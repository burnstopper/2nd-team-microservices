from app.database.base_class import Base

from sqlalchemy import Integer, String, Column, CheckConstraint


# https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-database-models
# no need for __tablename__ because of declarative style (app.database.base_class)
class Answers(Base):
    # unique and index constraints are redundant in case of single column of "Integer" type
    # https://www.sqlite.org/lang_createtable.html#rowid
    id = Column(Integer, primary_key=True)
    respondent_id = Column(Integer,
                           index=True,
                           unique=True,
                           nullable=False)
    gender = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=False)
    year_of_work_start = Column(Integer, nullable=False)
    speciality = Column(String, nullable=False)
