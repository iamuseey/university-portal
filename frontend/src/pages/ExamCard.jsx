import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ExamCard() {
  const [student, setStudent] = useState(null)
  const [registeredCourses, setRegisteredCourses] = useState([])
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const SESSION = '2025/2026'
  const SEMESTER = 1

  useEffect(() => {
    const savedStudent = localStorage.getItem('student')
    if (!savedStudent) {
      navigate('/login')
      return
    }
    const studentData = JSON.parse(savedStudent)
    setStudent(studentData)
    fetchData(studentData)
  }, [])

  const fetchData = async (studentData) => {
    try {
      // Fetch registered courses
      const coursesRes = await fetch(
        `${API_URL/api/courses/registered?student_id=${studentData.id}&session=${SESSION}&semester=${SEMESTER}`
      )
      const coursesData = await coursesRes.json()
      setRegisteredCourses(coursesData.registered)

      // Fetch payment status
      const paymentRes = await fetch(
        `${API_URL/api/payments/status?student_id=${studentData.id}&session=${SESSION}`
      )
      const paymentData = await paymentRes.json()
      const paid = paymentData.payments.find(p => p.status === 'paid')
      setPaymentStatus(paid || null)

    } catch (err) {
      setError('Failed to load exam card data')
    }
    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const generateExamNumber = (matric) => {
    const cleaned = matric.replace(/\//g, '')
    return `EX${SESSION.replace('/', '')}${cleaned}`
  }

  const isCleared = paymentStatus && registeredCourses.length > 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading exam card...</p>
    </div>
  )

  if (!student) return null

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar - hidden when printing */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center print:hidden">
        <h1 className="text-lg font-bold">🪪 Exam Card</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{student.full_name}</span>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-white text-blue-800 text-sm px-3 py-1 rounded-lg font-semibold">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-3xl mx-auto">

        {/* Not Cleared Warning */}
        {!isCleared && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6 text-center">
            <p className="text-4xl mb-3">🚫</p>
            <h3 className="text-lg font-bold text-red-700 mb-2">
              Exam Card Not Available
            </h3>
            <p className="text-red-600 text-sm mb-4">
              You must complete the following before accessing your exam card:
            </p>
            <div className="text-left max-w-xs mx-auto">
              <div className="flex items-center gap-2 mb-2">
                {paymentStatus
                  ? <span className="text-green-600">✅</span>
                  : <span className="text-red-500">❌</span>}
                <span className="text-sm text-gray-700">School fees paid</span>
              </div>
              <div className="flex items-center gap-2">
                {registeredCourses.length > 0
                  ? <span className="text-green-600">✅</span>
                  : <span className="text-red-500">❌</span>}
                <span className="text-sm text-gray-700">Courses registered</span>
              </div>
            </div>
          </div>
        )}

        {/* Exam Card */}
        {isCleared && (
          <>
            {/* Print Button */}
            <div className="flex justify-end mb-4 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 flex items-center gap-2">
                🖨️ Print Exam Card
              </button>
            </div>

            {/* Actual Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-800">

              {/* Card Header */}
              <div className="bg-blue-800 text-white p-6 text-center">
                <div className="text-4xl mb-2">🎓</div>
                <h1 className="text-xl font-bold uppercase">
                  Federal University Portal
                </h1>
                <h2 className="text-lg font-semibold mt-1">
                  Student Examination Card
                </h2>
                <p className="text-blue-200 text-sm mt-1">
                  {SESSION} Academic Session — Semester {SEMESTER}
                </p>
              </div>

              {/* Clearance Banner */}
              <div className="bg-green-500 text-white text-center py-2 font-bold text-sm">
                ✅ CLEARED FOR EXAMINATION
              </div>

              {/* Student Details */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Full Name</p>
                    <p className="font-bold text-gray-800 text-lg">{student.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Matric Number</p>
                    <p className="font-bold text-gray-800 text-lg">{student.matric_no}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Department</p>
                    <p className="font-semibold text-gray-700">{student.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Faculty</p>
                    <p className="font-semibold text-gray-700">{student.faculty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Level</p>
                    <p className="font-semibold text-gray-700">{student.level}L</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Exam Number</p>
                    <p className="font-bold text-blue-700">
                      {generateExamNumber(student.matric_no)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Confirmation */}
              <div className="px-6 py-3 bg-green-50 border-b flex items-center gap-3">
                <span className="text-green-600 text-xl">💳</span>
                <div>
                  <p className="text-sm font-semibold text-green-700">
                    School Fees Paid — {SESSION}
                  </p>
                  <p className="text-xs text-green-600">
                    RRR: {paymentStatus.remita_rrr} |
                    Date: {new Date(paymentStatus.paid_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Registered Courses */}
              <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-3">
                  Registered Courses ({registeredCourses.length})
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">S/N</th>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">Course Code</th>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">Course Title</th>
                      <th className="text-center p-2 text-xs font-semibold text-gray-600">Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredCourses.map((course, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="p-2 text-gray-500">{i + 1}</td>
                        <td className="p-2 font-semibold text-gray-700">{course.code}</td>
                        <td className="p-2 text-gray-600">{course.title}</td>
                        <td className="p-2 text-center text-gray-600">{course.credit_units}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 bg-gray-50">
                      <td colSpan="3" className="p-2 font-bold text-gray-700">Total Units</td>
                      <td className="p-2 text-center font-bold text-blue-700">
                        {registeredCourses.reduce((sum, c) => sum + parseInt(c.credit_units), 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 border-t p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="border-t-2 border-gray-400 pt-2 mt-8">
                      <p className="text-xs text-gray-500">Student Signature</p>
                    </div>
                  </div>
                  <div>
                    <div className="border-t-2 border-gray-400 pt-2 mt-8">
                      <p className="text-xs text-gray-500">Exam Officer Stamp & Signature</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                  This card must be presented at all examination venues.
                  Loss of this card must be reported immediately to the Exam Officer.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ExamCard