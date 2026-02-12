import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cigar-lounge'

console.log('Attempting to connect to MongoDB...')
console.log('Connection string:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')) // Hide password in logs

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,
})
    .then(() => console.log('✅ Connected to MongoDB successfully!'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message)
        console.error('Connection string (sanitized):', MONGODB_URI.replace(/:[^:@]+@/, ':****@'))
        console.error('Make sure:')
        console.error('1. MongoDB service is running in Railway')
        console.error('2. MONGODB_URI environment variable is set correctly')
        console.error('3. Network allows connection to MongoDB')
    })

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

// Book Schema
const bookSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverUrl: String,
    isbn: String,
    pageCount: { type: Number, default: 200 },
    publishedDate: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: String,
    openLibraryId: String,
    spineColor: { type: String, default: '#8b4513' },
    fontColor: { type: String, default: '#f4e8d0' },
    dateRead: { type: Date },
    dateAdded: { type: Date, default: Date.now }
})

const Book = mongoose.model('Book', bookSchema)

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Access denied' })
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        req.user = verified
        next()
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' })
    }
}

// ===== AUTH ROUTES =====

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' })
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' })
        }

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const user = new User({
            email,
            password: hashedPassword,
            userId
        })

        await user.save()

        // Create token
        const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        )

        res.status(201).json({
            token,
            user: { email: user.email, userId: user.userId }
        })
    } catch (error) {
        console.error('Register error:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' })
        }

        // Find user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        // Create token
        const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        )

        res.json({
            token,
            user: { email: user.email, userId: user.userId }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

// ===== BOOK ROUTES =====

// Search books (Google Books API for better covers)
app.get('/api/books/search', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query
        
        if (!q) {
            return res.status(400).json({ error: 'Query required' })
        }

        console.log('Searching Google Books for:', q)

        // Build URL with API key if available
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY || ''
        const apiKeyParam = apiKey ? `&key=${apiKey}` : ''
        const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=10${apiKeyParam}`

        // Use Google Books API for better cover images
        const response = await fetch(searchUrl)
        
        if (!response.ok) {
            console.error('Google Books API error:', response.status, response.statusText)
            
            // Special handling for rate limit
            if (response.status === 429) {
                return res.status(429).json({ 
                    error: 'Rate limit exceeded. Please add GOOGLE_BOOKS_API_KEY to environment variables.',
                    needsApiKey: !apiKey
                })
            }
            
            return res.status(500).json({ error: 'Google Books API failed' })
        }

        const data = await response.json()
        console.log('Google Books response:', JSON.stringify(data).substring(0, 200))

        if (!data.items || data.items.length === 0) {
            console.log('No books found for query:', q)
            return res.json([])
        }

        const books = data.items.map(item => {
            const volumeInfo = item.volumeInfo || {}
            const imageLinks = volumeInfo.imageLinks || {}
            const industryIdentifiers = volumeInfo.industryIdentifiers || []
            
            return {
                id: item.id,
                title: volumeInfo.title || 'Unknown Title',
                author: volumeInfo.authors && volumeInfo.authors.length > 0 
                    ? volumeInfo.authors[0] 
                    : 'Unknown Author',
                coverUrl: imageLinks.thumbnail 
                    || imageLinks.smallThumbnail 
                    || null,
                isbn: industryIdentifiers.length > 0 
                    ? industryIdentifiers[0].identifier 
                    : null,
                pageCount: volumeInfo.pageCount || 200,
                publishedDate: volumeInfo.publishedDate || 'Unknown'
            }
        })

        console.log(`Returning ${books.length} books`)
        res.json(books)
    } catch (error) {
        console.error('Search error:', error)
        res.status(500).json({ error: 'Search failed', message: error.message })
    }
})

// Get all books for user
app.get('/api/books', authenticateToken, async (req, res) => {
    try {
        const books = await Book.find({ userId: req.user.userId })
            .sort({ dateAdded: -1 })
        res.json(books)
    } catch (error) {
        console.error('Get books error:', error)
        res.status(500).json({ error: 'Failed to fetch books' })
    }
})

// Get public library (for sharing)
app.get('/api/books/public/:userId', async (req, res) => {
    try {
        const books = await Book.find({ userId: req.params.userId })
            .sort({ dateAdded: -1 })
        res.json(books)
    } catch (error) {
        console.error('Get public books error:', error)
        res.status(500).json({ error: 'Failed to fetch books' })
    }
})

// Add book
app.post('/api/books', authenticateToken, async (req, res) => {
    try {
        const { 
            title, author, coverUrl, isbn, pageCount, publishedDate,
            rating, review, id, spineColor, fontColor, dateRead 
        } = req.body

        // Validate
        if (!title || !author || !rating) {
            return res.status(400).json({ error: 'Title, author, and rating required' })
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' })
        }

        const book = new Book({
            userId: req.user.userId,
            title,
            author,
            coverUrl,
            isbn,
            pageCount: pageCount || 200,
            publishedDate,
            rating,
            review,
            openLibraryId: id,
            spineColor: spineColor || '#8b4513',
            fontColor: fontColor || '#f4e8d0',
            dateRead: dateRead || new Date()
        })

        await book.save()
        res.status(201).json(book)
    } catch (error) {
        console.error('Add book error:', error)
        res.status(500).json({ error: 'Failed to add book' })
    }
})

// Update book
app.put('/api/books/:id', authenticateToken, async (req, res) => {
    try {
        const book = await Book.findOne({ 
            _id: req.params.id, 
            userId: req.user.userId 
        })

        if (!book) {
            return res.status(404).json({ error: 'Book not found' })
        }

        const { rating, review } = req.body

        if (rating) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Rating must be between 1 and 5' })
            }
            book.rating = rating
        }

        if (review !== undefined) {
            book.review = review
        }

        await book.save()
        res.json(book)
    } catch (error) {
        console.error('Update book error:', error)
        res.status(500).json({ error: 'Failed to update book' })
    }
})

// Delete book
app.delete('/api/books/:id', authenticateToken, async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.userId 
        })

        if (!book) {
            return res.status(404).json({ error: 'Book not found' })
        }

        res.json({ message: 'Book deleted successfully' })
    } catch (error) {
        console.error('Delete book error:', error)
        res.status(500).json({ error: 'Failed to delete book' })
    }
})

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    })
})

// Test Google Books API endpoint (no auth required for testing)
app.get('/api/test-google-books', async (req, res) => {
    try {
        const testQuery = 'Harry Potter'
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY || ''
        const apiKeyParam = apiKey ? `&key=${apiKey}` : ''
        
        console.log('Testing Google Books API with:', testQuery)
        console.log('Using API key:', apiKey ? 'Yes' : 'No (may hit rate limit)')
        
        const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(testQuery)}&maxResults=3${apiKeyParam}`
        const response = await fetch(searchUrl)
        
        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error: `Google Books API returned ${response.status}`,
                hasApiKey: !!apiKey,
                message: response.status === 429 
                    ? 'Rate limit hit - add GOOGLE_BOOKS_API_KEY environment variable'
                    : 'API error'
            })
        }
        
        const data = await response.json()
        
        res.json({
            success: true,
            hasApiKey: !!apiKey,
            itemsFound: data.items ? data.items.length : 0,
            firstBook: data.items && data.items[0] ? {
                title: data.items[0].volumeInfo?.title,
                author: data.items[0].volumeInfo?.authors?.[0],
                hasImage: !!data.items[0].volumeInfo?.imageLinks?.thumbnail
            } : null,
            rawResponse: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app
