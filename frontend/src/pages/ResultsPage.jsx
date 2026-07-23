import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ResultsPage() {
  const [student, setStudent] = useState(null)
  const [results, setResults] = useState([])
  const [session, setSession] = useState('2025/2026')
  const [semester, setSemester] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const savedStudent = localStorage.getItem('student')
    if (!savedStudent) {
      navigate('/login')
      return
    }
    const studentData = JSON.parse(savedStudent)
    setStudent(studentData)
    fetchResults(studentData, session, semester)
  }, [])

  const fetchResults = async (studentData, sess, sem) => {
    setLoading(true)
    setError('')
    try {
      const url = `${API_URL}/api/results?student_id=${studentData.id}&session=${sess}&semester=${sem}`
      console.log("Fetching results:", url)

      const response = await fetch(url)
      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      const data = await response.json()
      console.log("Results API Response:", data) // DEBUG

      setResults(data.results || []) // GUARD
      if (!data.results || data.results.length === 0) {
        setError('No results found for this session and semester')
      }
    } catch (err) {
      console.error("Fetch results error:", err)
      setError('Failed to load results. Please try again.')
      setResults([]) // GUARD
    }
    setLoading(false)
  }

  const handleFilterChange = () => {
    if (!student) return
    fetchResults(student, session, semester)
  }

  const calculateGPA = () => {
    if (results.length === 0) return 0
    const totalPoints = results.reduce((sum, r) => sum + (r.grade_point * r.credit_units), 0)
    const totalUnits = results.reduce((sum, r) => sum + r.credit_units, 0)
    return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : 0
  }

  if (!student) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading results...</p>
    </div>
  )

  const gpa = calculateGPA()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">📊 My Results</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{student.full_name}</span>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-white text-blue-800 text-sm px-3 py-1 rounded-lg font-semibold">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-5xl mx-auto">
        {error && <div className="bg-red-50 border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Session</label>
              <select 
                value={session} 
                onChange={(e) => setSession(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2">
                <option value="2025/2026">2025/2026</option>
                <option value="2024/2025">2024/2025</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Semester</label>
              <select 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2">
                <option value={1}>First Semester</option>
                <option value={2}>Second Semester</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleFilterChange}
            className="mt-4 w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800">
            Load Results
          </button>
        </div>

        {/* GPA Card */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow p-5 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Current GPA</p>
                <p className="text-3xl font-bold text-blue-700">{gpa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Courses</p>
                <p className="text-2xl font-bold text-gray-700">{results.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500">No results available for selected session</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Course Code</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Course Title</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">Units</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">Score</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">Grade</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">GP</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr key={result.id || i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 text-sm font-bold text-gray-700">{result.course_code}</td>
                    <td className="p-4 text-sm text-gray-600">{result.course_title}</td>
                    <td className="p-4 text-center text-sm text-gray-600">{result.credit_units}</td>
                    <td className="p-4 text-center text-sm text-gray-600">{result.total_score}</td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {result.grade}
                      </span>
                    </td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700">{result.grade_point}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultsPage