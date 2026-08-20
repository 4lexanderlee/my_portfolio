from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import date

# --- PROFILE ---
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

# --- EXPERIENCE ---
class ExperienceBase(BaseModel):
    rol: str
    company: str
    start_date: date
    end_date: Optional[date] = None
    location: Optional[str] = None
    profile_id: UUID

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    rol: Optional[str] = None
    company: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    location: Optional[str] = None

class ExperienceResponse(ExperienceBase):
    id: UUID

    class Config:
        from_attributes = True

# --- PROJECTS ---
class ProjectBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    icon_url: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    video_url: Optional[str] = None
    colab_url: Optional[str] = None
    drive_url: Optional[str] = None
    website_url: Optional[str] = None
    destacado: bool = False
    profile_id: UUID

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    icon_url: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    video_url: Optional[str] = None
    colab_url: Optional[str] = None
    drive_url: Optional[str] = None
    website_url: Optional[str] = None
    destacado: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: UUID

    class Config:
        from_attributes = True

# --- SKILLS ---
class SkillBase(BaseModel):
    category: str
    skill_name: str
    profile_id: UUID

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    category: Optional[str] = None
    skill_name: Optional[str] = None

class SkillResponse(SkillBase):
    id: UUID

    class Config:
        from_attributes = True

# --- CERTIFICATIONS ---
class CertificationBase(BaseModel):
    title: str
    awarded_by: str
    date_issue: Optional[date] = None
    icon_url: Optional[str] = None
    reference_link: Optional[str] = None
    profile_id: UUID

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    awarded_by: Optional[str] = None
    date_issue: Optional[date] = None
    icon_url: Optional[str] = None
    reference_link: Optional[str] = None

class CertificationResponse(CertificationBase):
    id: UUID

    class Config:
        from_attributes = True

# --- TRAINING ---
class TrainingBase(BaseModel):
    title: str
    study_center: str
    start_date: date
    end_date: Optional[date] = None
    profile_id: UUID

class TrainingCreate(TrainingBase):
    pass

class TrainingUpdate(BaseModel):
    title: Optional[str] = None
    study_center: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class TrainingResponse(TrainingBase):
    id: UUID

    class Config:
        from_attributes = True