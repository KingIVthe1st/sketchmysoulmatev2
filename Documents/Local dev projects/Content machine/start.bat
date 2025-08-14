@echo off
echo 🚀 Starting TrendMaster Application...
echo ======================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from template...
    copy env.example .env
    echo 📝 Please edit .env file with your API keys (especially OPENAI_API_KEY)
    echo Press Enter when ready to continue...
    pause
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 🐍 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🐍 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🌐 Starting the application...
echo.

REM Start backend in background
echo 🔧 Starting Flask backend...
start "Flask Backend" cmd /k "venv\Scripts\activate.bat && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo ⚛️  Starting React frontend...
cd frontend
start "React Frontend" cmd /k "npm start"
cd ..

echo.
echo 🎉 Application is starting up!
echo.
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔧 Backend API will be available at: http://localhost:5000
echo.
echo Both services are now running in separate windows.
echo Close the windows to stop the services.
echo.
pause
