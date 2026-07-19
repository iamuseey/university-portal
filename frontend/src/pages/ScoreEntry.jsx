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
        `http://localhost:5000/api/courses/available?level=300&department=${staffData.department}`
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
        `http://localhost:5000/api/scores/students?course_id=${course.id}&session=${SESSION}&semester=${SEMESTER}`
      )
      const data = await response.json()
      setStudents(data.students)

      // Initialize scores
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

      const response = await fetch('http://localhost:5000/api/scores/save', {
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
      const response = await fetch('http://localhost:5000/api/scores/submit', {
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
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">✏️ Score Entry</h1>
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

        {/* Course Selection */}
        {!selectedCourse && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-800 mb-4">
              📚 Select Course to Enter Scores
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {courses.map((course, i) => (
                <button
                  key={i}
                  onClick={() => handleCourseSelect(course)}
                  className="flex justify-between items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-left">
                  <div>
                    <p className="font-bold text-gray-800">{course.code}</p>
                    <p className="text-sm text-gray-500">{course.title}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {course.credit_units} units
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Score Entry Table */}
        {selectedCourse && (
          <div>
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow p-5 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {selectedCourse.code} — {selectedCourse.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {SESSION} | Semester {SEMESTER} | {students.length} students
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCourse(null)
                  setStudents([])
                  setMessage('')
                  setError('')
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline">
                ← Change Course
              </button>
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

            {/* Score Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">S/N</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Student</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Matric No</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-600">CA (30)</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-600">Exam (70)</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-600">Total</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-600">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, i) => {
                    const ca = parseFloat(scores[student.student_id]?.ca_score) || 0
                    const exam = parseFloat(scores[student.student_id]?.exam_score) || 0
                    const total = ca + exam
                    const { grade } = calculateGrade(total)

                    return (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="p-4 text-gray-500 text-sm">{i + 1}</td>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-gray-700">
                            {student.full_name}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-500">{student.matric_no}</p>
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={scores[student.student_id]?.ca_score || ''}
                            onChange={(e) => handleScoreChange(student.student_id, 'ca_score', e.target.value)}
                            className="w-16 text-center border border-gray-300 rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="70"
                            value={scores[student.student_id]?.exam_score || ''}
                            onChange={(e) => handleScoreChange(student.student_id, 'exam_score', e.target.value)}
                            className="w-16 text-center border border-gray-300 rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-sm font-bold ${total >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                            {total > 0 ? total : '-'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                            grade === 'A' ? 'bg-green-100 text-green-600' :
                            grade === 'B' ? 'bg-blue-100 text-blue-600' :
                            grade === 'C' ? 'bg-yellow-100 text-yellow-600' :
                            grade === 'D' ? 'bg-orange-100 text-orange-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {total > 0 ? grade : '-'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {students.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">👥</p>
                  <p className="text-gray-500">No students registered for this course</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {students.length > 0 && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSaveScores}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                  {loading ? 'Saving...' : '💾 Save Scores'}
                </button>
                <button
                  onClick={handleSubmitToHOD}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
                  {loading ? 'Submitting...' : '📤 Submit to HOD'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScoreEntry