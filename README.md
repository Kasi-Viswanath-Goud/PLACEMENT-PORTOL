# ALTS - AI-Powered Campus Placement Portal

A comprehensive web application designed to streamline the campus placement process for both students and HR teams. Built with the MERN stack (MongoDB, Express.js, React, Node.js), this platform offers dynamic resume building, intelligent job matching, high-end analytics, and an intuitive application tracking system.

## 🚀 Features

### For Students
- **Interactive Dashboard:** Track applied jobs, interview statuses, and saved opportunities.
- **Smart Resume Builder:** Create ATS-friendly resumes directly on the platform with built-in templates.
- **Dynamic Profiles:** Showcase projects, live demos, GitHub repositories, technical skills, and academic achievements.
- **Real-time Notifications:** Receive updates on application status changes and interview schedules.
- **Mock AI Analysis:** Get feedback on resumes to improve ATS compatibility.

### For HR / Companies
- **Applicant Tracking System (ATS):** Manage all applicants for a job posting in one centralized dashboard.
- **Recruiter Analytics Dashboard:** Live data tracking of active jobs, total applicants, and real-time hiring funnels.
- **One-Click Resume Viewing:** View student resumes inline without downloading them.
- **Quick Status Updates:** Easily shortlist, select, or reject candidates.
- **Automated Email Integration:** Automatically send congratulatory emails (via NodeMailer) directly to the student's inbox when marked as "Selected" or "Interview Scheduled".
- **Direct Messaging:** Send quick template messages to applicants directly from the dashboard.

### System-Wide
- **Premium Aesthetics:** High-end, seamless dark and light mode styling.
- **Micro-Animations:** Fluid layout transitions and tab switching powered by Framer Motion.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router, Context API, Lucide React, Recharts (Analytics), Framer Motion, Vanilla CSS
- **Backend:** Node.js, Express.js, JWT (Authentication), NodeMailer (Email)
- **Database:** MongoDB (Mongoose) - *(Also supports Mock Data mode for easy local development without DB)*
- **File Parsing:** `pdf-parse`, `mammoth` (for resume text extraction)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chintugoud-create/PLACEMENT-PORTOL.git
   cd PLACEMENT-PORTOL
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   * Create a `.env` file inside the `server` directory based on `.env.example`.
   * Configure your `SMTP_USER` and `SMTP_PASS` in the `.env` to enable email notifications.
   * Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   # Open a new terminal
   cd client
   npm install
   ```
   * Start the React development server:
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Default Mock Accounts

If you run the app without MongoDB, it will automatically use mock data. You can log in with:
- **Student:** `chintu@email.com` / `password123`
- **Company/HR:** `hr@techcorp.com` / `password123`
- **Admin:** `admin@alts.edu` / `password123`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
