const pool = require('../config/db')

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

const getPrograms = async (req, res) => {
  try {
    const { departmentId } = req.params

    const result = await pool.query(
      `SELECT id, program_name
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

module.exports = {
  getFaculties,
  getDepartments,
  getPrograms
}