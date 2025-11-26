import uvicorn
import os
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.absolute()))
# Add the backend directory to the Python path
backend_dir = str(Path(__file__).parent.absolute())
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

if __name__ == "__main__":
    # Set the working directory to the backend directory
    os.chdir(backend_dir)
    
    # Run the FastAPI app
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"],
        workers=1
    )
