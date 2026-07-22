import API_URL from '../api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentLogin() {
  const [matricNo, setMatricNo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = async () => {
  if (matricNo === '' || password === '') {
    setError('Please fill in all fields')
    return
  }

  try {
    const response = await fetch('${API_URL/api/auth/student/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matric_no: matricNo, password })
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('student', JSON.stringify(data.student))
      navigate('/student/dashboard')
    } else {
      setError(data.message)
    }
  } catch (err) {
    setError('Cannot connect to server. Try again.')
  }
}

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold text-blue-800">
            Student Portal
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your matric number and password
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {/* Matric Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matric Number
          </label>
          <input
            type="text"
            placeholder="e.g. CSC/2022/001"
            value={matricNo}
            onChange={(e) => setMatricNo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          Login to Portal
        </button>

        {/* Forgot Password */}
        <p className="text-center text-sm text-blue-600 mt-4 cursor-pointer hover:underline">
          Forgot Password? Contact your department
        </p>

      </div>
    </div>
  )
}

export default StudentLogin