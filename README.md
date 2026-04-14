<div align="center">

<img src="frontend/public/tng-logo.png" alt="TNG Logo" width="80" height="80" />

# TNG Hotels & Banquets

### Akola's Premier Luxury Hospitality Destination

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-tng--hotelsandbanquets.vercel.app-gold?style=for-the-badge)](https://tng-hotelsandbanquets.vercel.app)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

*SY Engineering — Web Programming Lab Mini Project*

</div>

---

## 🏨 About This Project

TNG Hotels & Banquets is a **full-stack luxury hotel website** built for a real hotel under construction in Akola, Maharashtra. Designed to match the quality and features of industry leaders like Taj Hotels, Radisson, and Sterling Holidays, this project demonstrates a complete, production-ready hospitality web application.

**Hotel Contact:** +91 90826 90060 | reservations@tnghotels.com

---

## ✨ Features

### Guest Experience
| Feature | Details |
|---|---|
| 🎠 **Hero Slider** | 5-image auto-sliding hero with arrows, dots, 5s auto-play |
| 🛏️ **Rooms & Suites** | 5 room types with gallery, amenities, availability check |
| 📅 **Booking System** | Date picker, multi-room (1–5), real-time availability, GST breakdown |
| 💳 **Razorpay Payments** | Secure online payment with test mode support |
| 📧 **Email Confirmation** | Luxury HTML booking & cancellation emails via EmailJS |
| 💬 **WhatsApp Integration** | Pre-filled booking confirmation & cancellation messages |
| 🔐 **Authentication** | JWT login/register, forgot password, member profiles |
| 📱 **Fully Responsive** | Mobile-first design across all screen sizes |

### Pages
- **Home** — Hero slider, stats, rooms preview, banquet CTA, testimonials, gallery
- **Rooms** — Filter by type, room cards with availability
- **Room Detail** — Image gallery, amenities, booking sidebar
- **Booking** — Full form, date picker, GST breakdown, Razorpay payment
- **My Bookings** — View, track, and cancel reservations
- **Dining** — Restaurant showcase with specialties
- **Amenities** — Pool, spa, gym, banquet facilities
- **About** — Story, timeline, values
- **Contact** — Form, map embed, phone, WhatsApp
- **How to Reach** — Google Maps, transport options
- **Login / Register** — Auth with password strength, error handling

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6 |
| **Backend** | Node.js, Express, Helmet, CORS, Rate Limiting |
| **Database** | PostgreSQL 16 with node-postgres |
| **Auth** | JWT + bcryptjs |
| **Payments** | Razorpay |
| **Emails** | EmailJS (REST API, 200 free/month) |
| **Fonts** | Cormorant Garamond + Cinzel + Jost (Google Fonts) |
| **Icons** | Lucide React |
| **Deploy** | Vercel (frontend) + Railway (backend + DB) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v20+
- PostgreSQL 16+
- Git

### 1. Clone
```bash
git clone https://github.com/Arav1904/SY_WPL-Mini_Project.git
cd SY_WPL-Mini_Project
```

### 2. Database Setup
Create database `tng_hotel` in pgAdmin, then run the schema:
```bash
psql -U postgres -d tng_hotel -f backend/config/schema.sql
```

### 3. Backend
```bash
cd backend
npm install
```
Create `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/tng_hotel
JWT_SECRET=your_long_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
```bash
npm run dev   # Runs on http://localhost:5000
```

### 4. Frontend
```bash
cd frontend
npm install
```
Create `frontend/.env`:
```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_CANCEL_TEMPLATE_ID=template_yyyyyyy
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```
```bash
npm run dev   # Runs on http://localhost:5173
```

---

## 💳 Razorpay Test Payment Setup

1. Sign up at [razorpay.com](https://razorpay.com) — free
2. Dashboard → Settings → API Keys → **Generate Test Keys**
3. Copy **Test Key ID** and **Test Key Secret** to both `.env` files
4. Use these test cards:

| Card Type | Number | Expiry | CVV |
|---|---|---|---|
| Visa | `4111 1111 1111 1111` | Any future | Any 3 digits |
| Mastercard | `5267 3181 8797 5449` | Any future | Any 3 digits |
| UPI | `success@razorpay` | — | — |

> Test OTP: `1234` | All test transactions are free

---

## 📧 EmailJS Email Setup

1. Sign up at [emailjs.com](https://emailjs.com) — free (200 emails/month)
2. Add Gmail as Email Service → note **Service ID**
3. Create 2 templates (paste HTML from `/email-templates/`):
   - `booking_confirmation_email.html` → note Template ID → add as `VITE_EMAILJS_TEMPLATE_ID`
   - `cancellation_email.html` → note Template ID → add as `VITE_EMAILJS_CANCEL_TEMPLATE_ID`
4. Account page → copy **Public Key** → add as `VITE_EMAILJS_PUBLIC_KEY`
5. Restart frontend

---

## 🗄️ Database Schema

```sql
users         — Members (id, name, email, password_hash, phone, role)
rooms         — Room types (id, name, type, price, amenities, images, total_rooms)
bookings      — Reservations (id, user_id, room_id, dates, guests, total, payment_status)
testimonials  — Guest reviews (id, name, rating, review, is_approved)
contacts      — Contact form submissions
```

**Seeded data:** 5 rooms + 6 testimonials + 1 admin user

---

## 🌐 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Settings → General → Root Directory → `frontend`
4. Add environment variables (all `VITE_*` vars)
5. Deploy

### Backend → Railway
1. New project at [railway.app](https://railway.app)
2. Deploy from GitHub → set root directory to `backend`
3. Add PostgreSQL plugin
4. Add all environment variables
5. Set `DATABASE_URL` to Railway's PostgreSQL URL

---

## 📁 Project Structure

```
SY_WPL-Mini_Project/
├── backend/
│   ├── config/
│   │   ├── db.js              # PostgreSQL connection
│   │   └── schema.sql         # Tables + seed data
│   ├── middleware/
│   │   └── auth.js            # JWT middleware (~40 lines)
│   ├── routes/
│   │   ├── auth.js            # Login, register, profile
│   │   ├── bookings.js        # CRUD + cancellation
│   │   ├── rooms.js           # Listing + availability
│   │   ├── testimonials.js    # Reviews
│   │   ├── contact.js         # Contact form
│   │   └── payment.js         # Razorpay
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── tng-logo.png       # ← Put logo here
│   ├── src/
│   │   ├── components/        # Navbar, Footer, HeroSlider, etc.
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # All 15 page components
│   │   └── utils/             # api.js (axios instance)
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── email-templates/
│   ├── booking_confirmation_email.html
│   └── cancellation_email.html
│
├── .gitignore
├── vercel.json
└── README.md
```

---

## 🔐 Default Admin Account

After running `schema.sql`, update the admin password:
```sql
-- Run in pgAdmin Query Tool connected to tng_hotel
-- First generate hash: node -e "require('bcryptjs').hash('YourPassword',10).then(console.log)"
UPDATE users SET password_hash = 'PASTE_HASH_HERE' WHERE email = 'admin@tnghotels.com';
```
Login: `admin@tnghotels.com`

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| Rooms not loading | Check `frontend/.env` has `VITE_API_URL=/api` (no http://) |
| Backend DB error | Verify `DATABASE_URL` password in `backend/.env` |
| Port 5000 busy | `npx kill-port 5000` |
| Vercel shows old site | Vercel dashboard → Redeploy |
| Vercel page refresh 404 | `vercel.json` rewrites must point to `index.html` |
| EmailJS not sending | Restart frontend after adding `.env` vars |
| Razorpay not loading | Add `<script src="https://checkout.razorpay.com/v1/checkout.js">` to `index.html` |

---

## 👨‍💻 Developer

**Arav Ghiya**  **
**Dhruvkumar Goenka**
SY Engineering — Web Programming Lab  
TNG Hotels & Banquets, Akola

---

<div align="center">
<sub>Built with ❤️ for TNG Hotels & Banquets, Akola, Maharashtra, India</sub>
</div>
