const pool = require('../config/db')

// Get student SIWES details
const getSiwesDetails = async (req, res) => {
  try {
    const { student_id } = req.query

    const siwes = await pool.query(
      `SELECT * FROM siwes WHERE student_id = $1`,
      [student_id]
    )

    if (siwes.rows.length === 0) {
      return res.json({ siwes: null })
    }

    // Get weekly logs
    const logs = await pool.query(
      `SELECT * FROM siwes_weekly_logs 
       WHERE siwes_id = $1 
       ORDER BY week_number ASC`,
      [siwes.rows[0].id]
    )

    res.json({
      siwes: siwes.rows[0],
      logs: logs.rows
    })

  } catch (error) {
    console.error('Get SIWES error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Submit weekly log
const submitWeeklyLog = async (req, res) => {
  try {
    const { siwes_id, week_number, activities, skills_learned, challenges } = req.body

    // Check if week already submitted
    const existing = await pool.query(
      `SELECT * FROM siwes_weekly_logs 
       WHERE siwes_id = $1 AND week_number = $2`,
      [siwes_id, week_number]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Week already submitted!' })
    }

    await pool.query(
      `INSERT INTO siwes_weekly_logs 
       (siwes_id, week_number, activities, skills_learned, challenges)
       VALUES ($1, $2, $3, $4, $5)`,
      [siwes_id, week_number, activities, skills_learned, challenges]
    )

    res.json({ message: 'Weekly log submitted successfully!' })

  } catch (error) {
    console.error('Submit log error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update SIWES placement details
const updateSiwesDetails = async (req, res) => {
  try {
    const {
      student_id,
      company_name,
      company_address,
      supervisor_name,
      supervisor_phone,
      supervisor_email,
      start_date,
      end_date
    } = req.body

    // Check if SIWES record exists
    const existing = await pool.query(
      `SELECT * FROM siwes WHERE student_id = $1`,
      [student_id]
    )

    if (existing.rows.length > 0) {
      // Update existing
      await pool.query(
        `UPDATE siwes SET
          company_name = $1,
          company_address = $2,
          supervisor_name = $3,
          supervisor_phone = $4,
          supervisor_email = $5,
          start_date = $6,
          end_date = $7
         WHERE student_id = $8`,
        [company_name, company_address, supervisor_name,
         supervisor_phone, supervisor_email, start_date, end_date, student_id]
      )
    } else {
      // Create new
      await pool.query(
        `INSERT INTO siwes 
         (student_id, company_name, company_address, supervisor_name, 
          supervisor_phone, supervisor_email, start_date, end_date, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')`,
        [student_id, company_name, company_address, supervisor_name,
         supervisor_phone, supervisor_email, start_date, end_date]
      )
    }

    res.json({ message: 'SIWES details updated successfully!' })

  } catch (error) {
    console.error('Update SIWES error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getSiwesDetails,
  submitWeeklyLog,
  updateSiwesDetails
}