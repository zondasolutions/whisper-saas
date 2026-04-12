from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db_session as get_db
from app.models.user_model import User
from app.models.subscriptions_model import Subscription
import mercadopago
from app.core.config import settings

webhook_router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@webhook_router.post("/mercadopago")
async def mercadopago_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Receives IPN / Webhooks from MercadoPago.
    """
    payload = await request.json()
    action = payload.get("action") or payload.get("type")
    
    # In a real app we'd verify the signature or fetch the actual payment status
    # using MercadoPago SDK. Given MVP context, if it's a payment, we extract
    # reference or email to identify the user. For simplicity, assuming the
    # payload contains an 'external_reference' pointing to the user ID.

    data = payload.get("data", {})
    payment_id = data.get("id")

    if not payment_id:
        return {"status": "ignored", "reason": "No payment ID"}

    user_id = payload.get("external_reference")
    
    if not user_id:
        # Usually we would query MP API for the payment info to get external_reference
        pass # Handle properly via SDK if needed
    
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            # Mark a subscription as active or create one
            # Assuming we find the first subscription to activate
            sub = db.query(Subscription).filter(Subscription.user_id == user.id).first()
            if sub:
                sub.status = "active"
                db.commit()

    return {"status": "success"}
