import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="app-container flex min-h-screen">
      <Sidebar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <main className="flex-1 ml-64">
        <KanbanBoard />
      </main>
    </div>
  );
}

export default App;
