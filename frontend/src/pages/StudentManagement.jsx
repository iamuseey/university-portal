import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentManagement() {
  const [admin, setAdmin] = useState(null)
  const [students, setStudents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin')
    if (!savedAdmin) {
      navigate('/admin/login')
      return
    }
    const adminData = JSON.parse(savedAdmin)
    setAdmin(adminData)
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    setError('')
    try {
      const url = `${API_URL}/api/students/all`
      console.log("Fetching students:", url)

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response:", data) // DEBUG

      const studentList = data.students || [] // GUARD
      setStudents(studentList)
      setFiltered(studentList)
      setTotalCount(data.total || studentList.length) // use total from backend or fallback
      
      if (studentList.length === 0) {
        setError('No students found in the system')
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError('Failed to load students. Please check connection.')
      setStudents([]) // GUARD
      setFiltered([])
      setTotalCount(0)
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearch(value)
    const filteredList = students.filter(s => 
      s.full_name?.toLowerCase().includes(value) || 
      s.matric_no?.toLowerCase().includes(value)
    )
    setFiltered(filteredList)
  }

  if (!admin) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading students...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-purple-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">👥 Manage Students</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{admin.full_name}</span>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white text-purple-800 text-sm px-3 py-1 rounded-lg font-semibold">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-purple-700">{totalCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Showing</p>
              <p className="text-2xl font-bold text-gray-700">{filtered.length}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or matric no..."
            value={search}
            onChange={handleSearch}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-gray-500">No students found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">S/N</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Student</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Matric No</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Department</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Level</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, i) => (
                  <tr key={student.id || i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 text-gray-500 text-sm">{i + 1}</td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-700">{student.full_name}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{student.matric_no}</td>
                    <td className="p-4 text-sm text-gray-600">{student.department}</td>
                    <td className="p-4 text-sm text-gray-600">{student.level}L</td>
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

export default StudentManagement