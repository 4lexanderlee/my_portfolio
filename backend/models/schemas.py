from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from uuid import UUID
from datetime import date


# ── Validador de fechas "YYYY-MM" → date ───────────────────────────────────
def _parse_month_date(v):
    """Acepta 'YYYY-MM' o 'YYYY-MM-DD'. Devuelve siempre un objeto date."""
    if v is None:
        return v
    if isinstance(v, date):
        return v
    if isinstance(v, str):
        parts = v.split("-")
        if len(parts) == 2:                   # 'YYYY-MM'
            return date(int(parts[0]), int(parts[1]), 1)
        elif len(parts) == 3:                 # 'YYYY-MM-DD'
            return date(int(parts[0]), int(parts[1]), int(parts[2]))
    raise ValueError(f"Formato de fecha inválido: {v!r}")


# ─────────────────────────────────────────────────────────────────────────────
# PROFILE
# ─────────────────────────────────────────────────────────────────────────────
class ProfileBase(BaseModel):
    name: str
    last_name: str
    description: str
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


# ─────────────────────────────────────────────────────────────────────────────
# IAM  (Ocupaciones / Roles del Typewriter)
# ─────────────────────────────────────────────────────────────────────────────
class IamBase(BaseModel):
    occupation_name: str
    profile_id: UUID


class IamCreate(BaseModel):
    occupation_name: str
    profile_id: Optional[UUID] = None


class IamUpdate(BaseModel):
    occupation_name: Optional[str] = None


class IamResponse(IamBase):
    iam_id: UUID

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────────────────────────────
# EXPERIENCE  (con responsabilidades anidadas)
# ─────────────────────────────────────────────────────────────────────────────
class ResponsibilityIn(BaseModel):
    description: str
    order: int = 1


class ResponsibilityResponse(BaseModel):
    id: UUID
    experience_id: UUID
    description: str
    order: int

    class Config:
        from_attributes = True


class ExperienceBase(BaseModel):
    rol: str
    company: str
    start_date: date
    end_date: Optional[date] = None
    location: Optional[str] = None
    profile_id: UUID

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def parse_month(cls, v):
        return _parse_month_date(v)


class ExperienceCreate(ExperienceBase):
    responsibilities: List[ResponsibilityIn] = []


class ExperienceUpdate(BaseModel):
    rol: Optional[str] = None
    company: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    location: Optional[str] = None
    responsibilities: Optional[List[ResponsibilityIn]] = None

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def parse_month(cls, v):
        return _parse_month_date(v)


class ExperienceResponse(ExperienceBase):
    id: UUID
    responsibilities: List[ResponsibilityResponse] = []

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────────────────────────────
# PROJECTS
# ─────────────────────────────────────────────────────────────────────────────
class ProjectBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    icon_url: Optional[str] = None
    description: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    video_url: Optional[str] = None
    drive_url: Optional[str] = None
    website_url: Optional[str] = None
    destacado: bool = False
    profile_id: UUID

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def parse_month(cls, v):
        return _parse_month_date(v)


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
    drive_url: Optional[str] = None
    website_url: Optional[str] = None
    destacado: Optional[bool] = None

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def parse_month(cls, v):
        return _parse_month_date(v)


class ProjectResponse(ProjectBase):
    id: UUID

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────────────────────────────
# SKILLS
# ─────────────────────────────────────────────────────────────────────────────
class SkillBase(BaseModel):
    category: str
    skill_name: str
    profile_id: UUID


class SkillCreate(BaseModel):
    category: str
    skill_name: str
    profile_id: Optional[UUID] = None


class SkillUpdate(BaseModel):
    category: Optional[str] = None
    skill_name: Optional[str] = None


class SkillResponse(SkillBase):
    id: UUID

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────────────────────────────
# CERTIFICATIONS
# ─────────────────────────────────────────────────────────────────────────────
class CertificationBase(BaseModel):
    title: str
    awarded_by: str
    date_issue: Optional[date] = None
    icon_url: Optional[str] = None
    reference_link: str
    profile_id: UUID

    @field_validator("date_issue", mode="before")
    @classmethod
    def parse_month(cls, v):
        return _parse_month_date(v)


class CertificationCreate(BaseModel):
    title: str
    awarded_by: str
    date_issue: Optional[date] = None
    icon_url: Optional[str] = None
    reference_link: str
    profile_id: Optional[UUID] = None


class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    awarded_by: Optional[str] = None
    date_issue: Optional[date] = None
    icon_url: Optional[str] = None
    reference_link: Optional[str] = None

    @field_validator("date_issue", mode="before")
    @classmethod
    def parse_month(cls, v):
        return _parse_month_date(v)


class CertificationResponse(CertificationBase):
    id: UUID

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────────────────────────────
# TRAINING
# ─────────────────────────────────────────────────────────────────────────────
class TrainingBase(BaseModel):
    title: str
    study_center: str
    start_date: date
    end_date: Optional[date] = None
    profile_id: UUID

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def parse_month(cls, v):
        return _parse_month_date(v)


class TrainingCreate(TrainingBase):
    pass


class TrainingUpdate(BaseModel):
    title: Optional[str] = None
    study_center: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def parse_month(cls, v):
        return _parse_month_date(v)


class TrainingResponse(TrainingBase):
    id: UUID

    class Config:
        from_attributes = True