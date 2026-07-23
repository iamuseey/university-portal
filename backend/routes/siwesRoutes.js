const express = require('express')
const router = express.Router()
const {
  getSiwesDetails,
  submitWeeklyLog,
  updateSiwesDetails
} = require('../controllers/siwesController')

router.get('/details', getSiwesDetails)
router.post('/log', submitWeeklyLog)
router.post('/update', updateSiwesDetails)

module.exports = router