from sqlalchemy import create_engine, text
from logging.config import fileConfig
from urllib.parse import quote_plus
from sqlalchemy import engine_from_config
from sqlalchemy import pool
import sys
from alembic import context
import os
from dotenv import load_dotenv
from loguru import logger as log


# Añadir la carpeta raíz del proyecto al path para importar módulos app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
load_dotenv()

# Obtener la URL desde la variable de entorno
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT", "5432")
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASS")
db_driver = os.getenv("DB_DRIVER", "postgresql+psycopg")

# Verificar que tenemos todas las variables necesarias
if not all([db_host, db_name, db_user, db_password]):
    missing = []
    if not db_host: missing.append("DB_HOST")
    if not db_name: missing.append("DB_NAME") 
    if not db_user: missing.append("DB_USER")
    if not db_password: missing.append("DB_PASS")
    raise ValueError(f"Faltan variables de entorno: {', '.join(missing)}")

# Codificar la contraseña
encoded_password = quote_plus(str(db_password))
database_url = f"{db_driver}://{db_user}:{encoded_password}@{db_host}:{db_port}/{db_name}"

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

#Model import
try:
    from app.core.db import Base
    from app.models import *
    log.info("Modelos importados correctamente para Alembic")
except ImportError as ie:
    log.error(f"Error al importar modelos: {ie}")

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    #Usar nuestra database_url directamente
    context.configure(
        url=database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    #Crear engine directamente con nuestra URL
    connectable = create_engine(database_url, poolclass=pool.NullPool)
    
    with connectable.connect() as connection:

        
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True
        )
        
        with context.begin_transaction():
            context.run_migrations()
        


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()