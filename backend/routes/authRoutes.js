const express = require('express')
const router = express.Router()
const {
  studentLogin,
  staffLogin,
  adminLogin,
  getAllStudents,
  toggleStudentStatus
} = require('../controllers/authController')

router.post('/student/login', studentLogin)
router.post('/staff/login', staffLogin)
router.post('/admin/login', adminLogin)
router.get('/students', getAllStudents)
router.post('/students/toggle', toggleStudentStatus)

module.exports = router