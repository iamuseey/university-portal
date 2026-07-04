function AdminLogin() {
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

        {/* Admin ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Admin ID
          </label>
          <input
            type="text"
            placeholder="Enter your admin ID"
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
            className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Button */}
        <button className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition">
          Login to Admin Portal
        </button>

        {/* Warning */}
        <p className="text-center text-sm text-gray-500 mt-4">
          ⚠️ Unauthorized access is prohibited
        </p>

      </div>
    </div>
  )
}

export default AdminLogin