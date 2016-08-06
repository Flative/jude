__all__ = ['PlayList']

from sqlalchemy import Column, DateTime, Integer
from sqlalchemy.sql import func

from ..db import Base


class PlayList(Base):

    __tablename__ = "play_lists"

    id = Column(Integer(), primary_key=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
