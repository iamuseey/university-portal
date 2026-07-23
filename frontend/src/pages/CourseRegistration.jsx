import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CourseRegistration() {
  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState([])
  const [selectedCourses, setSelectedCourses] = useState([])
  const [loading, setLoading] = useState(true) // start true
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const SESSION = '2025/2026'

  useEffect(() => {
    const savedStudent = localStorage.getItem('student')
    if (!savedStudent) {
      navigate('/login')
      return
    }
    const studentData = JSON.parse(savedStudent)
    setStudent(studentData)
    fetchCourses(studentData)
  }, [])

  const fetchCourses = async (studentData) => {
    setLoading(true)
    setError('')
    try {
      const url = `${API_URL}/api/courses/available?level=${studentData.level}&department=${studentData.department}&session=${SESSION}`
      console.log("Fetching courses:", url)

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response:", data) // DEBUG

      setCourses(data.courses || []) // GUARD: fallback to empty array
      
      if (!data.courses || data.courses.length === 0) {
        setError('No courses found for your level and department')
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError('Failed to load courses. Please check your connection and try again.')
      setCourses([]) // GUARD: prevent crash
    }
    setLoading(false)
  }

  const handleToggleCourse = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const handleRegister = async () => {
    if (selectedCourses.length === 0) {
      setError('Please select at least one course')
      return
    }
    // your register logic here
  }

  if (!student) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading courses...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">📚 Course Registration</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{student.full_name}</span>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-white text-blue-800 text-sm px-3 py-1 rounded-lg font-semibold">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-4xl mx-auto">
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

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-800 mb-4">
            Available Courses - {SESSION}
          </h3>

          {courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500">No courses available for this session</p>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-bold text-gray-800">{course.code}</p>
                    <p className="text-sm text-gray-500">{course.title} - {course.credit_units} Units</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleToggleCourse(course.id)}
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </div>
          )}

          {courses.length > 0 && (
            <button
              onClick={handleRegister}
              className="mt-6 w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800">
              Register Selected Courses
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseRegistration