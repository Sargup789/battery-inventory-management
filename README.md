# Tools Monorepo

This repository contains:
- `toolsbe`: backend API (Express + TypeORM MongoDB)
- `toolsfe`: frontend app (Next.js)

## Prerequisites
- Node.js + npm
- MongoDB running locally on `127.0.0.1:27017`

## Install
```bash
npm install
```

## Run both backend and frontend
```bash
npm run dev
```

- Backend: `http://127.0.0.1:8001`
- Frontend: `http://127.0.0.1:3001`

## Build all
```bash
npm run build
```
