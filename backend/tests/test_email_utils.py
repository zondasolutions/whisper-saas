import pytest
from unittest.mock import patch, MagicMock
from app.core import email_utils

@pytest.fixture
def mock_settings():
    mock = MagicMock()
    mock.EMAILS_ENABLED = True
    mock.EMAIL_BACKEND = "smtp"
    mock.SMTP_HOST = "a0090239.ferozo.com"
    mock.SMTP_PORT = 465
    mock.SMTP_USER = "no-reply@zondasolutions.com"
    mock.SMTP_PASS = None
    mock.SMTP_FROM = "no-reply@zondasolutions.com"
    mock.SMTP_TLS = False
    mock.SMTP_SSL = True
    mock.EMAIL_BANNER_URL = "https://placeholder.com/banner.png"
    mock.PROJECT_NAME = "Whisper SaaS MVP"
    mock.RESET_TOKEN_EXPIRE_MINUTES = 30
    return mock

# @pytest.mark.integration #DESCOMENTAR ESTA LINEA PARA HACER PRUEBA DE INTEGRACIÓN REAL CON SMTP
def test_send_reset_email_real(mock_settings):
    with patch.object(email_utils, "settings", mock_settings):
        email_utils.send_reset_email(
            to_email="p.mirazo@zondasolutions.com",
            token="test-token-abc123"
        )