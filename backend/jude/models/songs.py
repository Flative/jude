__all__ = 'PlayList',

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func

from ..db import Base, session


class PlayList(Base):

    __tablename__ = "play_lists"

    id = Column(Integer(), primary_key=True)
    title = Column(String(100))
    song_id = Column(String(100))
    is_playing = Column(Boolean(), default=False)
    created_at = Column(DateTime(timezone=True), default=func.now())

    @classmethod
    def get_current_lists(cls):
        lists = []
        for obj in session.query(cls).order_by(cls.id.asc()).all():
            lists.append({'pk': obj.id, 'title': obj.title, 'song_id': obj.song_id, 'is_playing': obj.is_playing})
        return lists

