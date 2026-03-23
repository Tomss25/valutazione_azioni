# Portfolio Analyzer - FinTech Dashboard Q4 2025

Enterprise-grade financial analysis platform for stock evaluation and portfolio management.

## 🚀 Features

- **Executive Dashboard**: KPI cards, donut charts for sector/industry allocation, bar charts for score distribution
- **Global Analysis**: Interactive data table with TanStack React Table, multi-select filters, score range sliders
- **Raw Data Inspector**: Tab-based view of all Excel sheets with pagination

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Table**: TanStack React Table
- **Excel Parsing**: SheetJS (xlsx)

---

## 🌐 DEPLOYMENT GUIDE

### Option 1: Deploy su Vercel (Raccomandato)

Vercel è la piattaforma creata dal team di Next.js, perfetta per questo progetto.

#### Step 1: Crea un repository su GitHub

1. Vai su [github.com](https://github.com) e accedi (o crea un account)
2. Clicca su **"New repository"** (icona + in alto a destra)
3. Nome repository: `portfolio-analyzer` (o quello che preferisci)
4. Seleziona **Private** se vuoi tenerlo privato
5. Clicca **"Create repository"**

#### Step 2: Carica il codice su GitHub

```bash
# 1. Estrai l'archivio ZIP scaricato
unzip fintech-portfolio-analyzer.zip
cd fintech-app

# 2. Inizializza Git
git init

# 3. Aggiungi tutti i file
git add .

# 4. Crea il primo commit
git commit -m "Initial commit: Portfolio Analyzer"

# 5. Collega al repository GitHub (sostituisci USERNAME con il tuo)
git remote add origin https://github.com/USERNAME/portfolio-analyzer.git

# 6. Carica su GitHub
git branch -M main
git push -u origin main
```

#### Step 3: Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com) e accedi con GitHub
2. Clicca **"Add New Project"**
3. Seleziona il repository `portfolio-analyzer`
4. Vercel rileva automaticamente Next.js - lascia le impostazioni di default
5. Clicca **"Deploy"**
6. Attendi 1-2 minuti... ✨ **Il tuo sito è online!**

L'URL sarà qualcosa come: `https://portfolio-analyzer-xxx.vercel.app`

---

### Option 2: Deploy su Netlify

1. Vai su [netlify.com](https://netlify.com) e accedi
2. Clicca **"Add new site"** → **"Import an existing project"**
3. Connetti GitHub e seleziona il repository
4. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Clicca **"Deploy site"**

---

### Option 3: Deploy su Railway

1. Vai su [railway.app](https://railway.app) e accedi con GitHub
2. Clicca **"New Project"** → **"Deploy from GitHub repo"**
3. Seleziona il repository
4. Railway configura tutto automaticamente
5. Il sito sarà disponibile su un URL `.railway.app`

---

### Option 4: Run Locale (Sviluppo)

```bash
# Estrai il progetto
unzip fintech-portfolio-analyzer.zip
cd fintech-app

# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Apri http://localhost:3000
```

---

## 📁 Project Structure

```
fintech-app/
├── modello_finale_integrato.xlsx  # Data source (required)
├── src/
│   ├── app/
│   │   ├── api/portfolio/route.ts # API endpoint
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main page
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── dashboard/             # Dashboard view components
│   │   ├── analysis/              # Global analysis components
│   │   └── rawdata/               # Raw data inspector
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   └── types/
│       └── portfolio.ts           # TypeScript types
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 📊 API Endpoint

### GET /api/portfolio

Returns portfolio data from the Excel file.

**Response**:
```json
{
  "success": true,
  "data": {
    "securities": [...],
    "rawSheets": [...],
    "summary": {
      "totalSecurities": 2997,
      "totalMarketCap": 123456789,
      "avgFundamentalScore": 2.45,
      "sectors": [...],
      "industries": [...],
      "scoreDistribution": [...]
    }
  }
}
```

## 🎨 Design System

L'app usa un tema Light professionale con:
- Primary color: Emerald/Teal
- Background: Soft gray-white
- Cards: Pure white con shadows
- Accent colors per score visualization

## 📝 Excluded Sheets

I seguenti fogli sono esclusi dalla risposta API:
- MARKET AVERAGE
- INPUT USA Average
- INPUT EUROPE Average

## 🔧 Aggiornare i Dati

1. Sostituisci `modello_finale_integrato.xlsx` con il file aggiornato
2. Fai commit e push su GitHub:
   ```bash
   git add modello_finale_integrato.xlsx
   git commit -m "Update data file"
   git push
   ```
3. Vercel fa il re-deploy automaticamente in ~1 minuto

---

## ❓ Troubleshooting

### "File Excel non trovato"
Assicurati che `modello_finale_integrato.xlsx` sia nella root del progetto (non in una sottocartella).

### Build fallito su Vercel
Controlla che `package.json` abbia tutte le dipendenze. Prova a fare `npm install` localmente prima.

### Dati non aggiornati dopo il push
Vercel fa caching. Vai su Vercel Dashboard → Deployments → Redeploy.

---

## 📄 License

MIT License - See LICENSE file for details.

---

Built with ❤️ for enterprise financial analysis
