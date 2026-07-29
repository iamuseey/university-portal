const pool = require('../config/db')

// GET ALL FACULTIES
const getFaculties = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, faculty_name
       FROM faculties
       ORDER BY faculty_name`
    )

    res.json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET DEPARTMENTS BY FACULTY
const getDepartments = async (req, res) => {
  try {
    const { facultyId } = req.params

    const result = await pool.query(
      `SELECT id, department_name
       FROM departments
       WHERE faculty_id = $1
       ORDER BY department_name`,
      [facultyId]
    )

    res.json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET PROGRAMS BY DEPARTMENT
const getPrograms = async (req, res) => {
  try {
    const { departmentId } = req.params

    const result = await pool.query(
      `SELECT
          id,
          program_name,
          degree,
          duration
       FROM programs
       WHERE department_id = $1
       ORDER BY program_name`,
      [departmentId]
    )

    res.json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// GENERATE MATRIC NUMBER - ADDED BELOW getPrograms
const generateMatricNumber = async (req, res) => {
  try {
    const { departmentId, session } = req.query

    if (!departmentId ||!session) {
      return res.status(400).json({
        message: 'Department and session are required'
      })
    }

    // Get department code
    const deptResult = await pool.query(
      `SELECT department_code
       FROM departments
       WHERE id = $1`,
      [departmentId]
    )

    if (deptResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Department not found'
      })
    }

    const code = deptResult.rows[0].department_code

    // Find the latest matric number
    const result = await pool.query(
      `SELECT matric_no
       FROM students
       WHERE matric_no LIKE $1
       ORDER BY matric_no DESC
       LIMIT 1`,
      [`${code}/${session}/%`]
    )

    let nextNumber = 1

    if (result.rows.length > 0) {
      const lastMatric = result.rows[0].matric_no
      const serial = parseInt(lastMatric.split('/')[2])
      nextNumber = serial + 1
    }

    const matricNo =
      `${code}/${session}/${String(nextNumber).padStart(3, '0')}`

    res.json({
      matric_no: matricNo
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Server error'
    })
  }
}

module.exports = {
  getFaculties,
  getDepartments,
  getPrograms,
  generateMatricNumber
}