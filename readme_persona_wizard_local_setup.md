# Persona Wizard — Local Setup Guide

This guide explains how to run the **Persona Wizard** (React + Tailwind + Recharts + Framer Motion) on your machine using **Vite**.

---

## 1) Prerequisites
- **Node.js** v18+ (or 20+ recommended)
- npm (bundled with Node)

Check versions:
```bash
node -v
npm -v
```

---

## 2) Create the project
```bash
npm create vite@latest persona-wizard --template react
cd persona-wizard
```

---

## 3) Install dependencies
```bash
npm install framer-motion recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 4) Configure Tailwind
**tailwind.config.js**
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
```

**src/index.css** (replace everything)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 5) Add the Persona Wizard code
1. Open **src/App.jsx** and replace its content with the **Persona Wizard** component from the canvas (file titled *“Persona Wizard (React)”*).  
2. Ensure the following imports exist at the top of `src/App.jsx`:
```jsx
import React from "react";
import "./index.css";
```
3. Keep `export default function PersonaWizard() { ... }` as-is so Vite renders it.

> If your `src/main.jsx` is the standard Vite template, you do **not** need to change it.

**src/main.jsx** (default Vite file for reference)
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 6) Run locally
```bash
npm run dev
```
Open the printed local URL (e.g., `http://localhost:5173`).

---

## 7) Build for production
```bash
npm run build
```
The static site will be in the **/dist** folder.

---

## 8) Folder structure (after setup)
```
persona-wizard/
├─ index.html
├─ package.json
├─ vite.config.js
├─ postcss.config.js
├─ tailwind.config.js
├─ README.md                # (optional) you can paste this guide here
├─ /node_modules
├─ /public
└─ /src
   ├─ App.jsx               # Persona Wizard component (from canvas)
   ├─ main.jsx
   ├─ index.css             # Tailwind entry
   └─ assets/               # (optional) images/icons if you add any
```

---

## 9) Optional: package.json snippet
Useful if you want to compare your dependencies.
```json
{
  "name": "persona-wizard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.460.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.10",
    "vite": "^5.3.0"
  }
}
```

*(Versions are indicative; using latest stable is fine.)*

---

## 10) Troubleshooting
- **Blank page / compile error**: Ensure you pasted the full Persona Wizard component, including imports (`framer-motion`, `recharts`, `lucide-react`).
- **Tailwind classes not applying**: Confirm `tailwind.config.js` `content` paths include `./src/**/*.{js,ts,jsx,tsx}` and that `src/index.css` contains the three `@tailwind` lines.
- **Icons not rendering**: Check `lucide-react` is installed and imported in `App.jsx`.
- **Weights sum warning**: The wizard displays your current total; keep it near `1.00` for accurate scoring.

---

## 11) Next steps
- Add **Candidate Overlay** (compare Persona vs Candidate on the radar + gap table).
- Auto-generate a **JD** from the saved persona JSON.
- Persist personas to local storage or an API.

---

That’s it — you’re ready to run the Persona Wizard locally. Paste the component code from the canvas into `src/App.jsx`, start the dev server, and you’re good to go.

