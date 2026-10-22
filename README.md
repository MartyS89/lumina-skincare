# Lumina Skin (AI Skincare Companion inspired by Glow)

A modern full-stack skincare web and mobile application built with **Python Django** (Backend REST API) and **React / Next.js** (Frontend UI).

---

## Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│             Next.js 14 Frontend (React)                │
│  - Port 3000 (app router, Tailwind CSS, Lucide icons)  │
│  - AI Skin Scanner with camera upload                  │
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
│  - Port 8000 (Python 3.15, SQLite / PostgreSQL ready)  │
│  - Models: Product, Ingredient, ConflictRule,          │
│            Routine, RoutineStep, SkinScan              │
│  - Endpoints: /api/products/, /api/conflicts/check/,   │
│               /api/scans/analyze/, /api/routines/,     │
│               /api/chat/ (Conversational LLM Coach)    │
└────────────────────────────────────────────────────────┘
```

---

## How to Run

### 1. Start the Django API Backend
Open a terminal in the root project folder:

```bash
cd /Users/martin/PyCharm
source .venv/bin/activate
python manage.py runserver 127.0.0.1:8000
```
* Django API: `http://127.0.0.1:8000/api/`
* Django Admin: `http://127.0.0.1:8000/admin/`

### 2. Start the Next.js Frontend
In a second terminal:

```bash
cd /Users/martin/PyCharm/frontend
npm run dev
```
* Access the app in your browser at: `http://localhost:3000`

---

## Core Features Implemented

1. **AI Skin Scanner (`/api/scans/analyze/`):**
   * Upload or capture a portrait selfie.
   * Diagnoses skin profile and scores: Hydration, Calmness (Redness), Clarity (Blemishes), and Surface Texture.
   * Highlights specific facial concerns (e.g. T-zone congestion, dehydration lines) and generates an AI Action Plan.

2. **Daily Skincare Routines (`/api/routines/`, `/api/steps/<id>/toggle/`):**
   * Pre-configured Morning & Evening routines.
   * Interactive check-off system to track daily completion streak.
   * Associated products with active ingredient badges and application instructions.

3. **Active Ingredient Conflict Checker (`/api/conflicts/check/`):**
   * Select combinations of active ingredients (e.g., Retinol + Salicylic Acid, Vitamin C + Benzoyl Peroxide).
   * Evaluates synergy rules and alerts users with severity levels (`Danger` vs `Caution`), biochemical reasons, and dermatological usage suggestions.

4. **Curated Product Directory (`/api/products/`):**
   * Filter by category (Cleansers, Serums, Moisturizers, SPF, Treatments).
   * Search by brand, name, or active ingredients with direct compatibility checking.

5. **Skin Diary (`/api/scans/`):**
   * Historical record of all past facial scans to track progress over weeks and months.
