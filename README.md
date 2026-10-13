# POC-59 — Traditional & Complementary Medicine Integration Tracker

Real Rails POC-59 is a demonstration dashboard for exploring traditional and complementary medicine (TCM) integration across Gulf markets. It is intended for POC reviewers, health-system analysts and planners, regulators, and stakeholders considering how complementary-care services relate to conventional-care pathways. It is not clinical decision support.

> **SYNTHETIC / DEMONSTRATION DATA** — Every displayed figure is illustrative. No live healthcare sources or external healthcare APIs are connected.

## Dashboard features

- Practitioner licensing map and compliance measures by region and modality.
- Monthly usage-volume trends by modality.
- Fictional adverse-event alert examples.
- Regional licensing-compliance ranking with modality-level breakdowns.
- Synthetic stage-to-stage conventional-care referral flow.
- “Why this matters” and “Who controls the rail” context panels.
- Region, modality, time-period, and text-search controls; filtered licensing records can be exported as CSV.
- Source-quality and provenance information, including the synthetic snapshot date and intended future references.

## Technology and architecture

The project is split into two applications. The Next.js App Router page composes the dashboard components and calls the FastAPI service through typed helpers in `frontend/src/lib/api.ts`. FastAPI exposes typed Pydantic responses. Synthetic fixtures live in `backend/app/data.py`; Pandas groups licensing fixtures for the regional ranking endpoint.

| Area | Technologies used |
| --- | --- |
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Recharts, TanStack Table |
| Map | `react-simple-maps` and `world-atlas` |
| Reusable UI | Small local Button and Badge components using Radix Slot and class-variance-authority (shadcn/ui-style components) |
| Backend | Python, FastAPI, Pydantic, Uvicorn, Pandas |

```text
backend/
  app/
    main.py                 FastAPI app, CORS, and /health
    schemas.py              Typed API response models
    data.py                 Deterministic synthetic fixtures and source metadata
    export_mock_data.py     Exports fixtures to mock_data/
    routes/dashboard.py     Dashboard API routes and regional ranking aggregation
  requirements.txt
frontend/
  src/
    app/                    App Router page and global styling
    components/dashboard/   Reusable dashboard sections
    components/ui/          Local Button and Badge components
    lib/                    API helpers, types, and shared utilities
  package.json
mock_data/                  Labelled sample CSV/JSON files and documentation
```

## Prerequisites

- Node.js **20.9 or newer** and npm. The checked-in lockfile records the Next.js engine requirement as `>=20.9.0`.
- Python **3.10 or newer**.
- Internet access during initial setup to download npm and Python packages.

The versions observed in the review environment were Node.js 22.16.0, npm 10.9.2, and Python 3.14.6. These are environment details, not pinned project versions.

## Run locally

Start the backend first, then start the frontend in a second terminal. Commands below are for PowerShell from the repository root.

### Terminal 1 — FastAPI backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The health endpoint is available at [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health).

### Terminal 2 — Next.js frontend

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend API helper defaults to `http://127.0.0.1:8000`. To override it, create `frontend/.env.local` containing:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

The backend CORS configuration permits the local frontend origins `http://localhost:3000` and `http://127.0.0.1:3000`.

For macOS or Linux, create the virtual environment with `python3 -m venv .venv`, activate it with `source .venv/bin/activate`, then use `python -m pip install -r requirements.txt` and `python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`.

## API endpoints

All dashboard endpoints are GET requests. The seven `/api` responses identify their current values as `SYNTHETIC / DEMONSTRATION DATA`.

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Reports whether the backend process is available. |
| `GET /api/dashboard/summary` | Dataset-level counts and summary source metadata. |
| `GET /api/licensing/map` | Geographic regions and licensing/compliance records by modality. |
| `GET /api/usage/trends` | Monthly usage-volume observations. |
| `GET /api/adverse-events` | Fictional adverse-event alert examples. |
| `GET /api/licensing/rankings` | Regions ranked by aggregate compliance across modalities, including counts and formula metadata. |
| `GET /api/referrals/flow` | Synthetic source-to-target pathway edges and volumes. |
| `GET /api/sources` | Provenance and intended future reference-source metadata. |

## Mock-data files

All files under `mock_data/` are labelled **SYNTHETIC DATA — NOT REAL** and are exported from the backend fixtures.

- `licensing_practitioners.csv` and `licensing_practitioners.json` — one region/modality licensing record per row, with map coordinates and compliance fields.
- `usage_volume.csv` — monthly usage-volume observations by region and modality.
- `adverse_events.csv` — fictional alert examples and statuses.
- `referral_flow.csv` — synthetic transition edges with source, target, and volume.
- `data_dictionary.md` — fields and meanings for the sample records.
- `README.md` — generation instructions and data limitations.

To regenerate these files from the repository root in PowerShell:

```powershell
cd backend
.\.venv\Scripts\python.exe -m app.export_mock_data
```

This command overwrites the corresponding files in `mock_data/`.

## Data limitations and future references

The licensing counts, compliance rates, usage volumes, adverse-event examples, and referral volumes are synthetic demonstrations. They are not registry extracts, observed patient or referral counts, or real clinical reports. Compliance is calculated as compliant licenses divided by total licenses, multiplied by 100, and rounded to one decimal place. Regional ranking aggregates those counts across modalities. Coverage and source freshness are not applicable to the synthetic dataset; its snapshot date is a generation date, not a source retrieval or update time.

The synthetic geographic examples are the United Arab Emirates, Saudi Arabia, and Qatar. Qatar is included as a synthetic Gulf-market example and has no connected source in this POC. No real-world coverage claim is made.

These are intended future references only; they do not provide the current dashboard values and are not queried by the application:

- [WHO Traditional Medicine Strategy](https://www.who.int/publications/i/item/9789240113176)
- [UAE MOHAP complementary-medicine / healthcare-professional evaluation information](https://mohap.gov.ae/documents/20117/0/Healthcare%2Bprofessional%2Bevaluation%2B%281%29.pdf/b4428178-29df-264d-6d02-71cb5e836884?t=1738817875021)
- [Dubai Health Authority TCAM practice guidance](https://dha.gov.ae/uploads/112021/8ffadaa8-95d2-42e8-8c9a-f75fcc532873.pdf)
- [Saudi SFDA herbal-product information](https://www.sfda.gov.sa/en/herbal-drugs)

The current POC does not specify a Saudi practitioner-licensing source or a specific source for adverse-event or referral-flow values. No such source connection is implied.

## Verification status and known limitations

At the latest recorded frontend scope check, the TypeScript no-emit check passed. `npm run lint` stalled without returning a result. Browser interactions and the production build have not been verified against the latest frontend changes. No automated frontend test script or backend test suite is present in the repository.

The dashboard depends on the local FastAPI backend for data. If it is not running at the configured API address, the frontend displays an API connection error. The mock-data export command overwrites its output files. No authentication, database, deployment setup, or external data integration is included in this POC.

## Known npm audit finding

A reported npm audit identified five high-severity findings in a development-only ESLint/Next.js dependency chain. The findings trace through that chain to the reported `braces` advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). The current investigation did not identify a compatible patched dependency solution for this project's Next.js version. No dependency changes were applied. The audit's suggested major-version downgrade was not applied because compatibility with the project's Next.js version was not established. This dependency finding remains unresolved and requires follow-up; this note does not claim that the vulnerability is fixed or establish that it cannot affect production.
