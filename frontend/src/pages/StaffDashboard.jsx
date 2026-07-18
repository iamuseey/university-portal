import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function StaffDashboard() {
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
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">🎓 University Portal — Staff</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {staff.full_name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-green-800 text-sm px-3 py-1 rounded-lg font-semibold hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">

        {/* Staff Info Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-6">
          <div className="text-6xl">👨‍🏫</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{staff.full_name}</h2>
            <p className="text-gray-500 text-sm">Staff ID: {staff.staff_id}</p>
            <p className="text-gray-500 text-sm">Department: {staff.department}</p>
            <p className="text-gray-500 text-sm">Rank: {staff.rank} | {staff.qualification}</p>
          </div>
          <div className="ml-auto text-center bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-2xl font-bold text-green-700 capitalize">{staff.role}</p>
            <p className="text-xs text-gray-500">{staff.faculty} Faculty</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-700">4</p>
            <p className="text-sm text-gray-500">Assigned Courses</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">128</p>
            <p className="text-sm text-gray-500">Total Students</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">2</p>
            <p className="text-sm text-gray-500">Pending Results</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-500">1</p>
            <p className="text-sm text-gray-500">Notifications</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* My Courses */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-800 mb-4">📚 My Courses This Semester</h3>
            {[
              { code: "CSC 301", title: "Data Structures", students: 45 },
              { code: "CSC 305", title: "Software Engineering", students: 38 },
              { code: "CSC 401", title: "Artificial Intelligence", students: 29 },
              { code: "CSC 403", title: "Machine Learning", students: 16 },
            ].map((course, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{course.code}</p>
                  <p className="text-xs text-gray-500">{course.title}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {course.students} students
                </span>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">⚡ Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Enter Scores", icon: "✏️" },
                  { label: "Class List", icon: "👥" },
                  { label: "Submit Results", icon: "📤" },
                  { label: "My Timetable", icon: "📅" },
                  { label: "Upload Materials", icon: "📂" },
                  { label: "Announcements", icon: "📢" },
                  { label: "Attendance", icon: "☑️" },
                  { label: "My Profile", icon: "👤" },
                ].map((link, i) => (
                  <button key={i} className="flex items-center gap-2 bg-gray-50 hover:bg-green-50 border border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-700 transition">
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">🔔 Notifications</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-yellow-800">Results Submission Deadline</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Submit all results before July 25th. Contact HOD for extensions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard