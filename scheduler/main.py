from fastapi import FastAPI
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from database import Base, engine, SessionLocal
from config import settings
from utils import proceess_fire_data
import httpx


# This command creates the database tables based on models. Create if table DNE else nothing happens
Base.metadata.create_all(bind=engine)

jobstores = { 'default': SQLAlchemyJobStore(url=settings.DATABASE_URL) }
scheduler = AsyncIOScheduler(jobstores=jobstores, timezone="UTC")

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start() # start the scheduler
    yield
    scheduler.shutdown()  # shutdown the scheduler

app = FastAPI(lifespan=lifespan)


# ************************************************************************* #
# Scheduler Application that Polls the API every 5 minutes


# poll date from the api every 5 minutes
@scheduler.scheduled_job('interval', seconds=30, id="poll-from-api")
async def poll_from_api():
    db = SessionLocal()
    try:
        async with httpx.AsyncClient() as client:
            # get the json string response from API
            res = await client.get(settings.API_URL)

            # throw exception if there is a Http Status Error
            res.raise_for_status()

            # load json string into a python object
            incidents = res.json()

            for fire in incidents:
                proceess_fire_data(fire, db)

            db.commit()

    except httpx.HTTPStatusError as e:
       print(f"HTTP Error: received error code {e.response.status_code}") 
       db.rollback()
    except httpx.RequestError as e:
        print(f"Network Error: could not connect to the API at {e.request.url}.")
        db.rollback()
    except Exception as e:
        print(f"Unexpected error occurred: {e}")
        db.rollback()
    finally:
        print("job done. closing db noe")
        db.close()
        