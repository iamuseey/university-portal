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
        `${API_URL/api/payments/fees?level=${studentData.level}&department=${studentData.department}&session=${SESSION}`
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
        `${API_URL/api/payments/status?student_id=${studentData.id}&session=${SESSION}`
      )
      const data = await response.json()
      // Get the combined payment if exists
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
      const response = await fetch('${API_URL/api/payments/generate', {
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
      const response = await fetch('${API_URL/api/payments/confirm', {
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

      <div className="p-6 max-w-3xl mx-auto">

        {/* Student Info */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{student.full_name}</h2>
              <p className="text-sm text-gray-500">Matric: {student.matric_no}</p>
              <p className="text-sm text-gray-500">
                {student.level}L — {student.department}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Session</p>
              <p className="font-bold text-gray-800">{SESSION}</p>
              <p className="text-sm text-gray-500">Semester 1</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Fee Breakdown */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
          <div className="p-5 border-b bg-gray-50">
            <h3 className="font-bold text-gray-800">
              📋 Fee Breakdown — {SESSION}
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Fee Type</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="text-sm text-gray-700">{fee.fee_type}</p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {formatAmount(fee.amount)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 border-t-2 border-blue-200">
                <td className="p-4 font-bold text-blue-800 text-lg">Total</td>
                <td className="p-4 text-right font-bold text-blue-800 text-lg">
                  {formatAmount(totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-800 mb-4">🏦 Payment</h3>

          {/* Not paid yet */}
          {!payment && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-6">
                Click the button below to generate your Remita RRR payment code.
                Use it to pay at any bank, Remita website, or mobile app.
              </p>
              <button
                onClick={handleGenerateRRR}
                disabled={loading}
                className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">
                {loading ? 'Generating...' : `💳 Pay Now — ${formatAmount(totalAmount)}`}
              </button>
            </div>
          )}

          {/* RRR Generated — Pending */}
          {isPending && (
            <div>
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5 mb-4">
                <p className="text-sm text-yellow-700 font-semibold mb-3">
                  ⏳ Payment Pending — Use this RRR to pay
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-bold text-gray-800 text-lg">
                      {formatAmount(payment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Remita RRR</p>
                    <p className="font-bold text-blue-700 text-lg">
                      {payment.remita_rrr}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Pay using this RRR at any bank branch, Remita.net, or USSD *7797#
                </p>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
                {loading ? 'Confirming...' : '✅ I Have Paid — Confirm Payment'}
              </button>
            </div>
          )}

          {/* Paid */}
          {isPaid && (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Payment Confirmed!
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Your school fees for {SESSION} have been paid successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Amount Paid</p>
                    <p className="font-bold text-green-700">
                      {formatAmount(payment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">RRR</p>
                    <p className="font-bold text-gray-700">{payment.remita_rrr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="font-bold text-gray-700">{payment.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date Paid</p>
                    <p className="font-bold text-gray-700">
                      {new Date(payment.paid_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="mt-4 w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition">
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeePayment