"""Create example DB

Revision ID: 3f9d537accda
Revises: 
Create Date: 2023-02-03 19:48:34.190795

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3f9d537accda'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('object',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    pass
