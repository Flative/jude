__all__ = 'PlayList',

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from ..db import Base


class PlayList(Base):

    __tablename__ = "play_lists"

    id = Column(Integer(), primary_key=True)
    title = Column(String(100))
    song_id = Column(String(100))
    created_at = Column(DateTime(timezone=True), default=func.now())
