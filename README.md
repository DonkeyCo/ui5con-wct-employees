# Employee Management System (React + TypeScript + UI5 Web Components)

A modern, modular Employee Management System built with React, TypeScript, Vite, and **UI5 Web Components** (Fiori design, not React wrappers).

## ✨ Features

- **Fiori-styled UI** with UI5 Web Components and official branding
- **Role Switching:** Seamless toggle between Employee and Manager roles
- **Two Main Dashboards:**
  - **Global Dashboard:**
    - Virtualized, filterable, sortable employee table
    - Popin/overflow columns for responsive design
    - Row actions (navigation, details)
  - **Team Dashboard:**
    - View and manage your team (10 demo employees, random data)
    - **Manager features:**
      - Multi-selection and mass actions (e.g., salary adjustment dialog)
      - Add/Remove employees (dialog, row action)
      - Drag-and-drop: reorder team, assign employees to projects
      - Salary column (EUR, summary row)
      - SegmentedButton to toggle table details
    - **Employee features:**
      - View team and project assignments
- **Project Board:**
  - Fiori Card layout for projects and unassigned employees
  - Drag-and-drop employees between projects
- **Central Data Model:**
  - React Context for shared employee/team/project state
- **Fully Modular Codebase:**
  - All dialogs, tables, and boards are reusable components
- **GitHub Pages Ready:**
  - Correct asset paths, Vite config, and deploy scripts

## 🚀 Advanced Table Features (UI5 Web Components Table)
- Virtualization for large datasets
- Multi-selection (Manager only)
- Row actions (remove, navigation)
- Drag-and-drop row reordering
- Drag-and-drop between project lists
- Filtering, sorting, and popin/overflow columns
- Mass actions (salary adjustment for selected employees)
- Responsive Fiori layout

## 🛠️ Tech Stack
- React + TypeScript
- Vite
- [UI5 Web Components](https://sap.github.io/ui5-webcomponents/)
- [UI5 Web Components for React](https://sap.github.io/ui5-webcomponents-react/v2/?path=/docs/getting-started--docs)

## ▶️ Getting Started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deploy to GitHub Pages
1. Build the app:
   ```sh
   npm run build
   ```
2. Deploy:
   ```sh
   npm run deploy
   ```

---

_This project is a showcase of advanced UI5 Web Components Table features and Fiori UX in a modern React + TypeScript app._
