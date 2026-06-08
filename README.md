# PDFNest

PDFNest is a lightweight full-stack PDF utility web application inspired by tools like iLovePDF. It is built as a clean resume project with a React + TypeScript frontend and a FastAPI backend.

## Features Planned for v1

- Merge multiple PDFs
- Split PDF by page range
- Remove selected pages
- Reorder pages
- Convert images to PDF
- Encrypt PDF with password
- Decrypt PDF with password
- Compress PDF
- Rotate selected pages
- Drag-and-drop uploads
- PDF page preview and thumbnails
- Processing progress and result download flow
- Dark and light theme toggle
- Temporary local file storage with cleanup

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Upload UI | react-dropzone |
| PDF preview | react-pdf / PDF.js |
| Backend | FastAPI, Uvicorn |
| PDF processing | pypdf, PyMuPDF, Pillow |
| Database | None for v1 |
| Frontend deployment | Vercel |
| Backend deployment | Render free web service |
| Storage | Temporary local filesystem storage |

## Project Structure

```text
PDFNest/
  backend/
    app/
      api/
        routes/
      core/
      schemas/
      services/
      utils/
      main.py
    storage/
      outputs/
      uploads/
    requirements.txt
    render.yaml

  frontend/
    public/
    src/
      components/
      hooks/
      pages/
      services/
      tools/
      types/
      utils/
    package.json
    vite.config.ts
    tailwind.config.js
    vercel.json
```

## API Design

### Available now

```http
GET /api/health
GET /api/tools
```

### Planned processing endpoints

```http
POST /api/tools/merge
POST /api/tools/split
POST /api/tools/remove-pages
POST /api/tools/reorder-pages
POST /api/tools/images-to-pdf
POST /api/tools/encrypt
POST /api/tools/decrypt
POST /api/tools/compress
POST /api/tools/rotate
GET /api/download/{file_id}
DELETE /api/files/{file_id}
```

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

On Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

API docs:

```text
http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Create `frontend/.env` when needed (use `frontend/.env.example` as a template):

```env
VITE_API_BASE=http://localhost:8000
```

Create `backend/.env` when needed (use `backend/.env.example` as a template):

```env
FRONTEND_ORIGIN=http://localhost:5173
MAX_UPLOAD_MB=50
FILE_EXPIRY_MINUTES=60
```

## Architecture Notes

The frontend talks to the backend through a clean REST API. Files are uploaded to the FastAPI service, processed temporarily, and returned through a download endpoint. v1 intentionally avoids login, signup, database storage, and heavyweight document conversion so the project stays free-tier friendly and beginner-friendly.

Temporary files are stored under `backend/storage`. A root `render.yaml` is included for Render blueprint deployment. Runtime files are ignored by Git, while `.gitkeep` files preserve the folder structure.

## Deployment Notes

### Frontend on Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE=https://your-render-service.onrender.com`

Quick Vercel steps:

- Sign in to Vercel and create a new project from this GitHub repo.
- Set the project root to `frontend`.
- Add environment variable `VITE_API_BASE` pointing to your backend (see Render URL).
- Deploy — Vercel will run `npm run build` and publish the `dist` output.

### Backend on Render

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variable: `FRONTEND_ORIGIN=https://your-vercel-app.vercel.app`

Note: `render.yaml` is included at the repo root as a Render service blueprint. You can import it in Render or create a new Python web service with the same build and start commands.

Quick Render steps:

- In Render, create a new Web Service and connect the repository.
- Choose the `backend` folder as the root (or import `render.yaml` to auto-configure).
- Set the Build Command to: `pip install -r requirements.txt`.
- Set the Start Command to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Add the environment variables `FRONTEND_ORIGIN` and any `MAX_UPLOAD_MB` / `FILE_EXPIRY_MINUTES`.

When Render builds, it will expose a public URL like `https://your-service.onrender.com` — use that as `VITE_API_BASE` in Vercel.

## Screenshots

Screenshots will be added after the first UI checkpoint is running locally.

## Roadmap

- Phase 1: Project scaffold, health API, frontend shell
- Phase 2: Upload flow and API connection
- Phase 3: Merge and split tools
- Phase 4: PDF thumbnails and page selection
- Phase 5: Remaining PDF utilities
- Phase 6: Cleanup service and deployment polish

## Pushing a checkpoint

When you want to push a stable checkpoint (e.g., after finishing core features and integration), use:

```bash
git add .
git commit -m "chore: integrate frontend + backend; add processing endpoints, PDF helpers, previews, and reorder UI"
git push origin main
```

Or for smaller commits, use the suggested messages shown in the project progress notes.

Quick verification after deploy

1. Start the backend locally or confirm Render URL: `curl https://your-service.onrender.com/api/health`
2. Build + deploy frontend on Vercel and confirm the UI loads and `VITE_API_BASE` points to the backend.
3. Upload a test PDF from the UI and verify a download link appears.

If you want, I can create a `DEPLOY.md` with step-by-step screenshots and the exact Render import flow.

**Live Demo & Post‑deploy Checklist**

- **Frontend (Vercel):** https://pdf-nest-eight.vercel.app
- **Backend (Render):** https://pdfnest-backend.onrender.com

Quick verification (replace URLs above if yours differ):

1. Health check (backend):

```bash
curl -i https://pdfnest-backend.onrender.com/api/health
```

2. Quick merge test (use a small `sample.pdf`):

```bash
curl -F "files=@sample.pdf" https://pdfnest-backend.onrender.com/api/process/merge
```

3. Open the frontend and try upload → process → download at:

```
https://pdf-nest-eight.vercel.app
```

Deployment notes:

- After deploying the frontend on Vercel, set the `FRONTEND_ORIGIN` env var on Render to your Vercel origin (including `https://`) and restart the backend so CORS is correct.
- Ensure `VITE_API_BASE` on Vercel points to the Render backend URL (no trailing slash).
- Remove any temporary test files used during verification (e.g., `sample.pdf`).

If you want, I can add a small GitHub Action that runs the health check after deploy and reports status.

