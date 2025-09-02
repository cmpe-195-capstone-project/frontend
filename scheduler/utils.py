from datetime import datetime
from sqlalchemy.orm import Session
from database import FireData

# list of valid formats for santa clara county
valid_county = ["Santa Clara", "Santa Clara County", "County of Santa Clara", "SCC", "SCL"]

# function to parse datetime strings from the API.
def parse_datetime(date_string: str | None) -> datetime | None:
    if not date_string:
        return None

    # handle the 'Z' for UTC timezone 
    if date_string.endswith('Z'):
        date_string = date_string[:-1] + '+00:00'
    return datetime.fromisoformat(date_string)


def proceess_fire_data(fire: dict, db: Session):
    try:
        # make sure to only look at data from Santa Clara County
        if fire.get("County") not in valid_county:
            return

        # db.merge() function handles either creating a new record or updating an existing one based on the primary key (id).
        fire_instance = FireData(
            id=fire.get("UniqueId"),
            name=fire.get("Name", "N/A"),
            location=fire.get("Location", "N/A"),
            county=fire.get("County", "N/A"),
            is_active=fire.get("IsActive", False),
            final=fire.get("Final", False),
            updated_datetime=parse_datetime(fire.get("Updated")),
            start_datetime=parse_datetime(fire.get("Started")),
            extinguished_datetime=parse_datetime(fire.get("ExtinguishedDate")),
            start_date=parse_datetime(fire.get("StartedDateOnly")),
            acres_burned=float(fire.get("AcresBurned", 0.0)),
            percent_contained=float(fire.get("PercentContained", 0.0)),
            latitude=float(fire.get("Latitude", 0.0)),
            longitude=float(fire.get("Longitude", 0.0)),
            fire_type=fire.get("Type", "Unknown"),
            control_statement=fire.get("ControlStatement"),
            url=fire.get("Url"),
        )

        db.merge(fire_instance)

    except (ValueError, TypeError) as e:
        # TODO: Handle this better
        print(f"Skipping record due to data error: {e} - ID: {fire.get('UniqueId')}")
