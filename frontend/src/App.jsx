import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StudentLogin from './pages/StudentLogin'
import StaffLogin from './pages/StaffLogin'
import AdminLogin from './pages/AdminLogin'
import StudentDashboard from './pages/StudentDashboard'
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Route */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App