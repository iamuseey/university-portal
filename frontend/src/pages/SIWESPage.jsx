import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API_URL from '../api'

function SIWESPage() {
  const [student, setStudent] = useState(null)
  const [siwes, setSiwes] = useState(null)
  const [logs, setLogs] = useState([])
  const [activeTab, setActiveTab] = useState('details')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showLogForm, setShowLogForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  // Weekly log form
  const [weekNo, setWeekNo] = useState('')
  const [activities, setActivities] = useState('')
  const [skills, setSkills] = useState('')
  const [challenges, setChallenges] = useState('')

  // Edit placement form
  const [editForm, setEditForm] = useState({
    company_name: '',
    company_address: '',
    supervisor_name: '',
    supervisor_phone: '',
    supervisor_email: '',
    start_date: '',
    end_date: ''
  })

  const navigate = useNavigate()

  const studentLinks = [
    { label: 'Dashboard', icon: '🏠', path: '/student/dashboard' },
    { label: 'Course Registration', icon: '📝', path: '/student/courses' },
    { label: 'Fee Payment', icon: '💳', path: '/student/fees' },
    { label: 'My Results', icon: '📊', path: '/student/results' },
    { label: 'Exam Card', icon: '🪪', path: '/student/examcard' },
    { label: 'SIWES/IT', icon: '🏢', path: '/student/siwes' },
    { label: 'Medical', icon: '🏥', path: '/student/medical' },
    { label: 'Library', icon: '📚', path: '/student/library' },
    { label: 'Hostel', icon: '🏠', path: '/student/hostel' },
    { label: 'Documents', icon: '📄', path: '/student/documents' },
    { label: 'My Profile', icon: '👤', path: '/student/profile' },
  ]

  useEffect(() => {
    const savedStudent = localStorage.getItem('student')
    if (!savedStudent) {
      navigate('/login')
      return
    }
    const studentData = JSON.parse(savedStudent)
    setStudent(studentData)
    fetchSiwes(studentData)
  }, [])

  const fetchSiwes = async (studentData) => {
    try {
      const response = await fetch(
        `${API_URL}/api/siwes/details?student_id=${studentData.id}`
      )
      const data = await response.json()
      setSiwes(data.siwes)
      setLogs(data.logs || [])

      if (data.siwes) {
        setEditForm({
          company_name: data.siwes.company_name || '',
          company_address: data.siwes.company_address || '',
          supervisor_name: data.siwes.supervisor_name || '',
          supervisor_phone: data.siwes.supervisor_phone || '',
          supervisor_email: data.siwes.supervisor_email || '',
          start_date: data.siwes.start_date?.split('T')[0] || '',
          end_date: data.siwes.end_date?.split('T')[0] || ''
        })
      }
    } catch (err) {
      setError('Failed to load SIWES data')
    }
    setLoading(false)
  }

  const handleSubmitLog = async () => {
    setMessage('')
    setError('')

    if (!weekNo || !activities) {
      setError('Week number and activities are required!')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/siwes/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siwes_id: siwes.id,
          week_number: parseInt(weekNo),
          activities,
          skills_learned: skills,
          challenges
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setShowLogForm(false)
        setWeekNo('')
        setActivities('')
        setSkills('')
        setChallenges('')
        fetchSiwes(student)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to submit log')
    }
  }

  const handleUpdateDetails = async () => {
    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/siwes/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          ...editForm
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setShowEditForm(false)
        fetchSiwes(student)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to update details')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading SIWES data...</p>
    </div>
  )

  if (!student) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role="student" user={student.full_name} links={studentLinks} />

      <div className="p-4 max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow p-5 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                🏢 SIWES / Industrial Training
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Student Industrial Work Experience Scheme
              </p>
            </div>
            {siwes && (
              <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${getStatusColor(siwes.status)}`}>
                {siwes.status}
              </span>
            )}
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

        {/* No SIWES Yet */}
        {!siwes && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-4xl mb-3">🏢</p>
            <h3 className="font-bold text-gray-800 mb-2">
              No SIWES Record Found
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              You haven't submitted your IT placement details yet.
              Fill in your company details to get started.
            </p>
            <button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800">
              + Add Placement Details
            </button>
          </div>
        )}

        {/* SIWES Details */}
        {siwes && (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow mb-4">
              <div className="flex border-b">
                {[
                  { id: 'details', label: '📋 Details' },
                  { id: 'logs', label: `📝 Weekly Logs (${logs.length})` },
                  { id: 'letter', label: '📄 IT Letter' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-700 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">Placement Information</h3>
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold hover:bg-blue-200">
                      ✏️ Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Company Name</p>
                      <p className="font-bold text-gray-800">{siwes.company_name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Company Address</p>
                      <p className="font-semibold text-gray-700 text-sm">{siwes.company_address}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Supervisor Name</p>
                      <p className="font-bold text-gray-800">{siwes.supervisor_name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Supervisor Phone</p>
                      <p className="font-semibold text-gray-700">{siwes.supervisor_phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Supervisor Email</p>
                      <p className="font-semibold text-gray-700 text-sm">{siwes.supervisor_email}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">IT Status</p>
                      <p className={`font-bold capitalize ${
                        siwes.completion_status === 'completed'
                          ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {siwes.completion_status}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Start Date</p>
                      <p className="font-semibold text-gray-700">
                        {new Date(siwes.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">End Date</p>
                      <p className="font-semibold text-gray-700">
                        {new Date(siwes.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Weekly Logs Tab */}
              {activeTab === 'logs' && (
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">Weekly Activity Logs</h3>
                    <button
                      onClick={() => setShowLogForm(true)}
                      className="text-xs bg-green-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700">
                      + Submit Week Log
                    </button>
                  </div>

                  {logs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-4xl mb-2">📝</p>
                      <p className="text-gray-500 text-sm">No weekly logs submitted yet</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="border rounded-xl p-4 mb-3">
                        <div className="flex justify-between items-center mb-3">
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                            Week {log.week_number}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(log.submitted_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Activities</p>
                            <p className="text-sm text-gray-700">{log.activities}</p>
                          </div>
                          {log.skills_learned && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase">Skills Learned</p>
                              <p className="text-sm text-gray-700">{log.skills_learned}</p>
                            </div>
                          )}
                          {log.challenges && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase">Challenges</p>
                              <p className="text-sm text-gray-700">{log.challenges}</p>
                            </div>
                          )}
                          {log.supervisor_comment && (
                            <div className="bg-green-50 rounded-lg p-3">
                              <p className="text-xs font-semibold text-green-700 uppercase">Supervisor Comment</p>
                              <p className="text-sm text-green-700">{log.supervisor_comment}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* IT Letter Tab */}
              {activeTab === 'letter' && (
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-4">IT Placement Letter</h3>

                  {siwes.it_letter_issued ? (
                    <div>
                      {/* Printable Letter */}
                      <div className="border-2 border-gray-300 rounded-xl p-6 mb-4" id="it-letter">
                        <div className="text-center mb-6">
                          <div className="text-4xl mb-2">🎓</div>
                          <h2 className="text-lg font-bold uppercase">Federal University Portal</h2>
                          <h3 className="text-base font-semibold mt-1">
                            Student Industrial Training Placement Letter
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>

                        <p className="text-sm text-gray-700 mb-4">
                          <strong>To:</strong><br />
                          The Manager/IT Coordinator<br />
                          <strong>{siwes.company_name}</strong><br />
                          {siwes.company_address}
                        </p>

                        <p className="text-sm text-gray-700 mb-4">
                          <strong>Dear Sir/Ma,</strong>
                        </p>

                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          This is to introduce <strong>{student.full_name}</strong>, a {student.level}L student
                          of the Department of <strong>{student.department}</strong>, with Matric Number
                          <strong> {student.matric_no}</strong>. This student is required to undergo
                          the Student Industrial Work Experience Scheme (SIWES) as part of the
                          curriculum requirements.
                        </p>

                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          We request that you kindly accept this student for industrial training
                          in your esteemed organization from{' '}
                          <strong>{new Date(siwes.start_date).toLocaleDateString()}</strong> to{' '}
                          <strong>{new Date(siwes.end_date).toLocaleDateString()}</strong>.
                        </p>

                        <p className="text-sm text-gray-700 mb-8 leading-relaxed">
                          Your assistance in this regard will be highly appreciated as it will
                          contribute immensely to the practical knowledge and professional
                          development of the student.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <div className="border-t-2 border-gray-400 pt-2 mt-12">
                              <p className="text-xs text-gray-500">SIWES Coordinator Signature & Stamp</p>
                            </div>
                          </div>
                          <div>
                            <div className="border-t-2 border-gray-400 pt-2 mt-12">
                              <p className="text-xs text-gray-500">HOD Signature & Stamp</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800">
                        🖨️ Print IT Letter
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-4xl mb-3">⏳</p>
                      <p className="text-gray-600 font-semibold">IT Letter Not Yet Issued</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Your IT letter will be available after your placement is approved
                        by the SIWES coordinator.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Submit Weekly Log Modal */}
        {showLogForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              <div className="p-5 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Submit Weekly Log</h3>
                <button onClick={() => setShowLogForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Week Number</label>
                  <input
                    type="number"
                    value={weekNo}
                    onChange={(e) => setWeekNo(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activities This Week</label>
                  <textarea
                    value={activities}
                    onChange={(e) => setActivities(e.target.value)}
                    placeholder="Describe what you did this week..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills Learned</label>
                  <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="What skills did you learn?"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Challenges Faced</label>
                  <textarea
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    placeholder="Any challenges this week?"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="p-5 border-t flex gap-3">
                <button
                  onClick={() => setShowLogForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200">
                  Cancel
                </button>
                <button
                  onClick={handleSubmitLog}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700">
                  Submit Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Placement Details Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
              <div className="p-5 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Placement Details</h3>
                <button onClick={() => setShowEditForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Company Name', key: 'company_name', type: 'text', placeholder: 'e.g. Dangote Group Nigeria Ltd' },
                  { label: 'Company Address', key: 'company_address', type: 'text', placeholder: 'Full company address' },
                  { label: 'Supervisor Name', key: 'supervisor_name', type: 'text', placeholder: 'e.g. Engr. Abdullahi Musa' },
                  { label: 'Supervisor Phone', key: 'supervisor_phone', type: 'text', placeholder: 'e.g. 08012345678' },
                  { label: 'Supervisor Email', key: 'supervisor_email', type: 'email', placeholder: 'supervisor@company.com' },
                  { label: 'Start Date', key: 'start_date', type: 'date', placeholder: '' },
                  { label: 'End Date', key: 'end_date', type: 'date', placeholder: '' },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={editForm[field.key]}
                      onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="p-5 border-t flex gap-3">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">
                  Cancel
                </button>
                <button
                  onClick={handleUpdateDetails}
                  className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800">
                  Save Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SIWESPage