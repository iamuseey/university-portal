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
      let url = `${API_URL}/api/auth/students?` // FIXED: backticks
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
      const response = await fetch(`${API_URL}/api/auth/students/toggle`, { // FIXED: backticks
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

      {/* ... rest of your JSX is perfect */}
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
        {/* ... rest */}
      </div>
    </div>
  )
}

export default StudentManagement