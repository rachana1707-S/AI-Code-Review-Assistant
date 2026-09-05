from datetime import (
    datetime,
    timedelta,
    timezone
)

import os

from dotenv import load_dotenv

from jose import jwt

from passlib.context import CryptContext


load_dotenv()


SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


if not SECRET_KEY:
    raise ValueError(
        "SECRET_KEY is not configured."
    )


password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(
    password: str
):

    return password_context.hash(
        password
    )


def verify_password(
    plain_password: str,
    hashed_password: str
):

    return password_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(
    data: dict
):

    payload = data.copy()

    expire = (
        datetime.now(
            timezone.utc
        )
        +
        timedelta(
            minutes=
            ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload.update({
        "exp": expire
    })


    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )