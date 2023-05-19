from pydantic import BaseModel

# https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-pydantic-models
# not a @dataclass because dict() method is required in CRUD


# schema of Results received from client side
class Answers(BaseModel):
    # # gender contains information like "male/female", formed and validated on the frontend
    gender: str
    # date_of_birth contains only year and month, validating is done on the frontend
    date_of_birth: str
    # years_of_work contains number of years of work, validation is the same with date_of_birth
    years_of_work: int
    speciality: str

    # https://fastapi.tiangolo.com/tutorial/sql-databases/#use-pydantics-orm_mode
    class Config:
        orm_mode = True

