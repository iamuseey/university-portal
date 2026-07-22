import API_URL from '../api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
const [adminId, setAdminId] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')

const navigate = useNavigate()

const handleLogin = async () => {
if (adminId === '' || password === '') {
setError('Please fill in all fields')
return
}

try {
const response = await fetch(`${API_URL}/api/auth/admin/login`, { // FIXED: backticks `
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ admin_id: adminId, password })
})

const data = await response.json()

if (response.ok) {
localStorage.setItem('token', data.token)
localStorage.setItem('admin', JSON.stringify(data.admin))
navigate('/admin/dashboard')
} else {
setError(data.message)
}
} catch (err) {
setError('Cannot connect to server. Try again.')
}
}

return (
<div className="min-h-screen bg-gray-900 flex items-center justify-center">
<div className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">

{/* Header */}
<div className="text-center mb-8">
<div className="text-5xl mb-3">🛡️</div>
<h1 className="text-2xl font-bold text-white">
Admin Portal
</h1>
<p className="text-gray-400 text-sm mt-1">
Authorized personnel only
</p>
</div>

{/* Error Message */}
{error && (
<div className="bg-red-900 border border-red-700 text-red-300 text-sm rounded-lg p-3 mb-4">
{error}
</div>
)}

{/* Admin ID */}
<div className="mb-4">
<label className="block text-sm font-medium text-gray-300 mb-1">
Admin ID
</label>
<input
type="text"
placeholder="Enter your admin ID"
value={adminId}
onChange={(e) => setAdminId(e.target.value)}
className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
/>
</div>

{/* Password */}
<div className="mb-6">
<label className="block text-sm font-medium text-gray-300 mb-1">
Password
</label>
<input
type="password"
placeholder="Enter your password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
/>
</div>

{/* Button */}
<button
onClick={handleLogin}
className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition">
Login to Admin Portal
</button>

<p className="text-center text-sm text-gray-500 mt-4">
⚠️ Unauthorized access is prohibited
</p>

</div>
</div>
)
}

export default AdminLogin