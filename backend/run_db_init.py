import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now import and run the db_init module
from app.db_init import *

if __name__ == "__main__":
    print("Database initialization completed.")
