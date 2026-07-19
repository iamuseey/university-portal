import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get student data from localStorage
    const savedStudent = localStorage.getItem('student')

    if (!savedStudent) {
      // No data found — send back to login
      navigate('/login')
      return
    }

    setStudent(JSON.parse(savedStudent))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('student')
    navigate('/login')
  }

  // Show loading while data loads
  if (!student) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navigation Bar */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">🎓 University Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {student.full_name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-800 text-sm px-3 py-1 rounded-lg font-semibold hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-6xl mx-auto">

        {/* Student Info Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-6">
          <div className="text-6xl">👤</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{student.full_name}</h2>
            <p className="text-gray-500 text-sm">Matric No: {student.matric_no}</p>
            <p className="text-gray-500 text-sm">Department: {student.department}</p>
            <p className="text-gray-500 text-sm">
              Level: {student.level} | Faculty: {student.faculty}
            </p>
          </div>
          <div className="ml-auto text-center bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Current CGPA</p>
            <p className="text-4xl font-bold text-blue-700">{student.cgpa}</p>
            <p className="text-xs text-green-600 font-semibold">
              {student.cgpa >= 4.5 ? 'First Class' :
               student.cgpa >= 3.5 ? 'Second Class Upper' :
               student.cgpa >= 2.4 ? 'Second Class Lower' :
               student.cgpa >= 1.5 ? 'Third Class' : 'Pass'}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">6</p>
            <p className="text-sm text-gray-500">Registered Courses</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">✅</p>
            <p className="text-sm text-gray-500">Fees Paid</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">3</p>
            <p className="text-sm text-gray-500">Pending Results</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-500">1</p>
            <p className="text-sm text-gray-500">Notifications</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Registered Courses */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-800 mb-4">📚 Registered Courses</h3>
            {[
              { code: "CSC 301", title: "Data Structures", units: 3 },
              { code: "CSC 303", title: "Computer Networks", units: 3 },
              { code: "CSC 305", title: "Software Engineering", units: 3 },
              { code: "MTH 301", title: "Numerical Methods", units: 3 },
              { code: "CSC 307", title: "Operating Systems", units: 3 },
              { code: "GST 301", title: "Entrepreneurship", units: 2 },
            ].map((course, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{course.code}</p>
                  <p className="text-xs text-gray-500">{course.title}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {course.units} units
                </span>
              </div>
            ))}
          </div>

          {/* Quick Links + Notifications */}
          <div className="flex flex-col gap-6">

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">⚡ Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "My Results", icon: "📊", path: "/student/results" },
                  { label: "Pay Fees", icon: "💳", path: "/student/fees" },
                  { label: "Timetable", icon: "📅", path: "/student/timetable" },
                  { label: "Course Reg", icon: "📝", path: "/student/courses" },
                  { label: "Library", icon: "📚", path: "/student/library" },
                  { label: "Hostel", icon: "🏠", path: "/student/hostel" },
                  { label: "Documents", icon: "📄", path: "/student/documents" },
                  { label: "My Profile", icon: "👤", path: "/student/profile" },
                ].map((link, i) => (
                  <button 
                    key={i} 
                    onClick={() => navigate(link.path)} 
                    className="flex items-center gap-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-700 transition">
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">🔔 Notifications</h3>
              <div className="bg-yellow-50 border-yellow-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-yellow-800">Exam Timetable Released</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Second semester exams begin July 20th. Check your timetable.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard