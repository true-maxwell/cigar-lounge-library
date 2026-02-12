# 🔧 MongoDB Connection Error - Fix Guide

## The Error
```
MongoServerSelectionError: Socket 'connect' timed out
```

This means your backend can't connect to MongoDB.

---

## ✅ Solution 1: Fix Railway MongoDB (Fastest)

### Step 1: Check Your Services
1. Go to https://railway.app
2. Click your project
3. You should see **TWO services**:
   - `cigar-lounge-api` (or similar - your backend)
   - `MongoDB` (database icon)

**If you DON'T see MongoDB service:**
- Click **"New"** → **"Database"** → **"Add MongoDB"**
- Wait for it to deploy

### Step 2: Get MongoDB Connection String
1. Click on the **MongoDB service** (not your backend)
2. Click **"Variables"** tab
3. Look for one of these variables:
   - `MONGO_URL`
   - `DATABASE_URL`
   - `MONGOURL`
4. **Copy the entire value**

It looks like:
```
mongodb://mongo:4JK3nF8sKLp2@mongodb.railway.internal:27017
```

### Step 3: Update Backend Variable
1. Click on your **backend service** (the Node.js one)
2. Click **"Variables"** tab
3. Find `MONGODB_URI`
   - If it exists, click to edit it
   - If not, click **"New Variable"**
4. Set it to: **[MongoDB URL from step 2]/cigar-lounge**

Example:
```
mongodb://mongo:4JK3nF8sKLp2@mongodb.railway.internal:27017/cigar-lounge
```

**Key parts:**
- Use the full URL from MongoDB service
- Add `/cigar-lounge` at the end

### Step 4: Save and Redeploy
1. Click **"Add"** or **"Update"**
2. Railway will auto-redeploy
3. Watch the deployment logs
4. Look for: **"✅ Connected to MongoDB successfully!"**

---

## ✅ Solution 2: Use MongoDB Atlas (Alternative)

If Railway MongoDB doesn't work, use Atlas (free cloud):

### Step 1: Create Atlas Account
1. Go to https://cloud.mongodb.com/
2. Sign up (free)
3. Create an organization
4. Create a project: "Cigar Lounge"

### Step 2: Create Free Cluster
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Choose a cloud provider (AWS recommended)
4. Choose a region close to you
5. Cluster name: `Cluster0` (default is fine)
6. Click **"Create"**

### Step 3: Create Database User
1. Security Quickstart will appear
2. Create a username: `cigar-lounge-admin`
3. Create a password: **Save this!** (copy to notepad)
4. Click **"Create User"**

### Step 4: Allow Network Access
1. In the same quickstart, or go to **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. Confirm with **"0.0.0.0/0"**
5. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Database"**
2. Click **"Connect"** on your cluster
3. Choose **"Drivers"**
4. Copy the connection string:

```
mongodb+srv://cigar-lounge-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update Railway Backend
1. Replace `<password>` with your actual password
2. Add `/cigar-lounge` before the `?`:

```
mongodb+srv://cigar-lounge-admin:YourPassword123@cluster0.xxxxx.mongodb.net/cigar-lounge?retryWrites=true&w=majority
```

3. Go to Railway → Your backend service
4. Variables tab
5. Set `MONGODB_URI` to this connection string
6. Save

### Step 7: Redeploy
Railway will auto-redeploy and connect to MongoDB Atlas!

---

## ✅ Solution 3: Check Environment Variables

Make sure Railway backend has:

```
MONGODB_URI=mongodb://mongo:PASSWORD@mongodb.railway.internal:27017/cigar-lounge
JWT_SECRET=your-secret-key-here
PORT=3001
```

---

## 🔍 How to Check If It's Fixed

### Check Railway Logs:
1. Railway → Your backend service
2. Click **"Deployments"**
3. Click latest deployment
4. Look for:
   ```
   ✅ Connected to MongoDB successfully!
   Server running on port 3001
   ```

### Test the API:
```bash
curl https://your-backend-url.up.railway.app/api/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

---

## 🐛 Still Not Working?

### Debug Checklist:
- [ ] MongoDB service is running (green dot in Railway)
- [ ] Backend service is running (green dot in Railway)
- [ ] `MONGODB_URI` is set in backend variables
- [ ] Connection string has `/cigar-lounge` at the end
- [ ] No typos in the connection string
- [ ] If using Atlas: IP whitelist set to 0.0.0.0/0

### Get More Info:
Push the updated `server.js` with better error messages:

```bash
cd cigar-lounge-app
git add .
git commit -m "Add better MongoDB connection logging"
git push
```

Then check Railway logs for detailed error messages.

---

## 💡 Quick Test Locally

To test if it's a Railway issue or code issue:

```bash
# Start local MongoDB (if you have it)
mongod

# In another terminal
cd cigar-lounge-app/api
npm install
node server.js
```

If it works locally but not on Railway, it's a Railway configuration issue.

---

## 📞 Need Help?

1. Check Railway logs (shows actual error)
2. Check MongoDB Atlas network access
3. Verify connection string format
4. Make sure both services are in same Railway project

---

**Most Common Fix:** 
Use MongoDB Atlas (Solution 2) - it's more reliable than Railway's internal MongoDB for hobby projects!
