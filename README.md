# SheBack 🌟
### Career Gap Recovery Platform for Women Returning to Work & Education

**SheBack** is a full-stack career recovery platform engineered to support women returning to the professional workforce or higher education after a career break (parenting, elder care, illness, relocation, or personal hiatus). 

Powered by **Gemini AI**, SheBack translates past career history and break experiences into transferable strengths, identifies modern skill gaps, generates custom 12-week roadmaps, and connects returners with returnships, remote roles, and bridge courses.

---

## 🚀 Tech Stack

### Frontend (`/client`)
- **React 19** & **Vite**
- **Tailwind CSS v4** (Modern dark-mode, glassmorphism, refined palette)
- **React Router v7** (Public and protected routing)
- **Lucide React** (Modern, clean icon set)
- **Recharts** (Interactive career match and progress charts)
- **Axios** (Configured with JWT token interceptors & Vite dev proxy)

### Backend (`/server`)
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (With resilient in-memory fallback store if local MongoDB is offline)
- **JWT (JSON Web Token)** authentication & session management
- **bcryptjs** password hashing
- **dotenv** configuration & **cors**
- **Gemini AI API** (`@google/generative-ai`) for personalized gap analysis & roadmap generation

---

## 📁 Project Structure

```
muti-agent/
├── package.json              # Monorepo runner (concurrent client & server scripts)
├── README.md                 # Complete system documentation
├── client/                   # Vite React Frontend
│   ├── package.json
│   ├── vite.config.js        # Vite config with API proxy
│   ├── index.html
│   └── src/
│       ├── App.jsx           # Router configuration for all 9 pages
│       ├── index.css         # Styling, glassmorphism, typography
│       ├── components/
│       │   ├── Navbar.jsx    # Responsive navigation bar
│       │   ├── Footer.jsx    # Footer with community links
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx # Auth state & persistence
│       └── pages/
│           ├── Landing.jsx   # 1. Landing Page
│           ├── Login.jsx     # 2. Login Page (with 1-click Demo Account)
│           ├── Register.jsx  # 3. Registration Page
│           ├── Onboarding.jsx# 4. 11-field Onboarding questionnaire
│           ├── Dashboard.jsx # 5. User Hub & Career overview
│           ├── CareerAnalysis.jsx # 6. AI Gap Analysis & Audit
│           ├── Opportunities.jsx  # 7. Courses, Returnships & Jobs
│           ├── Roadmap.jsx   # 8. Interactive 12-Week Milestone Tracker
│           └── Profile.jsx   # 9. Profile Editor & Career Target Settings
└── server/                   # Express Backend
    ├── package.json
    ├── .env                  # Port, JWT Secret, MongoDB URI, Gemini Key
    └── src/
        ├── index.js          # Express app entrypoint & API mount
        ├── seed.js           # Seed script for returnships, courses, and jobs
        ├── config/
        │   └── db.js         # Mongoose connection with error handling
        ├── models/
        │   ├── User.js       # User auth model
        │   ├── Profile.js    # 11-field career profile model
        │   ├── Opportunity.js# Courses, returnships, and jobs model
        │   └── Roadmap.js    # Multi-phase milestone roadmap model
        ├── controllers/
        │   ├── authController.js
        │   ├── profileController.js
        │   ├── analysisController.js
        │   ├── opportunityController.js
        │   └── roadmapController.js
        ├── middleware/
        │   └── auth.js       # Bearer JWT verification middleware
        ├── routes/
        │   ├── authRoutes.js
        │   ├── profileRoutes.js
        │   ├── analysisRoutes.js
        │   ├── opportunityRoutes.js
        │   └── roadmapRoutes.js
        └── services/
            └── geminiService.js # Gemini AI prompt integration + smart fallback
```

---

## ⚡ Quick Start

### 1. Install Dependencies
Run the following in the project root:
```bash
npm install
```
*(This automatically installs dependencies for both `client` and `server` via postinstall).*

### 2. Configure Environment (Optional)
The backend `.env` file is located at `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sheback
JWT_SECRET=sheback_super_secret_jwt_key_2026_career_gap_recovery
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note:** If local MongoDB is not running, SheBack will automatically start with its in-memory fallback database so you can test immediately without any external setup.

### 3. Seed Database (Optional)
To populate MongoDB with curated returnships, courses, and job listings:
```bash
npm run seed
```

### 4. Run Locally
Start both backend (port 5000) and frontend (port 5173) with a single command:
```bash
npm run dev
```

Open your browser to:
**`http://localhost:5173`**

---

## 👩‍💻 Demo Account

For rapid evaluation, you can either sign up with any email or click **"Use Demo Account"** on the Login page:
- **Email:** `demo@sheback.com`
- **Password:** `password123`

---

## 🌐 Complete API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `GET` | `/api/profile` | Retrieve candidate profile & gap data | Yes |
| `PUT` | `/api/profile` | Update candidate profile & preferences | Yes |
| `POST` | `/api/analysis` | Generate or re-run Gemini AI Career Gap Analysis | Yes |
| `GET` | `/api/analysis` | Retrieve existing career gap audit | Yes |
| `GET` | `/api/opportunities` | Search & filter courses, returnships, and jobs | No |
| `GET` | `/api/roadmap` | Retrieve personalized 12-week roadmap & mentors | Yes |
| `PUT` | `/api/roadmap/milestone` | Toggle completed status of roadmap milestones | Yes |

---

## 📋 Onboarding Data Fields

The onboarding questionnaire gathers all 11 required parameters:
1. `name` - Full Name
2. `previousRole` - Past job title
3. `education` - Highest degree and institution
4. `yearsOfExperience` - Total career experience before hiatus
5. `previousIndustry` - Prior domain / vertical
6. `breakDuration` - Duration & nature of career break
7. `previousSkills` - Core legacy tools & capabilities
8. `interests` - Future passions & preferred sectors
9. `preferredWorkType` - Remote / Hybrid / Flexible / On-site
10. `preferredLocation` - Desired city or remote preferences
11. `desiredCareer` - Target role upon return

---

## 🧠 AI Gap Analysis Features

The Career Analysis page showcases:
- **Transferable Skills Audit:** Highlights competencies from prior work and break periods (leadership, project planning, analytical execution) with category tags.
- **Core Strengths:** Pinpoints validated professional assets.
- **Skill Gaps:** Identifies missing modern frameworks and provides prioritized action items.
- **Role Match Visualization:** Recharts bar graph displaying compatibility across top 4 pathways.
- **Recommended Pathways:** In-depth breakdown with salary benchmarks and growth outlooks.
- **Bridge Courses:** Curated micro-credentials on Coursera, Udemy, and SheBack Academy.
- **Returnship Programs:** Paid returnships with mentorship built for returning women.
- **Direct Job Listings:** Flexible, career-break friendly openings.
- **12-Week Recovery Roadmap:** Phased milestones you can tick off as you learn.
