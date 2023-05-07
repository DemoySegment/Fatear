from datetime import datetime

from pydantic import BaseModel
from errors import internalServerError
import logging
from db.main import Database

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("searchService")
logger.setLevel(logging.DEBUG)


class SearchRequest(BaseModel):
    title: str
    artist: str
    genre: str
    rating: str


class SearchService:
    def __init__(self, db: Database):
        self.db = db

    def search(self, request: SearchRequest):
        db = self.db
        try:
            main = "select songID, title, avg(stars) as avgrating  from song natural left join artistperformssong natural left join songgenre natural left join ratesong natural left join artist "
            con1 = "where " if len(request.title) > 0 else " "
            sub1 = "(title like %s ) " if len(request.title) > 0 else " "
            con2 = "and " if len(request.title) > 0 and len(request.artist) > 0 else " "
            con3 = "where " if len(request.title) <= 0 < len(request.artist) else " "
            sub2 = "(fname like %s or lname like %s or CONCAT(lname, ' ', fname) LIKE %s ) " if len(
                request.artist) > 0 else " "
            con4 = "and " if (len(request.artist) > 0 or len(request.title) > 0) and len(request.genre) > 0 else " "
            con5 = "where " if len(request.artist) <= 0 < len(request.genre) and len(request.title) <= 0 else " "
            sub3 = "(genre like %s ) " if len(request.genre) > 0 else " "
            sub4 = " group by songID, title "
            sub5 = "having avgrating > %s" if len(request.rating) > 0 else " "

            query = main + con1 + sub1 + con2 + con3 + sub2 + con4 + con5 + sub3 + sub4 + sub5
            logger.error(query)

            params = []
            if len(request.title) > 0:
                params.append("%" + request.title + "%")
            if len(request.artist) > 0:
                params.append("%" + request.artist + "%")
                params.append("%" + request.artist + "%")
                params.append("%" + request.artist + "%")
            if len(request.genre) > 0:
                params.append("%" + request.genre + "%")
            if len(request.rating) > 0:
                params.append(request.rating)
            logger.error(params)

            result = db.query(query,
                              params)

            for song in result["result"]:
                artists = db.query(
                    "select distinct artistID,fname, lname from artist natural join artistperformssong natural join song where song.songID = %s",
                    [song["songID"]])["result"]
                artists_list = [(artist["fname"] or "") + " " + (artist["lname"] or "") for artist in artists]
                song["artist_list"] = artists_list

            return {**result}
        except Exception as e:
            logger.error("Unable to search for songs")
            logger.error(e)
            raise internalServerError.InternalServerError()
