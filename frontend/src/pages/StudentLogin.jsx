function StudentLogin() {
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

        {/* Matric Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matric Number
          </label>
          <input
            type="text"
            placeholder="e.g. CSC/2022/001"
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
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
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