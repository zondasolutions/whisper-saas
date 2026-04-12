from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import calendar
from sqlalchemy import func
from app.core.security import get_current_user
from app.core.db import get_db_session as get_db
from app.models.user_usage_model import UserUsage

usage_router = APIRouter(prefix="/usage", tags=["Usage"])

@usage_router.get("/me")
def get_my_usage(user=Depends(get_current_user), db: Session = Depends(get_db)):
    current_month = datetime.utcnow().strftime("%Y-%m")
    
    usage_total = db.query(func.sum(UserUsage.seconds_used)).filter(
        UserUsage.user_id == user.id,
        UserUsage.month_year == current_month
    ).scalar() or 0

    if getattr(user, "is_admin", False):
        limit_seconds = -1 # Unlimited
        tier = "Admin"
    else:
        has_active_sub = any(sub.status == "active" for sub in getattr(user, "subscriptions", []))
        if has_active_sub:
            limit_seconds = 72000 # 1200 minutes
            tier = "Premium"
        else:
            limit_seconds = 1800 # 30 minutes
            tier = "Free"
            
    # Calculate reset date (First day of next month)
    now = datetime.utcnow()
    last_day = calendar.monthrange(now.year, now.month)[1]
    reset_date = datetime(now.year, now.month, last_day, 23, 59, 59)
    
    return {
        "tier": tier,
        "used_seconds": usage_total,
        "limit_seconds": limit_seconds,
        "reset_date": reset_date.isoformat()
    }
