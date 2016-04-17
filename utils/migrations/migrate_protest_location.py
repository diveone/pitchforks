from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import models


engine = create_engine('postgresql://proto:admin@localhost:5432/pitchforks')
Session = sessionmaker(engine)

session = Session()

User = models.User
Protest = models.Protest

locations = session.query(Protest).all()

def split_location():
    for l in locations:
        city_state = l.location.split()
        l.city = city_state[0]
        l.state = city_state[1]

split_location()

session.commit()
