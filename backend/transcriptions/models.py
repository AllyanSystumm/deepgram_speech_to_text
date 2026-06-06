from django.db import models

# Create your models here.



class Transcription(models.Model):
    """
    Stores one speech-to-text transcription record.
    Each record represents one audio file uploaded by the user.
    """

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    audio_file = models.FileField(upload_to="audio/")
    transcript_text = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )
    error_message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transcription {self.id} - {self.status}"