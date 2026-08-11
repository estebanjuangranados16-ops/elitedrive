#EliteDrive — Luxury Car Dealership Platform

> A full-featured luxury vehicle dealership web app built with React, TypeScript, and Vite. Live at [elitedrive-three.vercel.app](https://elitedrive-three.vercel.app)

![EliteDrive Preview](https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200&h=400)

##  Features

- **Vehicle Inventory** — Filterable catalog with brand, model, price range, year, body type and fuel type
- **Vehicle Detail Modal** — Image gallery with zoom viewer, financing calculator, test drive booking
- **AI Live Chat** — Powered by Google Gemini AI, trained as an EliteDrive virtual advisor
- **Favorites** — Persistent favorites list saved to localStorage
- **Marketplace** — Community listings page for private sellers
- **Sell / Appraisal Form** — Drag & drop photo upload + email submission
- **Contact Form** — Real email delivery via FormSubmit
- **Newsletter** — Email subscription with confirmation
- **Fully Responsive** — Mobile-first design for phones, tablets and desktop

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| UI Components | Radix UI (Slider) |
| Icons | Lucide React |
| Routing | React Router DOM v7 |
| AI Chat | Google Gemini AI (`@google/genai`) |
| Email | FormSubmit, EmailJS |
| Deployment | Vercel |

##  Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/elitedrive.git
cd elitedrive

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY from https://aistudio.google.com/app/apikey

# 4. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

##  Project Structure

```
src/
├── components/
│   └── LiveChat.tsx      # AI-powered chat widget
├── App.tsx               # Main app with all page components
├── constants.ts          # Car inventory data
├── types.ts              # TypeScript interfaces
└── index.css             # Global styles & Tailwind theme
```

##  Live Demo

**[https://elitedrive-three.vercel.app](https://elitedrive-three.vercel.app)**


