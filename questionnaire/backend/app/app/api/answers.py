import httpx
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import PlainTextResponse, JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime

from app.crud.answers import answers
from app.schemas.answers import Answers
from app.database.dependencies import get_db
from app.core.config import settings

answers_router = APIRouter()

# sets retries amount to 10 and if after this other microservice does not respond - raise normal exception (5xx)
transport = httpx.AsyncHTTPTransport(retries=10)
timeout = httpx.Timeout(1.0)


@answers_router.post("/get-token", status_code=status.HTTP_201_CREATED, response_class=PlainTextResponse)
async def request_token():
    async with httpx.AsyncClient(transport=transport, timeout=timeout) as client:
        return (await client.post(f'http://{settings.TOKEN_SERVICE_HOST}:{settings.TOKEN_SERVICE_PORT}'
                                  f'/api/user/new_respondent',
                                  headers={'Authorization': f'Bearer {settings.BEARER_TOKEN}'})
                ).text


async def get_id_by_token(respondent_token: str):
    async with httpx.AsyncClient(transport=transport, timeout=timeout) as client:
        return int(
            (await client.get(f'http://{settings.TOKEN_SERVICE_HOST}:{settings.TOKEN_SERVICE_PORT}'
                              f'/api/user/{respondent_token}',
                              headers={'Authorization': f'Bearer {settings.BEARER_TOKEN}'})
             ).text
        )


@answers_router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_answer(answers_in: Answers,
                        respondent_token: str,
                        db: Session = Depends(get_db)):
    """
    Submit answers from respondent.
    """
    respondent_id = await get_id_by_token(respondent_token=respondent_token)

    existing_answers = await answers.get_by_respondent_id(db=db, respondent_id=respondent_id)
    if existing_answers is not None:
        await answers.update(db=db, db_answers=existing_answers, answers_in=answers_in)
    else:
        await answers.create(db=db, answers_in=answers_in, respondent_id=respondent_id)


async def get_answers_or_404(respondent_token: str, db: Session):
    respondent_id = await get_id_by_token(respondent_token=respondent_token)
    existing_answers = await answers.get_by_respondent_id(db=db, respondent_id=respondent_id)
    if existing_answers is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No submitted results found")
    return existing_answers


@answers_router.get("/fetch-results")
async def get_previous_results(respondent_token: str, db: Session = Depends(get_db)):
    """
    Fetch previous results of respondent.
    """
    existing_answers = await get_answers_or_404(respondent_token, db)
    return JSONResponse(status_code=status.HTTP_200_OK,
                        content=Answers(gender=existing_answers.gender,
                                        date_of_birth=existing_answers.date_of_birth,
                                        years_of_work=datetime.today().year - existing_answers.year_of_work_start,
                                        speciality=existing_answers.speciality).dict()
                        )


async def get_age_and_gender(respondent_token: str, db: Session = Depends(get_db)):
    """
    Fetch age and gender of respondent.
    """
    existing_answers = await get_answers_or_404(respondent_token, db)
    return JSONResponse(status_code=status.HTTP_200_OK,
                        content=dict(age=(datetime.today() - existing_answers.date_of_birth).year,
                                     gender=existing_answers.gender),
                        )
