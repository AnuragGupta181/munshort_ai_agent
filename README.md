# LugInsight - Luggage Brand Competitive Intelligence Dashboard

A full-stack competitive intelligence dashboard that scrapes, analyzes, and visualizes customer reviews and pricing data for luggage brands on Amazon India.

## What It Does

- **Scrapes** Amazon India product listings and reviews using Playwright
- **Analyzes** sentiment using Google Gemini LLM (with fallback heuristics)
- **Compares** brands on price, discount, rating, sentiment, and aspect-level quality
- **Surfaces** non-obvious insights, anomalies, and trust signals
- **Presents** everything in an interactive React dashboard

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### 1. Install Dependencies

```bash
# Backend
uv sync

# Frontend
cd frontend && npm install && cd ..
```

### 2. Run with Sample Data (No Scraping Needed)

The project ships with a pre-generated sample dataset so you can explore the dashboard immediately:

```bash
# Generate/refresh sample data
uv run python scripts/generate_sample.py

# Start backend (port 8000)
uv run uvicorn backend.app:app --port 8000

# In another terminal, start frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173 in your browser.

### 3. Run with Real Data (Optional)

```bash
# Set your Gemini API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Install Playwright browsers
uv run playwright install chromium

# Scrape all 6 brands
uv run python scripts/scrape.py all --max-products 12

# Process scraped data with Gemini sentiment analysis
uv run python scripts/process.py

# Or process without Gemini (uses rating-based heuristics)
uv run python scripts/process.py --skip-llm
```

## Architecture

```
Scraper (Playwright)  -->  data/raw/ (JSON)
         |
Processing Pipeline (Pandas + Gemini)  -->  data/processed/ (JSON)
         |
FastAPI Server (port 8000)  <--  reads JSON at startup
         |
React Dashboard (Vite, port 5173)  <--  fetches via REST API
```

**Key design decision**: The scraper and processor are offline CLI tools that produce static JSON files. The API server simply reads these files. No database needed -- the dataset is small enough to fit in memory.

## Dashboard Views

### Overview
Total brands, products, reviews, average sentiment, pricing charts, and brand snapshot cards.

### Brand Comparison
Sortable comparison table, price-vs-sentiment scatter plot, aspect heatmap, sentiment radar chart, and discount analysis.

### Product Drilldown
Filterable product table with expandable rows showing review synthesis, appreciation/complaint themes, and per-aspect sentiment bars.

### Agent Insights
5 AI-generated non-obvious conclusions, anomaly detection cards, value-for-money analysis, and review trust leaderboard.

## Filters
- Brand selector (multi-select)
- Minimum rating filter
- Category filter (Cabin, Check-in, Medium, Small)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Scraping | Playwright (headless Chromium) |
| Data Processing | Pandas, Python |
| Sentiment Analysis | Google Gemini 2.0 Flash |
| Backend API | FastAPI + Uvicorn |
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State Management | Zustand |
| Data Fetching | TanStack React Query |

## Data Scope

| Metric | Coverage |
|--------|----------|
| Brands | Safari, Skybags, American Tourister, VIP, Aristocrat, Nasher Miles |
| Products per brand | 10-12 |
| Reviews per brand | 50-100 |
| Aspect categories | Wheels, Handle, Material, Zipper, Size/Space, Durability |

## Bonus Features

- **Aspect-level sentiment**: Per-brand heatmap for wheels, handle, material, zipper, size, durability
- **Anomaly detection**: Flags high-rating products with negative sentiment, suspicious pricing, durability concerns
- **Value-for-money analysis**: Sentiment adjusted by price band scatter plot
- **Review trust signals**: Detects suspicious review patterns (burst reviews, low verified ratio, generic phrasing)
- **Agent Insights**: 5 auto-generated non-obvious conclusions from the data

## Sentiment Methodology

When using **Gemini LLM** (default):
- Reviews are sent in batches of 15 to Gemini 2.0 Flash
- Each review receives a sentiment score (-1.0 to 1.0) and theme tags
- Aspect-level sentiment is extracted for 6 luggage-specific aspects
- Product-level synthesis paragraphs are generated

When using **fallback mode** (`--skip-llm`):
- Sentiment is derived from star ratings: `(rating - 3) / 2.5`
- Aspect detection uses keyword matching
- No synthesis paragraphs generated

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/overview` | Dashboard stats |
| `GET /api/brands` | All brands with metrics |
| `GET /api/brands/{slug}` | Single brand detail |
| `GET /api/products` | Filterable product list |
| `GET /api/products/{asin}` | Product detail with reviews |
| `GET /api/insights` | Agent insights |
| `GET /api/anomalies` | Detected anomalies |
| `GET /api/aspects` | Aspect sentiment matrix |
| `GET /api/value-for-money` | Value analysis |
| `GET /api/trust-signals` | Trust scores |
| `GET /api/filters` | Available filter options |

## Limitations

- Amazon scraping is rate-limited and may be blocked; the sample dataset is provided as a reliable fallback
- Sentiment analysis quality depends on Gemini API; the fallback heuristic is simpler but functional
- Review count per product varies based on Amazon availability
- Category and size data depends on how products are listed on Amazon

## Project Structure

```
munshot_ai_agent/
├── backend/
│   ├── app.py                  # FastAPI server
│   ├── config.py               # Settings
│   ├── scraper/                # Playwright scrapers
│   ├── processing/             # Analysis pipeline
│   ├── routes/                 # API endpoints
│   └── models/                 # Pydantic schemas
├── frontend/src/
│   ├── pages/                  # 4 dashboard pages
│   ├── components/             # Charts, cards, filters
│   ├── hooks/                  # React Query hooks
│   └── stores/                 # Zustand state
├── data/
│   ├── sample/                 # Pre-built dataset
│   ├── raw/                    # Scraped data
│   └── processed/              # Analyzed data
└── scripts/
    ├── generate_sample.py      # Sample data generator
    ├── scrape.py               # Scraper CLI
    └── process.py              # Processing pipeline
```
