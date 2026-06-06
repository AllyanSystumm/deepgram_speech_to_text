from django.urls import path

from .views import TranscriptionCreateAPIView


urlpatterns = [
    path(
        "transcriptions/",
        TranscriptionCreateAPIView.as_view(),
        name="create-transcription",
    ),
]