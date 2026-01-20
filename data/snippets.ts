
import { Language } from '../types';

export interface Snippet {
  id: string;
  name: string;
  description: string;
  code: string;
  category: string;
}

export const SNIPPETS: Record<Language, Snippet[]> = {
  python: [
    {
      id: 'py-binary-search',
      name: 'Binary Search',
      category: 'Algorithms',
      description: 'Efficient search in a sorted array.',
      code: `def binary_search(arr, x):\n    low = 0\n    high = len(arr) - 1\n    mid = 0\n \n    while low <= high:\n        mid = (high + low) // 2\n        if arr[mid] < x:\n            low = mid + 1\n        elif arr[mid] > x:\n            high = mid - 1\n        else:\n            return mid\n    return -1`
    },
    {
      id: 'py-list-comp',
      name: 'List Comprehension',
      category: 'Utilities',
      description: 'Elegant way to create lists.',
      code: `numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers if x % 2 == 0]\nprint(squares) # [4, 16]`
    },
    {
      id: 'py-request',
      name: 'HTTP Get Request',
      category: 'Networking',
      description: 'Fetch data from an API.',
      code: `import requests\n\ndef fetch_data(url):\n    try:\n        response = requests.get(url)\n        response.raise_for_status()\n        return response.json()\n    except Exception as e:\n        return f"Error: {e}"`
    }
  ],
  java: [
    {
      id: 'java-singleton',
      name: 'Singleton Pattern',
      category: 'Design Patterns',
      description: 'Thread-safe singleton implementation.',
      code: `public class DatabaseConnection {\n    private static DatabaseConnection instance;\n    \n    private DatabaseConnection() {}\n    \n    public static synchronized DatabaseConnection getInstance() {\n        if (instance == null) {\n            instance = new DatabaseConnection();\n        }\n        return instance;\n    }\n}`
    },
    {
      id: 'java-stream',
      name: 'Stream Filter',
      category: 'Streams API',
      description: 'Filter and collect a list.',
      code: `List<String> names = Arrays.asList("Alice", "Bob", "Charlie");\nList<String> filtered = names.stream()\n    .filter(s -> s.startsWith("A"))\n    .collect(Collectors.toList());`
    }
  ],
  javascript: [
    {
      id: 'js-fs-read',
      name: 'Read JSON File',
      category: 'File System',
      description: 'Async file reading with Node.js.',
      code: `const fs = require('fs').promises;\n\nasync function readConfig() {\n    try {\n        const data = await fs.readFile('config.json', 'utf8');\n        return JSON.parse(data);\n    } catch (err) {\n        console.error('Error reading file:', err);\n    }\n}`
    },
    {
      id: 'js-express-server',
      name: 'Basic Express Server',
      category: 'Web',
      description: 'Minimal Express.js setup.',
      code: `const express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(port, () => {\n  console.log(\`Example app listening at http://localhost:\${port}\`);\n});`
    }
  ],
  html: [
    {
      id: 'html-flex-center',
      name: 'Center with Flexbox',
      category: 'Layout',
      description: 'CSS to center any element.',
      code: `/* CSS */\n.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}`
    },
    {
      id: 'html-responsive-grid',
      name: 'Auto-Grid Layout',
      category: 'Layout',
      description: 'Responsive grid without media queries.',
      code: `/* CSS */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}`
    },
    {
      id: 'html-glass-card',
      name: 'Glassmorphism Card',
      category: 'UI',
      description: 'Modern glass effect style.',
      code: `/* CSS */\n.glass-card {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n  padding: 20px;\n}`
    }
  ],
  mongodb: [
    {
      id: 'mongo-aggregate-match',
      name: 'Aggregation Match & Group',
      category: 'Aggregation',
      description: 'Filter and group documents.',
      code: `db.orders.aggregate([\n  { $match: { status: "A" } },\n  { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }\n])`
    },
    {
      id: 'mongo-update-many',
      name: 'Update Many',
      category: 'CRUD',
      description: 'Update multiple documents based on criteria.',
      code: `db.users.updateMany(\n  { age: { $gt: 18 } },\n  { $set: { isAdult: true } }\n)`
    }
  ]
};
