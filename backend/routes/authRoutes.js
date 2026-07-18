const express = require('express')
const router = express.Router()
const { studentLogin, staffLogin, adminLogin } = require('../controllers/authController')

router.post('/student/login', studentLogin)
router.post('/staff/login', staffLogin)
router.post('/admin/login', adminLogin)

module.exports = router