# Lumina Skin (AI Skincare Companion inspired by Glow)

A full-stack skincare web app, inspired by apps like Glow, built with **Python Django** (REST API backend) and **React / Next.js** (frontend, plain JavaScript/JSX).

> **Project status: portfolio prototype.** The ingredient conflict checker, product catalog, routines and skin history are backed by real database models. The **skin scanner is a simulation**: it saves the uploaded photo but generates *randomized* scores and fixed recommendations; it does not analyze the image. The AI Coach calls a real LLM only if you supply an OpenAI API key; otherwise it falls back to built-in keyword-based answers. There is no user authentication, so all data is shared.

---

## Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│             Next.js 14 Frontend (React)                │
│  - Port 3000 (app router, Tailwind CSS, Lucide icons)  │
│  - Skin Scanner (photo upload, simulated analysis)     │
│  - Morning & Evening Routine Checklist                 │
│  - Active Ingredient Conflict Detector                 │
│  - Product Catalog & Recommendations                   │
│  - Skin Diary & Progress History                       │
│  - AI Skincare Coach Chatbot (RAG + LLM API)           │
└───────────────────────────┬────────────────────────────┘
                            │ JSON / REST (CORS enabled)
                            ▼
┌────────────────────────────────────────────────────────┐
│           Django REST Framework Backend                │
│  - Port 8000 (Python 3.12+, SQLite database)           │
│  - Models: Product, Ingredient, ConflictRule,          │
│            Routine, RoutineStep, SkinScan              │
│  - Endpoints: /api/products/, /api/conflicts/check/,   │
│               /api/scans/analyze/, /api/routines/,     │
│               /api/chat/ (Conversational LLM Coach)    │
└────────────────────────────────────────────────────────┘
```

---

## Prerequisites

* Python 3.12 or newer (developed with 3.15)
* Node.js 18.18 or newer (developed with 22) and npm

## Setup and Run

Clone the repository, then use two terminals.

### 1. Backend (Django API)

```bash
cd lumina-skincare
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate           # creates the SQLite database
python manage.py seed_skincare_data  # loads sample products, ingredients, rules, routines
python manage.py runserver 127.0.0.1:8000
```
* Django API: `http://127.0.0.1:8000/api/`
* Django Admin: `http://127.0.0.1:8000/admin/` (create a login first with `python manage.py createsuperuser`)

### 2. Frontend (Next.js)

```bash
cd lumina-skincare/frontend
npm install
npm run dev
```
* Open the app at `http://localhost:3000`

The frontend expects the API at `http://127.0.0.1:8000/api` (set in `frontend/app/page.jsx`). If the backend is not running, the app shows built-in sample data and a "Demo Mode (API offline)" badge.

### Optional: live LLM for the AI Coach

Either set the `OPENAI_API_KEY` environment variable before starting Django, or paste a key into the "Custom LLM Key" box on the AI Coach tab. Without a key, the coach uses built-in keyword-based answers.

---

## Core Features Implemented

1. **Skin Scanner (`/api/scans/analyze/`), simulated:**
   * Upload a portrait photo; it is stored and a scan record is saved.
   * Scores (Hydration, Calmness, Clarity, Texture), concerns and recommendations are **randomized/placeholder values**, not a real image analysis. Real computer-vision analysis (e.g. MediaPipe/OpenCV or a vision LLM) is the natural next step.

2. **Daily Skincare Routines (`/api/routines/`, `/api/steps/<id>/toggle/`):**
   * Pre-configured Morning & Evening routines.
   * Check-off state is saved through the API. (The "5 Day Streak" badge is a static placeholder.)
   * Associated products with active ingredient badges and application instructions.

3. **Active Ingredient Conflict Checker (`/api/conflicts/check/`):**
   * Select combinations of active ingredients (e.g., Retinol + Salicylic Acid, Vitamin C + Benzoyl Peroxide).
   * Evaluates synergy rules and alerts users with severity levels (`Danger` vs `Caution`), biochemical reasons, and dermatological usage suggestions.

4. **Curated Product Directory (`/api/products/`):**
   * Filter by category (Cleansers, Serums, Moisturizers, SPF, Treatments).
   * Search by brand, name, or active ingredients with direct compatibility checking.

5. **Skin Diary (`/api/scans/`):**
   * Historical record of all past facial scans to track progress over weeks and months.
