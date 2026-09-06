# My College

This project redesigns the S. B. J. S. Rampuria Jain College website content.

## Structure

- `backend`: Python FastAPI app and college content API.
- `frontend`: React + Vite + TypeScript user interface with `react-router-dom`.

## Run locally

```powershell
cd "J:\my college\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 5000
```


## Frontend development

```powershell
cd "J:\my college\frontend"
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. Keep the FastAPI backend running on `8000` for `/api/college`.


