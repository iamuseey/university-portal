import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ScoreEntry() {
  const [staff, setStaff] = useState(null)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [scores, setScores] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const SESSION = '2025/2026'
  const SEMESTER = 1

  useEffect(() => {
    const savedStaff = localStorage.getItem('staff')
    if (!savedStaff) {
      navigate('/staff/login')
      return
    }
    const staffData = JSON.parse(savedStaff)
    setStaff(staffData)
    fetchCourses(staffData)
  }, [])

  const fetchCourses = async (staffData) => {
    try {
      const response = await fetch(
        `${API_URL}/api/courses/available?level=300&department=${staffData.department}`
      )
      const data = await response.json()
      setCourses(data.courses)
    } catch (err) {
      setError('Failed to load courses')
    }
  }

  const fetchStudents = async (course) => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch(
        `${API_URL}/api/scores/students?course_id=${course.id}&session=${SESSION}&semester=${SEMESTER}`
      )
      const data = await response.json()
      setStudents(data.students)

      const initialScores = {}
      data.students.forEach(s => {
        initialScores[s.student_id] = {
          ca_score: s.ca_score || '',
          exam_score: s.exam_score || ''
        }
      })
      setScores(initialScores)
    } catch (err) {
      setError('Failed to load students')
    }
    setLoading(false)
  }

  const handleCourseSelect = (course) => {
    setSelectedCourse(course)
    fetchStudents(course)
  }

  const handleScoreChange = (studentId, field, value) => {
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }))
  }

  const calculateGrade = (total) => {
    if (total >= 70) return { grade: 'A', point: 5.0 }
    if (total >= 60) return { grade: 'B', point: 4.0 }
    if (total >= 50) return { grade: 'C', point: 3.0 }
    if (total >= 45) return { grade: 'D', point: 2.0 }
    return { grade: 'F', point: 0.0 }
  }

  const handleSaveScores = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const scoreData = Object.entries(scores).map(([studentId, score]) => {
        const ca = parseFloat(score.ca_score) || 0
        const exam = parseFloat(score.exam_score) || 0
        const total = ca + exam
        const { grade, point } = calculateGrade(total)

        return {
          student_id: parseInt(studentId),
          course_id: selectedCourse.id,
          session: SESSION,
          semester: SEMESTER,
          ca_score: ca,
          exam_score: exam,
          total_score: total,
          grade,
          grade_point: point
        }
      })

      const response = await fetch(`${API_URL}/api/scores/save`, { // FIXED: backticks
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: scoreData,
          submitted_by: staff.user_id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Scores saved successfully!')
        fetchStudents(selectedCourse)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to save scores')
    }
    setLoading(false)
  }

  const handleSubmitToHOD = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/scores/submit`, { // FIXED: backticks
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: selectedCourse.id,
          session: SESSION,
          semester: SEMESTER,
          submitted_by: staff.user_id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('🎉 Results submitted to HOD for approval!')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to submit results')
    }
    setLoading(false)
  }

  if (!staff) return null

  return (
    // ... rest of your JSX is perfect
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
    </div>
  )
}

export default ScoreEntry