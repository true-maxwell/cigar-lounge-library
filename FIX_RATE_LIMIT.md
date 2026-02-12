# 🚨 Fix: Google Books Rate Limit (429 Error)

## The Problem
```
Google Books API error: 429 Too Many Requests
```

Google Books limits free API calls to 1000/day without an API key. You've hit that limit.

## ✅ The Solution: Get a Free API Key

With an API key, you get **1,000 requests per day PER USER** - much better!

---

## 🔑 Step-by-Step: Get Your API Key

### Step 1: Go to Google Cloud Console
https://console.cloud.google.com/

### Step 2: Create a Project
1. Click **"Select a project"** (top bar)
2. Click **"New Project"**
3. Name: `Cigar Lounge Library`
4. Click **"Create"**
5. Wait 10 seconds, then click **"Select Project"**

### Step 3: Enable Books API
1. Click **"☰ Menu"** (hamburger icon top left)
2. Go to **"APIs & Services"** → **"Library"**
3. Search for: `Books API`
4. Click on **"Books API"**
5. Click **"Enable"**

### Step 4: Create API Key
1. Click **"☰ Menu"** → **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** (top)
3. Choose **"API Key"**
4. **Copy the API key!** (looks like `AIzaSyB1234...`)
5. Click **"Restrict Key"** (recommended)
   - API restrictions → Select APIs → Choose **"Books API"**
   - Click **"Save"**

### Step 5: Add to Railway
1. Go to https://railway.app
2. Click your **backend service**
3. Click **"Variables"** tab
4. Click **"New Variable"**
5. Name: `GOOGLE_BOOKS_API_KEY`
6. Value: Paste your API key
7. Click **"Add"**

Railway will auto-redeploy (2-3 minutes).

### Step 6: Deploy Updated Code
```bash
cd cigar-lounge-app
git add .
git commit -m "Add Google Books API key support"
git push
```

---

## ✅ Verify It Works

### Test Endpoint
After deployment, visit:
```
https://your-backend.up.railway.app/api/test-google-books
```

You should see:
```json
{
  "success": true,
  "hasApiKey": true,  ← This should be true!
  "itemsFound": 3,
  "firstBook": {
    "title": "Harry Potter...",
    ...
  }
}
```

If `hasApiKey: false`, the environment variable didn't save. Try again.

### Test on Your Site
1. Go to your Vercel site
2. Click "+ ADD BOOK"
3. Search "Harry Potter"
4. **Should see 10 results!**

---

## 📊 API Key Limits

**Without API Key:**
- 1000 requests/day total (shared by everyone)
- Easy to hit limit ❌

**With API Key:**
- 1000 requests/day per user ✅
- Tracked per API key
- Free forever
- More than enough for personal use

**Need more?**
- Upgrade to paid plan (unlikely needed)
- Or create multiple projects with different keys

---

## 🐛 Troubleshooting

### "API key not valid"
- Make sure you enabled **Books API** in Google Cloud
- Make sure you **restricted the key** to Books API only
- Wait 5 minutes after creating (can take time to propagate)

### Still getting 429 errors
- Check Railway logs to confirm key is being used:
```
Using API key: Yes
```
- If it says "No", the environment variable isn't set
- Make sure variable name is exactly: `GOOGLE_BOOKS_API_KEY`

### "hasApiKey: false" in test endpoint
- Environment variable not saved in Railway
- Go to Railway → Variables → Check it's there
- Try deleting and re-adding it
- Redeploy manually if needed

---

## 💡 Alternative: Wait 24 Hours

If you don't want to get an API key right now:
- Wait 24 hours
- The rate limit resets at midnight UTC
- You'll get another 1000 free requests

But getting the API key is **highly recommended** - it takes 5 minutes and solves the problem permanently!

---

## 🎯 Quick Summary

1. Get API key from Google Cloud Console (5 min)
2. Add to Railway as `GOOGLE_BOOKS_API_KEY` (1 min)
3. Push updated code (1 min)
4. Test and enjoy unlimited searches! ✅

---

**After this fix, you'll never hit the rate limit again! 🚀**
