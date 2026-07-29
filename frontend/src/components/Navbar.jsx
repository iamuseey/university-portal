import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import * as Icons from 'react-icons/io5'
import { IoArrowBack } from 'react-icons/io5'

function Navbar({ role, user, links }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const colors = {
    student: { bg: 'bg-blue-800' },
    staff: { bg: 'bg-green-800' },
    hod: { bg: 'bg-orange-800' },
    admin: { bg: 'bg-gray-900' }
  }

  const theme = colors[role] || colors.student
  const dashboardPath = role === 'admin' ? '/admin/dashboard' : role === 'staff' || role === 'hod' ? '/staff/dashboard' : '/student/dashboard'

  const handleLogout = () => {
    localStorage.clear()
    navigate(role === 'admin' ? '/admin/login' : role === 'staff' || role === 'hod' ? '/staff/login' : '/login')
  }
  const handleNavigate = (path) => { navigate(path); setMenuOpen(false) }
  const goDashboard = () => { navigate(dashboardPath); setMenuOpen(false) }
  const goBack = () => { navigate(-1) }
  const isDashboard = location.pathname === dashboardPath

  return (
    <>
      <nav className={`${theme.bg} text-white px-4 py-4 flex justify-between items-center shadow-md sticky top-0 z-50`}>
        <div className="flex items-center gap-3">
          {!isDashboard &&
            <button
              onClick={goBack}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-white font-semibold transition"
            >
              <IoArrowBack className="text-lg" />
              <span>Back</span>
            </button>
          }
          <h1 onClick={goDashboard} className="text-base font-bold cursor-pointer">🎓 University Portal</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm">Welcome, {user}</span>
          <button onClick={goDashboard} className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-semibold">🏠 Dashboard</button>
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded-lg text-sm font-semibold">🚪 Logout</button>
        </div>
        <div className="flex md:hidden"><button onClick={() => setMenuOpen(!menuOpen)}><span className="text-2xl">{menuOpen ? '✕' : '☰'}</span></button></div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className={`${theme.bg} relative w-72 h-full overflow-y-auto`}>
            <div className="p-5 border-b border-white/20">
              <h2 className="text-white font-bold text-lg">🎓 University Portal</h2>
              <p className="text-white text-sm mt-1">{user}</p>
              <p className="text-white text-xs opacity-70 capitalize">{role} Portal</p>
            </div>
            <div className="p-3">
              <button onClick={goDashboard} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10">
                <span>🏠</span><span>Dashboard</span>
              </button>
            </div>

            <div className="flex-1 px-3">
              {links.map((link, index) => {
                const Icon = Icons[link.icon]
                if (!Icon) return null

                return (
                  <button
                    key={index}
                    onClick={() => handleNavigate(link.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 ${location.pathname === link.path ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'} text-white`}
                  >
                    <Icon className="text-xl" />
                    <span>{link.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="p-4 border-t border-white/20">
              <button onClick={handleLogout} className="w-full bg-red-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">🚪 Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default Navbar