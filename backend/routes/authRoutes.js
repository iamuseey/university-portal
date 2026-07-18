const express = require('express')
const router = express.Router()
const { studentLogin, staffLogin } = require('../controllers/authController')

router.post('/student/login', studentLogin)
router.post('/staff/login', staffLogin)

module.exports = router