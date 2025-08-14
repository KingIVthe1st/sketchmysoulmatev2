@echo off
echo 🚀 Deploying TrendMaster to Vercel...
echo ======================================

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please log in to Vercel...
    echo This will open a browser window for authentication.
    vercel login
)

echo 🌐 Deploying to Vercel...
echo This will create a new project and deploy your app.

REM Deploy to Vercel
vercel --prod --yes

echo.
echo 🎉 Deployment complete!
echo.
echo Your app is now live on Vercel!
echo Check the output above for your live URL.
echo.
echo Next steps:
echo 1. Set up your backend on Render (see DEPLOYMENT.md)
echo 2. Update the API URL in your Vercel project settings
echo 3. Test your live application!
pause
