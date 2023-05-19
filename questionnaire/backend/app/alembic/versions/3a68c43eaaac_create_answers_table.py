"""Create answers table

Revision ID: 3a68c43eaaac
Revises: 
Create Date: 2023-04-05 00:08:31.477480

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '3a68c43eaaac'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('answers',
                    sa.Column('id', sa.INTEGER(), nullable=False),
                    sa.Column('respondent_id', sa.INTEGER(),
                              index=True,
                              unique=True,
                              nullable=False),
                    sa.Column('gender', sa.VARCHAR(), nullable=False),
                    sa.Column('date_of_birth', sa.VARCHAR(), nullable=False),
                    sa.Column('year_of_work_start', sa.INTEGER(), nullable=False),
                    sa.Column('speciality', sa.VARCHAR(), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )


def downgrade() -> None:
    pass
