const express = require('express')
const router = express.Router()

const {
  getFaculties,
  getDepartments,
  getPrograms,
  generateMatricNumber
} = require('../controllers/setupController')

router.get('/faculties', getFaculties)

router.get('/departments/:facultyId', getDepartments)

router.get('/programs/:departmentId', getPrograms)

router.get('/generate-matric', generateMatricNumber)

module.exports = router