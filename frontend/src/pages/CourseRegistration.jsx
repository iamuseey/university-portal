import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CourseRegistration() {
  const [student, setStudent] = useState(null)
  const [availableCourses, setAvailableCourses] = useState([])
  const [registeredCourses, setRegisteredCourses] = useState([])
  const [totalUnits, setTotalUnits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const SESSION = '2025/2026'
  const SEMESTER = 1

  useEffect(() => {
    const savedStudent = localStorage.getItem('student')
    if (!savedStudent) {
      navigate('/login')
      return
    }
    const studentData = JSON.parse(savedStudent)
    setStudent(studentData)
    fetchCourses(studentData)
    fetchRegistered(studentData)
  }, [])

  const fetchCourses = async (studentData) => {
    try {
      const response = await fetch(
        `${API_URL}/api/courses/available?level=${studentData.level}&department=${studentData.department}`
      )
      const data = await response.json()
      setAvailableCourses(data.courses)
    } catch (err) {
      setError('Failed to load courses')
    }
  }

  const fetchRegistered = async (studentData) => {
    try {
      const response = await fetch(
        `${API_URL}/api/courses/registered?student_id=${studentData.id}&session=${SESSION}&semester=${SEMESTER}`
      )
      const data = await response.json()
      setRegisteredCourses(data.registered)
      setTotalUnits(data.total_units)
    } catch (err) {
      setError('Failed to load registered courses')
    }
  }

  const isRegistered = (courseId) => {
    return registeredCourses.some(r => r.course_id === courseId)
  }

  const handleAdd = async (course) => {
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/courses/add`, { // FIXED: backticks
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          course_id: course.id,
          session: SESSION,
          semester: SEMESTER,
          level: student.level
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ ${course.code} added successfully!`)
        fetchRegistered(student)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to add course')
    }
    setLoading(false)
  }

  const handleRemove = async (course) => {
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/courses/remove`, { // FIXED: backticks
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          course_id: course.course_id,
          session: SESSION
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`❌ ${course.code} removed`)
        fetchRegistered(student)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to remove course')
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/courses/submit`, { // FIXED: backticks
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          session: SESSION,
          semester: SEMESTER,
          level: student.level
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`🎉 ${data.message} Total: ${data.total_units} units`)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to submit registration')
    }
  }

  const maxUnits = student?.level >= 100 && student?.level <= 500
    ? { 100: 40, 200: 35, 300: 30, 400: 30, 500: 24 }[student.level]
    : 30

  if (!student) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>

  return (
    // ... rest of your JSX is perfect, no changes needed
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">🎓 Course Registration</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{student.full_name}</span>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-white text-blue-800 text-sm px-3 py-1 rounded-lg font-semibold">
            Back to Dashboard
          </button>
        </div>
      </nav>
      {/* ... rest of your JSX */}
    </div>
  )
}

export default CourseRegistration