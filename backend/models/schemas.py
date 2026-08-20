from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class ProfileBase(BaseModel):
    name: str
    last_name: str
    description: Optional[str] = None
    cv_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    email: EmailStr
    employment_status: bool = True

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    profile_id: UUID

    class Config:
        from_attributes = True