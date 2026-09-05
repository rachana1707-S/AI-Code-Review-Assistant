from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime
)

from datetime import datetime

from .database import Base




class Review(Base):

    __tablename__ = "reviews"


    id = Column(

        Integer,

        primary_key=True,

        index=True

    )


    filename = Column(

        String,

        nullable=False

    )


    code = Column(

        Text,

        nullable=False

    )


    quality_score = Column(

        Integer

    )


    analysis = Column(

        Text

    )


    created_at = Column(

        DateTime,

        default=datetime.utcnow

    )