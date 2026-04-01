# tests/test_db_conn.py
import pytest
from sqlalchemy import text
from app.core.db import engine
from app.core.config import settings

def test_database_connection_and_schema():
    """
    Verifica que la app puede conectarse a la base de datos 
    usando las variables cargadas desde el archivo .env,
    y que está configurada para apuntar al esquema específico.
    """
    try:
        with engine.connect() as connection:
            # 1. Verificar conexión básica
            result = connection.execute(text("SELECT 1"))
            assert result.scalar() == 1, "La consulta básica a la DB falló"
            
            # 2. Verificar el esquema (search_path)
            schema_result = connection.execute(text("SHOW search_path;"))
            search_path = schema_result.scalar()
            
            assert settings.DB_SCHEMA in search_path, f"El schema '{settings.DB_SCHEMA}' no está en el search_path de la DB ('{search_path}')."
            
    except Exception as e:
        pytest.fail(f"La conexión o la validación del schema falló con el error: {str(e)}")
