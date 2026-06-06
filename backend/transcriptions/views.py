from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Transcription
from .serializers import TranscriptionSerializer
from .services.deepgram_service import DeepgramService
from .validators import validate_audio_file


class TranscriptionCreateAPIView(APIView):
    """
    API endpoint for uploading an audio file and getting its transcription.
    """

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        """
        Handles POST request from frontend.

        Expected form-data:
        audio_file: uploaded audio file
        """

        transcription = None

        try:
            audio_file = request.FILES.get("audio_file")

            # Step 1: Check if the uploaded file is valid.
            validate_audio_file(audio_file)

            # Step 2: Save the uploaded audio file with pending status.
            transcription = Transcription.objects.create(
                audio_file=audio_file,
                status="pending"
            )

            # Step 3: Send audio file to Deepgram and get transcript text.
            transcript_text = DeepgramService.transcribe_audio(audio_file)

            # Step 4: Update database record after successful transcription.
            transcription.transcript_text = transcript_text
            transcription.status = "completed"
            transcription.save()

            # Step 5: Convert Django model object into JSON response.
            serializer = TranscriptionSerializer(transcription)

            return Response(
                {
                    "message": "Transcription completed successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK
            )

        except ValidationError as error:
            return Response(
                {
                    "message": "Invalid audio upload.",
                    "errors": error.detail,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as error:
            # If transcription record was already created, mark it as failed.
            if transcription:
                transcription.status = "failed"
                transcription.error_message = str(error)
                transcription.save()

                serializer = TranscriptionSerializer(transcription)

                return Response(
                    {
                        "message": "Transcription failed.",
                        "data": serializer.data,
                    },
                    status=status.HTTP_502_BAD_GATEWAY
                )

            return Response(
                {
                    "message": "Server error occurred before transcription started.",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )