const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const studentLogin = async (req, res) => {
  try {
    const { matric_no, password } = req.body

    // 1. Check if matric number exists
    const studentResult = await pool.query(
      `SELECT s.*, u.full_name, u.password_hash, u.role, u.is_active 
       FROM students s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.matric_no = $1`,
      [matric_no]
    )

    if (studentResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid matric number or password' })
    }

    const student = studentResult.rows[0]

    // 2. Check if account is active
    if (!student.is_active) {
      return res.status(401).json({ message: 'Account is disabled. Contact admin.' })
    }

    // 3. Check password
    const validPassword = await bcrypt.compare(password, student.password_hash)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid matric number or password' })
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: student.user_id,
        role: student.role,
        matric_no: student.matric_no,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 5. Send response
    res.json({
      message: 'Login successful',
      token,
      student: {
        full_name: student.full_name,
        matric_no: student.matric_no,
        department: student.department,
        faculty: student.faculty,
        level: student.level,
        cgpa: student.cgpa,
        academic_status: student.academic_status,
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

const staffLogin = async (req, res) => {
  try {
    const { staff_id, password } = req.body

    // 1. Check if staff ID exists
    const staffResult = await pool.query(
      `SELECT s.*, u.full_name, u.password_hash, u.role, u.is_active 
       FROM staff s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.staff_id = $1`,
      [staff_id]
    )

    if (staffResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid staff ID or password' })
    }

    const staff = staffResult.rows[0]

    // 2. Check if account is active
    if (!staff.is_active) {
      return res.status(401).json({ message: 'Account disabled. Contact admin.' })
    }

    // 3. Check password
    const validPassword = await bcrypt.compare(password, staff.password_hash)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid staff ID or password' })
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: staff.user_id,
        role: staff.role,
        staff_id: staff.staff_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 5. Send response
    res.json({
      message: 'Login successful',
      token,
      staff: {
        full_name: staff.full_name,
        staff_id: staff.staff_id,
        department: staff.department,
        faculty: staff.faculty,
        rank: staff.rank,
        qualification: staff.qualification,
        role: staff.role,
      }
    })

  } catch (error) {
    console.error('Staff login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { studentLogin, staffLogin }