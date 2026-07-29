import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentProfile() {
  const [student, setStudent] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedStudent = localStorage.getItem('student')

    if (!savedStudent) {
      navigate('/login')
      return
    }

    setStudent(JSON.parse(savedStudent))
  }, [])

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const info = [
    { label: 'Full Name', value: student.full_name },
    { label: 'Matric Number', value: student.matric_no },
    { label: 'Faculty', value: student.faculty },
    { label: 'Department', value: student.department },
    { label: 'Level', value: `${student.level} Level` },
    { label: 'CGPA', value: student.cgpa },
    { label: 'Academic Status', value: student.academic_status },
    { label: 'Admission Session', value: student.admission_session },
    { label: 'Email', value: student.email },
    { label: 'Phone', value: student.phone },
    { label: 'State', value: student.state },
    { label: 'Local Government', value: student.lga },
    { label: 'Home Address', value: student.address },
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">

        <button
          onClick={() => navigate('/student/dashboard')}
          className="font-semibold">
          ← Back
        </button>

        <h1 className="font-bold text-lg">
          Student Profile
        </h1>

        <div></div>

      </div>

      <div className="max-w-3xl mx-auto p-6">

        <div className="bg-white rounded-xl shadow p-8">

          <div className="text-center">

            <div className="text-7xl">
              👤
            </div>

            <h2 className="text-2xl font-bold mt-3">
              {student.full_name}
            </h2>

            <p className="text-gray-500">
              {student.matric_no}
            </p>

          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4">

            {info.map((item, index) => (

              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4">

                <p className="text-xs text-gray-500 uppercase">
                  {item.label}
                </p>

                <p className="font-semibold text-gray-700">
                  {item.value || '-'}
                </p>

              </div>

            ))}

          </div>

          <button
            onClick={() => navigate('/student/change-password')}
            className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold">

            🔒 Change Password

          </button>

        </div>

      </div>

    </div>
  )
}

export default StudentProfile