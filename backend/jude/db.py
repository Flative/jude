import os

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base


DB_URI = os.environ.get('DB_URI', 'sqlite:///db.sqlite3')


engine = create_engine(DB_URI, convert_unicode=True)
Base = declarative_base()
Base.metadata.bind = engine

session_factory = sessionmaker()
session_factory.configure(bind=engine, expire_on_commit=False, autocommit=False, autoflush=False)
session = scoped_session(session_factory)
