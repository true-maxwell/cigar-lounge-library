# The Cigar Lounge Library 🔥📚

A beautifully crafted pixel-art personal library application where you can track books you've read, rate them, write reviews, and share your collection with others.

## Features

✨ **Stunning Pixel Art UI** - Master-level detailed pixel art with:
- Time-based ambient scene (changes throughout the day)
- Incredibly detailed room with furniture, plants, decorations
- Animated elements (flowing river, flickering candles, smoke, birds)
- Perspective-correct floor and rug
- Beautiful book selection animations

📚 **Book Management**
- Search books from Open Library
- Add books with ratings and reviews
- Books displayed as vertical spines with varying heights (based on page count)
- Pixelated book covers in detail modal

🔐 **Secure Authentication**
- User accounts with JWT authentication
- Private libraries per user
- Shareable public links (read-only)

## Tech Stack

**Frontend:**
- React 18
- Framer Motion (animations)
- Vite (build tool)
- CSS with extensive pixel art styling

**Backend:**
- Node.js + Express
- MongoDB (database)
- JWT authentication
- bcrypt (password hashing)

## Local Development

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account

### Setup

1. **Clone and install dependencies:**

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd api
npm install
cd ..
```

2. **Set up environment variables:**

```bash
# Create frontend .env
cp .env.example .env

# Create backend .env
cp api/.env.example api/.env
```

3. **Start MongoDB** (if using local):

```bash
# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu:
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in api/.env
```

4. **Run the application:**

```bash
# Terminal 1 - Start backend (from api folder)
cd api
npm run dev

# Terminal 2 - Start frontend (from root folder)
npm run dev
```

5. **Open your browser:**
```
http://localhost:5173
```

## Deployment (Vercel + Railway)

This is the **easiest deployment option** - completely free for hobby projects!

### Part 1: Deploy Backend to Railway

1. **Create a Railway account:** https://railway.app

2. **Create a new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Select the repository

3. **Add MongoDB:**
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will automatically create a MongoDB instance
   - Copy the `MONGODB_URI` connection string

4. **Configure backend:**
   - Click on your service
   - Go to "Variables" tab
   - Add these environment variables:
     ```
     JWT_SECRET=your-secure-random-string-here
     PORT=3001
     ```
   - The MONGODB_URI is auto-added by Railway

5. **Set root directory:**
   - Go to "Settings"
   - Set "Root Directory" to `api`
   - Set "Start Command" to `npm start`

6. **Deploy:**
   - Railway will auto-deploy
   - Copy your backend URL (e.g., `https://your-app.up.railway.app`)

### Part 2: Deploy Frontend to Vercel

1. **Create a Vercel account:** https://vercel.com

2. **Import project:**
   - Click "New Project"
   - Import your Git repository
   - Vercel auto-detects Vite

3. **Configure environment:**
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend.up.railway.app
     ```
   - (Use the Railway URL from Part 1)

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like `https://your-app.vercel.app`

5. **Update CORS (important!):**
   - Go back to Railway backend
   - Update `server.js` if needed to allow your Vercel domain
   - Or use `app.use(cors({ origin: 'https://your-app.vercel.app' }))`

### Alternative: Deploy Both to Railway

You can also deploy both frontend and backend to Railway:

1. Create two services in Railway:
   - One for backend (api folder)
   - One for frontend (root folder, Vite static)

2. Set environment variables appropriately

3. Railway handles everything!

## Environment Variables Reference

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001  # Development
VITE_API_URL=https://your-api-url   # Production
```

### Backend (api/.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/cigar-lounge  # Local
MONGODB_URI=mongodb+srv://...                        # MongoDB Atlas
JWT_SECRET=change-this-to-a-secure-random-string
```

## Troubleshooting

**Frontend can't connect to backend:**
- Check that VITE_API_URL is set correctly
- Make sure backend is running
- Check CORS settings in backend

**Database connection fails:**
- Verify MONGODB_URI is correct
- Check MongoDB is running (local)
- Verify MongoDB Atlas IP whitelist (cloud)

**Books not loading:**
- Check browser console for errors
- Verify authentication token is being sent
- Check backend logs

**Share link not working:**
- Public route doesn't require authentication
- Share URL format: `https://your-app.com/share/{userId}`

## Project Structure

```
cigar-lounge-app/
├── api/                    # Backend
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── .env              # Backend environment variables
├── src/                   # Frontend
│   ├── App.jsx           # Main React component
│   ├── main.jsx          # React entry point
│   └── index.css         # 2000+ lines of detailed pixel art CSS!
├── index.html            # HTML entry
├── vite.config.js        # Vite configuration
├── package.json          # Frontend dependencies
└── .env                  # Frontend environment variables
```

## Features in Detail

### Time-Based Ambient Scene
The window view changes based on your local time:
- **Morning (5-8am):** Sunrise tones, soft light
- **Day (8am-5pm):** Bright daylight, clouds, birds
- **Evening (5-8pm):** Sunset glow, warm colors
- **Night (8pm-5am):** Moon, stars, darker tones

### Book Spine Details
- Heights vary based on page count (80px - 180px)
- Unique colors generated from book ID
- Vertical text orientation
- Hover animation (lifts up)
- Click animation (slides out before modal)

### Room Details
Over 30 detailed elements including:
- Persian rug with intricate pattern
- Leather armchair with tufted details
- Hardwood floor with perspective
- Potted plant with 5 leaves
- Wall art in brass frame
- Reading lamp with glow
- Desk with drawer
- Cigar with animated smoke
- Whiskey glass with ice cube
- Candles with flickering flames
- Bookends, stacked books
- Wall sconce
- Crown molding & baseboards

## Credits

Built with attention to detail and passion for pixel art aesthetics.

Inspired by cozy reading spaces and classic adventure games.

Book data powered by Open Library API.

## License

MIT License - feel free to use for personal projects!

---

**Enjoy your cozy pixel art library! 📚✨**
