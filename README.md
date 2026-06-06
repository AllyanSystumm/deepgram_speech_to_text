# VoxScribe - Speech-to-Text Transcription Web App

VoxScribe is a full-stack speech-to-text transcription web application. The user records audio from the browser microphone, sends the recorded audio to a Django backend, and the backend sends that audio to Deepgram for transcription. The final transcript is returned to the frontend and stored in PostgreSQL.

---

## Project Overview

The application allows a user to:

* Record audio from the browser microphone
* Stop and reset the recording
* Send the recorded audio to the backend
* Transcribe the audio using Deepgram
* Display the transcript on the frontend
* Store transcription records in PostgreSQL
* View saved transcription records in Django Admin

---

## Tech Stack

### Frontend

* React.js
* Next.js
* TypeScript
* CSS Modules
* Custom React hooks
* Fetch API
* FormData API

### Backend

* Python
* Django
* Django REST Framework
* PostgreSQL
* Deepgram Speech-to-Text API
* python-decouple
* django-cors-headers
* requests

### Database

* PostgreSQL
* pgAdmin

---

## Project Folder Structure

```text
voxscribe/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── page.module.css
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppShell.tsx
│   │   │   │   └── AppShell.module.css
│   │   │   │
│   │   │   ├── recorder/
│   │   │   │   ├── RecorderCard.tsx
│   │   │   │   └── RecorderCard.module.css
│   │   │   │
│   │   │   ├── transcript/
│   │   │   │   ├── TranscriptPanel.tsx
│   │   │   │   ├── TranscriptPanel.module.css
│   │   │   │   ├── TranscriptionDashboard.tsx
│   │   │   │   └── TranscriptionDashboard.module.css
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Button.module.css
│   │   │       ├── Card.tsx
│   │   │       ├── Card.module.css
│   │   │       ├── Notification.tsx
│   │   │       └── Notification.module.css
│   │   │
│   │   ├── hooks/
│   │   │   └── useAudioRecorder.ts
│   │   │
│   │   ├── services/
│   │   │   └── transcriptionApi.ts
│   │   │
│   │   ├── types/
│   │   │   └── transcription.ts
│   │   │
│   │   ├── constants/
│   │   │   └── api.ts
│   │   │
│   │   └── utils/
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── transcriptions/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── validators.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── services/
│   │       └── deepgram_service.py
│   │
│   ├── media/
│   │   └── audio/
│   │
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   └── .gitignore
│
└── database/
```

---

## Software Architecture

The project follows a clean layered structure.

### Frontend Architecture

```text
page.tsx
→ route-level page only

TranscriptionDashboard.tsx
→ manages feature state and connects UI to logic

useAudioRecorder.ts
→ handles microphone recording logic

transcriptionApi.ts
→ handles API request to Django backend

RecorderCard.tsx
→ displays recording UI

TranscriptPanel.tsx
→ displays transcript output

Notification.tsx
→ displays success/error messages
```

### Backend Architecture

```text
views.py
→ API request and response handling

validators.py
→ audio file validation

deepgram_service.py
→ Deepgram API communication

models.py
→ database table structure

serializers.py
→ converts model data to JSON

urls.py
→ API route definitions
```

---

## Backend Setup

### 1. Go to backend folder

```bash
cd ~/Documents/transcription_project/voxscribe/backend
```

### 2. Activate virtual environment

```bash
source .venv/bin/activate
```

### 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 4. Create `.env` file

Create this file:

```text
backend/.env
```

Example:

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True

DB_NAME=voxscribe_db
DB_USER=postgres
DB_PASSWORD=your_postgresql_password_here
DB_HOST=localhost
DB_PORT=5432

DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

Important:

```text
Do not upload .env to GitHub.
It contains private credentials and API keys.
```

---

## PostgreSQL Setup

### Database Name

```text
voxscribe_db
```

### Database Tables

After migrations, PostgreSQL should contain Django default tables and one custom transcription table.

Important custom table:

```text
transcriptions_transcription
```

Main columns:

```text
id
audio_file
transcript_text
status
error_message
created_at
updated_at
```

### Run migrations

```bash
python manage.py migrate
```

### Create admin user

```bash
python manage.py createsuperuser
```

---

## Run Backend Server

```bash
cd ~/Documents/transcription_project/voxscribe/backend
source .venv/bin/activate
python manage.py runserver
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Django Admin:

```text
http://127.0.0.1:8000/admin/
```

API endpoint:

```text
http://127.0.0.1:8000/api/transcriptions/
```

---

## Frontend Setup

### 1. Go to frontend folder

```bash
cd ~/Documents/transcription_project/voxscribe/frontend
```

### 2. Use correct Node version

```bash
nvm use --lts
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Run frontend server

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

Use `localhost`, not LAN IP, for microphone testing.

---

## Full Project Run Commands

Use two terminals.

### Terminal 1 - Backend

```bash
cd ~/Documents/transcription_project/voxscribe/backend
source .venv/bin/activate
python manage.py runserver
```

### Terminal 2 - Frontend

```bash
cd ~/Documents/transcription_project/voxscribe/frontend
nvm use --lts
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Main User Flow

```text
1. User opens frontend at http://localhost:3000
2. User clicks microphone button
3. Browser asks for microphone permission
4. User allows microphone access
5. User records audio
6. User clicks Stop
7. User clicks Transcribe Audio
8. Frontend sends audio Blob to Django backend using FormData
9. Django validates the uploaded audio file
10. Django saves a pending transcription record
11. Django sends audio to Deepgram
12. Deepgram returns transcript text
13. Django updates record status to completed
14. Frontend displays transcript
15. Success notification appears
```

---

## Backend API

### Endpoint

```text
POST /api/transcriptions/
```

### Request Type

```text
multipart/form-data
```

### Required Field

```text
audio_file
```

### Example cURL Test

```bash
curl -X POST \
  -F "audio_file=@test_audio/sample-speech-1m.mp3;type=audio/mpeg" \
  http://127.0.0.1:8000/api/transcriptions/
```

### Successful Response Example

```json
{
  "message": "Transcription completed successfully.",
  "data": {
    "id": 1,
    "audio_file": "/media/audio/sample-speech-1m.mp3",
    "transcript_text": "Your transcript text appears here.",
    "status": "completed",
    "error_message": "",
    "created_at": "2026-06-06T18:02:41.029619Z",
    "updated_at": "2026-06-06T18:03:07.253898Z"
  }
}
```

---

## Database Verification Queries

Run these queries in pgAdmin Query Tool.

### Show all tables

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Show all transcription records

```sql
SELECT 
    id,
    audio_file,
    status,
    transcript_text,
    error_message,
    created_at,
    updated_at
FROM transcriptions_transcription
ORDER BY created_at DESC;
```

### Show only completed transcriptions

```sql
SELECT 
    id,
    status,
    transcript_text,
    created_at
FROM transcriptions_transcription
WHERE status = 'completed'
ORDER BY created_at DESC;
```

### Count records by status

```sql
SELECT 
    status,
    COUNT(*) AS total_records
FROM transcriptions_transcription
GROUP BY status;
```

---

## Important Implementation Details

### 1. Full transcript storage

The full transcript is stored in PostgreSQL inside:

```text
transcriptions_transcription.transcript_text
```

Django Admin list only shows a short preview using:

```python
return obj.transcript_text[:80] + "..."
```

This does not cut the stored transcript. It only controls the admin preview.

### 2. Audio file storage

The database stores the file path.

Example:

```text
audio/recording.webm
```

The actual file is stored inside:

```text
backend/media/audio/
```

### 3. Deepgram API key security

The Deepgram API key is stored in:

```text
backend/.env
```

It is not exposed to the frontend.

### 4. Frontend upload format

The frontend sends audio using:

```ts
FormData
```

The field name must be:

```text
audio_file
```

because the Django backend reads:

```python
request.FILES.get("audio_file")
```

---

## Validation Rules

The backend validates uploaded audio files before sending them to Deepgram.

Allowed audio MIME types:

```text
audio/webm
audio/wav
audio/ogg
audio/mpeg
audio/mp3
```

Maximum file size:

```text
10MB
```
<img width="1849" height="1004" alt="image" src="https://github.com/user-attachments/assets/4096687d-6c3e-42d9-bdb1-e5bd802d4e1f" />
