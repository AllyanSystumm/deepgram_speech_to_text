# // it checks either uploaed file is correct or not 

from rest_framework.exceptions import ValidationError





ALLOWED_AUDIO_TYPES = [
    "audio/webm",
    "audio/wav",
    "audio/ogg",
    "audio/mpeg",
    "audio/mp3",
]


MAX_AUDIO_SIZE_MB = 10


def validate_audio_file(audio_file):
    """
    Validates the uploaded audio file before saving or sending it to Deepgram.
    """

    if not audio_file:
     raise ValidationError("Audio file is required.")
 
   

    if audio_file.content_type not in ALLOWED_AUDIO_TYPES:
     raise ValidationError(
        "Invalid audio file type. Allowed types are: webm, wav, mp3, ogg."
    )

    max_size_bytes = MAX_AUDIO_SIZE_MB * 1024 * 1024

    if audio_file.size > max_size_bytes:
        raise ValidationError(
            f"Audio file is too large. Maximum allowed size is {MAX_AUDIO_SIZE_MB}MB."
        )

    return audio_file