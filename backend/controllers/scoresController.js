const pool = require('../config/db')

// Get students registered for a course
const getStudentsForCourse = async (req, res) => {
  try {
    const { course_id, session, semester } = req.query

    const students = await pool.query(
      `SELECT 
        cr.student_id,
        u.full_name,
        s.matric_no,
        r.ca_score,
        r.exam_score,
        r.total_score,
        r.grade,
        r.status as result_status
       FROM course_registrations cr
       JOIN students s ON cr.student_id = s.id
       JOIN users u ON s.user_id = u.id
       LEFT JOIN results r ON r.student_id = cr.student_id 
         AND r.course_id = cr.course_id 
         AND r.session = cr.session
       WHERE cr.course_id = $1 
       AND cr.session = $2 
       AND cr.semester = $3
       ORDER BY s.matric_no ASC`,
      [course_id, session, semester]
    )

    res.json({ students: students.rows })

  } catch (error) {
    console.error('Get students error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Save scores
const saveScores = async (req, res) => {
  try {
    const { scores, submitted_by } = req.body

    for (const score of scores) {
      await pool.query(
        `INSERT INTO results 
          (student_id, course_id, session, semester, ca_score, exam_score, total_score, grade, grade_point, submitted_by, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
         ON CONFLICT (student_id, course_id, session, semester) 
         DO UPDATE SET 
           ca_score = $5,
           exam_score = $6,
           total_score = $7,
           grade = $8,
           grade_point = $9,
           submitted_by = $10,
           status = 'pending'`,
        [
          score.student_id,
          score.course_id,
          score.session,
          score.semester,
          score.ca_score,
          score.exam_score,
          score.total_score,
          score.grade,
          score.grade_point,
          submitted_by
        ]
      )
    }

    res.json({ message: 'Scores saved successfully' })

  } catch (error) {
    console.error('Save scores error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Submit scores to HOD
const submitScores = async (req, res) => {
  try {
    const { course_id, session, semester, submitted_by } = req.body

    await pool.query(
      `UPDATE results 
       SET status = 'submitted'
       WHERE course_id = $1 
       AND session = $2 
       AND semester = $3
       AND submitted_by = $4`,
      [course_id, session, semester, submitted_by]
    )

    res.json({ message: 'Results submitted to HOD successfully' })

  } catch (error) {
    console.error('Submit scores error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// HOD approve scores
const approveScores = async (req, res) => {
  try {
    const { course_id, session, semester, approved_by } = req.body

    await pool.query(
      `UPDATE results 
       SET status = 'approved', approved_by = $4
       WHERE course_id = $1 
       AND session = $2 
       AND semester = $3`,
      [course_id, session, semester, approved_by]
    )

    res.json({ message: 'Results approved successfully' })

  } catch (error) {
    console.error('Approve scores error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getStudentsForCourse,
  saveScores,
  submitScores,
  approveScores
}