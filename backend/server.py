from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="EuroKredit API")
api_router = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ----- Models -----
class LoanApplicationCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=40)
    loan_type: str
    amount: float = Field(gt=0)
    duration_months: int = Field(gt=0, le=360)
    monthly_income: Optional[float] = None
    message: Optional[str] = None


class LoanApplication(LoanApplicationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"
    created_at: str = Field(default_factory=now_iso)


class ContactMessageCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    message: str = Field(min_length=5, max_length=2000)


class ContactMessage(ContactMessageCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)


class SimulatorRequest(BaseModel):
    amount: float = Field(gt=0)
    duration_months: int = Field(gt=0, le=360)
    loan_type: str = "personnel"


class SimulatorResponse(BaseModel):
    amount: float
    duration_months: int
    interest_rate: float
    monthly_payment: float
    total_cost: float
    total_interest: float
    loan_type: str


RATES = {
    "personnel": 4.9,
    "immobilier": 3.2,
    "auto": 4.2,
    "professionnel": 5.5,
    "rachat": 4.5,
}


def compute_monthly(amount: float, rate_pct: float, months: int) -> float:
    r = (rate_pct / 100.0) / 12.0
    if r == 0:
        return amount / months
    return amount * r / (1 - (1 + r) ** -months)


# ----- Routes -----
@api_router.get("/")
async def root():
    return {"service": "EuroKredit API", "status": "ok"}


@api_router.post("/simulator", response_model=SimulatorResponse)
async def simulate(payload: SimulatorRequest):
    rate = RATES.get(payload.loan_type.lower(), 4.9)
    monthly = compute_monthly(payload.amount, rate, payload.duration_months)
    total = monthly * payload.duration_months
    return SimulatorResponse(
        amount=round(payload.amount, 2),
        duration_months=payload.duration_months,
        interest_rate=rate,
        monthly_payment=round(monthly, 2),
        total_cost=round(total, 2),
        total_interest=round(total - payload.amount, 2),
        loan_type=payload.loan_type.lower(),
    )


@api_router.post("/applications", response_model=LoanApplication)
async def create_application(payload: LoanApplicationCreate):
    obj = LoanApplication(**payload.model_dump())
    await db.loan_applications.insert_one(obj.model_dump())
    return obj


@api_router.get("/applications", response_model=List[LoanApplication])
async def list_applications():
    docs = await db.loan_applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [LoanApplication(**d) for d in docs]


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(payload: ContactMessageCreate):
    obj = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(obj.model_dump())
    return obj


@api_router.get("/rates")
async def get_rates():
    return {"rates": RATES}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
