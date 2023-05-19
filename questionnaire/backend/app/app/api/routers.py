from fastapi import APIRouter, Depends

from app.api.answers import answers_router, get_age_and_gender, get_previous_results
from app.api.auth import has_access

api_router = APIRouter()
api_router.include_router(answers_router,
                          prefix="/api",
                          tags=["questionnaire"])

api_router.add_api_route("api/questionnaire/get-age-and-gender",
                         get_age_and_gender,
                         dependencies=[Depends(has_access)],
                         methods=["GET"])

api_router.add_api_route("api/questionnaire/fetch-results",
                         get_previous_results,
                         dependencies=[Depends(has_access)],
                         methods=["GET"])
