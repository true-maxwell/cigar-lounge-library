import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Authentication Component
function AuthScreen({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed')
            }

            onLogin(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-screen">
            <div className="auth-box">
                <h1 className="auth-title">The Cigar Lounge Library</h1>
                {error && <div className="error-message">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">EMAIL</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">PASSWORD</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="pixel-button" disabled={loading}>
                        {loading ? 'LOADING...' : isLogin ? 'LOG IN' : 'SIGN UP'}
                    </button>
                </form>
                <div className="auth-toggle">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span className="auth-link" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </span>
                </div>
            </div>
        </div>
    )
}

// Time-based scene hook
function useTimeOfDay() {
    const [timeOfDay, setTimeOfDay] = useState('day')

    useEffect(() => {
        const updateTime = () => {
            const hour = new Date().getHours()
            if (hour >= 5 && hour < 8) setTimeOfDay('morning')
            else if (hour >= 8 && hour < 17) setTimeOfDay('day')
            else if (hour >= 17 && hour < 20) setTimeOfDay('evening')
            else setTimeOfDay('night')
        }

        updateTime()
        const interval = setInterval(updateTime, 60000)
        return () => clearInterval(interval)
    }, [])

    return timeOfDay
}

// Window Scene Component - Sunset Style Matching Uploaded Image
function WindowScene() {
    return (
        <>
            <div className="room-walls" />
            
            <div className="window-frame">
                <div className="window-glass-reflection" />
                <div className="window-panes">
                    <div className="window-pane-vertical" />
                    <div className="window-pane-horizontal" />
                </div>
                
                <div className="window-scene">
                    {/* Sunset sky gradient */}
                    <div className="sky-layer" />
                    
                    {/* Bright sunset sun */}
                    <div className="sun-detailed" />
                    
                    {/* Purple mountains with snow caps (2 peaks) */}
                    <div className="mountains-mid">
                        <div className="mountain-peak-mid" />
                        <div className="mountain-peak-mid" />
                    </div>
                    
                    {/* Dense pine forest */}
                    <div className="forest-layer">
                        {[...Array(25)].map((_, i) => (
                            <div 
                                key={i} 
                                className="tree-detailed"
                                style={{
                                    left: `${i * 4}%`,
                                }}
                            >
                                <div className="tree-trunk" />
                                <div className="tree-foliage-layers">
                                    <div className="foliage-layer" />
                                    <div className="foliage-layer" />
                                    <div className="foliage-layer" />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Blue lake/river */}
                    <div className="lake">
                        <div className="water-reflection" />
                    </div>
                </div>
            </div>
        </>
    )
}

// Book Detail Modal with enhanced animation
function BookDetailModal({ book, onClose, onDelete }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div 
                className="book-modal" 
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <button className="modal-close" onClick={onClose}>×</button>
                
                {book.coverUrl && (
                    <div className="book-cover-container">
                        <motion.img 
                            src={book.coverUrl} 
                            alt={book.title} 
                            className="book-cover"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                        />
                    </div>
                )}
                
                <div className="book-details">
                    <h2 className="book-title">{book.title}</h2>
                    <div className="book-author">by {book.author}</div>
                    
                    <div className="book-meta">
                        {book.pageCount && <div className="meta-item">Pages: {book.pageCount}</div>}
                        {book.publishedDate && <div className="meta-item">Published: {book.publishedDate}</div>}
                        {book.dateRead && <div className="meta-item">Date Read: {new Date(book.dateRead).toLocaleDateString()}</div>}
                        {book.isbn && <div className="meta-item">ISBN: {book.isbn}</div>}
                    </div>
                    
                    <div className="book-rating">
                        {[...Array(5)].map((_, i) => (
                            <span 
                                key={i} 
                                className="star" 
                                style={{ color: i < book.rating ? '#b8860b' : '#ddd' }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    {book.review && (
                        <div className="book-review">{book.review}</div>
                    )}
                </div>

                <div className="modal-actions">
                    <button className="pixel-button secondary" onClick={() => onDelete(book)}>
                        DELETE
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

// Add Book Modal
function AddBookModal({ onClose, onAdd, token }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedBook, setSelectedBook] = useState(null)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [searching, setSearching] = useState(false)
    const [spineColor, setSpineColor] = useState('#8b4513')
    const [fontColor, setFontColor] = useState('#f4e8d0')
    const [dateRead, setDateRead] = useState('')

    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setSearching(true)
        
        try {
            const response = await fetch(`${API_URL}/api/books/search?q=${encodeURIComponent(searchQuery)}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            setSearchResults(data)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setSearching(false)
        }
    }

    const handleSave = async () => {
        if (!selectedBook || rating === 0) {
            alert('Please select a book and rating')
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...selectedBook,
                    rating,
                    review,
                    spineColor,
                    fontColor,
                    dateRead: dateRead || new Date().toISOString()
                })
            })

            if (!response.ok) throw new Error('Failed to add book')

            const newBook = await response.json()
            onAdd(newBook)
            onClose()
        } catch (error) {
            console.error('Error adding book:', error)
            alert('Failed to add book')
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div 
                className="book-modal" 
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <button className="modal-close" onClick={onClose}>×</button>
                <h2 className="book-title">Add Book</h2>

                {!selectedBook ? (
                    <>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input search-input"
                                placeholder="Search for a book..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button className="pixel-button" onClick={handleSearch}>
                                SEARCH
                            </button>
                        </div>

                        {searching && <div className="loading">Searching...</div>}

                        <div className="search-results">
                            <AnimatePresence>
                                {searchResults.map((book, i) => (
                                    <motion.div
                                        key={book.id}
                                        className="search-result-item"
                                        onClick={() => setSelectedBook(book)}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <div className="result-title">{book.title}</div>
                                        <div className="result-author">by {book.author}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="book-details">
                            <div className="book-title">{selectedBook.title}</div>
                            <div className="book-author">by {selectedBook.author}</div>
                            {selectedBook.coverUrl && (
                                <div className="book-cover-container">
                                    <img src={selectedBook.coverUrl} alt={selectedBook.title} className="book-cover" />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">RATING</label>
                            <div className="rating-input">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`rating-star ${rating >= star ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">DATE READ</label>
                            <input
                                type="date"
                                className="form-input"
                                value={dateRead}
                                onChange={(e) => setDateRead(e.target.value)}
                            />
                        </div>

                        <div className="spine-customization">
                            <label className="form-label">SPINE CUSTOMIZATION</label>
                            <div className="color-pickers">
                                <div className="color-picker-group">
                                    <label>Spine Color</label>
                                    <input
                                        type="color"
                                        value={spineColor}
                                        onChange={(e) => setSpineColor(e.target.value)}
                                        className="color-input"
                                    />
                                </div>
                                <div className="color-picker-group">
                                    <label>Font Color</label>
                                    <input
                                        type="color"
                                        value={fontColor}
                                        onChange={(e) => setFontColor(e.target.value)}
                                        className="color-input"
                                    />
                                </div>
                            </div>
                            <div className="spine-preview" style={{ background: spineColor }}>
                                <span style={{ color: fontColor }}>{selectedBook.title}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">REVIEW</label>
                            <textarea
                                className="review-textarea"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Share your thoughts..."
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="pixel-button secondary" onClick={() => setSelectedBook(null)}>
                                BACK
                            </button>
                            <button className="pixel-button" onClick={handleSave}>
                                SAVE BOOK
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    )
}

// Main App Component
function App() {
    const [user, setUser] = useState(null)
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddBook, setShowAddBook] = useState(false)
    const [selectedBook, setSelectedBook] = useState(null)
    const [animatingBookId, setAnimatingBookId] = useState(null)
    const [viewOnlyMode, setViewOnlyMode] = useState(false)
    const [viewOnlyUserId, setViewOnlyUserId] = useState(null)

    useEffect(() => {
        // Check for view-only mode (public library sharing)
        const urlParams = new URLSearchParams(window.location.search)
        const viewUserId = urlParams.get('view')
        
        if (viewUserId) {
            // Auto-logout to prevent editing someone else's library
            localStorage.removeItem('cigar_lounge_token')
            localStorage.removeItem('cigar_lounge_user')
            
            setViewOnlyMode(true)
            setViewOnlyUserId(viewUserId)
            loadPublicLibrary(viewUserId)
            setLoading(false)
            return
        }

        // Normal auth check
        const token = localStorage.getItem('cigar_lounge_token')
        const savedUser = localStorage.getItem('cigar_lounge_user')
        
        if (token && savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if (user) {
            loadBooks()
        }
    }, [user])

    const loadBooks = async () => {
        try {
            const token = localStorage.getItem('cigar_lounge_token')
            const response = await fetch(`${API_URL}/api/books`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            setBooks(data.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)))
        } catch (error) {
            console.error('Error loading books:', error)
        }
    }

    const loadPublicLibrary = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/api/books/public/${userId}`)
            if (response.ok) {
                const data = await response.json()
                setBooks(data.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)))
            } else {
                console.error('Public library not found')
            }
        } catch (error) {
            console.error('Error loading public library:', error)
        }
    }

    const handleLogin = (data) => {
        setUser(data.user)
        localStorage.setItem('cigar_lounge_token', data.token)
        localStorage.setItem('cigar_lounge_user', JSON.stringify(data.user))
    }

    const handleLogout = () => {
        setUser(null)
        setBooks([])
        localStorage.removeItem('cigar_lounge_token')
        localStorage.removeItem('cigar_lounge_user')
    }

    const handleBookClick = (book) => {
        setAnimatingBookId(book._id)
        setTimeout(() => {
            setSelectedBook(book)
            setAnimatingBookId(null)
        }, 300)
    }

    const handleDeleteBook = async (bookToDelete) => {
        try {
            const token = localStorage.getItem('cigar_lounge_token')
            const response = await fetch(`${API_URL}/api/books/${bookToDelete._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!response.ok) throw new Error('Failed to delete book')

            setBooks(books.filter(b => b._id !== bookToDelete._id))
            setSelectedBook(null)
        } catch (error) {
            console.error('Error deleting book:', error)
            alert('Failed to delete book')
        }
    }

    const copyShareLink = () => {
        const shareLink = `${window.location.origin}?view=${user.userId}`
        navigator.clipboard.writeText(shareLink)
        alert('Library link copied! Anyone can view your books with this link.')
    }

    const copyInviteLink = () => {
        const inviteLink = `${window.location.origin}?ref=${user.userId}`
        navigator.clipboard.writeText(inviteLink)
        alert('Invite link copied! Friends can sign up with this link.')
    }

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    // View-only mode (public library)
    if (viewOnlyMode) {
        return (
            <div className="app-container">
                <div className="bookshelf">
                    <div className="shelf-header">
                        <h2 className="shelf-title">PUBLIC LIBRARY (VIEW ONLY)</h2>
                    </div>
                    
                    <div className="books-container">
                        {books.length === 0 ? (
                            <p style={{color: '#ffd700', padding: '20px'}}>This library is empty.</p>
                        ) : (
                            books.map((book) => {
                                const baseHeight = Math.min(Math.max(110, (book.pageCount || 200) / 2.8), 185)
                                const idHash = book._id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
                                const heightVariation = (idHash % 15) - 7
                                const height = baseHeight + heightVariation
                                const width = 28 + (idHash % 10)
                                const spineColor = book.spineColor || '#8b4513'
                                const fontColor = book.fontColor || '#f4e8d0'
                                
                                return (
                                    <motion.div
                                        key={book._id}
                                        className="book-spine"
                                        onClick={() => setSelectedBook(book)}
                                        style={{
                                            background: spineColor,
                                            height: `${height}px`,
                                            width: `${width}px`
                                        }}
                                        whileHover={{ y: -8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="book-spine-text" style={{ color: fontColor }}>
                                            {book.title}
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}
                    </div>
                </div>

                <div className="lounge-window">
                    <WindowScene />
                </div>

                <AnimatePresence>
                    {selectedBook && (
                        <BookDetailModal
                            book={selectedBook}
                            onClose={() => setSelectedBook(null)}
                            onDelete={() => {}} // No delete in view mode
                        />
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // Normal authenticated mode
    if (!user) {
        return <AuthScreen onLogin={handleLogin} />
    }

    return (
        <div className="app-container">
            <div className="user-controls">
                <button className="pixel-button share-link" onClick={copyShareLink}>
                    SHARE MY LIBRARY
                </button>
                <button className="pixel-button invite-btn" onClick={copyInviteLink}>
                    INVITE FRIENDS
                </button>
                <button className="pixel-button secondary" onClick={handleLogout}>
                    LOGOUT
                </button>
            </div>

            <div className="bookshelf">
                <div className="shelf-header">
                    <div className="shelf-title">My Library</div>
                    <button className="pixel-button add-book-btn" onClick={() => setShowAddBook(true)}>
                        + ADD BOOK
                    </button>
                </div>
                <div className="books-container">
                    {books.length === 0 ? (
                        <div className="empty-shelf">
                            Your library is empty.<br/>
                            Add your first book to get started!
                        </div>
                    ) : (
                        books.map((book) => {
                            // Create properly proportioned books (taller and narrower)
                            const baseHeight = Math.min(Math.max(110, (book.pageCount || 200) / 2.8), 185)
                            const idHash = book._id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
                            const heightVariation = (idHash % 15) - 7
                            const height = baseHeight + heightVariation
                            const width = 28 + (idHash % 10)
                            
                            // Determine book style/age based on ID hash
                            const styleType = idHash % 5
                            const spineColor = book.spineColor || '#8b4513'
                            const fontColor = book.fontColor || '#f4e8d0'
                            
                            // Add style class for variety
                            let styleClass = 'book-spine'
                            if (styleType === 0) styleClass += ' book-antique'      // Very old
                            else if (styleType === 1) styleClass += ' book-modern'  // New, pristine
                            else if (styleType === 2) styleClass += ' book-ornate'  // Decorative
                            else if (styleType === 3) styleClass += ' book-worn'    // Well-used
                            else styleClass += ' book-classic'                       // Standard
                            
                            return (
                                <motion.div
                                    key={book._id}
                                    className={`${styleClass} ${animatingBookId === book._id ? 'opening' : ''}`}
                                    onClick={() => handleBookClick(book)}
                                    style={{
                                        background: spineColor,
                                        height: `${height}px`,
                                        width: `${width}px`
                                    }}
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="book-spine-text" style={{ color: fontColor }}>
                                        {book.title}
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </div>
            </div>

            <div className="lounge-window">
                <WindowScene />
            </div>

            <AnimatePresence>
                {showAddBook && (
                    <AddBookModal
                        onClose={() => setShowAddBook(false)}
                        onAdd={(book) => {
                            setBooks([book, ...books])
                            setShowAddBook(false)
                        }}
                        token={localStorage.getItem('cigar_lounge_token')}
                    />
                )}

                {selectedBook && (
                    <BookDetailModal
                        book={selectedBook}
                        onClose={() => setSelectedBook(null)}
                        onDelete={handleDeleteBook}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
