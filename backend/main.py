import json

from fastapi import FastAPI, Request
import uvicorn
import os
import logging
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from db.main import Database
from dotenv import load_dotenv

from service import authService, ratingService, reviewService, searchService, songService, userService
from service import followService
from service import friendService
from service import newsService
from service import recipeService

from errors.main import ExtendableError
from errors.internalServerError import InternalServerError
from errors.invalidToken import InvalidJwtError
from errors.userNotFound import UserNotFound
from service.followService import FollowRequest
from service.friendService import FriendRequest
from service.newsService import NewsRequest
from service.ratingService import GetRatingRequest, RatingRequest
from service.reviewService import GetReviewRequest, ReviewRequest
from service.searchService import SearchRequest
from service.songService import SongRequest
from service.userService import UserRequest

load_dotenv()

app = FastAPI(debug=True)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("logger")
logger.setLevel(logging.DEBUG)

# Add allowed origins, methods, and headers
origins = ["http://localhost", "http://localhost:3000"]

# Create the middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = Database()

AuthService = authService.AuthService(db)
RecipeService = recipeService.RecipeService(db)
SongService = songService.SongService(db)
FollowService = followService.FollowService(db)
FriendService = friendService.FriendService(db)
NewsService = newsService.NewsService(db)
RatingService = ratingService.RatingService(db)
ReviewService = reviewService.ReviewService(db)
SearchService = searchService.SearchService(db)
UserService = userService.UserService(db)


@app.post("/signup")
async def signupHandler(registrationData: authService.UserRegistration):
    logger.debug("thi")
    try:

        user = AuthService.registerUser(registrationData)
        return user
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/login")
async def loginHandler(loginData: authService.LoginForm):
    try:
        user = AuthService.login(loginData)
        return user
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


# for test
@app.post("/")
def read_root():
    return {"Hello": "World"}


@app.middleware("http")
async def AuthMiddleWare(request: Request, call_next):
    try:

        if request.url.path not in ['/', '/signup', '/login', '/getNewSongs', '/song', '/search/searchSongs'] and request.method == "POST":
            authHeader = request.headers.get('authorization')

            if authHeader is None:
                logger.debug(authHeader)
                raise InvalidJwtError()
            tokenizedHeader = authHeader.split(' ')
            if len(tokenizedHeader) != 2:
                raise InvalidJwtError()
            token = tokenizedHeader[1]
            user = AuthService.getUserFromToken(token)
            request.state.user = user
        response = await call_next(request)
        return response
    except Exception as e:
        if not isinstance(e, ExtendableError):
            ex = InternalServerError()
            return JSONResponse(
                status_code=int(ex.code),
                content={'info': ex.info, 'code': int(ex.code), 'name': ex.name}
            )
        return JSONResponse(
            status_code=int(e.code),
            content={'info': e.info, 'code': int(e.code), 'name': e.name}
        )


@app.get("/user")
async def getUser(request: Request):
    try:
        if (request.state.user == None):
            raise UserNotFound()
        return request.state.user
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/recipe")
async def postRecipe(request: Request, recipeToAdd: recipeService.InsertRecipe):
    try:
        postedBy = request.state.user['userName']
        recipeToAdd.postedBy = postedBy
        postedRecipe = RecipeService.insertRecipe(recipeToAdd)
        return postedRecipe
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/getNewSongs")
async def get_new_songs(request: Request):
    try:

        result = SongService.get_new_songs(5)
        return result
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/friend/search")
async def search_friends(request: Request, data: FriendRequest):
    try:
        result = FriendService.get_user_list(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/friend/getRequestsTo")
async def get_requests_to(request: Request, user: UserRequest):
    try:
        result = FriendService.get_requests_to(user)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/friend/getRequestsBy")
async def get_requests_by(request: Request, user: UserRequest):
    try:
        result = FriendService.get_requests_by(user)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/friend/getFriends")
async def get_friends(request: Request, user: UserRequest):
    try:
        result = FriendService.get_friends(user)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/friend/friendRequest")
async def new_friend_request(request: Request, friend_request: friendService.FriendRequest):
    try:
        logger.error(friend_request)
        result = FriendService.new_friend_request(friend_request)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/friend/acceptFriendRequest")
async def accept_friend_request(request: Request, friend_request: friendService.FriendRequest):
    try:
        result = FriendService.accept_friend_request(friend_request)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/friend/rejectFriendRequest")
async def reject_friend_request(request: Request, friend_request: friendService.FriendRequest):
    try:
        result = FriendService.reject_friend_request(friend_request)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/follow/search")
async def search_follow(request: Request, data: FollowRequest):
    try:
        result = FollowService.get_user_list(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/follow/getFollower")
async def get_follower(request: Request, data: UserRequest):
    try:
        result = FollowService.get_follower(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/follow/newFollow")
async def new_follow(request: Request, data: FollowRequest):
    try:
        result = FollowService.follow(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/song/{songID}")
async def get_song_detail(request: Request, songID: str):
    try:
        para_dict = {"songID": songID}
        result = SongService.get_song_detail(SongRequest(**para_dict))
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/song/getMyRating")
async def get_song_detail(request: Request, data: GetRatingRequest):
    try:
        result = RatingService.get_my_song_rating(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/song/getMyReview")
async def get_song_detail(request: Request, data: GetReviewRequest):
    try:
        result = ReviewService.get_my_song_review(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/song/postSongRate")
async def post_song_rate(request: Request, data: RatingRequest):
    try:
        result = RatingService.post_song_rating(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/song/postSongReview")
async def post_song_rate(request: Request, data: ReviewRequest):
    try:
        result = ReviewService.post_song_review(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/news/getSubscribedSongs")
async def get_subscribed_songs(request: Request, data: NewsRequest):
    try:
        result = NewsService.get_songs_of_following_artist(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/news/getFriendReview")
async def get_friend_review(request: Request, data: NewsRequest):
    try:
        result = NewsService.get_friend_post(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/news/getFollowerReview")
async def get_follower_review(request: Request, data: NewsRequest):
    try:
        result = NewsService.get_follower_post(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e

@app.post("/search/searchSongs")
async def get_follower_review(request: Request, data: SearchRequest):
    try:
        result = SearchService.search(data)
        return result
    except Exception as e:
        logger.debug(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.exception_handler(ExtendableError)
async def exceptionHandler(request: Request, exc: ExtendableError):
    return JSONResponse(
        status_code=int(exc.code),
        content={'info': exc.info, 'code': int(exc.code), 'name': exc.name}
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=int(os.environ['PORT']), reload=True, workers=1, loop="asyncio",
                log_level="debug")  # Enable debug mode for auto-reloading
