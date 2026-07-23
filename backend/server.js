const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const resultsRoutes = require('./routes/resultsRoutes')
const scoresRoutes = require('./routes/scoresRoutes')
const siwesRoutes = require('./routes/siwesRoutes')

const app = express()

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/results', resultsRoutes)
app.use('/api/scores', scoresRoutes)
app.use('/api/siwes', siwesRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'University Portal API is running!',
    version: '1.0.0',
    status: 'healthy'
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})