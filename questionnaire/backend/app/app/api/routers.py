from fastapi import APIRouter

from app.api import answers

api_router = APIRouter()
api_router.include_router(answers.answers_router,
                          prefix="/api",
                          tags=["questionnaire"])
