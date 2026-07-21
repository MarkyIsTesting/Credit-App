from dotenv import load_dotenv
load_dotenv()

import os
import logging
import uuid
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from pathlib import Path

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, BackgroundTasks
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

from email_service import (
    send_welcome_email,
    send_application_created_email,
    send_step_email,
    STEPS,
)


# -------- Setup --------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_MINUTES = 60 * 24  # 1 day for convenience
REFRESH_DAYS = 7

# Cookie policy (env-driven so local HTTP dev works, prod HTTPS stays secure).
# Local dev over http://  -> COOKIE_SECURE=false, COOKIE_SAMESITE=lax
# Cross-site prod over https:// -> COOKIE_SECURE=true,  COOKIE_SAMESITE=none
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "lax").lower()

app = FastAPI(title="EuroKredit API")
api_router = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# -------- Password helpers --------
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


# -------- JWT --------
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id, "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_DAYS),
        "type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    response.set_cookie("access_token", access, httponly=True, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE, max_age=ACCESS_MINUTES * 60, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE, max_age=REFRESH_DAYS * 86400, path="/")


# -------- Auth dependency --------
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Type de jeton invalide")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Jeton expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Jeton invalide")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Accès administrateur requis")
    return user


# -------- Models --------
class RegisterIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    created_at: str


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


# 5-step process (imported from email_service)
FRONTEND_URL_ENV = os.environ.get("FRONTEND_URL", "")


class LoanApplication(LoanApplicationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    status: str = "submitted"  # current step
    step_index: int = 0
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


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


class StepUpdate(BaseModel):
    step_index: int = Field(ge=0, le=4)


RATES = {"personnel": 4.9, "immobilier": 3.2, "auto": 4.2, "professionnel": 5.5, "rachat": 4.5}


def compute_monthly(amount: float, rate_pct: float, months: int) -> float:
    r = (rate_pct / 100.0) / 12.0
    if r == 0:
        return amount / months
    return amount * r / (1 - (1 + r) ** -months)


# -------- Public routes --------
@api_router.get("/")
async def root():
    return {"service": "EuroKredit API", "status": "ok"}


@api_router.get("/rates")
async def get_rates():
    return {"rates": RATES}


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


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(payload: ContactMessageCreate):
    obj = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(obj.model_dump())
    return obj


# -------- Auth routes --------
@api_router.post("/auth/register", response_model=UserOut)
async def register(payload: RegisterIn, response: Response, background: BackgroundTasks):
    email = payload.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Un compte existe déjà avec cet email.")
    user = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": email,
        "password_hash": hash_password(payload.password),
        "role": "client",
        "created_at": now_iso(),
    }
    await db.users.insert_one(user)

    # Auto-link any existing applications submitted with same email but without user_id
    await db.loan_applications.update_many(
        {"email": email, "$or": [{"user_id": None}, {"user_id": {"$exists": False}}]},
        {"$set": {"user_id": user["id"], "updated_at": now_iso()}},
    )

    set_auth_cookies(response, user["id"], user["email"])
    background.add_task(send_welcome_email, user["email"], user["name"], FRONTEND_URL_ENV)
    user.pop("password_hash", None)
    return user


@api_router.post("/auth/login", response_model=UserOut)
async def login(payload: LoginIn, request: Request, response: Response):
    email = payload.email.lower().strip()

    # Brute force protection
    ident = f"{request.client.host if request.client else 'unknown'}:{email}"
    fifteen_ago = (datetime.now(timezone.utc) - timedelta(minutes=15)).isoformat()
    recent = await db.login_attempts.count_documents({"identifier": ident, "at": {"$gt": fifteen_ago}})
    if recent >= 5:
        raise HTTPException(status_code=429, detail="Trop de tentatives. Réessayez dans 15 minutes.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.insert_one({"identifier": ident, "at": now_iso()})
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide.")

    # Clear attempts on success
    await db.login_attempts.delete_many({"identifier": ident})

    set_auth_cookies(response, user["id"], user["email"])
    user.pop("password_hash", None)
    user.pop("_id", None)
    return user


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/", samesite=COOKIE_SAMESITE, secure=COOKIE_SECURE)
    response.delete_cookie("refresh_token", path="/", samesite=COOKIE_SAMESITE, secure=COOKIE_SECURE)
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return user


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Aucun jeton de rafraîchissement")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Type de jeton invalide")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        set_auth_cookies(response, user["id"], user["email"])
        return {"ok": True}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Jeton de rafraîchissement expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Jeton invalide")


# -------- Applications --------
@api_router.post("/applications", response_model=LoanApplication)
async def create_application(payload: LoanApplicationCreate, request: Request, background: BackgroundTasks):
    # Optional auth: attach user_id if a valid token is present
    user_id = None
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if token:
        try:
            pl = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            if pl.get("type") == "access":
                user_id = pl.get("sub")
        except Exception:
            user_id = None

    obj = LoanApplication(**payload.model_dump(), user_id=user_id)
    await db.loan_applications.insert_one(obj.model_dump())
    background.add_task(
        send_application_created_email,
        obj.email, obj.full_name, obj.id, obj.loan_type, obj.amount, obj.duration_months, FRONTEND_URL_ENV,
    )
    return obj


@api_router.get("/applications/me", response_model=List[LoanApplication])
async def my_applications(user: dict = Depends(get_current_user)):
    docs = await db.loan_applications.find(
        {"$or": [{"user_id": user["id"]}, {"email": user["email"]}]},
        {"_id": 0},
    ).sort("created_at", -1).to_list(500)
    return [LoanApplication(**d) for d in docs]


@api_router.get("/applications/{app_id}", response_model=LoanApplication)
async def get_application(app_id: str, user: dict = Depends(get_current_user)):
    doc = await db.loan_applications.find_one({"id": app_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    if user.get("role") != "admin" and doc.get("user_id") != user["id"] and doc.get("email") != user["email"]:
        raise HTTPException(status_code=403, detail="Accès interdit")
    return LoanApplication(**doc)


@api_router.get("/applications", response_model=List[LoanApplication])
async def list_applications(user: dict = Depends(require_admin)):
    docs = await db.loan_applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [LoanApplication(**d) for d in docs]


@api_router.patch("/applications/{app_id}/step", response_model=LoanApplication)
async def update_step(app_id: str, payload: StepUpdate, background: BackgroundTasks, user: dict = Depends(require_admin)):
    step_name = STEPS[payload.step_index]
    result = await db.loan_applications.find_one_and_update(
        {"id": app_id},
        {"$set": {"step_index": payload.step_index, "status": step_name, "updated_at": now_iso()}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    background.add_task(
        send_step_email,
        result.get("email"), result.get("full_name"), app_id, step_name, FRONTEND_URL_ENV,
    )
    return LoanApplication(**result)


app.include_router(api_router)


# -------- CORS --------
# Accept a comma-separated list via CORS_ORIGINS, fall back to FRONTEND_URL, then localhost dev.
# NOTE: "*" is intentionally NOT used — browsers reject wildcard origins on credentialed
# (cookie) requests, so an explicit origin list is required for auth to work cross-origin.
_origins_raw = os.environ.get("CORS_ORIGINS") or os.environ.get("FRONTEND_URL") or "http://localhost:3000"
allowed_origins = [o.strip() for o in _origins_raw.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------- Startup --------
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.loan_applications.create_index("user_id")
    await db.loan_applications.create_index("email")
    await db.login_attempts.create_index("identifier")
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@eurokredit.fr")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin2026!")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "name": "Administrateur",
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Admin utilisateur créé : %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Mot de passe admin mis à jour : %s", admin_email)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# -------- Entrypoint --------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host=os.environ.get("HOST", "0.0.0.0"),
        port=int(os.environ.get("PORT", "8001")),
        reload=os.environ.get("RELOAD", "false").lower() == "true",
    )
