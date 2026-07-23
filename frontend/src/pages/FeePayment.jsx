import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function FeePayment() {
  const [student, setStudent] = useState(null)
  const [fees, setFees] = useState([])
  const [payment, setPayment] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const SESSION = '2025/2026'

  useEffect(() => {
    const savedStudent = localStorage.getItem('student')
    if (!savedStudent) {
      navigate('/login')
      return
    }
    const studentData = JSON.parse(savedStudent)
    setStudent(studentData)
    fetchFees(studentData)
    fetchPaymentStatus(studentData)
  }, [])

  const fetchFees = async (studentData) => {
    try {
      const response = await fetch(
        `${API_URL}/api/payments/fees?level=${studentData.level}&department=${studentData.department}&session=${SESSION}`
      )
      const data = await response.json()
      setFees(data.fees)
      setTotalAmount(data.total_amount)
    } catch (err) {
      setError('Failed to load fee structure')
    }
  }

  const fetchPaymentStatus = async (studentData) => {
    try {
      const response = await fetch(
        `${API_URL}/api/payments/status?student_id=${studentData.id}&session=${SESSION}`
      )
      const data = await response.json()
      const combined = data.payments.find(p => p.fee_type === 'Combined School Fees')
      setPayment(combined || null)
    } catch (err) {
      setError('Failed to load payment status')
    }
  }

  const handleGenerateRRR = async () => {
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/payments/generate`, { // FIXED: backticks
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          session: SESSION,
          fee_type: 'Combined School Fees',
          amount: totalAmount
        })
      })

      const data = await response.json()

      if (response.ok) {
        setPayment(data.payment)
        setMessage('RRR generated! Use it to pay at any bank or Remita platform.')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to generate RRR')
    }
    setLoading(false)
  }

  const handleConfirmPayment = async () => {
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/payments/confirm`, { // FIXED: backticks
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: payment.id,
          remita_rrr: payment.remita_rrr
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Payment confirmed successfully!')
        fetchPaymentStatus(student)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to confirm payment')
    }
    setLoading(false)
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const isPaid = payment && payment.status === 'paid'
  const isPending = payment && payment.status === 'pending'

  if (!student) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">💳 Fee Payment</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{student.full_name}</span>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-white text-blue-800 text-sm px-3 py-1 rounded-lg font-semibold">
            Back to Dashboard
          </button>
        </div>
      </nav>
      {/* ... rest of your JSX is perfect */}
    </div>
  )
}

export default FeePayment