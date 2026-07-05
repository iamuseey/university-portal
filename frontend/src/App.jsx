import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StudentLogin from './pages/StudentLogin'
import StaffLogin from './pages/StaffLogin'
import AdminLogin from './pages/AdminLogin'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student Login - Public */}
        <Route path="/login" element={<StudentLogin />} />

        {/* Staff Login - Internal */}
        <Route path="/staff/login" element={<StaffLogin />} />

        {/* Admin Login - Private */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Student Dashboard */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App