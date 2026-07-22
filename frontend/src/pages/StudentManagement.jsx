import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentManagement() {
  const [admin, setAdmin] = useState(null)
  const [students, setStudents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin')
    if (!savedAdmin) {
      navigate('/admin/login')
      return
    }
    setAdmin(JSON.parse(savedAdmin))
    fetchStudents()
  }, [])

  const fetchStudents = async (searchTerm = '', level = '', dept = '') => {
    setLoading(true)
    try {
      let url = '${API_URL/api/auth/students?'
      if (searchTerm) url += `search=${searchTerm}&`
      if (level) url += `level=${level}&`
      if (dept) url += `department=${dept}&`

      const response = await fetch(url)
      const data = await response.json()
      setStudents(data.students)
      setFiltered(data.students)
    } catch (err) {
      setError('Failed to load students')
    }
    setLoading(false)
  }

  const handleSearch = (value) => {
    setSearch(value)
    const results = students.filter(s =>
      s.full_name.toLowerCase().includes(value.toLowerCase()) ||
      s.matric_no.toLowerCase().includes(value.toLowerCase())
    )
    setFiltered(results)
  }

  const handleLevelFilter = (value) => {
    setLevelFilter(value)
    fetchStudents(search, value, deptFilter)
  }

  const handleToggleStatus = async (student) => {
    setMessage('')
    setError('')
    try {
      const response = await fetch('${API_URL/api/auth/students/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: student.user_id || student.id,
          is_active: !student.is_active
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        fetchStudents(search, levelFilter, deptFilter)
        if (selectedStudent?.matric_no === student.matric_no) {
          setSelectedStudent({ ...selectedStudent, is_active: !student.is_active })
        }
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const getClassification = (cgpa) => {
    if (cgpa >= 4.5) return { text: 'First Class', color: 'text-green-600' }
    if (cgpa >= 3.5) return { text: '2nd Class Upper', color: 'text-blue-600' }
    if (cgpa >= 2.4) return { text: '2nd Class Lower', color: 'text-yellow-600' }
    if (cgpa >= 1.5) return { text: 'Third Class', color: 'text-orange-600' }
    return { text: 'Pass', color: 'text-red-600' }
  }

  if (!admin) return null

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">🎓 Student Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{admin.full_name}</span>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white text-gray-900 text-sm px-3 py-1 rounded-lg font-semibold">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-blue-700">{students.length}</p>
            <p className="text-sm text-gray-500">Total Students</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-green-600">
              {students.filter(s => s.is_active).length}
            </p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-red-500">
              {students.filter(s => !s.is_active).length}
            </p>
            <p className="text-sm text-gray-500">Inactive</p>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* Student List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow overflow-hidden">

              {/* Filters */}
              <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="🔍 Search name or matric..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <select
                  value={levelFilter}
                  onChange={(e) => handleLevelFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option value="">All Levels</option>
                  <option value="100">100L</option>
                  <option value="200">200L</option>
                  <option value="300">300L</option>
                  <option value="400">400L</option>
                  <option value="500">500L</option>
                </select>
              </div>

              {/* Table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 text-xs font-semibold text-gray-600">Student</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-600">Matric No</th>
                    <th className="text-center p-4 text-xs font-semibold text-gray-600">Level</th>
                    <th className="text-center p-4 text-xs font-semibold text-gray-600">CGPA</th>
                    <th className="text-center p-4 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-center p-4 text-xs font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-400">
                        Loading students...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-400">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((student, i) => (
                      <tr
                        key={i}
                        className={`border-b last:border-0 cursor-pointer transition ${
                          selectedStudent?.matric_no === student.matric_no
                            ? 'bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedStudent(student)}>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-gray-700">
                            {student.full_name}
                          </p>
                          <p className="text-xs text-gray-400">{student.department}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-600">{student.matric_no}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {student.level}L
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm font-bold text-blue-700">
                            {student.cgpa}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            student.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {student.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleStatus(student)
                            }}
                            className={`text-xs px-3 py-1 rounded-lg font-semibold ${
                              student.is_active
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}>
                            {student.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Profile Panel */}
          <div>
            {selectedStudent ? (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">👤</div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {selectedStudent.full_name}
                  </h3>
                  <p className="text-gray-500 text-sm">{selectedStudent.matric_no}</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold mt-2 inline-block ${
                    selectedStudent.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {selectedStudent.is_active ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-semibold text-gray-700">{selectedStudent.department}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Faculty</p>
                    <p className="font-semibold text-gray-700">{selectedStudent.faculty}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Level</p>
                    <p className="font-semibold text-gray-700">{selectedStudent.level}L</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">CGPA</p>
                    <p className="font-bold text-blue-700 text-xl">{selectedStudent.cgpa}</p>
                    <p className={`text-xs font-semibold ${getClassification(selectedStudent.cgpa).color}`}>
                      {getClassification(selectedStudent.cgpa).text}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Academic Status</p>
                    <p className="font-semibold text-gray-700">
                      {selectedStudent.academic_status}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-gray-700 text-sm">
                      {selectedStudent.email}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-700">{selectedStudent.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Registered</p>
                    <p className="font-semibold text-gray-700 text-sm">
                      {new Date(selectedStudent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(selectedStudent)}
                  className={`w-full mt-4 py-2 rounded-lg font-semibold text-sm ${
                    selectedStudent.is_active
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}>
                  {selectedStudent.is_active
                    ? '🚫 Deactivate Account'
                    : '✅ Activate Account'}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-4xl mb-3">👆</p>
                <p className="text-gray-500 text-sm">
                  Click on a student to view their full profile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentManagement