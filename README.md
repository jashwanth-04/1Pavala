# 1Pavala — Smart Money Management Web Application

> **Privacy-first, manual personal expense tracking and monthly budgeting web app for Laptop/PC, Tablet, and Mobile.**

---

## 🚀 Live Demo & Development
To run the application locally:

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev

# Build production bundle
npm run build
```

The application will run at **http://localhost:3000**.

---

## 🛠️ Tech Stack

- **Core & Runtime:** React 18 (`react`, `react-dom`)
- **Language:** TypeScript 5 (`strict: true`)
- **Build System:** Vite 6
- **Styling:** Tailwind CSS 3 + PostCSS + Autoprefixer
- **Icons:** Lucide React
- **Typography:** Plus Jakarta Sans
- **Storage:** Client-side HTML5 Web Storage (`localStorage`) with full JSON/CSV export and import

---

## 🏗️ System Architecture

1Pavala is structured as an offline-first Single Page Application (SPA) with a unidirectional reactive data flow:

```
[UI Components & Modals] 
       ↕ (Actions & State)
[AppContext Store & Calculation Engine]
       ↕ (Synchronous serialization)
[StorageService (Local Sandbox Engine)]
       ↕
[Browser localStorage]
```

---

## 📱 Application Screens

1. **Dashboard:** Current month spend, budget progress, interactive Category Donut chart, Daily spending trend, and recent transactions.
2. **Add / Edit Expense Modal:** Amount, Category selector, Date picker, optional Payment Method pills (UPI, Cards, Cash), and optional note.
3. **Transaction History:** Live search, filters (Month, Category, Payment Method), three-way sorting, inline edit/delete, and CSV export.
4. **Insights:** Category breakdown, daily trend line, month-over-month comparative analysis, and payment channel statistics.
5. **Budgeting:** Monthly target setup, visual threshold warning alerts (**75%**, **90%**, **100%**), and Safe Daily Allowance pacing calculator.
6. **Monthly Summary:** Complete audit report for any selected month with largest expense, average purchase size, and printable view.
7. **Settings & Data:** Currency symbol selector (`₹`, `$`, `€`, `£`, etc.), threshold controls, custom category creator, JSON backup export, and JSON restore.

---

## 🔒 Privacy Guarantee

- **No bank account connections**
- **No UPI credentials or SMS scraping**
- **No server-side database tracking**
- **100% Local Device Storage**

---

## 📄 Complete Project Documentation
For the complete technical blueprint, data models, algorithm specifications, and diagrams, see:
[`1Pavala_Project_Documentation.md`](./1Pavala_Project_Documentation.md)
