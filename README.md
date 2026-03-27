# market-watch

A Vietnamese market-tracking CLI tool that displays real-time prices for gasoline, gold (SJC), cryptocurrencies (BTC/ETH), and Vietnam ETFs — all from your terminal.

---

## Features

| Category        | Data Source       | Details                              |
| --------------- | ----------------- | ------------------------------------ |
| Gasoline        | PV Oil            | RON 95-III, E10 RON 95-III, E5 RON 92-II |
| Gold            | SJC via vnstock   | Buy / Sell prices                    |
| Cryptocurrency  | Binance           | BTC/USDT, ETH/USDT                   |
| Vietnam ETFs    | vnstock           | E1VFVN30 (VN30), FUEVFVND (VN Diamond) |

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- npm v8 or higher **or** [Yarn](https://yarnpkg.com/) v1.22 or higher
- A [Binance](https://www.binance.com/) account with API key & secret

---

## Installation

### Option 1 — Run from source (development)

```bash
# Clone the repository
git clone https://github.com/your-username/market-watch-vn.git
cd market-watch-vn
```

**npm**
```bash
npm install
npm run dev
```

**yarn**
```bash
yarn install
yarn dev
```

### Option 2 — Install globally via link

This lets you run `market-watch` from anywhere on your machine.

```bash
# Clone and enter the repo
git clone https://github.com/your-username/market-watch-vn.git
cd market-watch-vn
```

**npm**
```bash
npm install
npm run build
npm link
```

**yarn**
```bash
yarn install
yarn build
yarn link
```

After linking, the `market-watch` command becomes available in any terminal session:

```bash
market-watch
```

To unlink later:

**npm**
```bash
npm unlink -g market-watch
```

**yarn**
```bash
yarn unlink market-watch
```

---

## Configuration

This project requires environment variables to connect to external APIs. Two loading strategies are supported:

### Local `.env` file (recommended for development)

Create a `.env` file in the project root:

```env
PVOIL_ENDPOINT=https://...
BINANCE_APIKEY=your_binance_api_key
BINANCE_SECRETKEY=your_binance_secret_key
```

### Global config file (required when using `npm link` / `yarn link`)

When running `market-watch` as a global command, the local `.env` is not in scope. Instead, create a config file in your home directory:

**Windows:** `C:\Users\<YourName>\.market-watch.env`
**macOS / Linux:** `~/.market-watch.env`

```env
PVOIL_ENDPOINT=https://...
BINANCE_APIKEY=your_binance_api_key
BINANCE_SECRETKEY=your_binance_secret_key
```

> The CLI automatically falls back to `~/.market-watch.env` if no local `.env` is found.

### Environment variables

| Variable           | Required | Description                                   |
| ------------------ | -------- | --------------------------------------------- |
| `PVOIL_ENDPOINT`   | Yes      | PV Oil price page URL (HTML scraping endpoint)|
| `BINANCE_APIKEY`   | Yes      | Your Binance API key                          |
| `BINANCE_SECRETKEY`| Yes      | Your Binance API secret                       |

---

## Usage

```bash
market-watch
```

An interactive prompt will appear. Use arrow keys to navigate, `Space` to select categories, and `Enter` to confirm.

**Available categories:**

- `Tất cả` — fetch all data at once
- `Giá xăng hôm nay` — current gasoline prices
- `Giá vàng hôm nay` — SJC gold prices (buy/sell)
- `Bitcoin` — BTC/USDT price from Binance
- `Ethereum` — ETH/USDT price from Binance
- `ETF VN30` — E1VFVN30 reference price
- `ETF VN Diamond` — FUEVFVND reference price

After viewing results, you can choose to check more categories or exit.

---

## Scripts

| Description                        | npm                | yarn           |
| ---------------------------------- | ------------------ | -------------- |
| Run in development mode (no build) | `npm run dev`      | `yarn dev`     |
| Compile TypeScript to `dist/`      | `npm run build`    | `yarn build`   |
| Run the compiled build             | `npm start`        | `yarn start`   |

---

## Project Structure

```
src/
├── index.ts              # CLI entry point & interactive prompt
├── constants/
│   └── env.ts            # Environment variable loading
├── interfaces/
│   └── index.ts          # TypeScript interfaces
├── services/
│   ├── binance.ts        # Binance crypto price fetching
│   ├── pvoil.ts          # PV Oil gasoline price scraping
│   └── vnstock.ts        # Gold & ETF prices via vnstock-js
└── utils/
    └── index.ts          # Number formatting utilities
```

---

## License

[MIT](LICENSE)
