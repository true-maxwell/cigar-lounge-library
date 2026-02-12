# 🚀 Simple Deployment Guide

## Deploy Your Cigar Lounge Library Online in 15 Minutes!

This guide will help you deploy your app to the internet **completely free** using Vercel (frontend) and Railway (backend + database).

---

## What You'll Need

1. A GitHub account (to store your code)
2. A Vercel account (for the website)
3. A Railway account (for the backend and database)

All three are **free** for hobby projects!

---

## Step 1: Push Your Code to GitHub

1. Go to https://github.com and sign in (or create an account)

2. Click the "+" button (top right) → "New repository"

3. Name it: `cigar-lounge-library`

4. Click "Create repository"

5. On your computer, in the `cigar-lounge-app` folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cigar-lounge-library.git
git push -u origin main
```

(Replace YOUR_USERNAME with your GitHub username)

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account

1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway

### 2.2 Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `cigar-lounge-library`

### 2.3 Add MongoDB Database

1. In your Railway project, click "+ New"
2. Select "Database"
3. Choose "Add MongoDB"
4. Railway will create a MongoDB database automatically!

### 2.4 Configure Backend Service

1. Click on your `cigar-lounge-library` service (not the MongoDB)

2. Go to "Settings" tab:
   - Find "Root Directory"
   - Enter: `api`
   - Click "Save"

3. Go to "Variables" tab:
   - Click "New Variable"
   - Add: `JWT_SECRET` = `your-super-secret-random-string-12345`
   - (Make up your own secure random string!)
   
   Note: MONGODB_URI is automatically added by Railway!

4. Go to "Settings" tab again:
   - Find your service URL (it looks like: `your-app-name.up.railway.app`)
   - **COPY THIS URL** - you'll need it for Vercel!

5. Click "Deploy" if it doesn't deploy automatically

### 2.5 Wait for Deployment

Watch the logs. When you see "Server running on port XXXX", it's live! ✅

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up" → Sign in with GitHub
3. Authorize Vercel

### 3.2 Import Project

1. Click "New Project"
2. Find `cigar-lounge-library` in the list
3. Click "Import"

### 3.3 Configure Environment Variable

**IMPORTANT STEP:**

1. Before clicking "Deploy", expand "Environment Variables"

2. Add this variable:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-RAILWAY-URL.up.railway.app`
   - (Use the Railway URL from Step 2.4!)

3. Click "Deploy"

### 3.4 Wait for Deployment

Vercel will build and deploy your app (takes ~2 minutes).

When done, you'll get a URL like: `https://cigar-lounge-library.vercel.app`

---

## Step 4: Test Your App!

1. Visit your Vercel URL
2. Create an account
3. Add a book
4. Admire your cozy pixel art library! 🎉

---

## Common Issues & Fixes

### ❌ "Cannot connect to backend"

**Fix:** 
1. Go to Railway → Your service → Variables
2. Make sure all environment variables are set
3. Check if service is running (green dot)
4. Copy the Railway URL again and update VITE_API_URL in Vercel

### ❌ Books not loading

**Fix:**
1. Open browser console (F12)
2. Check for errors
3. Make sure you're logged in
4. Try refreshing the page

### ❌ "Database connection failed"

**Fix:**
1. Go to Railway → MongoDB service
2. Make sure it's running
3. Railway should auto-connect it to your backend

### ❌ Share link doesn't work

**Fix:**
- Share links have format: `your-app.vercel.app/share/USER_ID`
- Make sure you copy the full link from the Share button

---

## Updating Your App

Made changes to the code? Easy:

1. **Commit and push to GitHub:**
```bash
git add .
git commit -m "Your update message"
git push
```

2. **Railway and Vercel will auto-deploy!**
   - Both platforms watch your GitHub repo
   - They automatically rebuild when you push changes
   - No extra steps needed!

---

## Free Tier Limits

### Vercel (Frontend)
- ✅ 100GB bandwidth/month
- ✅ Unlimited projects
- ✅ Perfect for personal use!

### Railway (Backend + Database)
- ✅ $5 free credit/month
- ✅ ~500 hours runtime (enough for hobby projects)
- ✅ 1GB database storage

**Bottom line:** Your app will run free as long as you don't get massive traffic!

---

## Need Help?

If something isn't working:

1. Check the deployment logs in Railway/Vercel
2. Make sure all environment variables are set correctly
3. Verify your GitHub repository has all the code
4. Try redeploying from Railway/Vercel dashboard

---

## Optional: Custom Domain

Want `mylibraryapp.com` instead of `.vercel.app`?

1. Buy a domain (Google Domains, Namecheap, etc.)
2. In Vercel, go to Settings → Domains
3. Follow their instructions to connect it

---

**That's it! Your library is now live on the internet! 🎉📚**

Share your library URL with friends using the Share button in the app.
