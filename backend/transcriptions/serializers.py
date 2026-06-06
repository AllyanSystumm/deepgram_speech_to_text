from rest_framework import serializers

from .models import Transcription


class TranscriptionSerializer(serializers.ModelSerializer):
    """
    Converts Transcription model data into JSON format.
    This makes it easy for the frontend to read transcription records.
    """

    class Meta:
        model = Transcription
        fields = [
            "id",
            "audio_file",
            "transcript_text",
            "status",
            "error_message",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "transcript_text",
            "status",
            "error_message",
            "created_at",
            "updated_at",
        ]

