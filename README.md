
# VoxScribe

Quick speech-to-text demo: record in the browser, upload to a Django backend,
transcribe with Deepgram, and store results for viewing.

Purpose: a compact local dev project to test browser audio capture
and an API-backed transcription flow.

Key features:
- Browser recording and upload
- Django REST API to accept audio and return transcripts
- Transcription via Deepgram
- Stores transcripts in a local database for inspection

Stack:
- Frontend: Next.js, React, TypeScript
- Backend: Django, Django REST Framework, Python
- Database: SQLite for development (Postgres for production)
- Transcription: Deepgram API

Prerequisites:
- Node.js and npm (or nvm)
- Python 3.10+ and virtualenv/venv
- A Deepgram API key for backend transcription

Quick start — Backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# set SECRET_KEY and DEEPGRAM_API_KEY in .env
python manage.py migrate
python manage.py runserver
```

Quick start — Frontend:
```bash
cd frontend
nvm use --lts   # optional
npm install
npm run dev
```
<img width="1851" height="1003" alt="Screenshot from 2026-06-07 15-36-22" src="https://github.com/user-attachments/assets/a89bae9e-6655-4273-b25c-a7b0cec77fad" />


