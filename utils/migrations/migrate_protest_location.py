# This migration is to prepare for removing Protest.location. The change
# is to prepare for validation and also paving the way for collection of
# more accurate location data.
#
# The Protest.location column must be removed manually using the SQL scripts
# in /sql

import os

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import models


DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_PITCHFORKS = os.environ.get('DB_PITCHFORKS')
DB_HOST = os.environ.get('DB_HOST')
postgres_url = "postgresql://{}:{}@{}/{}".format(DB_USER, DB_PASSWORD,
                                                 DB_HOST, DB_PITCHFORKS)
engine = create_engine(postgres_url)
Session = sessionmaker(engine)

session = Session()

User = models.User
Protest = models.Protest

locations = session.query(Protest).all()

def migrate_location():
    """Move Protest.location to protest.city and protest.state."""
    for l in locations:
        city_state = l.location.split()
        if len(city_state) == 2:
            l.city = city_state[0]
            l.state = city_state[1]
        if len(city_state) == 3:
            city = "{} {}".format(city_state[0], city_state[1])
            l.city = city
            l.state = city_state[2]

migrate_location()
session.commit()
