# Professor Model School Dargai — School Management System
### LMS + DBMS | AI-Powered | Full Stack

---

## 🏫 School Information
- **School:** Professor Model School Dargai (PMS)
- **Owner & Principal:** Muhammad Daud Khan
- **Location:** Main Mardan Road, Manga Dargai, Charsadda, KPK, Pakistan
- **WhatsApp/Easypaisa:** 03139355501
- **Email:** sulaimanpms855@gmail.com

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ installed
- npm or yarn

### Install & Run
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser at http://localhost:5173
```

---

## 🏗️ Build for Production / Deployment

```bash
# Build the app
npm run build

# Output is in the /dist folder — ready to deploy!
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended — FREE)
1. Go to https://vercel.com
2. Click "New Project"
3. Upload or connect the project folder
4. Click Deploy — done!

### Option 2: Netlify (FREE)
1. Go to https://netlify.com
2. Drag & drop the `/dist` folder after running `npm run build`

### Option 3: cPanel / Shared Hosting
1. Run `npm run build`
2. Upload all files from `/dist` to `public_html/`
3. Done!

### Option 4: GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

---

## 📁 Project Structure
```
pms-dargai/
├── public/
│   └── logo.png              ← School logo
├── src/
│   ├── components/
│   │   ├── ui.jsx            ← Reusable UI components
│   │   ├── Sidebar.jsx       ← Navigation sidebar
│   │   └── Topbar.jsx        ← Top header bar
│   ├── pages/
│   │   ├── Dashboard.jsx     ← Main dashboard
│   │   ├── Students.jsx      ← Student management
│   │   ├── Academic.jsx      ← Teachers, Classes, Subjects, Timetable
│   │   ├── Exams.jsx         ← Attendance, Exams, Homework, LMS
│   │   ├── Admin.jsx         ← Fees, Expenses, Parents, Library, Reports, Settings
│   │   └── AIAssistant.jsx   ← AI-powered assistant (Claude API)
│   ├── utils/
│   │   └── data.js           ← Sample data & constants
│   ├── App.jsx               ← Root component & routing
│   ├── main.jsx              ← React entry point
│   └── index.css             ← Global styles & CSS variables
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🤖 AI Assistant
The AI Assistant uses the **Anthropic Claude API**.

- The API key is handled by the platform (claude.ai Artifacts).
- For standalone deployment, add your API key in `AIAssistant.jsx`:
  ```js
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_ANTHROPIC_API_KEY',  // add this
    'anthropic-version': '2023-06-01',
  }
  ```
- Get your API key at: https://console.anthropic.com

---

## 🔧 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| UI | Custom CSS (no frameworks) |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Anthropic Claude API |
| Fonts | Cinzel + DM Sans (Google Fonts) |

---

## 📱 Features
✅ Dashboard with live stats  
✅ Student Management (CRUD, profiles, search)  
✅ Teacher Management  
✅ Class & Section Management  
✅ Subject Management  
✅ Weekly Timetable  
✅ Attendance (Daily, Monthly Grid, Analytics)  
✅ Exams & Results (Grade auto-calculation)  
✅ Homework Management  
✅ LMS / Course Content  
✅ Fee Management (Easypaisa integration)  
✅ Expense Tracking  
✅ Parent Portal  
✅ Announcements  
✅ Library Management  
✅ Reports (PDF/Excel export)  
✅ AI Assistant (Math, English, Urdu, Science, admin tasks)  
✅ Settings & User Roles  
✅ School Logo integration  
✅ Mobile-responsive design  

---

## 📞 Support
**WhatsApp:** 03139355501  
**Email:** sulaimanpms855@gmail.com

---

*Built with ❤️ for Professor Model School Dargai*  
*Faith · Unity · Discipline*
