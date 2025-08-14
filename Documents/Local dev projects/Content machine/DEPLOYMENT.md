# 🚀 Deployment Guide - Render

This guide will walk you through deploying your TrendMaster application to Render for free hosting.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub (✅ Already done!)
2. **Render Account**: Sign up at [render.com](https://render.com) (free)
3. **API Keys**: You'll need your OpenAI API key at minimum

## 🎯 Deployment Steps

### Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click "Get Started" and sign up with your GitHub account
3. Authorize Render to access your repositories

### Step 2: Deploy Using Blueprint (Recommended)

1. **Click "New +"** in your Render dashboard
2. **Select "Blueprint"** from the options
3. **Connect your GitHub repository**:
   - Select `KingIVthe1st/contentmachinev1`
   - Render will automatically detect the `render.yaml` file

4. **Configure Environment Variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key (required)
   - `NEWSAPI_KEY`: NewsAPI key (optional)
   - `TWITTER_BEARER_TOKEN`: Twitter API key (optional)
   - `REDDIT_CLIENT_ID`: Reddit API key (optional)
   - `REDDIT_CLIENT_SECRET`: Reddit API secret (optional)

5. **Click "Apply"** to start deployment

### Step 3: Manual Deployment (Alternative)

If Blueprint doesn't work, deploy services manually:

#### Backend Service
1. **New +** → **Web Service**
2. **Connect Repository**: `KingIVthe1st/contentmachinev1`
3. **Settings**:
   - **Name**: `trendmaster-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free

4. **Environment Variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FLASK_ENV`: `production`
   - `SECRET_KEY`: Generate a random string

#### Database
1. **New +** → **PostgreSQL**
2. **Settings**:
   - **Name**: `trendmaster-db`
   - **Plan**: Free
   - **Database**: `trendmaster`
   - **User**: `trendmaster_user`

3. **Copy the connection string** and add it to your backend service as `DATABASE_URL`

#### Frontend Service
1. **New +** → **Static Site**
2. **Connect Repository**: `KingIVthe1st/contentmachinev1`
3. **Settings**:
   - **Name**: `trendmaster-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

4. **Environment Variables**:
   - `REACT_APP_API_URL`: Your backend service URL (e.g., `https://trendmaster-backend.onrender.com`)

## 🔧 Post-Deployment Configuration

### 1. Update Frontend API URL
After backend deployment, update the frontend environment variable:
- Go to your frontend service in Render
- Add/update `REACT_APP_API_URL` with your backend URL
- Redeploy the frontend

### 2. Test Your Application
1. **Backend**: Test API endpoints at `https://your-backend-name.onrender.com`
2. **Frontend**: Access your app at `https://your-frontend-name.onrender.com`

### 3. Database Setup
The database will be automatically created when you first use the app.

## 🌐 Custom Domain (Optional)

1. **Add Custom Domain** in your Render service settings
2. **Configure DNS** with your domain provider
3. **SSL Certificate** is automatically provided by Render

## 📊 Monitoring & Logs

- **Logs**: Available in each service's dashboard
- **Metrics**: Basic metrics provided for free
- **Uptime**: Monitor service health

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Verify all dependencies are in `requirements.txt`
   - Ensure Python version compatibility

2. **API Errors**:
   - Verify environment variables are set correctly
   - Check backend logs for errors
   - Ensure database connection is working

3. **Frontend Not Loading**:
   - Verify `REACT_APP_API_URL` is correct
   - Check build logs for errors
   - Ensure all dependencies are installed

### Getting Help:
- Check Render's [documentation](https://render.com/docs)
- Review service logs in Render dashboard
- Check GitHub issues for similar problems

## 💰 Cost Breakdown

**Free Tier Includes:**
- **Backend**: 750 hours/month (usually sufficient for personal use)
- **Database**: 90 days free trial, then $7/month
- **Frontend**: Unlimited (static hosting)
- **Bandwidth**: 100GB/month

**Upgrade Options:**
- **Backend**: $7/month for more hours
- **Database**: $7/month after trial
- **Custom Domains**: Free with paid plans

## 🔄 Continuous Deployment

Render automatically redeploys when you push to your main branch:
1. Push changes to GitHub
2. Render detects changes
3. Automatic build and deployment
4. Zero downtime updates

## 📱 Final URLs

After deployment, you'll have:
- **Frontend**: `https://your-app-name.onrender.com`
- **Backend API**: `https://your-backend-name.onrender.com`
- **Database**: Managed by Render

## 🎉 Success!

Your TrendMaster app is now live and accessible from anywhere in the world! 

**Next Steps:**
1. Test all functionality
2. Share your app URL
3. Monitor performance
4. Scale up if needed

---

**Need Help?** Check the troubleshooting section or Render's support documentation.
