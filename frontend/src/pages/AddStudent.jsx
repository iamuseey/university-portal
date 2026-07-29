import { useState, useEffect } from 'react'
import API_URL from '../api'
import Navbar from '../components/Navbar'
import { adminLinks } from '../links'

function AddStudent() {
  const admin = JSON.parse(localStorage.getItem('admin'))

  // STEP 2: New states for dropdowns
  const [faculties, setFaculties] = useState([])
  const [departments, setDepartments] = useState([])
  const [programs, setPrograms] = useState([])

  // STEP 3: Updated formData to use IDs
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    faculty_id: '',
    department_id: '',
    program_id: '',
    admission_session: '2026/2027',
    level: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // STEP 5: Updated handleChange for cascading
  const handleChange = async (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
     ...prev,
      [name]: value
    }))

    if (name === 'faculty_id') {
      setFormData(prev => ({
       ...prev,
        faculty_id: value,
        department_id: '',
        program_id: ''
      }))

      setPrograms([])

      const res = await fetch(
        `${API_URL}/api/auth/departments/${value}`
      )

      const data = await res.json()
      setDepartments(data)
    }

    if (name === 'department_id') {
      setFormData(prev => ({
       ...prev,
        department_id: value,
        program_id: ''
      }))

      const res = await fetch(
        `${API_URL}/api/auth/programs/${value}`
      )

      const data = await res.json()
      setPrograms(data)
    }
  }

  // STEP 4: Fetch faculties on load
  useEffect(() => {
    fetchFaculties()
  }, [])

  const fetchFaculties = async () => {
    const res = await fetch(`${API_URL}/api/auth/faculties`)
    const data = await res.json()
    setFaculties(data)
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

Default Password: ${data.matric_no}`
        )

        setFormData({
          full_name: '',
          email: '',
          phone: '',
          faculty_id: '',
          department_id: '',
          program_id: '',
          admission_session: '2026/2027',
          level: ''
        })
        setDepartments([])
        setPrograms([])
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

            {/* STEP 6: Faculty Dropdown */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  Faculty
                </label>
                <select
                  name="faculty_id"
                  value={formData.faculty_id}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select Faculty</option>
                  {faculties.map(faculty => (
                    <option
                      key={faculty.id}
                      value={faculty.id}
                    >
                      {faculty.faculty_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STEP 7: Department Dropdown */}
              <div>
                <label className="block mb-1 font-medium">
                  Department
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select Department</option>
                  {departments.map(department => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* STEP 8: Program Dropdown */}
            <div>
              <label className="block mb-1 font-medium">
                Program
              </label>
              <select
                name="program_id"
                value={formData.program_id}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              >
                <option value="">Select Program</option>
                {programs.map(program => (
                  <option
                    key={program.id}
                    value={program.id}
                  >
                    {program.program_name}
                  </option>
                ))}
              </select>
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
                  Admission Session
                </label>

                <input
                  name="admission_session"
                  value={formData.admission_session}
                  onChange={handleChange}
                  required
                  placeholder="2026/2027"
                  className="w-full border rounded-lg p-3"
                />
              </div>

            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
            >
              {loading? 'Admitting Student...' : 'Admit Student'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default AddStudent