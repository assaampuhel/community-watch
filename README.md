# 🛡️ CF Community Watch

**Clinical & Objective Moderation for Competitive Programming.**

Community Watch is a transparent, peer-driven integrity platform designed to ensure fairness in competitive programming contests. It allows community members to report rules violations (like plagiarism or outside assistance) with objective evidence, which is then reviewed by verified high-rated moderators.

## 🔗 Live Links
- **Frontend**: [https://community-watch-hazel.vercel.app](https://community-watch-hazel.vercel.app)
- **Backend API**: [https://community-watch-xo5c.onrender.com/api](https://community-watch-xo5c.onrender.com/api)

## ✨ Key Features
- **Peer Reporting**: Submit misconduct reports with contest/problem IDs and evidence.
- **Evidence Management**: Cloud-based evidence storage via **Cloudinary**.
- **Moderation System**: Verified members (Rating 1500+) can review, approve, or reject claims.
- **Public Cheater Database**: A clinical, transparent record of verified cheating incidents.
- **Real-time Search**: Search handles and records across the database.
- **Secure Auth**: JWT-based authentication with Codeforces identity verification.

## 🛠️ Technology Stack
- **Frontend**: React, Vite, TypeScript, TailwindCSS (for utility), Vanilla CSS (for premium aesthetics).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas).
- **Image Hosting**: Cloudinary.
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS.

## 📂 Project Structure
```text
community-watch/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, Modals, Pages)
│   │   ├── context/        # Auth State Management
│   │   ├── api.ts          # API Client Configuration
│   │   └── App.tsx         # Routing & Main Layout
│   └── public/             # Static Assets (Logos, Icons)
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Request Handlers
│   │   ├── models/         # Mongoose Schemas (Report, User, Review)
│   │   ├── routes/         # API Endpoints
│   │   ├── middleware/     # Auth & Validation Logic
│   │   └── index.js        # Server Entry Point
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account

### 1. Clone the repository
```bash
git clone https://github.com/assaampuhel/community-watch.git
cd community-watch
```

### 2. Setup Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` folder:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Run Locally
- **Start Backend**: `cd server && npm run dev`
- **Start Frontend**: `cd client && npm run dev`

## 🛡️ Moderation Policy
Only accounts with a verified rating of **1500+** can participate in the moderation review board. This ensures that technical evidence is judged by experienced community members.

---
*Maintained by the CF Community Watch Team.*
