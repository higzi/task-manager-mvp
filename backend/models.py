import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, ForeignKey, Text, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base

class User(Base):
    tablename = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False) 
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    authorized_at = Column(DateTime, default=func.now())

class Task(Base):
    tablename = "tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    deadline = Column(Date, nullable=False)
    importance = Column(Integer, nullable=False)
    complexity = Column(Integer, nullable=False)
    score = Column(Numeric(10, 3), nullable=False)
    status_id = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())