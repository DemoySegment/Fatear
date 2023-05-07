from datetime import datetime

from pydantic import BaseModel
from errors import internalServerError
import logging
from db.main import Database

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("reviewService")
logger.setLevel(logging.DEBUG)


class ReviewRequest(BaseModel):
    content: str
    username: str
    song_id: str


class GetReviewRequest(BaseModel):
    username: str
    song_id: str


class ReviewService:
    def __init__(self, db: Database):
        self.db = db

    def post_song_review(self, request: ReviewRequest):
        db = self.db
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            result = db.query("insert into reviewsong (username, songID, reviewText, reviewDate) values (%s,%s,%s,%s)",
                              [request.username, request.song_id, request.content, now])

            return {
                **request.dict()}
        except Exception as e:
            logger.error("Unable to add new new song review")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def post_album_review(self, request: ReviewRequest):
        db = self.db
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            result = db.query(
                "insert into reviewalbum (username, albumID, reviewText, reviewDate) values (%s,%s,%s,%s)",
                [request.username, request.song_id, request.content, now])

            return {
                "album_review_id": result["insertID"], **request}
        except Exception as e:
            logger.error("Unable to add new album review")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_my_song_review(self, data: GetReviewRequest):
        db = self.db
        try:
            result = db.query("select * from reviewsong where username=%s and songID = %s",
                              [data.username, data.song_id])

            return {
                **result}
        except Exception as e:
            logger.error("Unable to get song rating")
            logger.error(e)
            raise internalServerError.InternalServerError()
