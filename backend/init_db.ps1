# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Run the database initialization
python run_db_init.py

# Show completion message
Write-Host "
Database initialization completed successfully!"
