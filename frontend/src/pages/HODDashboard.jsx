import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function HODDashboard() {
  const [staff, setStaff] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedStaff = localStorage.getItem('staff')
    if (!savedStaff) {
      navigate('/staff/login')
      return
    }
    setStaff(JSON.parse(savedStaff))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('staff')
    navigate('/staff/login')
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-orange-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">📐 University Portal — HOD</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {staff.full_name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-orange-800 text-sm px-3 py-1 rounded-lg font-semibold hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">

        {/* HOD Info Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-6">
          <div className="text-6xl">👨‍💼</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{staff.full_name}</h2>
            <p className="text-gray-500 text-sm">Staff ID: {staff.staff_id}</p>
            <p className="text-gray-500 text-sm">Department: {staff.department}</p>
            <p className="text-gray-500 text-sm">Rank: {staff.rank} | {staff.qualification}</p>
          </div>
          <div className="ml-auto text-center bg-orange-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-2xl font-bold text-orange-700">HOD</p>
            <p className="text-xs text-gray-500">{staff.faculty} Faculty</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">342</p>
            <p className="text-sm text-gray-500">Dept Students</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">18</p>
            <p className="text-sm text-gray-500">Dept Lecturers</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">5</p>
            <p className="text-sm text-gray-500">Results Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-500">3</p>
            <p className="text-sm text-gray-500">Reg Exceptions</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Pending Results */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-800 mb-4">📊 Results Awaiting Approval</h3>
            {[
              { code: "CSC 301", title: "Data Structures", lecturer: "Dr. Musa Aliyu", status: "submitted" },
              { code: "CSC 303", title: "Computer Networks", lecturer: "Dr. Fatima Bello", status: "submitted" },
              { code: "CSC 305", title: "Software Engineering", lecturer: "Dr. Musa Aliyu", status: "draft" },
              { code: "MTH 301", title: "Numerical Methods", lecturer: "Dr. Yusuf Garba", status: "submitted" },
              { code: "CSC 307", title: "Operating Systems", lecturer: "Dr. Amina Kolo", status: "draft" },
            ].map((course, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{course.code} — {course.title}</p>
                  <p className="text-xs text-gray-500">{course.lecturer}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  course.status === 'submitted'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {course.status}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Links + Notifications */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">⚡ HOD Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Approve Results", icon: "✅" },
                  { label: "Assign Courses", icon: "📚" },
                  { label: "Dept Timetable", icon: "📅" },
                  { label: "Student Records", icon: "🎓" },
                  { label: "Reg Exceptions", icon: "📝" },
                  { label: "Dept Reports", icon: "📊" },
                  { label: "Lecturers List", icon: "👨‍🏫" },
                  { label: "Announcements", icon: "📢" },
                ].map((link, i) => (
                  <button key={i} className="flex items-center gap-2 bg-gray-50 hover:bg-orange-50 border border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-700 transition">
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">🔔 Notifications</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                <p className="text-sm font-semibold text-yellow-800">Results Due</p>
                <p className="text-xs text-yellow-600 mt-1">5 course results awaiting your approval before July 25th.</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-800">3 Registration Exceptions</p>
                <p className="text-xs text-blue-600 mt-1">Students requesting course registration exceptions need review.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HODDashboard