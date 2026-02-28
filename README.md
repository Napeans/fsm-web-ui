# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
Perfect 👍
Below is a **complete professional README.md** for your FSM React + TypeScript + Vite project.

You can copy-paste this directly into your project root as:

```
README.md
```

---

# 📄 COMPLETE README.md

````md
# 🚀 FSM Pro – Field Service Management Web App

Modern React + TypeScript frontend for Field Service Management system.

Built with:

- ⚛ React
- 🔷 TypeScript
- ⚡ Vite
- 🌐 Axios
- 🧭 React Router
- 🔐 JWT Authentication

---

# 📦 Project Setup

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd fsm-web
````

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

# 🏃 Running The App (Development - Local)

Uses:

```
.env.local
```

Start development server:

```bash
npm run dev
```

App will run at:

```
http://localhost:5173
```

---

# 🌍 Environment Configuration

Environment files must be placed in the project root (same level as package.json).

⚠ All environment variables must start with:

```
VITE_
```

---

## 📌 Local Environment

Create file: `.env.local`

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_ENV=local
```

---

## 📌 Test Environment

Create file: `.env.test`

```env
VITE_API_BASE_URL=https://test-api.yourdomain.com/api
VITE_ENV=test
```

---

## 📌 Production Environment

Create file: `.env.production`

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_ENV=production
```

---

# 🔌 Using Environment Variables In Code

Example (axios configuration):

```ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;
```

You can check current environment:

```ts
console.log(import.meta.env.VITE_ENV);
```

---

# 🏗️ Build Commands (Environment Based)

## 🔹 Production Build

Uses `.env.production`

```bash
npm run build
```

Output folder:

```
dist/
```

---

## 🔹 Test Build

Uses `.env.test`

```bash
npm run build:test
```

---

## 📦 Required package.json Scripts

Make sure your `package.json` contains:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:test": "vite build --mode test",
  "preview": "vite preview"
}
```

---

# 🔍 Preview Production Build Locally

```bash
npm run preview
```

This simulates production server.

---

# 📁 Production Build Output

After build:

```
dist/
 ├── index.html
 ├── assets/
 │     ├── index-xxxxx.js
 │     ├── index-xxxxx.css
```

Deploy the contents of `dist/` to your web server.

---

# 🌐 Deployment Options

## ✅ Option 1 – Deploy With .NET Backend (Recommended)

1. Run:

```bash
npm run build
```

2. Copy contents of `dist/` into:

```
wwwroot/
```

3. Publish .NET project.

---

## ✅ Option 2 – IIS Deployment

1. Copy `dist` contents to IIS website root.
2. Add `web.config` for SPA routing:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

## ✅ Option 3 – Nginx Deployment

Add fallback configuration:

```
location / {
  try_files $uri /index.html;
}
```

---

# 🔐 Authentication Flow

1. User logs in with Mobile + 6-digit PIN.
2. Backend returns JWT token.
3. Token stored in localStorage.
4. Axios interceptor attaches token to all API calls:

```
Authorization: Bearer <token>
```

---

# 📂 Recommended Project Structure

```
src/
 ├── api/
 ├── assets/
 ├── components/
 ├── features/
 │     ├── auth/
 │     ├── leads/
 │     ├── jobs/
 │     └── dashboard/
 ├── layouts/
 ├── routes/
 ├── styles/
 ├── App.tsx
 └── main.tsx
```

---

# 🛠️ Development Best Practices

✔ Use feature-based architecture
✔ Keep services separate from UI
✔ Use TypeScript interfaces
✔ Never store secrets in frontend
✔ Use environment-based builds
✔ Use role-based route protection

---

# ⚠ Important Notes

* Environment variables are embedded at build time.
* Changing `.env` requires rebuilding.
* Never store passwords, API secrets, or DB credentials in frontend `.env`.

---

# 📌 Quick Command Summary

| Action                   | Command              |
| ------------------------ | -------------------- |
| Install packages         | `npm install`        |
| Run locally              | `npm run dev`        |
| Build production         | `npm run build`      |
| Build test               | `npm run build:test` |
| Preview production build | `npm run preview`    |

---

# 👨‍💻 Tech Stack

* React 18+
* TypeScript
* Vite
* Axios
* React Router
* JWT Authentication

---

# 📈 Future Improvements

* Role-based dashboard
* Lead management
* Job tracking
* Quotation generation
* Invoice module
* Customer portal
* CI/CD pipeline
* Docker deployment

---

# 📞 Support

For technical queries contact:

Project Owner: <Your Name>
Project: FSM Pro

```

---

# ✅ You Are Now Production Ready

This README is:

- Professional
- Enterprise-ready
- Deployment-ready
- Multi-environment ready
- Clear for other developers

 