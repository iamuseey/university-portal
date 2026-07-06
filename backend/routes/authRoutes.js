const express = require('express')
const router = express.Router()
const { studentLogin } = require('../controllers/authController')

router.post('/student/login', studentLogin)

module.exports = router