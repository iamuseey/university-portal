import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar' // ADDED

function AdminDashboard() {
  const [admin, setAdmin] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin')
    if (!savedAdmin) {
      navigate('/admin/login')
      return
    }
    setAdmin(JSON.parse(savedAdmin))
  }, [])

  // ADDED: Admin navigation links
  const adminLinks = [
    { label: 'Dashboard', icon: '🏠', path: '/admin/dashboard' },
    { label: 'Manage Students', icon: '🎓', path: '/admin/students' },
    { label: 'Manage Staff', icon: '👨‍🏫', path: '/admin/staff' },
    { label: 'Course Reg Control', icon: '📝', path: '/admin/courses' },
    { label: 'Results Control', icon: '📊', path: '/admin/results' },
    { label: 'Fee Management', icon: '💰', path: '/admin/fees' },
    { label: 'Transcripts', icon: '📄', path: '/admin/transcripts' },
    { label: 'Admissions', icon: '📥', path: '/admin/admissions' },
    { label: 'System Settings', icon: '⚙️', path: '/admin/settings' },
    { label: 'My Profile', icon: '👤', path: '/admin/profile' },
  ]

  // REMOVED: handleLogout - Navbar handles it now

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* REPLACED: Navbar */}
      <Navbar role="admin" user={admin.full_name} links={adminLinks} />

      <div className="p-6 max-w-6xl mx-auto">

        {/* Admin Info Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-6">
          <div className="text-6xl">🛡️</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{admin.full_name}</h2>
            <p className="text-gray-500 text-sm">Admin ID: {admin.admin_id}</p>
            <p className="text-gray-500 text-sm">Office: {admin.office}</p>
            <p className="text-gray-500 text-sm">Access Level: {admin.access_level}</p>
          </div>
          <div className="ml-auto text-center bg-red-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-2xl font-bold text-red-700 capitalize">{admin.role}</p>
            <p className="text-xs text-gray-500">Authorized Personnel</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">1,240</p>
            <p className="text-sm text-gray-500">Total Students</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">87</p>
            <p className="text-sm text-gray-500">Total Staff</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">12</p>
            <p className="text-sm text-gray-500">Departments</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-500">5</p>
            <p className="text-sm text-gray-500">Pending Actions</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-800 mb-4">📋 Recent Activities</h3>
            {[
              { action: "New student registered", time: "2 mins ago", type: "blue" },
              { action: "Result approved — CSC 301", time: "15 mins ago", type: "green" },
              { action: "Fee payment confirmed — CSC/2022/001", time: "1 hour ago", type: "green" },
              { action: "Course registration opened", time: "3 hours ago", type: "yellow" },
              { action: "New staff account created", time: "Yesterday", type: "blue" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${item.type}-500`}></div>
                  <p className="text-sm text-gray-700">{item.action}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">⚡ Admin Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {adminLinks.slice(1, 9).map((link, i) => ( // USING adminLinks NOW
                  <button
                    key={i}
                    onClick={() => navigate(link.path)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-red-50 border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-700 transition">
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">⚠️ Pending Actions</h3>
              {[
                { action: "3 transcript requests pending", urgent: true },
                { action: "2 deferral applications to review", urgent: false },
              ].map((item, i) => (
                <div key={i} className={`rounded-lg p-3 mb-2 border ${item.urgent ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <p className={`text-sm font-semibold ${item.urgent ? 'text-red-700' : 'text-yellow-700'}`}>
                    {item.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard