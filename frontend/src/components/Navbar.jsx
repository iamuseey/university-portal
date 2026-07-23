import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Navbar({ role, user, links }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const colors = {
    student: { bg: 'bg-blue-800', text: 'text-blue-800', hover: 'hover:bg-blue-50' },
    staff: { bg: 'bg-green-800', text: 'text-green-800', hover: 'hover:bg-green-50' },
    hod: { bg: 'bg-orange-800', text: 'text-orange-800', hover: 'hover:bg-orange-50' },
    admin: { bg: 'bg-gray-900', text: 'text-gray-900', hover: 'hover:bg-gray-50' },
  }

  const theme = colors[role] || colors.student

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleNavigate = (path) => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className={`${theme.bg} text-white px-4 py-4 flex justify-between items-center relative z-50`}>
        {/* Logo */}
        <h1 className="text-base font-bold">🎓 University Portal</h1>

        {/* Desktop Welcome + Logout */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm">Welcome, {user}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-gray-800 text-sm px-3 py-1 rounded-lg font-semibold hover:bg-gray-100">
            Logout
          </button>
        </div>

        {/* Mobile — Welcome + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <span className="text-sm truncate max-w-32">{user}</span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none">
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className={`relative w-72 max-w-xs ${theme.bg} h-full overflow-y-auto z-50 flex flex-col`}>
            {/* Menu Header */}
            <div className="p-5 border-b border-white border-opacity-20">
              <p className="text-white font-bold text-lg">🎓 University Portal</p>
              <p className="text-white text-opacity-80 text-sm mt-1">{user}</p>
              <p className="text-white text-opacity-60 text-xs capitalize mt-1">{role} Portal</p>
            </div>

            {/* Menu Links */}
            <div className="flex-1 p-3">
              {links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigate(link.path)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition ${
                    location.pathname === link.path
                      ? 'bg-white bg-opacity-20 text-white font-semibold'
                      : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
                  }`}>
                  <span className="text-xl">{link.icon}</span>
                  <span className="text-sm">{link.label}</span>
                </button>
              ))}
            </div>

            {/* Logout at bottom */}
            <div className="p-4 border-t border-white border-opacity-20">
              <button
                onClick={handleLogout}
                className="w-full bg-white bg-opacity-20 text-white py-3 rounded-xl font-semibold hover:bg-opacity-30 transition">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar