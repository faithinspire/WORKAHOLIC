@echo off
cd c:\Users\OLU\FAITHJOBS

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Adding GitHub remote...
    git remote add origin https://github.com/faithinspire/WORKAHOLIC.git
) else (
    echo Updating GitHub remote...
    git remote set-url origin https://github.com/faithinspire/WORKAHOLIC.git
)

REM Add all files
echo Adding all files to git...
git add .

REM Create initial commit if needed
git status --porcelain >nul 2>&1
if not errorlevel 1 (
    echo Committing changes...
    git commit -m "FaithJobs - Complete application with all fixes and rebuilt pages"
)

REM Set main branch
echo Switching to main branch...
git branch -M main

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main --force

echo Done! Your code is now on GitHub at:
echo https://github.com/faithinspire/WORKAHOLIC

pause
