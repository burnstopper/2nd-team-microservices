from datetime import datetime

from typing import Type, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi.encoders import jsonable_encoder

from app.models.answers import Answers
from app.schemas.answers import Answers as ReceivedAnswers


class CRUDAnswers:
    def __init__(self, model: Type[Answers]):
        self.model = model

    # pass because usually every model has its own create function
    async def create(self, db: AsyncSession,
                     answers_in: ReceivedAnswers,
                     respondent_id: int) -> Answers:

        new_answers_fields = answers_in.dict()
        new_answers_fields.pop("years_of_work")

        new_answers = Answers(**new_answers_fields)
        new_answers.year_of_work_start = datetime.today().year - answers_in.years_of_work

        new_answers.respondent_id = respondent_id

        db.add(new_answers)
        await db.flush()

        return new_answers

    async def get_by_respondent_id(self,
                                   db: AsyncSession,
                                   respondent_id: int) -> Optional[Answers]:

        result = (await db.execute(select(self.model).where(self.model.respondent_id == respondent_id))).first()
        if result:
            # result is a tuple with only one item
            return result[0]
        else:
            return None

    async def update(self, db: AsyncSession,
                     db_answers: Answers,
                     answers_in: ReceivedAnswers) -> Answers:

        update_data = answers_in.dict(exclude_unset=True)

        db_object_data = jsonable_encoder(db_answers)
        for field in db_object_data:
            if field in update_data:
                # = assignment (db_object.field = update_data[field]) will not work
                setattr(db_answers, field, update_data[field])
        setattr(db_answers, "year_of_work_start", datetime.today().year - update_data["years_of_work"])

        db.add(db_answers)
        await db.flush()

        return db_answers


answers = CRUDAnswers(Answers)
