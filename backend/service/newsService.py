from datetime import datetime, date, timedelta

from pydantic import BaseModel
from errors import internalServerError
import logging
from db.main import Database

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("interestService")
logger.setLevel(logging.DEBUG)


class NewsRequest(BaseModel):
    username: str
    start_time: date


class NewsService:
    def __init__(self, db: Database):
        self.db = db

    def get_friend_post(self, request: NewsRequest):
        db = self.db
        try:

            data = db.query(
                "select * from reviewsong natural join song join friend on (username=user1) where user2 = %s and reviewDate > %s union "
                "select * from reviewsong natural join song join friend on (username=user2) where user1 = %s and reviewDate > %s",
                [request.username, request.start_time, request.username, request.start_time])
            count = 0

            for review in data['result']:
                review["id"] = count
                count = count + 1
            return {**data}
        except Exception as e:
            logger.error("Unable to get friend reviews")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_follower_post(self, request: NewsRequest):
        db = self.db
        try:
            #
            data = db.query("select * from reviewsong  natural join song join follows on (username=follower) where follows = %s and "
                            "reviewDate > %s",
                            [request.username, request.start_time])
            count = 0

            for review in data['result']:
                review["id"] = count
                count = count + 1

            return {**data}
        except Exception as e:
            logger.error("Unable to get follower review")
            logger.error(e)
            raise internalServerError.InternalServerError()

    def get_songs_of_following_artist(self, request: NewsRequest):
        db = self.db
        try:
            d = datetime.now()

            one_month_ago = date(d.year, d.month - 1, d.day) if d.month > 1 else date(d.year - 1, 12, d.day)
            query_date = one_month_ago if one_month_ago < request.start_time else request.start_time
            songs = db.query(
                "select distinct song.songID, title, releaseDate from song natural join artistperformssong natural join artist natural join userfanofartist  "
                "where userfanofartist.username = %s and releaseDate > %s",
                [request.username, query_date])
            # search for each new song's artists and genres
            for song in songs["result"]:
                artists = db.query(
                    "select distinct artistID,fname, lname from artist natural join artistperformssong natural join song where song.songID = %s",
                    [song["songID"]])["result"]
                artists_list = [(artist["fname"] or "") + " " + (artist["lname"] or "") for artist in artists]
                genres = db.query("select genre from songgenre natural join song where songID=%s", [song["songID"]])[
                    "result"]
                genre_list = [genre["genre"] for genre in genres]
                song["artist_list"] = artists_list
                song["genre_list"] = genre_list
            return {**songs}
        except Exception as e:
            logger.error("Unable to get new songs")
            logger.error(e)
            raise internalServerError.InternalServerError()
