const express = require('express')
const router = express.Router()

const {
  getFaculties,
  getDepartments,
  getPrograms
} = require('../controllers/academicController')

router.get('/faculties', getFaculties)

router.get('/departments/:facultyId', getDepartments)

router.get('/programs/:departmentId', getPrograms)

module.exports = router