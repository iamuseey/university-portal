const express = require('express')
const router = express.Router()
const {
  getFeeStructure,
  getPaymentStatus,
  generatePayment,
  confirmPayment
} = require('../controllers/paymentController')

router.get('/fees', getFeeStructure)
router.get('/status', getPaymentStatus)
router.post('/generate', generatePayment)
router.post('/confirm', confirmPayment)

module.exports = router