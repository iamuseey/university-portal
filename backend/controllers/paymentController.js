const pool = require('../config/db')

// Generate fake Remita RRR number
const generateRRR = () => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `RRR${timestamp}${random}`
}

// Get fee structure for student
const getFeeStructure = async (req, res) => {
  try {
    const { level, department, session } = req.query

    const fees = await pool.query(
      `SELECT * FROM fee_structures 
       WHERE level = $1 
       AND session = $2
       AND (department = $3 OR department IS NULL)
       ORDER BY is_compulsory DESC, fee_type ASC`,
      [level, session, department]
    )

    const total = fees.rows.reduce((sum, fee) => sum + parseFloat(fee.amount), 0)

    res.json({
      fees: fees.rows,
      total_amount: total
    })

  } catch (error) {
    console.error('Get fees error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get student payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { student_id, session } = req.query

    const payments = await pool.query(
      `SELECT * FROM payments 
       WHERE student_id = $1 AND session = $2
       ORDER BY created_at DESC`,
      [student_id, session]
    )

    const totalPaid = payments.rows
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)

    res.json({
      payments: payments.rows,
      total_paid: totalPaid
    })

  } catch (error) {
    console.error('Get payment status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Generate RRR for payment
const generatePayment = async (req, res) => {
  try {
    const { student_id, session, fee_type, amount } = req.body

    // Check if already paid
    const existing = await pool.query(
      `SELECT * FROM payments 
       WHERE student_id = $1 AND session = $2 
       AND fee_type = $3 AND status = 'paid'`,
      [student_id, session, fee_type]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: `${fee_type} already paid!` })
    }

    // Check if RRR already generated
    const pending = await pool.query(
      `SELECT * FROM payments 
       WHERE student_id = $1 AND session = $2 
       AND fee_type = $3 AND status = 'pending'`,
      [student_id, session, fee_type]
    )

    if (pending.rows.length > 0) {
      return res.json({
        message: 'RRR already generated',
        payment: pending.rows[0]
      })
    }

    // Generate new RRR
    const rrr = generateRRR()

    const payment = await pool.query(
      `INSERT INTO payments (student_id, session, fee_type, amount, remita_rrr, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [student_id, session, fee_type, amount, rrr]
    )

    res.json({
      message: 'RRR generated successfully',
      payment: payment.rows[0]
    })

  } catch (error) {
    console.error('Generate payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Confirm payment (simulate for now)
const confirmPayment = async (req, res) => {
  try {
    const { payment_id, remita_rrr } = req.body

    // In real app this would verify with Remita API
    // For now we simulate confirmation
    const payment = await pool.query(
      `UPDATE payments 
       SET status = 'paid', paid_at = NOW(), payment_method = 'Remita'
       WHERE id = $1 AND remita_rrr = $2
       RETURNING *`,
      [payment_id, remita_rrr]
    )

    if (payment.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    res.json({
      message: 'Payment confirmed successfully!',
      payment: payment.rows[0]
    })

  } catch (error) {
    console.error('Confirm payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getFeeStructure,
  getPaymentStatus,
  generatePayment,
  confirmPayment
}