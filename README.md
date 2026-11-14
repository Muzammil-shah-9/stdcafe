# Student Cafe

Student Cafe is a full-stack cafe menu and ordering project. The repository contains the Express/MongoDB API and the React/Vite frontend.

## Project layout

- `Student-Cafe/` — Express API, authentication routes, and MongoDB models
- `Student-Cafe-frontend/vite-project/` — React frontend

## Run locally

Install dependencies in each project folder:

```powershell
cd Student-Cafe
npm install
Copy-Item .env.example .env
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `Student-Cafe/.env` before starting the API. The API uses port `8000` by default in this project's local configuration.

In a second terminal, start the frontend:

```powershell
cd Student-Cafe-frontend/vite-project
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Notes

- Local `.env` files, `node_modules`, and generated `dist` folders are excluded from Git.
- The API currently connects to MongoDB using `MONGO_URI` and signs authentication tokens using `JWT_SECRET`.
