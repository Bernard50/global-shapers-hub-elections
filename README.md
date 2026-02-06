# 🗳️ Global Shapers Hub Election Platform

A secure, multi-tenant election management system designed exclusively for **Global Shapers Hubs**. Built for transparency, security, and ease of use.

## ✨ Features
- **Simplified Whitelist Auth**: No more tokens. Voters log in using only their **Name** and **Member ID**.
- **Invitation Code Guard**: Restricts hub creation to authorized personnel via a master invitation key.
- **Bulk Import**: Hub admins can paste member lists directly for instant whitelist population.
- **Real-time Results**: Instant analytics and vote tracking with turnout percentages.
- **Theme Support**: Premium Light and Dark mode implementation.
- **Mobile Optimized**: Fully responsive interface for voting on-the-go.

## 🛠️ Technology Stack
- **Frontend**: React + Vite
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Vanilla CSS with a custom Design System
- **State Management**: React Hooks

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Supabase](https://supabase.com/) account

### 2. Environment Setup
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Configuration
Run the provided SQL script in your Supabase SQL Editor to set up the required tables (`hubs`, `elections`, `voters`, `votes`, `access_requests`).

### 4. Installation & Development
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## 📖 Documentation
- For detailed instructions on running an election, see [**`USER_GUIDE.md`**](./USER_GUIDE.md).

## 🛡️ Security
This platform implements 3-factor verification (Hub ID + Name + Member ID) and ensures one vote per member via database-level unique constraints.

---

*Shaping our future, one vote at a time. 🌍✨*
