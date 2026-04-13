# assemblers/plan_detail_assembler.py
from .plan_detail_keys import *

class PlanDetailAssembler:

    @staticmethod
    def assemble(
        max_minutes_per_month: int,
        max_file_size_mb: int,
        max_files_per_month: int,
        allowed_formats: list[str],
        transcription_languages: list[str],
        export_txt: bool,
        export_pdf: bool,
        export_srt: bool,
        speaker_detection: bool,
        priority_queue: bool,
        api_access: bool,
    ) -> dict:
        return {
            MAX_MINUTES_PER_MONTH: max_minutes_per_month,
            MAX_FILE_SIZE_MB: max_file_size_mb,
            MAX_FILES_PER_MONTH: max_files_per_month,
            ALLOWED_FORMATS: allowed_formats,
            TRANSCRIPTION_LANGUAGES: transcription_languages,
            FEATURES: {
                EXPORT_TXT: export_txt,
                EXPORT_PDF: export_pdf,
                EXPORT_SRT: export_srt,
                SPEAKER_DETECTION: speaker_detection,
                PRIORITY_QUEUE: priority_queue,
                API_ACCESS: api_access,
            }
        }

    @staticmethod
    def disassemble(plan_details: dict) -> dict:
        features = plan_details.get(FEATURES, {})
        return {
            MAX_MINUTES_PER_MONTH: plan_details.get(MAX_MINUTES_PER_MONTH),
            MAX_FILE_SIZE_MB: plan_details.get(MAX_FILE_SIZE_MB),
            MAX_FILES_PER_MONTH: plan_details.get(MAX_FILES_PER_MONTH),
            ALLOWED_FORMATS: plan_details.get(ALLOWED_FORMATS),
            TRANSCRIPTION_LANGUAGES: plan_details.get(TRANSCRIPTION_LANGUAGES),
            FEATURES: {
                EXPORT_TXT: features.get(EXPORT_TXT),
                EXPORT_PDF: features.get(EXPORT_PDF),
                EXPORT_SRT: features.get(EXPORT_SRT),
                SPEAKER_DETECTION: features.get(SPEAKER_DETECTION),
                PRIORITY_QUEUE: features.get(PRIORITY_QUEUE),
                API_ACCESS: features.get(API_ACCESS),
            }
        }