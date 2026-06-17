@echo off
REM FaithJobs Startup Script
REM This script installs dependencies and starts both servers

echo.
echo ========================================
echo       FaithJobs - Starting Servers
echo ========================================
echo.

REM Check if node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js is installed

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo ✓ npm is installed

REM Install backend dependencies
echo.
echo [1/4] Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed

REM Install frontend dependencies
echo.
echo [2/4] Installing frontend dependencies...
pushd client
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed!
    popd
    pause
    exit /b 1
)
popd
echo ✓ Frontend dependencies installed

echo.
echo [3/4] Starting Backend Server (Port 5000)...
echo Press Ctrl+C to stop servers
echo.

REM Start backend in a new window
start "FaithJobs Backend" cmd /k npm start

timeout /t 3 /nobreak

echo.
echo [4/4] Starting Frontend Server (Port 3000)...
echo.

REM Start frontend in a new window
pushd client
start "FaithJobs Frontend" cmd /k npm start
popd

echo.
echo ========================================
echo  ✓ FaithJobs is Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Test Accounts:
echo   Job Seeker: teacher@example.com / teacher123
echo   Recruiter:  recruiter@example.com / recruiter123
echo.
pause
