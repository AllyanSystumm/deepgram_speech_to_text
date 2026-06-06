import requests
from django.conf import settings


class DeepgramService:
    """
    Handles communication with the Deepgram Speech-to-Text API.
    This keeps transcription business logic separate from API views.
    """

    DEEPGRAM_URL = "https://api.deepgram.com/v1/listen"

    @staticmethod
    def transcribe_audio(audio_file):
        """
        Sends an uploaded audio file to Deepgram and returns the transcript text.
        """

        headers = {
            "Authorization": f"Token {settings.DEEPGRAM_API_KEY}",
            "Content-Type": audio_file.content_type,
        }

        params = {
            "model": "nova-2",
            "language": "en",
            "smart_format": "true",
        }

        audio_file.seek(0)
        audio_data = audio_file.read()

        response = requests.post(
            DeepgramService.DEEPGRAM_URL,
            headers=headers,
            params=params,
            data=audio_data,
            timeout=60,
        )

        if response.status_code != 200:
            raise Exception(f"Deepgram API error: {response.text}")

        response_data = response.json()

        try:
            transcript = response_data["results"]["channels"][0]["alternatives"][0]["transcript"]
        except (KeyError, IndexError):
            raise Exception("Transcript not found in Deepgram response.")

        return transcript