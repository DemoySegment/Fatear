from datetime import datetime

from pydantic import BaseModel
from errors import internalServerError
import logging
from db.main import Database

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("userService")
logger.setLevel(logging.DEBUG)


class UserRequest(BaseModel):
    username: str


class UserService:
    def __init__(self, db: Database):
        self.Database = db


