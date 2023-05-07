from datetime import datetime

from pydantic import BaseModel
from errors import internalServerError
import logging
from db.main import Database
from service.userService import UserRequest

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("followService")
logger.setLevel(logging.DEBUG)
class FollowRequest(BaseModel):
    follower: str
    follows: str


class FollowService:
    def __init__(self, db: Database):
        self.Database = db

    def follow(self, request: FollowRequest):
        db = self.Database
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            result = db.query("insert into follows values (%s,%s,%s)", [request.follower, request.follows, now])
            return {
                "follow_id": result["insertId"],
                **request.dict()}
        except Exception as e:
            logger.error("Unable to handle new following request")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_follower(self, request: UserRequest):
        db = self.Database
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            result = db.query("select * from  follows where follows = %s", [request.username])

            return {
                **result}
        except Exception as e:
            logger.error("Unable to get follower")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_user_list(self, request: FollowRequest):
        db = self.Database

        try:
            request_result = db.query("select username, fname, lname, nickname from  user  where username like %s and username not in (select follower from follows where follows = %s union select %s)" , ["%"+ request.follower+"%", request.follows, request.follows]
                                      )
            return {
                **request_result
            }
        except Exception as e:
            logger.error("Unable to grab user information")
            logger.error(e)
            raise internalServerError.InternalServerError()