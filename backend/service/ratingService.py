from datetime import datetime, date

from pydantic import BaseModel
from errors import internalServerError
import logging
from db.main import Database

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("ratingService")
logger.setLevel(logging.DEBUG)
class RatingRequest(BaseModel):
    star: int
    username: str
    song_id: str

class GetRatingRequest(BaseModel):
    username: str
    song_id: str

class RatingService:
    def __init__(self, db: Database):
        self.db = db

    def post_song_rating(self, request: RatingRequest):
        db = self.db
        now = date.today().strftime("%Y-%m-%d")
        try:
            result = db.query("insert into ratesong (username, songID, stars, ratingDate) values (%s,%s,%s,%s)",
                         [request.username, request.song_id, request.star, now])

            return {
                **request.dict()}
        except Exception as e:
            logger.error("Unable to add new new song rating")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def post_album_rating(self, request: RatingRequest):
        db = self.db
        try:
            result = db.query("insert into ratealbum (username, albumID, stars) values (%s,%s,%s)",
                         [request.username, request.song_id, request.star])

            return {
                "album_rating_id": result["insertID"],
                **request}
        except Exception as e:
            logger.error("Unable to add new album rating")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_my_song_rating(self, data: GetRatingRequest):
        db = self.db
        try:
            result = db.query("select * from ratesong where username=%s and songID = %s", [data.username, data.song_id])

            return {
                **result}
        except Exception as e:
            logger.error("Unable to get song rating")
            logger.error(e)
            raise internalServerError.InternalServerError()


