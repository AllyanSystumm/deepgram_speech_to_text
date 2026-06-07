"""Unit tests for the `transcriptions` app.

This module contains three groups of tests:
- `ValidatorsTests`: checks input validation for uploaded audio files.
- `ModelAndSerializerTests`: smoke tests for the `Transcription` model
  and its `TranscriptionSerializer`.
- `TranscriptionAPITests`: integration-style tests for the
  `TranscriptionCreateAPIView`. External Deepgram calls are mocked so
  tests run quickly and deterministically.
"""

from io import BytesIO

from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.exceptions import ValidationError as DRFValidationError
from unittest.mock import patch

from .validators import validate_audio_file
from .models import Transcription
from .serializers import TranscriptionSerializer


class ValidatorsTests(TestCase):
	"""Tests for audio file validation logic in `validators.py`.

	- `test_validate_audio_file_missing`: ensures a missing file
	  raises a `ValidationError`.
	- `test_validate_audio_file_invalid_type`: ensures non-audio
	  content types are rejected.
	"""

	def test_validate_audio_file_missing(self):
		"""Missing file should raise `ValidationError`."""
		with self.assertRaises(DRFValidationError):
			validate_audio_file(None)

	def test_validate_audio_file_invalid_type(self):
		"""Non-audio content types should be rejected."""
		bad_file = SimpleUploadedFile("bad.txt", b"hello", content_type="text/plain")
		with self.assertRaises(DRFValidationError):
			validate_audio_file(bad_file)


class ModelAndSerializerTests(TestCase):
	"""Smoke tests for the `Transcription` model and its serializer.

	Ensures creation works, `__str__` contains expected text, and the
	serializer exposes the expected fields.
	"""

	def test_transcription_model_and_serializer(self):
		"""Create a `Transcription` and validate serializer output."""
		audio = SimpleUploadedFile(
			"test.wav",
			b"RIFF....WAVEfmt",
			content_type="audio/wav",
		)

		t = Transcription.objects.create(audio_file=audio, status="pending")

		# Model string representation
		self.assertIn("Transcription", str(t))

		# Serializer returns expected fields
		s = TranscriptionSerializer(t)
		self.assertIn("id", s.data)
		self.assertEqual(s.data["status"], "pending")


class TranscriptionAPITests(TestCase):
	"""Tests for the create-transcription API endpoint.

	The Deepgram call is mocked so we can assert view behavior when
	transcription succeeds or when the external service fails.
	"""

	def setUp(self):
		"""Prepare the API client and endpoint URL."""
		self.client = APIClient()
		self.url = reverse("create-transcription")

	@patch("transcriptions.views.DeepgramService.transcribe_audio")
	def test_create_transcription_success(self, mock_transcribe):
		"""Successful Deepgram response should create a completed record."""
		mock_transcribe.return_value = "Hello world transcript"

		audio = SimpleUploadedFile(
			"audio.wav",
			b"\x00\x01\x02",
			content_type="audio/wav",
		)

		response = self.client.post(self.url, {"audio_file": audio}, format="multipart")

		self.assertEqual(response.status_code, 200)
		self.assertIn("data", response.data)
		self.assertEqual(response.data["data"]["status"], "completed")

		# Verify DB record exists and contains transcript
		t = Transcription.objects.first()
		self.assertIsNotNone(t)
		self.assertEqual(t.transcript_text, "Hello world transcript")

	@patch("transcriptions.views.DeepgramService.transcribe_audio")
	def test_create_transcription_deepgram_failure(self, mock_transcribe):
		"""If Deepgram raises, the view should mark the record as failed."""
		mock_transcribe.side_effect = Exception("Deepgram down")

		audio = SimpleUploadedFile(
			"audio.wav",
			b"\x00\x01\x02",
			content_type="audio/wav",
		)

		response = self.client.post(self.url, {"audio_file": audio}, format="multipart")

		# The view should return 502 and create a failed Transcription record
		self.assertEqual(response.status_code, 502)
		t = Transcription.objects.first()
		self.assertIsNotNone(t)
		self.assertEqual(t.status, "failed")
