# Granite Calc — Kalkulátor nabídek žulového kameniva

## Struktura projektu

```
granite-calc/
├── shared/
│   ├── types/index.ts          ← TypeScript typy (sdílené)
│   └── utils/
│       ├── products.ts         ← Katalog produktů, koeficienty
│       ├── calc.ts             ← Kalkulační engine (pure funkce)
│       └── emailExport.ts      ← Generátor emailu nabídky
├── client/                     ← React + Vite + Tailwind frontend
│   └── src/
│       ├── api/index.ts        ← API vrstva (vše přes tuto vrstvu)
│       ├── store/index.ts      ← Zustand global state
│       ├── pages/              ← Stránky aplikace
│       └── components/         ← UI komponenty
└── server/                     ← Node.js + Express + Prisma backend
    ├── prisma/schema.prisma    ← DB schéma
    └── src/
        ├── routes/             ← API endpointy
        └── middleware/auth.ts  ← JWT autentizace
```

## Instalace a spuštění

### 1. Požadavky
- Node.js 18+
- PostgreSQL databáze (nebo Railway/Render)

### 2. Instalace závislostí
```bash
npm run install:all
```

### 3. Konfigurace backendu
Vytvořte `server/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/granite_calc"
JWT_SECRET="your-secret-key-here"
PORT=3001
CLIENT_URL="http://localhost:5173"
```

### 4. Databáze
```bash
cd server
npx prisma db push
npx tsx src/prisma/seed.ts   # Vytvoří prvního uživatele
```

### 5. Spuštění
```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Aplikace poběží na http://localhost:5173

## Hosting (Railway / Render)

### Backend (Railway)
1. Nový projekt → Deploy from GitHub → `/server`
2. Přidat PostgreSQL plugin
3. Nastavit env proměnné (DATABASE_URL se doplní automaticky)
4. Build command: `npm run build`
5. Start command: `npm start`

### Frontend (Netlify / Vercel)
1. Deploy složky `/client`
2. Build command: `npm run build`
3. Publish dir: `dist`
4. Env: `VITE_API_URL=https://your-backend.railway.app`

## Kalkulační logika

### Kategorie a výpočty t/j:
- **Sypané** (SYP): fixní koeficient (4/6→0.125, 8/11→0.200, 15/17→0.400 t/m²)
- **Řezané obrubníky** (REZ_OB): š × v × d × 2.65
- **Obloukové**: stejně + koef. R (≤0.7→×3.0 / ≤0.9→×2.5 / ≤2→×2.2 / ≤3→×2.1 / ≤5→×2.0 / >5→×1.8)
- **Lámané** (LAM_OB): š × v × 2.65 (bez délky!), cena PLN/t → přepočet přes ks/t
- **Dlažba** (DLAZBA): tloušťka × 2.65
- **Schody** (SCHODY): š × v × d × 2.65

### Cenové hladiny:
- Sypané: 0–125t / 126–250t / 250+t
- Řezané obrubníky: 0–500bm / 501–1500bm / 1500+bm
- Dlažba: 0–300m² / 301–1000m² / 1000+m²
- Lámané + Schody: jedna hladina
