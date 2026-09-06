from pydantic import BaseModel, EmailStr, ConfigDict

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(
        from_attributes=True
    )

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse