"""add fields to playlist

Revision ID: b6cc91666717
Revises: a8d0e040ed40
Create Date: 2016-08-09 21:37:10.012971

"""

# revision identifiers, used by Alembic.
revision = 'b6cc91666717'
down_revision = 'a8d0e040ed40'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('play_lists', sa.Column('song_id', sa.String(length=100), nullable=True))
    op.add_column('play_lists', sa.Column('title', sa.String(length=100), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('play_lists', 'title')
    op.drop_column('play_lists', 'song_id')
    ### end Alembic commands ###
