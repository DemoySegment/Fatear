from datetime import datetime

from pydantic import BaseModel
from errors import internalServerError
import logging
from db.main import Database

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("songService")
logger.setLevel(logging.DEBUG)


class SongRequest(BaseModel):
    songID: str


class SongService:
    def __init__(self, db: Database):
        self.Database = db

    def get_new_songs(self, num: int):
        db = self.Database
        try:
            request_result = db.query("select * from song order by releaseDate desc limit %s", [num])
            for song in request_result["result"]:
                artists = db.query(
                    "select distinct artistID,fname, lname from artist natural join artistperformssong natural join song where song.songID = %s",
                    [song["songID"]])["result"]
                artists_list = [(artist["fname"] or "") + " " + (artist["lname"] or "") for artist in artists]
                song["artist_list"] = artists_list

            # same as return friend_request.dict()
            return {

                **request_result
            }
        except Exception as e:
            logger.debug("Unable to get new songs")
            logger.debug(e)
            raise internalServerError.InternalServerError()

    def get_song_detail(self, data: SongRequest):
        db = self.Database
        try:
            request_result = db.query("select * from song where songID = %s", [data.songID])
            for song in request_result["result"]:
                artists = db.query(
                    "select distinct artistID,fname, lname from artist natural join artistperformssong natural join song where song.songID = %s",
                    [song["songID"]])["result"]
                artists_list = [(artist["fname"] or "") + " " + (artist["lname"] or "") for artist in artists]

                genres = db.query("select genre from songgenre natural join song where songID=%s", [song["songID"]])[
                    "result"]
                genre_list = [genre["genre"] for genre in genres]

                avg_rating = db.query("select  avg(stars) as avg from song natural join ratesong where songID = %s",
                                      [song["songID"]])[
                    "result"]

                reviews = db.query("select *  from reviewsong natural join song where songID=%s", [song["songID"]])[
                    "result"]

                song["artist_list"] = artists_list
                song["genre_list"] = genre_list
                song["avg_rating"] = avg_rating
                song["reviews"] = reviews

            # same as return friend_request.dict()
            return {

                **request_result
            }
        except Exception as e:
            logger.debug("Unable to get a song detail")
            logger.debug(e)
            raise internalServerError.InternalServerError()
