const pool = require('../config/db')

// Get student results
const getStudentResults = async (req, res) => {
  try {
    const { student_id, session, semester } = req.query

    let query = `
      SELECT 
        r.*,
        c.code,
        c.title,
        c.credit_units
      FROM results r
      JOIN courses c ON r.course_id = c.id
      WHERE r.student_id = $1
    `
    const params = [student_id]

    if (session) {
      query += ` AND r.session = $${params.length + 1}`
      params.push(session)
    }

    if (semester) {
      query += ` AND r.semester = $${params.length + 1}`
      params.push(semester)
    }

    query += ` ORDER BY r.session DESC, c.code ASC`

    const results = await pool.query(query, params)

    // Calculate GPA for this set of results
    let totalPoints = 0
    let totalUnits = 0

    results.rows.forEach(r => {
      if (r.status === 'approved') {
        totalPoints += parseFloat(r.grade_point) * parseInt(r.credit_units)
        totalUnits += parseInt(r.credit_units)
      }
    })

    const gpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : 0

    res.json({
      results: results.rows,
      gpa: parseFloat(gpa),
      total_units: totalUnits,
      total_points: totalPoints.toFixed(2)
    })

  } catch (error) {
    console.error('Get results error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all sessions for student
const getStudentSessions = async (req, res) => {
  try {
    const { student_id } = req.query

    const sessions = await pool.query(
      `SELECT DISTINCT session, semester 
       FROM results 
       WHERE student_id = $1 
       ORDER BY session DESC, semester ASC`,
      [student_id]
    )

    res.json({ sessions: sessions.rows })

  } catch (error) {
    console.error('Get sessions error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get cumulative CGPA
const getCGPA = async (req, res) => {
  try {
    const { student_id } = req.query

    const results = await pool.query(
      `SELECT r.grade_point, c.credit_units
       FROM results r
       JOIN courses c ON r.course_id = c.id
       WHERE r.student_id = $1 AND r.status = 'approved'`,
      [student_id]
    )

    let totalPoints = 0
    let totalUnits = 0

    results.rows.forEach(r => {
      totalPoints += parseFloat(r.grade_point) * parseInt(r.credit_units)
      totalUnits += parseInt(r.credit_units)
    })

    const cgpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : 0

    let classification = ''
    if (cgpa >= 4.5) classification = 'First Class Honours'
    else if (cgpa >= 3.5) classification = 'Second Class Upper'
    else if (cgpa >= 2.4) classification = 'Second Class Lower'
    else if (cgpa >= 1.5) classification = 'Third Class'
    else classification = 'Pass'

    res.json({
      cgpa: parseFloat(cgpa),
      classification,
      total_units: totalUnits,
      total_points: totalPoints.toFixed(2)
    })

  } catch (error) {
    console.error('Get CGPA error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getStudentResults,
  getStudentSessions,
  getCGPA
}