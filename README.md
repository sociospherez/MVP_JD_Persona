# Persona Wizard — TypeScript Starter

This bundle gives you a production-friendly scaffold using **React + Vite + TypeScript + Tailwind**.
It's the long-term scalable choice: strict typing, safer refactors, better IDE support, and cleaner contracts.

## Quick start
```bash
npm install
npm run dev
```

Then open the local URL shown (e.g., http://localhost:5173).

## Files to edit
- `src/App.tsx`: Replace with the Persona Wizard component from the canvas.
- `tailwind.config.js`: Already configured.
- `src/index.css`: Tailwind entry.

## Build
```bash
npm run build
```

## Notes
- If a library lacks perfect TypeScript types, add minimal `// @ts-expect-error` at the callsite and open a task to improve types later.
- Recharts and Framer Motion both ship types; if you hit generics issues, annotate props explicitly.
