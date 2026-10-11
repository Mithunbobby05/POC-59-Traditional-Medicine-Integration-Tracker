# POC-59 — Traditional & Complementary Medicine Integration Tracker

Real Rails POC-59 dashboard for tracking traditional and complementary medicine integration. The current dashboard is powered by clearly labelled synthetic demonstration data; no external healthcare APIs are connected.

## Requirements

- Node.js and npm
- Python 3.10 or newer

## Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The frontend uses `http://127.0.0.1:8000` as its local API default. To use another API address, create `frontend/.env.local` with:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Start the backend

In a separate terminal from the repository root:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

The health check is available at [http://localhost:8000/health](http://localhost:8000/health). Start the backend before opening the dashboard. The API allows local frontend development origins on port 3000.

For macOS/Linux, activate the virtual environment with `source .venv/bin/activate` instead. All current dashboard values are synthetic and are not sourced from WHO, MOHAP, DHA, or SFDA.
