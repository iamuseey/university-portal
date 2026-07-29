const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const addStudent = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      faculty_id,
      department_id,
      program_id,
      level,
      admission_session,
    } = req.body

    // 1. GET DEPARTMENT CODE
    const deptResult = await pool.query(
      `SELECT department_code
       FROM departments
       WHERE id = $1`,
      [department_id]
    )

    if (deptResult.rows.length === 0) {
      return res.status(404).json({
        message: "Department not found"
      })
    }

    const code = deptResult.rows[0].department_code
    const sessionYear = admission_session.split('/')[0]

    // 2. GET LAST MATRIC NUMBER
    const lastStudent = await pool.query(
      `SELECT matric_no
       FROM students
       WHERE matric_no LIKE $1
       ORDER BY matric_no DESC
       LIMIT 1`,
      [`${code}/${sessionYear}/%`]
    )

    let nextNumber = 1

    if (lastStudent.rows.length > 0) {
      const last = lastStudent.rows[0].matric_no
      nextNumber = parseInt(last.split('/')[2]) + 1
    }

    const matric_no = `${code}/${sessionYear}/${String(nextNumber).padStart(3,'0')}`

    // 3. HASH PASSWORD WITH MATRIC NO
    const passwordHash = await bcrypt.hash(matric_no, 10)

    const user = await pool.query(
      `INSERT INTO users (full_name,email,phone,password_hash,role,first_login)
      VALUES($1,$2,$3,$4,'student', true)
      RETURNING id`,
      [full_name, email, phone, passwordHash]
    )

    const userId = user.rows[0].id

    // 4. INSERT STUDENT WITH IDS
    await pool.query(
      `INSERT INTO students
      (
        user_id,
        matric_no,
        faculty_id,
        department_id,
        program_id,
        level,
        admission_session
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)`,
      [
        userId,
        matric_no,
        faculty_id,
        department_id,
        program_id,
        level,
        admission_session
      ]
    )

    res.json({
      message: "Student admitted successfully",
      matric_no: matric_no
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" })
  }
}

const studentLogin = async (req, res) => {
  try {
    const { matric_no, password } = req.body

    const studentResult = await pool.query(
      `SELECT
        s.id,
        s.user_id,
        s.matric_no,
        s.department_id,
        s.faculty_id,
        s.program_id,
        d.department_name AS department,
        f.faculty_name AS faculty,
        p.program_name AS program,
        s.level,
        s.cgpa,
        s.academic_status,
        s.state,
        s.lga,
        s.address,
        s.admission_session,
        u.full_name,
        u.email,
        u.phone,
        u.password_hash,
        u.role,
        u.is_active,
        u.first_login,
        u.created_at
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN faculties f ON s.faculty_id = f.id
       JOIN departments d ON s.department_id = d.id
       JOIN programs p ON s.program_id = p.id
       WHERE s.matric_no = $1`,
      [matric_no]
    )

    if (studentResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid matric number or password' })
    }

    const student = studentResult.rows[0]

    if (!student.is_active) {
      return res.status(401).json({ message: 'Account is disabled. Contact admin.' })
    }

    const validPassword = await bcrypt.compare(password, student.password_hash)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid matric number or password' })
    }

    const token = jwt.sign(
      { id: student.user_id, role: student.role, matric_no: student.matric_no },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login successful',
      token,
      student: {
        id: student.id,
        user_id: student.user_id,
        full_name: student.full_name,
        matric_no: student.matric_no,
        department_id: student.department_id,
        faculty_id: student.faculty_id,
        program_id: student.program_id,
        faculty: student.faculty,
        department: student.department,
        program: student.program,
        level: student.level,
        cgpa: student.cgpa,
        academic_status: student.academic_status,
        state: student.state,
        lga: student.lga,
        address: student.address,
        admission_session: student.admission_session,
        email: student.email,
        phone: student.phone,
        first_login: student.first_login,
        is_active: student.is_active,
        created_at: student.created_at
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

    const staffResult = await pool.query(
      `SELECT
        s.id, s.user_id, s.staff_id, s.department, s.faculty, s.rank, s.qualification,
        u.full_name, u.password_hash, u.role, u.is_active, u.first_login, u.created_at
       FROM staff s
       JOIN users u ON s.user_id = u.id
       WHERE s.staff_id = $1`,
      [staff_id]
    )

    if (staffResult.rows.length === 0) return res.status(401).json({ message: 'Invalid staff ID or password' })

    const staff = staffResult.rows[0]

    if (!staff.is_active) return res.status(401).json({ message: 'Account disabled. Contact admin.' })

    const validPassword = await bcrypt.compare(password, staff.password_hash)
    if (!validPassword) return res.status(401).json({ message: 'Invalid staff ID or password' })

    const token = jwt.sign({ id: staff.user_id, role: staff.role, staff_id: staff.staff_id }, process.env.JWT_SECRET, { expiresIn: '24h' })

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
        first_login: staff.first_login,
        created_at: staff.created_at
      }
    })

  } catch (error) {
    console.error('Staff login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

const adminLogin = async (req, res) => {
  try {
    const { admin_id, password } = req.body

    const adminResult = await pool.query(
      `SELECT
        a.id, a.user_id, a.admin_id, a.office, a.access_level,
        u.full_name, u.password_hash, u.role, u.is_active, u.first_login, u.created_at
       FROM admins a
       JOIN users u ON a.user_id = u.id
       WHERE a.admin_id = $1`,
      [admin_id]
    )

    if (adminResult.rows.length === 0) return res.status(401).json({ message: 'Invalid admin ID or password' })

    const admin = adminResult.rows[0]

    if (!admin.is_active) return res.status(401).json({ message: 'Account disabled. Contact IT.' })

    const validPassword = await bcrypt.compare(password, admin.password_hash)
    if (!validPassword) return res.status(401).json({ message: 'Invalid admin ID or password' })

    const token = jwt.sign({ id: admin.user_id, role: admin.role, admin_id: admin.admin_id }, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.json({
      message: 'Login successful',
      token,
      admin: {
        full_name: admin.full_name,
        admin_id: admin.admin_id,
        office: admin.office,
        access_level: admin.access_level,
        role: admin.role,
        first_login: admin.first_login,
        created_at: admin.created_at
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getAllStudents = async (req, res) => {
  try {
    const { search, department, level } = req.query
    let query = `
      SELECT
        s.id,
        s.user_id,
        s.matric_no,

        s.department_id,
        d.department_name AS department,

        s.faculty_id,
        f.faculty_name AS faculty,

        s.program_id,
        p.program_name AS program,

        s.level,
        s.cgpa,
        s.academic_status,
        s.state,
        s.lga,
        s.address,
        s.admission_session,

        u.full_name,
        u.email,
        u.phone,
        u.role,
        u.is_active,
        u.first_login,
        u.created_at
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN faculties f ON s.faculty_id = f.id
      JOIN departments d ON s.department_id = d.id
      JOIN programs p ON s.program_id = p.id
      WHERE 1=1`

    const params = []
    if (search) { params.push(`%${search}%`); query += ` AND (u.full_name ILIKE $${params.length} OR s.matric_no ILIKE $${params.length})` }
    if (department) { params.push(department); query += ` AND s.department_id = $${params.length}` }
    if (level) { params.push(level); query += ` AND s.level = $${params.length}` }
    query += ` ORDER BY s.matric_no ASC`

    const students = await pool.query(query, params)
    res.json({ students: students.rows, total: students.rows.length })

  } catch (error) {
    console.error('Get all students error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// STEP 1: NEW FUNCTIONS ADDED HERE
const getFaculties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        faculty_name
      FROM faculties
      ORDER BY faculty_name
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Server error'
    })
  }
}

const getDepartments = async (req, res) => {
  try {
    const { faculty_id } = req.params

    const result = await pool.query(`
      SELECT
        id,
        department_name
      FROM departments
      WHERE faculty_id = $1
      ORDER BY department_name
    `, [faculty_id])

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Server error'
    })
  }
}

const getPrograms = async (req, res) => {
  try {
    const { department_id } = req.params

    const result = await pool.query(`
      SELECT
        id,
        program_name
      FROM programs
      WHERE department_id = $1
      ORDER BY program_name
    `, [department_id])

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Server error'
    })
  }
}

const toggleStudentStatus = async (req, res) => {
  try {
    const { user_id, is_active } = req.body
    await pool.query(`UPDATE users SET is_active = $1 WHERE id = $2`, [is_active, user_id])
    res.json({ message: `Student account ${is_active? 'activated' : 'deactivated'} successfully` })
  } catch (error) {
    console.error('Toggle status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// THIS ONE IS ALREADY PERFECT
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const userResult = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [req.user.id]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const user = userResult.rows[0]

    const validPassword = await bcrypt.compare(currentPassword, user.password_hash)

    if (!validPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await pool.query(
      `UPDATE users
       SET password_hash = $1,
           first_login = false
       WHERE id = $2`,
      [hashedPassword, req.user.id]
    )

    res.json({ message: 'Password changed successfully. You can now access your dashboard.' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// STEP 2: UPDATED EXPORTS
module.exports = {
  studentLogin,
  staffLogin,
  adminLogin,

  getFaculties,
  getDepartments,
  getPrograms,
  
  getAllStudents,
  toggleStudentStatus,
  addStudent,
  changePassword
}