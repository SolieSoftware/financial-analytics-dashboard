# Financial Analytics Dashboard

A modern, real-time financial analytics platform for tracking stocks, analyzing market data, and managing investment portfolios with comprehensive technical and fundamental analysis tools.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)

---

## Features

### Real-Time Market Data
- **Live Stock Quotes**: Real-time price tracking with historical data visualization
- **Market Overview**: Monitor biggest gainers, losers, and most active stocks
- **Interactive Charts**: Recharts-powered visualizations with custom tooltips and trend indicators
- **TradingView Integration**: Professional-grade technical analysis widgets and indicators

### Stock Analysis
- **Company Overview**: Detailed company information, metrics, and key statistics
- **Technical Analysis**: TradingView technical indicators with buy/sell signals
- **Fundamental Data**: Financial metrics, ratios, and performance analytics
- **News Feed**: Real-time market news with sentiment analysis

### Portfolio Management
- **Watchlist**: Track your favorite stocks in one place
- **Performance Analytics**: Comprehensive metrics including volume, market cap, P/E ratio
- **Custom Dashboards**: Personalized views for different market segments

### User Experience
- **Dark Mode**: TradingView-inspired professional dark theme
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Fast Loading**: Redis caching with Supabase fallback for optimal performance
- **Real-time Updates**: SWR-powered data fetching with automatic revalidation

---

## Tech Stack

### Frontend (Next.js)
```
├── Framework:      Next.js 15.3.4 (App Router)
├── Language:       TypeScript 5.x
├── Styling:        TailwindCSS 4.1.11
├── UI Components:  ShadCN/UI (Custom component library)
├── Charts:         Recharts 3.2.1
├── State:          Redux Toolkit 2.8.2
├── Data Fetching:  SWR 2.3.6
├── Icons:          Lucide React 0.544.0
└── Auth:           Supabase Auth (SSR)
```

### Backend (FastAPI)
```
├── Framework:      FastAPI (Python)
├── Data Sources:   Yahoo Finance, Alpha Vantage, Financial Modeling Prep
├── Caching:        Redis (Railway)
├── Database:       Supabase (PostgreSQL)
├── Async Runtime:  Uvicorn
└── HTTP Client:    HTTPX (async)
```

### Infrastructure
```
├── Frontend Host:  Vercel
├── Backend Host:   Railway
├── Cache:          Redis (Railway)
├── Database:       Supabase
└── CI/CD:          GitHub Actions (auto-deploy)
```

---

## Architecture

### System Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Next.js   │────────▶│   FastAPI    │────────▶│  Redis      │
│  Frontend   │         │   Backend    │         │  Cache      │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │                        │
      ▼                        ▼
┌─────────────┐         ┌──────────────┐
│  Supabase   │         │  External    │
│  Auth & DB  │         │  APIs        │
└─────────────┘         └──────────────┘
                        (Yahoo Finance,
                         Alpha Vantage,
                         Financial Modeling Prep)
```

### Data Flow

1. **User Request** → Next.js frontend receives user interaction
2. **API Route** → Next.js API routes proxy requests to FastAPI backend
3. **Cache Check** → FastAPI checks Redis cache for existing data
4. **Data Source** → On cache miss, fetch from:
   - **Primary**: Supabase (historical ticker data)
   - **Fallback**: Yahoo Finance (yfinance)
   - **News/Market**: Alpha Vantage, Financial Modeling Prep
5. **Cache Update** → Store fresh data in Redis with TTL
6. **Response** → Return data to frontend
7. **State Management** → Redux stores global state, SWR manages server state
8. **UI Render** → React components display data with Recharts/TradingView widgets

### Caching Strategy

```python
# Cache TTLs (seconds)
TICKER_INFO_TTL = 3600        # 1 hour
TICKER_HISTORY_TTL = 1800     # 30 minutes
TICKER_LIST_TTL = 86400       # 24 hours
MARKET_NEWS_TTL = 900         # 15 minutes
```

- **Redis Primary**: Fast in-memory cache for frequent requests
- **Supabase Fallback**: Persistent storage for ticker historical data
- **TTL-based Expiry**: Automatic cache invalidation
- **Startup Warm-up**: Pre-populates cache with top 40 tickers on backend startup

---

## Project Structure

```
financial-analytics-dashboard/
├── frontend-next/              # Next.js frontend application
│   ├── src/
│   │   ├── app/               # Next.js 15 App Router
│   │   │   ├── (finance)/    # Finance pages (market-overview, stock-profile, trading-view)
│   │   │   ├── api/          # API routes (proxy to FastAPI)
│   │   │   ├── auth/         # Authentication pages (login, register, reset)
│   │   │   └── providers/    # Context providers (Redux, Auth)
│   │   ├── components/
│   │   │   ├── ui/           # ShadCN base components (Button, Card, Badge, etc.)
│   │   │   ├── charts/       # Recharts components (StockPriceChart, BaseCharts)
│   │   │   ├── cards/        # Specialized cards (MetricCard, StockCard)
│   │   │   ├── info/         # Info panels (CompanyOverview, KeyMetrics, LatestNews)
│   │   │   ├── sidebar/      # Navigation sidebar components
│   │   │   ├── selectors/    # Ticker selector component
│   │   │   └── trading-view-widgets/  # TradingView widget integrations
│   │   ├── utils/
│   │   │   ├── hooks/        # Custom React hooks (useStockProfile, useMarketProfile)
│   │   │   ├── types/        # TypeScript type definitions
│   │   │   ├── supabase/     # Supabase client utilities
│   │   │   └── fetchers/     # SWR data fetchers
│   │   └── lib/              # Utilities (cn helper for className merging)
│   ├── tailwind.config.ts    # Tailwind configuration with custom color palette
│   └── package.json
│
├── backend/                   # FastAPI backend application
│   ├── main.py               # Main FastAPI application with all endpoints
│   ├── services/             # External service clients
│   │   ├── yfinance_client.py    # Yahoo Finance integration
│   │   ├── redis_client.py       # Redis cache client
│   │   ├── supabase_client.py    # Supabase database client
│   │   └── cache_service.py      # Cache service abstraction
│   ├── core/
│   │   ├── config.py         # Configuration (cache TTLs, etc.)
│   │   └── cache.py          # Cache decorator utilities
│   ├── utils/
│   │   └── serializers.py    # Data serialization for caching
│   └── models/               # Data models
│
├── DEPLOYMENT.md             # Deployment guide (Vercel + Railway)
├── CURRENT_STATUS.md         # MUI to Tailwind migration status
└── README.md                 # This file
```

---

## Getting Started

### Prerequisites

- **Node.js**: 20.x or later
- **Python**: 3.11 or later
- **Redis**: Local instance or Railway cloud Redis
- **Supabase Account**: Free tier available

### API Keys Required

1. **Alpha Vantage**: [Get free API key](https://www.alphavantage.co/support/#api-key)
2. **Financial Modeling Prep**: [Get free API key](https://site.financialmodelingprep.com/developer/docs/)
3. **Supabase**: [Create free project](https://supabase.com/)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/SolieSoftware/financial-analytics-dashboard.git
cd financial-analytics-dashboard
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env.local file
cat > .env.local << EOF
ALPHAVANTAGE_API_KEY=your_alpha_vantage_key
FINANCIAL_MODELLING_API_KEY=your_fmp_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
REDIS_URL=redis://localhost:6379  # Optional for local Redis
EOF

# Start backend server
python main.py
# Backend runs on http://localhost:8000
```

#### 3. Frontend Setup

```bash
cd frontend-next

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF

# Start development server
npm run dev
# Frontend runs on http://localhost:3000
```

#### 4. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

### Frontend (`frontend-next/`)

```bash
npm run dev          # Start development server (with Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Backend (`backend/`)

```bash
python main.py       # Start FastAPI server
uvicorn main:app --reload  # Start with auto-reload
```

---

## API Endpoints

### Backend FastAPI Endpoints

#### Health & Admin
- `GET /` - API status check
- `GET /health/redis` - Redis connection health
- `POST /admin/clear-cache` - Clear Redis cache
- `GET /admin/redis/stats` - Redis statistics

#### Ticker Data
- `GET /api/tickers/{ticker}/data` - Get ticker info + historical data
- `GET /api/supabase/tickers/{market_cap}` - Get ticker list by market cap

#### Market Data (Alpha Vantage)
- `GET /api/market-daily/{symbol}/data` - Daily market data
- `GET /api/company-overview/{symbol}` - Company overview
- `GET /api/market-status` - Market status
- `GET /api/market-news/{symbol}` - Stock-specific news
- `GET /api/general-market-news` - General market news

#### Market Movers (Financial Modeling Prep)
- `GET /api/financial-modelling-prep/biggest-gainers` - Top gainers
- `GET /api/financial-modelling-prep/biggest-losers` - Top losers
- `GET /api/financial-modelling-prep/most-active` - Most active stocks

### Frontend API Routes (Next.js)

All frontend API routes (`/api/*`) proxy to the FastAPI backend and are used by the frontend components.

---

## Key Features Explained

### 1. Stock Profile Page

**Route**: `/stock-profile/{ticker}`

Displays comprehensive stock analysis including:
- **Price Chart**: Interactive Recharts visualization with historical data
- **Company Overview**: Business description, sector, industry, metrics
- **Key Metrics**: P/E ratio, market cap, dividend yield, etc.
- **Latest News**: Sentiment-analyzed news articles
- **Performance Analytics**: Volume, price changes, technical indicators
- **TradingView Widgets**: Technical indicators and fundamental data

### 2. Market Overview

**Route**: `/market-overview`

Market-wide dashboard featuring:
- **Biggest Gainers**: Top performing stocks
- **Biggest Losers**: Worst performing stocks
- **Most Active**: Highest volume stocks
- **Market Indices**: SPY, QQQ, DIA, IWM charts

### 3. Trading View

**Route**: `/trading-view/{ticker}`

Professional trading interface with:
- **Advanced Charts**: TradingView embedded charts
- **Technical Indicators**: RSI, MACD, Moving Averages, etc.
- **Economics Calendar**: Upcoming market events
- **Market Data Widgets**: Real-time market information

### 4. Authentication

**Routes**: `/auth/login`, `/auth/register`, `/auth/reset-password`

Supabase-powered authentication with:
- Email/password registration and login
- Password reset with email verification
- Protected routes with middleware
- SSR-compatible auth state

---

## Design System

### Color Palette (Tailwind Variables)

```css
/* Background */
--background-primary: #1a1a1a
--background-secondary: #242424
--background-tertiary: #2a2a2a

/* Text */
--text-primary: #e8e8e8
--text-secondary: #a8a8a8
--text-muted: #6a6a6a

/* Market Colors */
--bullish: #00ff88      /* Green */
--bearish: #ff4444      /* Red */

/* Accents */
--accent-blue: #4a9eff
--accent-purple: #9d4eff
--accent-yellow: #ffd700
--accent-cyan: #00e5ff

/* Borders */
--border: #3a3a3a
--border-light: #4a4a4a
```

### Component Library

Built with ShadCN/UI methodology:

- **Card**: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- **Badge**: Variants: `default`, `bullish`, `bearish`, `outline`
- **Button**: Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Alert**: Variants: `default`, `destructive`, `success`, `warning`, `info`
- **Skeleton**: Pulse animation for loading states
- **Input**: Form inputs with focus states

---

## Deployment

### Production Deployment (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Summary:**

1. **Frontend**: Deploy to Vercel
   - Root Directory: `frontend-next`
   - Build Command: `npm run build`
   - Add environment variable: `FASTAPI_URL`

2. **Backend**: Deploy to Railway
   - Root Directory: `backend`
   - Add Redis database
   - Configure environment variables

3. **Total Cost**: $0/month (free tiers)

### Environment Variables

#### Frontend (Vercel)
```
FASTAPI_URL=https://your-backend.railway.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (Railway)
```
ALPHAVANTAGE_API_KEY=your_key
FINANCIAL_MODELLING_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
REDIS_URL=auto_provided_by_railway
```

---

## Performance Optimizations

### Backend
- **Redis Caching**: In-memory cache with configurable TTLs
- **Supabase Fallback**: Database persistence for ticker data
- **Connection Pooling**: Optimized HTTP adapters with retry strategy
- **Async Operations**: FastAPI async endpoints with threadpool for sync operations
- **Startup Cache Warm-up**: Pre-loads top 40 tickers on startup

### Frontend
- **SWR Data Fetching**: Automatic revalidation and caching
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component
- **Turbopack**: Faster development builds
- **Redux State**: Optimized global state management

---

## Migration Status

Currently migrating from Material-UI to Tailwind CSS + ShadCN/UI:

**Progress**: ~75% Complete

✅ **Completed**:
- Charts & base components
- Auth pages
- Default components (Loading, Error)
- Finance app pages
- Info panels (Company Overview, Key Metrics, Latest News)
- Sidebar & navigation

⏳ **In Progress**:
- Ticker selector component
- Final MUI dependency removal

See [CURRENT_STATUS.md](./CURRENT_STATUS.md) for detailed migration tracking.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is private and proprietary. All rights reserved.

---

## Support & Contact

For issues, questions, or feature requests:
- **GitHub Issues**: [Create an issue](https://github.com/SolieSoftware/financial-analytics-dashboard/issues)
- **Documentation**: See the [DEPLOYMENT.md](./DEPLOYMENT.md) and [CURRENT_STATUS.md](./CURRENT_STATUS.md) files

---

## Acknowledgments

- **Data Sources**: Yahoo Finance, Alpha Vantage, Financial Modeling Prep
- **UI Inspiration**: TradingView
- **Component Library**: ShadCN/UI
- **Charts**: Recharts, TradingView Widgets
- **Infrastructure**: Vercel, Railway, Supabase

---

**Built with ❤️ by SolieSoftware**
