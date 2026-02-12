# 🚀 How to Push Updates to Your Live Website

## Quick Summary
Since you're using Railway (backend) + Vercel (frontend), updates are automatic when you push to GitHub! Here's how:

---

## Step-by-Step Update Process

### 1. Make Sure You Have Git Initialized

If you haven't already connected your project to GitHub:

```bash
cd cigar-lounge-app

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Major update: 60% bookshelf, custom spines, simplified animations"

# Add your GitHub repo (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/cigar-lounge-library.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. If Git Is Already Set Up

Simply run these three commands from your project folder:

```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "Update: custom book spines, share library feature, improved UI"

# Push to GitHub
git push
```

---

## What Happens Automatically

### Railway (Backend) ⚙️
1. Detects the push to GitHub
2. Automatically rebuilds your API
3. Redeploys with zero downtime
4. Usually takes 1-2 minutes

**To monitor:**
- Go to https://railway.app
- Click on your project
- Watch the "Deployments" tab

### Vercel (Frontend) 🎨
1. Detects the push to GitHub
2. Automatically builds your React app
3. Deploys to production
4. Usually takes 2-3 minutes

**To monitor:**
- Go to https://vercel.com
- Click on your project
- Watch the deployment progress

---

## Important: Database Changes

Since we added new fields to the book schema, existing books won't have these fields. This is fine! The defaults will apply:

- `spineColor`: defaults to #8b4513 (brown)
- `fontColor`: defaults to #f4e8d0 (cream)
- `publishedDate`: will show as empty for old books
- `dateRead`: will show as empty for old books

New books will have all these fields.

---

## Verifying the Update

### Check Backend (Railway)
```bash
# Test the health endpoint
curl https://your-app.up.railway.app/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Check Frontend (Vercel)
1. Visit your Vercel URL
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. You should see:
   - Bookshelf is now 60% of screen
   - Simplified window scene
   - "SHARE MY LIBRARY" and "INVITE FRIENDS" buttons
   - When adding books, spine customization options

---

## Troubleshooting

### Problem: "My changes aren't showing"

**Solution 1: Clear browser cache**
```
Chrome/Edge: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
Firefox: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
Safari: Cmd+Option+E
```

**Solution 2: Hard refresh**
```
Chrome: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
```

**Solution 3: Check Vercel deployment**
- Go to https://vercel.com → your project
- Make sure latest deployment is "Ready"
- Click on the deployment to see build logs

### Problem: "Books aren't saving with custom colors"

**Check Railway logs:**
1. Go to https://railway.app
2. Click your project → your service
3. Click "Deployments" → latest deployment
4. Check logs for errors

**Common fix:** Make sure the new fields are in your backend schema (they should be after this update)

### Problem: "Getting 404 errors on API calls"

**Check these:**
1. Railway service is running (green dot)
2. VITE_API_URL in Vercel matches your Railway URL exactly
3. No typos in the URL

**To update Vercel environment variable:**
1. Go to vercel.com → your project
2. Settings → Environment Variables
3. Edit VITE_API_URL
4. Redeploy (Deployments → ... → Redeploy)

---

## Testing New Features

### 1. Custom Book Spines
1. Click "+ ADD BOOK"
2. Search for any book
3. Select it
4. Scroll down to "SPINE CUSTOMIZATION"
5. Pick colors
6. See preview
7. Save

### 2. Share My Library
1. Click "SHARE MY LIBRARY" button
2. Link is copied
3. Open in incognito/private window
4. Should see your books (read-only)

### 3. Invite Friends
1. Click "INVITE FRIENDS" button  
2. Send link to someone
3. They can sign up through your link

### 4. Extended Book Info
1. Click any book spine
2. Should see:
   - Page count
   - Published date
   - Date read
   - ISBN

---

## Advanced: Environment Variables

If you need to change environment variables:

### Vercel (Frontend)
```bash
# Or via Vercel dashboard:
# 1. Project Settings → Environment Variables
# 2. Add/Edit variables
# 3. Redeploy
```

### Railway (Backend)
```bash
# Via Railway dashboard:
# 1. Your project → Service → Variables tab
# 2. Add/Edit variables
# 3. Railway auto-redeploys
```

---

## Rolling Back (If Needed)

### If something breaks:

**Vercel:**
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

**Railway:**
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → Redeploy

**Git:**
```bash
# See commit history
git log --oneline

# Revert to previous commit
git revert HEAD

# Push
git push
```

---

## Update Checklist

Before pushing updates, make sure:

- [ ] Code runs locally (`npm run dev`)
- [ ] No console errors in browser
- [ ] Backend runs locally (`cd api && npm run dev`)
- [ ] All new features tested
- [ ] Git commit message is descriptive
- [ ] `.env` files not committed (they're in `.gitignore`)

---

## Need Help?

1. **Check deployment logs** in Railway and Vercel
2. **Check browser console** (F12 → Console tab)
3. **Verify environment variables** are set correctly
4. **Clear browser cache** and try again

---

## Summary of This Update

**What Changed:**
- ✅ Bookshelf now 60% of screen
- ✅ Simplified window scene (just background)
- ✅ Custom book spine colors (per book)
- ✅ Custom font colors (per book)
- ✅ Date read tracking
- ✅ Extended book metadata (published date, etc.)
- ✅ "Share My Library" button (public link)
- ✅ "Invite Friends" button (renamed from Share)
- ✅ Better book covers (Google Books API)
- ✅ Simplified, smooth animations
- ✅ Book titles wrap on spine (no overflow)

**What Was Removed:**
- ❌ Time-of-day changing scenes
- ❌ All furniture and decorations
- ❌ Complex 3D animations
- ❌ Multiple animation keyframes

**Commands to Deploy:**
```bash
git add .
git commit -m "Major UI overhaul with custom spines"
git push
```

Then wait 3-5 minutes for automatic deployment! 🎉

---

**Your site will automatically update within 5 minutes of pushing to GitHub!**
