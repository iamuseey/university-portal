import { useState } from 'react'
import API_URL from '../api'
import Navbar from '../components/Navbar'
import { adminLinks } from '../links'

function AddStudent() {
  const admin = JSON.parse(localStorage.getItem('admin'))

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    faculty: '',
    department: '',
    level: '',
    matric_no: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/students/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(
          `Student admitted successfully!

Default Password: ${formData.matric_no}`
        )

        setFormData({
          full_name: '',
          email: '',
          phone: '',
          faculty: '',
          department: '',
          level: '',
          matric_no: ''
        })
      } else {
        setError(data.message)
      }

    } catch (err) {
      console.error(err)
      setError('Unable to connect to server.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar
        role="admin"
        user={admin?.full_name}
        links={adminLinks}
      />

      <div className="max-w-3xl mx-auto p-6">

        <div className="bg-white rounded-xl shadow-lg">

          <div className="border-b p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Admit New Student
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Create a new student account in the university portal.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5"
          >

            {message && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-1 font-medium">
                Full Name
              </label>

              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block mb-1 font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Phone
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block mb-1 font-medium">
                  Faculty
                </label>

                <input
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Department
                </label>

                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block mb-1 font-medium">
                  Level
                </label>

                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select Level</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Matric Number
                </label>

                <input
                  name="matric_no"
                  value={formData.matric_no}
                  onChange={handleChange}
                  required
                  placeholder="CSC/2025/001"
                  className="w-full border rounded-lg p-3"
                />
              </div>

            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? 'Admitting Student...' : 'Admit Student'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default AddStudent