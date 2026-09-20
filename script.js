// ===== State =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let currentPriorityFilter = "all";
let currentCategoryFilter = "all";

// ===== DOM Elements =====
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const themeToggle = document.getElementById("theme-toggle");
const priorityFilter = document.getElementById("priority-filter");
const categoryFilter = document.getElementById("category-filter");
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const cancelEdit = document.getElementById("cancel-edit");

// Stats
const statTotal = document.getElementById("stat-total");
const statActive = document.getElementById("stat-active");
const statCompleted = document.getElementById("stat-completed");

// ===== Theme =====
function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// ===== Save & Load =====
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== Generate ID =====
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ===== Render =====
function renderTasks() {
  let filtered = tasks;

  // Status filter
  if (currentFilter === "active") {
    filtered = filtered.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = filtered.filter((t) => t.completed);
  }

  // Priority filter
  if (currentPriorityFilter !== "all") {
    filtered = filtered.filter((t) => t.priority === currentPriorityFilter);
  }

  // Category filter
  if (currentCategoryFilter !== "all") {
    filtered = filtered.filter(
      (t) => (t.category || "").toLowerCase() === currentCategoryFilter.toLowerCase()
    );
  }

  // Sort: incomplete first, then by priority, then by due date
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  filtered.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (a.due && b.due) return a.due.localeCompare(b.due);
    if (a.due) return -1;
    if (b.due) return 1;
    return 0;
  });

  taskList.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    filtered.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.dataset.id = task.id;

      const isOverdue =
        task.due && !task.completed && new Date(task.due) < new Date().setHours(0, 0, 0, 0);

      li.innerHTML = `
        <div class="task-checkbox" data-action="toggle"></div>
        <div class="task-content">
          <div class="task-title">${escapeHtml(task.title)}</div>
          ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ""}
          <div class="task-meta">
            <span class="badge badge-${task.priority}">${task.priority}</span>
            ${task.category ? `<span class="badge badge-category">${escapeHtml(task.category)}</span>` : ""}
            ${
              task.due
                ? `<span class="badge ${isOverdue ? "badge-overdue" : "badge-due"}">${formatDate(task.due)}${isOverdue ? " • Overdue" : ""}</span>`
                : ""
            }
          </div>
        </div>
        <div class="task-actions">
          <button class="icon-btn edit" data-action="edit" title="Edit">✏️</button>
          <button class="icon-btn delete" data-action="delete" title="Delete">🗑️</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  updateStats();
  updateCategoryOptions();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  statTotal.textContent = total;
  statActive.textContent = active;
  statCompleted.textContent = completed;
}

function updateCategoryOptions() {
  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];
  const datalist = document.getElementById("category-list");
  datalist.innerHTML = categories.map((c) => `<option value="${escapeHtml(c)}">`).join("");

  // Update filter dropdown
  const currentValue = categoryFilter.value;
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    if (c === currentValue) opt.selected = true;
    categoryFilter.appendChild(opt);
  });
}

// ===== Helpers =====
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ===== Add Task =====
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("task-title").value.trim();
  if (!title) return;

  const task = {
    id: generateId(),
    title,
    description: document.getElementById("task-description").value.trim(),
    priority: document.getElementById("task-priority").value,
    due: document.getElementById("task-due").value || null,
    category: document.getElementById("task-category").value.trim() || null,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
  document.getElementById("task-priority").value = "medium";
});

// ===== Task Actions (Event Delegation) =====
taskList.addEventListener("click", (e) => {
  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;

  const li = e.target.closest(".task-item");
  const id = li.dataset.id;
  const action = actionEl.dataset.action;

  if (action === "toggle") {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  } else if (action === "delete") {
    if (confirm("Delete this task?")) {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      renderTasks();
    }
  } else if (action === "edit") {
    openEditModal(id);
  }
});

// ===== Edit Modal =====
function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  document.getElementById("edit-id").value = task.id;
  document.getElementById("edit-title").value = task.title;
  document.getElementById("edit-description").value = task.description || "";
  document.getElementById("edit-priority").value = task.priority;
  document.getElementById("edit-due").value = task.due || "";
  document.getElementById("edit-category").value = task.category || "";

  editModal.classList.remove("hidden");
}

cancelEdit.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

editModal.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.classList.add("hidden");
  }
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("edit-id").value;
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.title = document.getElementById("edit-title").value.trim();
  task.description = document.getElementById("edit-description").value.trim();
  task.priority = document.getElementById("edit-priority").value;
  task.due = document.getElementById("edit-due").value || null;
  task.category = document.getElementById("edit-category").value.trim() || null;

  saveTasks();
  renderTasks();
  editModal.classList.add("hidden");
});

// ===== Filters =====
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

priorityFilter.addEventListener("change", () => {
  currentPriorityFilter = priorityFilter.value;
  renderTasks();
});

categoryFilter.addEventListener("change", () => {
  currentCategoryFilter = categoryFilter.value;
  renderTasks();
});

// ===== Init =====
initTheme();
renderTasks();
