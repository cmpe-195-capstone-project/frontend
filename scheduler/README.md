## Docker Setup
### 1. Create .env File In Project's Root Directory
```shell 
touch .env
```

### 2. Add Image Tag
```
SCHEDULER_TAG=1.0.2
```
- Open `.env` file and add the line above. This tells Docker Compose which version of the scheduler image to pull from Docker Hub
- **Note**: `1.0.2` is the current version of the scheduler. You can see all versions on [Docker Hub](https://hub.docker.com/r/carlosqmv/ember-alert-scheduler)


### 3. Build & Run Docker Containers
- **Make sure to download docker first**
- Run the following command from the project's root directory. This will build the images, create a Docker network & start the containers in the background

```shell
docker compose up --build -d
```
- **Note**: This command is for the initial setup. For other uses, stop and restart the environment with `docker compose stop` and `docker compose start`



## Running Local Server with Dockarized DB (Optional)

### 1. Create & Start Postgres Container 
```shell
docker run --name my-postgres -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres:17
```
- **Note**: This command is for the initial setup. See [Useful Docker Commands](#useful-docker-commands) for how to **start** and **stop** existing containers

#### Using Postgres Shell Interface For Viewing Data
```shell
docker exec -it my-postgres psql -U postgres
```
> Link for useful [PSQL commands](https://www.geeksforgeeks.org/postgresql-psql-commands/)


---


### 2. Create Virtual Environment
```shell
python3 -m venv venv
```

### 3. Activate Virtual Environment
- **On Mac/Linux:**
```shell
source venv/bin/activate
```

- **On Windows:**
```shell
venv\Scripts\activate
```
> To turn off virtual environment run `deactivate` on terminal

### 4. Install Dependencies
```shell
pip install -r requirements.txt
```

### 5. Adding Environment Variables
- Ensure a `.env` file is present in the root directory
- Add the following lines to `.env` file
```
API_URL=https://incidents.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=true

DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
```

### 5. Run FastAPI app
```shell
uvicorn main:app --reload --port 7070
```

---


### Useful Docker Commands 
| Action                             | Command                                                                                   |
|------------------------------------|-------------------------------------------------------------------------------------------|
| Create & start postgres container  | `docker run --name my-postgres -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres:17` |
| Enter PSQL service                 | `docker exec -it my-postgres psql -U postgres`                                            |
| Stop Docker Container              | `docker stop [container-name]`                                                            |
| Start Docker Container             | `docker start [container-name]`                                                           |
| View All Docker Containers         | `docker ps -a`                                                                            |
| View All Running Docker Containers | `docker ps`                                                                               |
| Build a Docker Image               | `docker build -f Dockerfile -t [docker-image]:[tagname]`                                  |
| Push Docker Image to Docker Hub    | `docker push [docker-image]:[tagname]`                                                    |
| Docker Compose                     | `docker compose --build -d`                                                               |