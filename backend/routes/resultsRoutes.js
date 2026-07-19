const express = require('express')
const router = express.Router()
const {
  getStudentResults,
  getStudentSessions,
  getCGPA
} = require('../controllers/resultsController')

router.get('/student', getStudentResults)
router.get('/sessions', getStudentSessions)
router.get('/cgpa', getCGPA)

module.exports = router