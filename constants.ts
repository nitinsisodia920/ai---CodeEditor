
import { Language, CodeState, ThemeType, ProjectTemplate } from './types';

export const INITIAL_CODE: CodeState = {
  python: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Calculate first 10 numbers\nfor i in range(10):\n    print(f"Fib({i}) = {fibonacci(i)}")`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("🚀 CodeStream Java Runtime");\n        List<String> features = Arrays.asList("AI Assistant", "Real-time Execution", "Multi-language Support");\n        \n        for (String feature : features) {\n            System.out.println("Feature: " + feature);\n        }\n    }\n}`,
  javascript: `// Node.js Environment Demo\nconst os = require('os');\n\nconsole.log("System Info:");\nconsole.log("- Platform:", os.platform());\nconsole.log("- Architecture:", os.arch());\nconsole.log("- Total Memory:", (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2), "GB");\n\nconsole.log("\\nRunning heavy computation...");\nconst start = Date.now();\nlet sum = 0;\nfor(let i=0; i<1000000; i++) sum += i;\nconsole.log("Done. Sum:", sum, "Time:", Date.now() - start, "ms");`,
  html: `<div class="card">\n  <div class="header">\n    <h1>CodeStream AI</h1>\n    <p>Professional Frontend Sandbox</p>\n  </div>\n  <div class="content">\n    <p>This is a live preview of your HTML/CSS code. Try changing the styles in the CSS tab!</p>\n    <button id="cta-btn">Click Me</button>\n  </div>\n</div>`,
  css: `body {\n  background: #0d1117;\n  color: #c9d1d9;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  font-family: 'Inter', sans-serif;\n  margin: 0;\n}\n\n.card {\n  background: #161b22;\n  border: 1px solid #30363d;\n  border-radius: 12px;\n  padding: 2rem;\n  width: 320px;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.5);\n  text-align: center;\n}\n\n.header h1 {\n  margin: 0;\n  color: #58a6ff;\n}\n\nbutton {\n  background: #238636;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 600;\n  transition: 0.2s;\n}\n\nbutton:hover {\n  background: #2ea043;\n}`,
  frontendJs: `const btn = document.getElementById('cta-btn');\nbtn.addEventListener('click', () => {\n  alert('Hello from the CodeStream Sandbox!');\n  btn.style.transform = 'scale(1.1)';\n  setTimeout(() => btn.style.transform = 'scale(1)', 200);\n});`,
  mongodb: `// 🍃 MongoDB Simulated Playground\n// Query: Find all active premium users aged 25-35\n\ndb.users.find({\n  age: { $gte: 25, $lte: 35 },\n  status: "active",\n  membership: "premium"\n}).sort({ lastLogin: -1 }).limit(5)`
};

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'rest-api-node',
    name: 'Express REST API',
    description: 'A modular Node.js API structure with routes and mock data.',
    icon: '🚀',
    category: 'Backend',
    files: [
      { name: 'app.js', language: 'javascript', content: `const express = require('express');\nconst routes = require('./routes');\nconst app = express();\n\napp.use(express.json());\napp.use('/api', routes);\n\napp.get('/', (req, res) => res.send('API Root Active'));\n\nconst PORT = 3000;\napp.listen(PORT, () => console.log(\`Server on port \${PORT}\`));` },
      { name: 'routes.js', language: 'javascript', content: `const express = require('express');\nconst router = express.Router();\n\nconst users = [{id: 1, name: 'Dev'}];\n\nrouter.get('/users', (req, res) => res.json(users));\nrouter.post('/users', (req, res) => {\n  users.push(req.body);\n  res.status(201).json(req.body);\n});\n\nmodule.exports = router;` }
    ]
  },
  {
    id: 'flask-starter',
    name: 'Python Flask Web',
    description: 'Basic Flask application with routing and templates.',
    icon: '🐍',
    category: 'Backend',
    files: [
      { name: 'main.py', language: 'python', content: `from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.route("/")\ndef index():\n    return "Welcome to CodeStream Flask"\n\n@app.route("/health")\ndef health():\n    return jsonify({"status": "healthy"})\n\nif __name__ == "__main__":\n    app.run(debug=True)` }
    ]
  },
  {
    id: 'react-dashboard',
    name: 'Admin Dashboard',
    description: 'A modern UI dashboard built with HTML, CSS, and interactive JS.',
    icon: '📊',
    category: 'Frontend',
    files: [
      { name: 'index.html', language: 'html', content: `<div class="sidebar">Nav</div>\n<div class="main">\n  <header>Header</header>\n  <section class="stats">\n    <div class="stat-card">Users: 1.2k</div>\n    <div class="stat-card">Revenue: $45k</div>\n  </section>\n</div>` },
      { name: 'styles.css', language: 'html', content: `body { display: flex; height: 100vh; font-family: sans-serif; margin: 0; background: #f0f2f5; }\n.sidebar { width: 240px; background: #1c252e; color: #fff; padding: 20px; }\n.main { flex: 1; display: flex; flex-direction: column; }\nheader { height: 64px; background: #fff; border-bottom: 1px solid #ddd; display: flex; align-items: center; padding: 0 20px; }\n.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px; }\n.stat-card { background: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-weight: bold; }` },
      { name: 'script.js', language: 'html', content: `console.log('Dashboard initialized...');\ndocument.querySelectorAll('.stat-card').forEach(card => {\n  card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-5px)');\n  card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');\n});` }
    ]
  },
  {
    id: 'ecommerce-schema',
    name: 'E-commerce DB',
    description: 'MongoDB queries for a typical shopping platform.',
    icon: '🛍️',
    category: 'Database',
    files: [
      { name: 'orders.mongodb', language: 'mongodb', content: `// Calculate total revenue per category\ndb.products.aggregate([\n  { $group: { _id: "$category", revenue: { $sum: { $multiply: ["$price", "$sales"] } } } },\n  { $sort: { revenue: -1 } }\n])` },
      { name: 'users.mongodb', language: 'mongodb', content: `// Find loyal customers\ndb.users.find({ orders_count: { $gt: 10 } }).limit(20)` }
    ]
  }
];

export const LANGUAGES: { value: Language; label: string; icon: string }[] = [
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'javascript', label: 'Node.js', icon: '🟨' },
  { value: 'html', label: 'Frontend', icon: '🌐' },
  { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
];

export const THEMES: Record<ThemeType, any> = {
  industrial: {
    name: 'Industrial',
    primary: '#3b82f6',
    bg: '#050505',
    sidebar: '#080808',
    navbar: '#000000',
    border: 'rgba(255, 255, 255, 0.05)',
    text: '#94a3b8',
    highlight: '#ffffff'
  },
  midnight: {
    name: 'Midnight',
    primary: '#10b981',
    bg: '#000000',
    sidebar: '#000000',
    navbar: '#000000',
    border: '#111111',
    text: '#888888',
    highlight: '#ffffff'
  },
  nord: {
    name: 'Arctic Nord',
    primary: '#88c0d0',
    bg: '#2e3440',
    sidebar: '#242933',
    navbar: '#2e3440',
    border: '#3b4252',
    text: '#d8dee9',
    highlight: '#eceff4'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    primary: '#ff00ff',
    bg: '#0d0221',
    sidebar: '#1a0b2e',
    navbar: '#000000',
    border: '#ff00ff22',
    text: '#00ffff',
    highlight: '#ffffff'
  },
  forest: {
    name: 'Deep Forest',
    primary: '#a7c080',
    bg: '#1b1f1c',
    sidebar: '#232a26',
    navbar: '#1b1f1c',
    border: '#2d353b',
    text: '#859289',
    highlight: '#d3c6aa'
  }
};
