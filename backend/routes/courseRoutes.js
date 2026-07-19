const express = require('express')
const router = express.Router()
const {
  getAvailableCourses,
  getRegisteredCourses,
  addCourse,
  removeCourse,
  submitRegistration
} = require('../controllers/courseController')

router.get('/available', getAvailableCourses)
router.get('/registered', getRegisteredCourses)
router.post('/add', addCourse)
router.post('/remove', removeCourse)
router.post('/submit', submitRegistration)

module.exports = router