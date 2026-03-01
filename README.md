# Shaked Background Removal

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/Node-18%2B-brightgreen.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)

A full-stack web application for instant image background removal. Upload any image, and get a clean, transparent result in seconds - powered by the [Remove.bg](https://www.remove.bg/) API with a sleek React frontend and a secure FastAPI backend.

---

## Features

- **Drag-and-drop upload** - Drop an image or click to browse (PNG, JPG, WebP up to 10 MB)
- **Interactive comparison slider** - Slide between original and processed images with mouse and touch support
- **Processing history** - Browse, switch between, and delete previous results in a thumbnail strip
- **One-click download** - Save the background-removed image instantly
- **Light and dark themes** - Toggle between themes with preference saved across sessions
- **Responsive design** - Works seamlessly on desktop and mobile
- **Zero UI libraries** - Custom-built components with smooth animations and transitions
- **Secure by design** - API key stays on the server, never exposed to the browser

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite 6 |
| Backend | Python, FastAPI, httpx |
| External API | [Remove.bg](https://www.remove.bg/api) |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [Python](https://www.python.org/) 3.10 or later
- A [Remove.bg API key](https://www.remove.bg/api#remove-background) (free tier available)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ddex3/Shaked-Background-Removal.git
cd Shaked-Background-Removal
```

### 2. Set up the backend

```bash
cd server
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy the example environment file and add your API key:

```bash
cp .env.example .env
```

Open `server/.env` and replace the placeholder with your key:

```
REMOVE_BG_API_KEY=your_actual_api_key
```

Start the backend server:

```bash
uvicorn main:app --reload --port 8000
```

### 3. Set up the frontend

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The app opens at [http://localhost:5173](http://localhost:5173). The Vite dev server automatically proxies `/api` requests to the FastAPI backend.

## Usage

1. Open the app in your browser.
2. Drag and drop an image onto the upload area (or click to browse).
3. Wait for the background removal to finish.
4. Use the comparison slider to see the before and after.
5. Click **Download** to save the processed image.
6. Previous results appear in the thumbnail strip for quick access.

## Project Structure

```
Shaked-Background-Removal/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable UI components
│   │   └── styles/          # Global styles and themes
│   ├── vite.config.ts       # Vite config with API proxy
│   └── package.json
├── server/                  # FastAPI backend
│   ├── main.py              # API endpoint and file validation
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variable template
├── LICENSE
└── README.md
```

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `REMOVE_BG_API_KEY` | `server/.env` | Your Remove.bg API key |

## Getting Help

- **Bug reports and feature requests** - [Open an issue](https://github.com/ddex3/Shaked-Background-Removal/issues)
- **Remove.bg API docs** - [remove.bg/api](https://www.remove.bg/api)

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

Built with ❤️ by **[@ddex3](https://github.com/ddex3)**