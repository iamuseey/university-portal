import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ResultsPage() {
  const [student, setStudent] = useState(null)
  const [results, setResults] = useState([])
  const [sessions, setSessions] = useState([])
  const [cgpaData, setCgpaData] = useState(null)
  const [selectedSession, setSelectedSession] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [gpa, setGpa] = useState(0)
  const [totalUnits, setTotalUnits] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const savedStudent = localStorage.getItem('student')
    if (!savedStudent) {
      navigate('/login')
      return
    }
    const studentData = JSON.parse(savedStudent)
    setStudent(studentData)
    fetchSessions(studentData)
    fetchCGPA(studentData)
  }, [])

  const fetchSessions = async (studentData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/results/sessions?student_id=${studentData.id}`
      )
      const data = await response.json()
      setSessions(data.sessions)

      // Auto load first session
      if (data.sessions.length > 0) {
        const first = data.sessions[0]
        setSelectedSession(first.session)
        setSelectedSemester(first.semester)
        fetchResults(studentData, first.session, first.semester)
      }
    } catch (err) {
      console.error('Failed to load sessions')
    }
  }

  const fetchResults = async (studentData, session, semester) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/results/student?student_id=${studentData.id}&session=${session}&semester=${semester}`
      )
      const data = await response.json()
      setResults(data.results)
      setGpa(data.gpa)
      setTotalUnits(data.total_units)
    } catch (err) {
      console.error('Failed to load results')
    }
  }

  const fetchCGPA = async (studentData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/results/cgpa?student_id=${studentData.id}`
      )
      const data = await response.json()
      setCgpaData(data)
    } catch (err) {
      console.error('Failed to load CGPA')
    }
  }

  const handleSessionChange = (session, semester) => {
    setSelectedSession(session)
    setSelectedSemester(semester)
    fetchResults(student, session, semester)
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50'
      case 'B': return 'text-blue-600 bg-blue-50'
      case 'C': return 'text-yellow-600 bg-yellow-50'
      case 'D': return 'text-orange-600 bg-orange-50'
      case 'F': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    if (score >= 45) return 'text-orange-600'
    return 'text-red-600'
  }

  if (!student) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )

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

        {/* CGPA Summary */}
        {cgpaData && (
          <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
            <div className="bg-white rounded-xl shadow p-5 text-center col-span-2 md:col-span-1">
              <p className="text-sm text-gray-500 mb-1">Cumulative GPA</p>
              <p className="text-4xl font-bold text-blue-700">{cgpaData.cgpa}</p>
              <p className="text-xs text-green-600 font-semibold mt-1">
                {cgpaData.classification}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">Total Units</p>
              <p className="text-3xl font-bold text-gray-700">{cgpaData.total_units}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">Total Points</p>
              <p className="text-3xl font-bold text-gray-700">{cgpaData.total_points}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">Current GPA</p>
              <p className="text-3xl font-bold text-purple-700">{gpa}</p>
              <p className="text-xs text-gray-500">{selectedSession}</p>
            </div>
          </div>
        )}

        {/* Session Selector */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-3">
              Select Session & Semester
            </p>
            <div className="flex flex-wrap gap-2">
              {sessions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSessionChange(s.session, s.semester)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    selectedSession === s.session && selectedSemester == s.semester
                      ? 'bg-blue-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                  }`}>
                  {s.session} — Sem {s.semester}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">
                Results — {selectedSession} Semester {selectedSemester}
              </h3>
              <p className="text-sm text-gray-500">
                {results.length} courses | {totalUnits} units | GPA: {gpa}
              </p>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500">No results available for this period</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Course</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">Units</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">CA</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">Exam</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">Total</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">Grade</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-600">Points</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-700">{result.code}</p>
                      <p className="text-xs text-gray-500">{result.title}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm text-gray-600">{result.credit_units}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-sm font-semibold ${getScoreColor(result.ca_score)}`}>
                        {result.ca_score}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-sm font-semibold ${getScoreColor(result.exam_score)}`}>
                        {result.exam_score}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-sm font-bold ${getScoreColor(result.total_score)}`}>
                        {result.total_score}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm font-semibold text-gray-700">
                        {result.grade_point}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50 border-t-2 border-blue-200">
                  <td className="p-4 font-bold text-blue-800">Total</td>
                  <td className="p-4 text-center font-bold text-blue-800">{totalUnits}</td>
                  <td colSpan="4" className="p-4 text-center">
                    <span className="text-sm font-bold text-blue-800">
                      GPA: {gpa}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-blue-800">
                    {cgpaData?.total_points}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* Grading Scale */}
        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="font-bold text-gray-800 mb-3">📖 Grading Scale</h3>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
            {[
              { grade: 'A', range: '70-100', point: '5.0', color: 'green' },
              { grade: 'B', range: '60-69', point: '4.0', color: 'blue' },
              { grade: 'C', range: '50-59', point: '3.0', color: 'yellow' },
              { grade: 'D', range: '45-49', point: '2.0', color: 'orange' },
              { grade: 'F', range: '0-44', point: '0.0', color: 'red' },
            ].map((g, i) => (
              <div key={i} className={`text-center p-3 rounded-lg bg-${g.color}-50 border border-${g.color}-200`}>
                <p className={`text-2xl font-bold text-${g.color}-600`}>{g.grade}</p>
                <p className="text-xs text-gray-500">{g.range}</p>
                <p className="text-xs font-semibold text-gray-700">{g.point} pts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage