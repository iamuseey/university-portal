const express = require('express')
const router = express.Router()
const {
  getStudentsForCourse,
  saveScores,
  submitScores,
  approveScores
} = require('../controllers/scoresController')

router.get('/students', getStudentsForCourse)
router.post('/save', saveScores)
router.post('/submit', submitScores)
router.post('/approve', approveScores)

module.exports = router