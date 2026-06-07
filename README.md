
# VoxScribe — Quickstart

Record audio in-browser, upload to Django, transcribe with Deepgram, and store results in PostgreSQL.

Backend (minimal):
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set SECRET_KEY, DB_*, DEEPGRAM_API_KEY
python manage.py migrate
python manage.py runserver
```

Frontend (minimal):
```bash
cd frontend
nvm use --lts
npm install
npm run dev
```

<<<<<<< HEAD
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
=======
>>>>>>> c141ce0 (chore: tests, refactor useAudioRecorder, README)
