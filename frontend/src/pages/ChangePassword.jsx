import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../api'

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const getRedirectPath = () => {
    // Check each storage key and get role
    const student = localStorage.getItem('student')
    const staff = localStorage.getItem('staff')
    const admin = localStorage.getItem('admin')

    if (student) {
      return '/student/dashboard'
    }
    if (staff) {
      const staffData = JSON.parse(staff)
      if (staffData.role === 'hod') return '/hod/dashboard'
      return '/staff/dashboard'
    }
    if (admin) {
      return '/admin/dashboard'
    }
    return '/login'
  }

  const updateFirstLogin = () => {
    // Update first_login flag for whichever user is logged in
    const studentRaw = localStorage.getItem('student')
    const staffRaw = localStorage.getItem('staff')
    const adminRaw = localStorage.getItem('admin')

    if (studentRaw) {
      const data = JSON.parse(studentRaw)
      data.first_login = false
      localStorage.setItem('student', JSON.stringify(data))
    }
    if (staffRaw) {
      const data = JSON.parse(staffRaw)
      data.first_login = false
      localStorage.setItem('staff', JSON.stringify(data))
    }
    if (adminRaw) {
      const data = JSON.parse(adminRaw)
      data.first_login = false
      localStorage.setItem('admin', JSON.stringify(data))
    }
  }

  const handleChangePassword = async () => {
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from current password')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Password changed successfully! Redirecting...')
        updateFirstLogin()

        // Wait 1.5 seconds then redirect
        setTimeout(() => {
          navigate(getRedirectPath())
        }, 1500)

      } else {
        setError(data.message || 'Failed to change password')
      }
    } catch (err) {
      setError('Cannot connect to server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = (pwd) => {
    if (pwd.length === 0) return null
    if (pwd.length < 6) return { label: 'Too short', color: 'bg-red-500', width: '25%' }
    if (pwd.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: '50%' }
    if (pwd.length < 12) return { label: 'Good', color: 'bg-yellow-500', width: '75%' }
    return { label: 'Strong', color: 'bg-green-500', width: '100%' }
  }

  const strength = passwordStrength(newPassword)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-blue-800 p-6 text-center">
          <div className="text-5xl mb-2">🔐</div>
          <h1 className="text-xl font-bold text-white">Change Password</h1>
          <p className="text-blue-200 text-sm mt-1">
            For your security, please change your password to continue
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 flex items-center gap-2">
          <span className="text-yellow-600">⚠️</span>
          <p className="text-yellow-700 text-xs font-semibold">
            First login detected — password change required
          </p>
        </div>

        <div className="p-6">

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-4 flex items-center gap-2">
              <span>✅</span>
              <p className="text-sm font-semibold">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 flex items-center gap-2">
              <span>❌</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Current Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full border border-gray-300 rounded-xl p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {showCurrent ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-xl p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {showNew ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Password Strength */}
          {strength && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Password strength</span>
                <span className="text-xs font-semibold text-gray-700">{strength.label}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${strength.color}`}
                  style={{ width: strength.width }}>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`w-full border rounded-xl p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  confirmPassword && newPassword !== confirmPassword
                    ? 'border-red-300 bg-red-50'
                    : confirmPassword && newPassword === confirmPassword
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
                }`}
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-xs text-green-500 mt-1">✅ Passwords match</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-gray-600 mb-2">Password Requirements:</p>
            <div className="space-y-1">
              {[
                { text: 'At least 6 characters', met: newPassword.length >= 6 },
                { text: 'Different from current password', met: newPassword !== currentPassword && newPassword.length > 0 },
                { text: 'Passwords match', met: newPassword === confirmPassword && confirmPassword.length > 0 },
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={req.met ? 'text-green-500' : 'text-gray-300'}>
                    {req.met ? '✅' : '⭕'}
                  </span>
                  <span className={`text-xs ${req.met ? 'text-green-700' : 'text-gray-500'}`}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleChangePassword}
            disabled={loading || !!success}
            className="w-full bg-blue-800 text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Changing Password...
              </span>
            ) : '🔐 Change Password'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword