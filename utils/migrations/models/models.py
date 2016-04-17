from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import (
    Column, Date, Integer, String, Text,
    ForeignKey, create_engine)

Base = declarative_base()
engine = create_engine('postgresql://proto:admin@localhost:5432/pitchforks')

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)
    location = Column(String)
    avatar = Column(String)
    twitter_id = Column(Integer)
    twitter_token = Column(String)
    twitter_secret = Column(String)
    salt = Column(String)

    protests = relationship("Protest", backref="users")


class Protest(Base):
    __tablename__ = 'protests'

    name = Column(String)
    location = Column(String)
    date = Column(Date)
    event_id = Column(Integer, primary_key=True)
    submitted_by = Column(ForeignKey('users.id'))
    description = Column(Text)
    city = Column(String)
    state = Column(String(2))
    fist_pump = Column(Integer)

    # user = relationship("User", backref="protest", order_by="User.id")
