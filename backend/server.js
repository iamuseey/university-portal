const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const resultsRoutes = require('./routes/resultsRoutes') // <-- ADDED

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/results', resultsRoutes) // <-- ADDED

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'University Portal API is running!' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})