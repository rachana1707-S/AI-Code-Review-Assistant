from datetime import (
    datetime,
    timezone
)

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from .database import Base


class User(Base):

    __tablename__ = "users"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    name = Column(
        String(100),
        nullable=False
    )


    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )


    hashed_password = Column(
        String(255),
        nullable=False
    )


    created_at = Column(
        DateTime(timezone=True),
        default=lambda:
        datetime.now(
            timezone.utc
        )
    )


    reviews = relationship(
        "Review",
        back_populates="user",
        cascade="all, delete-orphan"
    )


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
        DateTime(timezone=True),
        default=lambda:
        datetime.now(
            timezone.utc
        )
    )


    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=True,
        index=True
    )


    user = relationship(
        "User",
        back_populates="reviews"
    )