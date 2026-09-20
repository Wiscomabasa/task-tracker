# Task Tracker

A clean, modern task management app built with **HTML**, **CSS**, and **JavaScript**.

Perfect for your GitHub portfolio — fully client-side, works offline, and stores data in the browser using `localStorage`.

## Features

- Add, edit, and delete tasks
- Mark tasks as complete / incomplete
- Priority levels (Low / Medium / High)
- Due dates with overdue highlighting
- Custom categories
- Filter by status (All / Active / Completed)
- Filter by priority and category
- Dark & Light theme toggle
- Live stats (Total / Active / Done)
- Data persists in the browser
- Fully responsive design
- Smooth animations

## Tech Stack

- HTML5
- CSS3 (Custom Properties for theming)
- Vanilla JavaScript (ES6+)
- localStorage for persistence

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/Wiscomabasa/task-tracker.git
   cd task-tracker
   ```

2. Open `index.html` in your browser  
   **or** use a simple local server:
   ```bash
   # Python
   python -m http.server 8000

   # Node (if you have it)
   npx serve .
   ```

3. Visit `http://localhost:8000`

## Deploy to GitHub Pages

1. Go to your repository **Settings**
2. Scroll to **Pages**
3. Under **Source**, select the `main` branch and `/ (root)`
4. Click **Save**
5. Your app will be live at:  
   `https://wiscomabasa.github.io/task-tracker/`

## Project Structure

```
task-tracker/
├── index.html      # Main HTML structure
├── styles.css      # All styles + dark/light theme
├── script.js       # App logic & localStorage
└── README.md       # This file
```

## Future Ideas (Optional Extensions)

Want to level this up later?

- **Python + SQLite backend** with Flask
  - Move tasks to a real database
  - Add user accounts
  - Multi-device sync
- Export tasks as JSON / CSV
- Drag-and-drop reordering
- Recurring tasks
- Notifications for due dates

## Author

**Wisani Mabasa**  
Final-year BSc Computer Science student  
[GitHub](https://github.com/Wiscomabasa)

---

Made with ❤️ using pure HTML, CSS & JavaScript
