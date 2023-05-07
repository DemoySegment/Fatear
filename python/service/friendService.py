from datetime import datetime

from pydantic import BaseModel
from errors import internalServerError
import logging
from db.main import Database
from service.userService import UserRequest

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("friendService")
logger.setLevel(logging.DEBUG)


class FriendRequest(BaseModel):
    user1: str
    user2: str


class FriendService:
    def __init__(self, db: Database):
        self.Database = db

    def new_friend_request(self, friend_request: FriendRequest):
        db = self.Database
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            request_result = db.query(
                (
                        "INSERT into " + db.friend + "(user1, user2, acceptStatus, requestSentBy, createdAt, updatedAt) "
                                                     "values(%s, %s, %s, %s, %s, %s)"),
                [friend_request.user1, friend_request.user2, "Pending", friend_request.user1, now, now]
            )
            # same as return friend_request.dict()
            return {
                "request_id": request_result["insertId"],
                **friend_request.dict()
            }
        except Exception as e:
            logger.error("Unable to add new friend request")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def accept_friend_request(self, friend_request: FriendRequest):
        db = self.Database
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            _ = db.query("update friend set acceptStatus=%s, updatedAt=%s where user1=%s and user2=%s",
                         ["Accepted", now, friend_request.user1, friend_request.user2])
            return {
                **friend_request.dict()
            }
        except Exception as e:
            logger.error("Unable to accept friend request")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_requests_by(self, user: UserRequest):
        db = self.Database

        try:
            result = db.query("select user2 as username, acceptStatus, updatedAt, requestSentBy from friend f1 where f1.user1=%s ",
                              [user.username])
            return {
                **result
            }
        except Exception as e:
            logger.error("Unable to get requests")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_requests_to(self, user: UserRequest):
        db = self.Database

        try:
            result = db.query(
                "select user1 as username, acceptStatus, createdAt, requestSentBy from friend f1 where f1.user2=%s and acceptStatus='Pending' ",
                [user.username])
            return {
                **result
            }
        except Exception as e:
            logger.error("Unable to get requests")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def reject_friend_request(self, friend_request: FriendRequest):
        db = self.Database
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            _ = db.query("update friend set acceptStatus=%s, updatedAt=%s where user1=%s and user2=%s",
                         ["Not Accepted", now, friend_request.user1, friend_request.user2])
            return {
                **friend_request.dict()
            }
        except Exception as e:
            logger.error("Unable to reject friend request")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_user_list(self, request: FriendRequest):
        db = self.Database

        try:
            request_result = db.query("select username, fname, lname, nickname from  user  where username like %s and username not in (select user1  from friend  where user2 = %s union select user2  from friend where user1 = %s union select %s)" , ["%"+ request.user2+"%", request.user1, request.user1, request.user1]
                                      )
            return {
                **request_result
            }
        except Exception as e:
            logger.error("Unable to grab user information")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_friends(self, request: UserRequest):
        db = self.Database

        try:
            request_result = db.query('select user1 as username, updatedAt from  friend  where user2 = %s  and acceptStatus="Accepted" union select user2 as username, updatedAt from friend where user1 = %s and acceptStatus="Accepted" order by updatedAt asc' , [ request.username, request.username]
                                      )
            for friend in request_result["result"]:
                # logger.error(friend)
                info = db.query("select fname, lname, nickname from user where username=%s", [friend["username"]])["result"][0]
                # logger.error(info)
                friend.update(info)
            return {
                **request_result
            }
        except Exception as e:
            logger.error("Unable to get friends")
            logger.error(e)
            raise internalServerError.InternalServerError()