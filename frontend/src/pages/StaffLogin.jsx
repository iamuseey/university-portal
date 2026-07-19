import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StaffLogin() {
  const [staffId, setStaffId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (staffId === '' || password === '') {
      setError('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: staffId, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('staff', JSON.stringify(data.staff))

        // Redirect based on role
        if (data.staff.role === 'hod') {
          navigate('/hod/dashboard')
        } else {
          navigate('/staff/dashboard')
        }
      } else {  // <-- ADDED } ABOVE THIS LINE
        setError(data.message)
      }
    } catch (err) {
      setError('Cannot connect to server. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👨‍🏫</div>
          <h1 className="text-2xl font-bold text-green-800">
            Staff Portal
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Lecturer, HOD, Dean & Bursar access
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {/* Staff ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff ID
          </label>
          <input
            type="text"
            placeholder="e.g. STAFF/2020/042"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition">
          Login to Staff Portal
        </button>

        <p className="text-center text-sm text-green-600 mt-4 cursor-pointer hover:underline">
          Forgot Password? Contact IT department
        </p>

      </div>
    </div>
  )
}

export default StaffLogin