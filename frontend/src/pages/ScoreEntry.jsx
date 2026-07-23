import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ScoreEntry() {
  const [staff, setStaff] = useState(null)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [students, setStudents] = useState([])
  const [scores, setScores] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
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
    setLoading(true)
    setError('')
    try {
      const url = `${API_URL}/api/staff/courses?staff_id=${staffData.id}`
      console.log("Fetching staff courses:", url)

      const response = await fetch(url)
      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      const data = await response.json()
      console.log("Courses API Response:", data) // DEBUG

      setCourses(data.courses || []) // GUARD
      if (!data.courses || data.courses.length === 0) {
        setError('No courses assigned to you for this session')
      }
    } catch (err) {
      console.error("Fetch courses error:", err)
      setError('Failed to load courses')
      setCourses([])
    }
    setLoading(false)
  }

  const fetchStudentsForCourse = async (courseId) => {
    if (!courseId) return
    setLoadingStudents(true)
    setError('')
    setStudents([])
    setScores({})

    try {
      const url = `${API_URL}/api/staff/course-students?course_id=${courseId}&session=${SESSION}`
      console.log("Fetching students for course:", url)

      const response = await fetch(url)
      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      const data = await response.json()
      console.log("Students API Response:", data) // DEBUG

      const studentList = data.students || [] // GUARD
      setStudents(studentList)

      // Initialize score object
      const scoreObj = {}
      studentList.forEach(s => {
        scoreObj[s.id] = { ca: '', exam: '' }
      })
      setScores(scoreObj)

      if (studentList.length === 0) {
        setError('No students registered for this course')
      }
    } catch (err) {
      console.error("Fetch students error:", err)
      setError('Failed to load students for this course')
      setStudents([])
    }
    setLoadingStudents(false)
  }

  const handleScoreChange = (studentId, type, value) => {
    setScores(prev => ({
     ...prev,
      [studentId]: {
       ...prev[studentId],
        [type]: value
      }
    }))
  }

  const handleSubmitScores = async () => {
    setMessage('')
    setError('')

    const scoreData = Object.keys(scores).map(studentId => ({
      student_id: studentId,
      course_id: selectedCourse,
      session: SESSION,
      semester: SEMESTER,
      ca_score: parseFloat(scores[studentId].ca) || 0,
      exam_score: parseFloat(scores[studentId].exam) || 0
    }))

    if (scoreData.length === 0) {
      setError('No scores to submit')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/staff/submit-scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: scoreData })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Scores submitted successfully!')
      } else {
        setError(data.message || 'Failed to submit scores')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to submit scores. Check connection.')
    }
  }

  if (!staff) return (
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
      {/* Navbar */}
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">📝 Score Entry</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{staff.full_name}</span>
          <button
            onClick={() => navigate('/staff/dashboard')}
            className="bg-white text-green-800 text-sm px-3 py-1 rounded-lg font-semibold">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        {message && <div className="bg-green-50 border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-50 border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}

        {/* Course Selector */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">Select Course</h3>
          {courses.length === 0? (
            <p className="text-gray-500">No courses assigned</p>
          ) : (
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value)
                fetchStudentsForCourse(e.target.value)
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Select a course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Students Score Table */}
        {loadingStudents? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p>Loading students...</p>
          </div>
        ) : students.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-5 border-b bg-gray-50">
              <h3 className="font-bold text-gray-800">Enter Scores - {SESSION} Semester {SEMESTER}</h3>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">S/N</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Student</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Matric No</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">CA [30]</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">Exam [70]</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => (
                  <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 text-gray-500 text-sm">{i + 1}</td>
                    <td className="p-4 text-sm font-semibold text-gray-700">{student.full_name}</td>
                    <td className="p-4 text-sm text-gray-600">{student.matric_no}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        max="30"
                        min="0"
                        value={scores[student.id]?.ca || ''}
                        onChange={(e) => handleScoreChange(student.id, 'ca', e.target.value)}
                        className="w-20 border rounded px-2 py-1 text-center"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        max="70"
                        min="0"
                        value={scores[student.id]?.exam || ''}
                        onChange={(e) => handleScoreChange(student.id, 'exam', e.target.value)}
                        className="w-20 border rounded px-2 py-1 text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-5 border-t">
              <button
                onClick={handleSubmitScores}
                className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800">
                Submit Scores
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScoreEntry