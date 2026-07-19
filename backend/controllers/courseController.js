const pool = require('../config/db')

// Credit unit limits per level
const CREDIT_LIMITS = {
  100: { min: 35, max: 40 },
  200: { min: 30, max: 35 },
  300: { min: 24, max: 30 },
  400: { min: 24, max: 30 },
  500: { min: 20, max: 24 },
}

// Get available courses for student level
const getAvailableCourses = async (req, res) => {
  try {
    const { level, department } = req.query

    const courses = await pool.query(
      `SELECT * FROM courses 
       WHERE level = $1 
       AND (department = $2 OR department = 'General Studies')
       ORDER BY is_compulsory DESC, code ASC`,
      [level, department]
    )

    res.json({ courses: courses.rows })

  } catch (error) {
    console.error('Get courses error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get student's registered courses
const getRegisteredCourses = async (req, res) => {
  try {
    const { student_id, session, semester } = req.query

    const registered = await pool.query(
      `SELECT cr.*, c.code, c.title, c.credit_units, c.is_compulsory
       FROM course_registrations cr
       JOIN courses c ON cr.course_id = c.id
       WHERE cr.student_id = $1 
       AND cr.session = $2 
       AND cr.semester = $3`,
      [student_id, session, semester]
    )

    // Get total units
    const totalUnits = registered.rows.reduce((sum, course) => sum + course.credit_units, 0)

    res.json({
      registered: registered.rows,
      total_units: totalUnits
    })

  } catch (error) {
    console.error('Get registered courses error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Add course to registration
const addCourse = async (req, res) => {
  try {
    const { student_id, course_id, session, semester, level } = req.body

    // Get current total units
    const currentReg = await pool.query(
      `SELECT SUM(c.credit_units) as total
       FROM course_registrations cr
       JOIN courses c ON cr.course_id = c.id
       WHERE cr.student_id = $1 
       AND cr.session = $2 
       AND cr.semester = $3`,
      [student_id, session, semester]
    )

    const currentUnits = parseInt(currentReg.rows[0].total) || 0

    // Get course credit units
    const course = await pool.query('SELECT * FROM courses WHERE id = $1', [course_id])
    if (course.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const courseUnits = course.rows[0].credit_units
    const newTotal = currentUnits + courseUnits

    // Check credit limit
    const limit = CREDIT_LIMITS[level] || { max: 30 }
    if (newTotal > limit.max) {
      return res.status(400).json({
        message: `Cannot add course. Maximum credit units for ${level}L is ${limit.max}. You have ${currentUnits} units.`
      })
    }

    // Check if already registered
    const existing = await pool.query(
      `SELECT * FROM course_registrations 
       WHERE student_id = $1 AND course_id = $2 AND session = $3`,
      [student_id, course_id, session]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'You already registered this course' })
    }

    // Add course
    await pool.query(
      `INSERT INTO course_registrations (student_id, course_id, session, semester)
       VALUES ($1, $2, $3, $4)`,
      [student_id, course_id, session, semester]
    )

    res.json({
      message: 'Course added successfully',
      new_total_units: newTotal
    })

  } catch (error) {
    console.error('Add course error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Remove course from registration
const removeCourse = async (req, res) => {
  try {
    const { student_id, course_id, session } = req.body

    // Check if course is compulsory
    const course = await pool.query(
      `SELECT c.is_compulsory FROM courses c
       JOIN course_registrations cr ON c.id = cr.course_id
       WHERE cr.student_id = $1 AND cr.course_id = $2 AND cr.session = $3`,
      [student_id, course_id, session]
    )

    if (course.rows.length > 0 && course.rows[0].is_compulsory) {
      return res.status(400).json({ message: 'Cannot remove a compulsory course' })
    }

    await pool.query(
      `DELETE FROM course_registrations 
       WHERE student_id = $1 AND course_id = $2 AND session = $3`,
      [student_id, course_id, session]
    )

    res.json({ message: 'Course removed successfully' })

  } catch (error) {
    console.error('Remove course error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Submit registration
const submitRegistration = async (req, res) => {
  try {
    const { student_id, session, semester, level } = req.body

    // Get total units
    const totalResult = await pool.query(
      `SELECT SUM(c.credit_units) as total
       FROM course_registrations cr
       JOIN courses c ON cr.course_id = c.id
       WHERE cr.student_id = $1 
       AND cr.session = $2 
       AND cr.semester = $3`,
      [student_id, session, semester]
    )

    const totalUnits = parseInt(totalResult.rows[0].total) || 0
    const limit = CREDIT_LIMITS[level] || { min: 24, max: 30 }

    // Check minimum units
    if (totalUnits < limit.min) {
      return res.status(400).json({
        message: `Minimum credit units for ${level}L is ${limit.min}. You have ${totalUnits} units.`
      })
    }

    // Mark as submitted
    await pool.query(
      `INSERT INTO registration_status (student_id, session, semester, total_units, is_submitted, submitted_at)
       VALUES ($1, $2, $3, $4, true, NOW())
       ON CONFLICT (student_id, session, semester) 
       DO UPDATE SET is_submitted = true, submitted_at = NOW(), total_units = $4`,
      [student_id, session, semester, totalUnits]
    )

    res.json({
      message: 'Registration submitted successfully!',
      total_units: totalUnits
    })

  } catch (error) {
    console.error('Submit registration error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getAvailableCourses,
  getRegisteredCourses,
  addCourse,
  removeCourse,
  submitRegistration
}