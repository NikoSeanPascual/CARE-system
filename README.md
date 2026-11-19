# ✚ C.A.R.E. — Campus Health, Medical Assessment, and Record Entry System

**C.A.R.E.** is a client-side web application designed to streamline campus clinic operations, digital student health check-ins, triage queuing, and medical supply tracking. Built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript**, it provides tailored dashboards for Students, Clinic Staff, and System Administrators (Head School Nurse) using browser-based local storage.
**Limitations** as this is made with pure vanilla javascript i didnt put every features so I am limited on what I can add

---

## ✨ Key Features

### 🎓 Student / Patient Portal (`pages/student.html`)
* **Interactive Symptom & Health Concern Selector:** Categorized symptom chips (*General/Pain*, *Respiratory/Cold*, *Gastrointestinal & Basic Request*) with real-time maximum rest pass calculation and severity ranking (*Low*, *Medium*, *High*).
* **Automated Queue & Digital Health Pass Generator:** Generates a unique queue ticket (e.g., `#Q-104`) and a printable digital health pass slip upon check-in.
* **Personal Consultation History:** Tracks past clinic visits, logged symptoms, rest durations, and current triage statuses.
* **Campus Clinic Location Map:** Embedded interactive map alongside clinic operating hours and internal emergency extensions.

### 🩺 Clinic Assistant / Staff Portal (`pages/staff.html`)
* **Live Patient Queue & Triage Metrics:** Real-time counters for *Pending Triage*, *In Clinic Rest*, and *Cleared Today*.
* **Patient Status & Dispensing Management:** Interactive modal to approve rest passes, discharge cleared students, and record dispensed supplies.
* **Automated Supply Deduction:** Dispensing medicine during triage automatically deducts stock counts and flags low-stock items (`< 20 units`).

### 📊 System Administrator / Head Nurse Console (`pages/admin.html`)
* **Daily Operations Analytics:** Monitors total daily visitors, active clinic patients, and total medicines dispensed.
* **Symptom Frequency Breakdown:** Dynamically aggregates and ranks the most reported health complaints across campus.
* **Comprehensive Health Logs & Inventory Oversight:** Full visibility into student consultation records and clinic supply stock levels.

### 🔐 Authentication & UI/UX
* **Role-Based Access Control:** Unified login and student registration portal (`index.html`) with strict password enforcement (minimum 8 characters, at least 1 letter, 1 number, and 1 special symbol) and input validation.
* **Modern Glassmorphism UI:** Cohesive dark-slate aesthetic (`#0b0f19`) across all portals with ambient background orbs, smooth tab-switching transitions, and responsive mobile navigation drawers.

---

## 📁 Project Structure

```text
CARE-Campus-Health-System/
├── index.html              # Login & Student Registration Portal
├── pages/
│   ├── student.html        # Student Check-in, History & Map Dashboard
│   ├── staff.html          # Clinic Staff Triage & Inventory Dashboard
│   └── admin.html          # Head Nurse Analytics & Logs Console
├── css/
│   ├── auth.css            # Authentication styling & slide-in animations
│   └── student.css         # Unified dark-theme dashboard & responsive styles
├── js/
│   ├── data.js             # Pre-configured user accounts & default data
│   ├── auth.js             # Login/Signup logic & form validation
│   ├── student.js          # Rest calculation, queue generation & print slip
│   ├── staff.js            # Triage updates & inventory stock deduction
│   └── admin.js            # Visitor metrics & symptom frequency analytics
└── assets/                 # UI icons (password visibility toggles, etc.)
