from django.contrib import admin

from .models import Transcription


@admin.register(Transcription)
class TranscriptionAdmin(admin.ModelAdmin):
    """
    Shows transcription records clearly inside Django admin.
    """

    list_display = (
        "id",
        "status",
        "short_transcript",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "transcript_text",
        "status",
    )

    list_filter = (
        "status",
        "created_at",
    )

    readonly_fields = (
        "audio_file",
        "transcript_text",
        "status",
        "error_message",
        "created_at",
        "updated_at",
    )

    def short_transcript(self, obj):
        """
        Shows a short preview of the transcript in the admin list page.
        """
        if not obj.transcript_text:
            return "No transcript"

        return obj.transcript_text[:80] + "..."

    short_transcript.short_description = "Transcript Preview"