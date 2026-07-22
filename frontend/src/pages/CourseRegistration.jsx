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
      const response = await fetch('${API_URL}/api/courses/add', {
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
      const response = await fetch('${API_URL}/api/courses/remove', {
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
      const response = await fetch('${API_URL}/api/courses/submit', {
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

      <div className="p-6 max-w-6xl mx-auto">

        {/* Info Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Student</p>
            <p className="font-bold text-gray-800">{student.full_name} — {student.matric_no}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Level / Dept</p>
            <p className="font-bold text-gray-800">{student.level}L — {student.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Session / Semester</p>
            <p className="font-bold text-gray-800">{SESSION} — Semester {SEMESTER}</p>
          </div>
          <div className="text-center bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Total Units</p>
            <p className={`text-2xl font-bold ${totalUnits > maxUnits ? 'text-red-600' : 'text-blue-700'}`}>
              {totalUnits} / {maxUnits}
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Available Courses */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-800 mb-4">📚 Available Courses</h3>
            {availableCourses.map((course) => (
              <div key={course.id} className="flex justify-between items-center py-3 border-b last:border-0">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-700">{course.code}</p>
                    {course.is_compulsory && (
                      <span className="text-xs bg-red-100 text-red-600 px-1 rounded">compulsory</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{course.title}</p>
                  <p className="text-xs text-blue-600">{course.credit_units} units</p>
                </div>
                <button
                  onClick={() => handleAdd(course)}
                  disabled={isRegistered(course.id) || loading}
                  className={`text-xs px-3 py-1 rounded-lg font-semibold transition ${
                    isRegistered(course.id)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  {isRegistered(course.id) ? 'Added ✓' : '+ Add'}
                </button>
              </div>
            ))}
          </div>

          {/* Registered Courses */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-800 mb-4">
              ✅ My Registered Courses ({registeredCourses.length})
            </h3>

            {registeredCourses.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No courses registered yet. Add courses from the left!
              </p>
            ) : (
              registeredCourses.map((course, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-700">{course.code}</p>
                      {course.is_compulsory && (
                        <span className="text-xs bg-red-100 text-red-600 px-1 rounded">compulsory</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{course.title}</p>
                    <p className="text-xs text-blue-600">{course.credit_units} units</p>
                  </div>
                  <button
                    onClick={() => handleRemove(course)}
                    disabled={course.is_compulsory || loading}
                    className={`text-xs px-3 py-1 rounded-lg font-semibold transition ${
                      course.is_compulsory
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}>
                    {course.is_compulsory ? 'Required' : 'Remove'}
                  </button>
                </div>
              ))
            )}

            {/* Submit Button */}
            {registeredCourses.length > 0 && (
              <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
                Submit Registration 🎓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseRegistration