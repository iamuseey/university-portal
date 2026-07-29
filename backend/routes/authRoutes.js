const express = require('express')
const router = express.Router()

const auth = require('../middleware/authMiddleware')

const {
  studentLogin,
  staffLogin,
  adminLogin,
  getAllStudents,
  toggleStudentStatus,
  addStudent,
  changePassword
} = require('../controllers/authController')

router.post('/student/login', studentLogin)
router.post('/staff/login', staffLogin)
router.post('/admin/login', adminLogin)

router.post('/change-password', auth, changePassword)

router.get('/students', getAllStudents)

router.post('/students/create', addStudent)

router.post('/students/toggle', toggleStudentStatus)

module.exports = router