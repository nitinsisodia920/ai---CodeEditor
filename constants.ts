
import { Language, CodeState, ThemeType } from './types';

export const INITIAL_CODE: CodeState = {
  python: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Calculate first 10 numbers\nfor i in range(10):\n    print(f"Fib({i}) = {fibonacci(i)}")`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("🚀 CodeStream Java Runtime");\n        List<String> features = Arrays.asList("AI Assistant", "Real-time Execution", "Multi-language Support");\n        \n        for (String feature : features) {\n            System.out.println("Feature: " + feature);\n        }\n    }\n}`,
  javascript: `// Node.js Environment Demo\nconst os = require('os');\n\nconsole.log("System Info:");\nconsole.log("- Platform:", os.platform());\nconsole.log("- Architecture:", os.arch());\nconsole.log("- Total Memory:", (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2), "GB");\n\nconsole.log("\\nRunning heavy computation...");\nconst start = Date.now();\nlet sum = 0;\nfor(let i=0; i<1000000; i++) sum += i;\nconsole.log("Done. Sum:", sum, "Time:", Date.now() - start, "ms");`,
  html: `<div class="card">\n  <div class="header">\n    <h1>CodeStream AI</h1>\n    <p>Professional Frontend Sandbox</p>\n  </div>\n  <div class="content">\n    <p>This is a live preview of your HTML/CSS code. Try changing the styles in the CSS tab!</p>\n    <button id="cta-btn">Click Me</button>\n  </div>\n</div>`,
  css: `body {\n  background: #0d1117;\n  color: #c9d1d9;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  font-family: 'Inter', sans-serif;\n  margin: 0;\n}\n\n.card {\n  background: #161b22;\n  border: 1px solid #30363d;\n  border-radius: 12px;\n  padding: 2rem;\n  width: 320px;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.5);\n  text-align: center;\n}\n\n.header h1 {\n  margin: 0;\n  color: #58a6ff;\n}\n\nbutton {\n  background: #238636;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 600;\n  transition: 0.2s;\n}\n\nbutton:hover {\n  background: #2ea043;\n}`,
  frontendJs: `const btn = document.getElementById('cta-btn');\nbtn.addEventListener('click', () => {\n  alert('Hello from the CodeStream Sandbox!');\n  btn.style.transform = 'scale(1.1)';\n  setTimeout(() => btn.style.transform = 'scale(1)', 200);\n});`,
  mongodb: `// 🍃 MongoDB Simulated Playground\n// Query: Find all active premium users aged 25-35\n\ndb.users.find({\n  age: { $gte: 25, $lte: 35 },\n  status: "active",\n  membership: "premium"\n}).sort({ lastLogin: -1 }).limit(5)`
};

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
