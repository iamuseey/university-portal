import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StudentLogin from './pages/StudentLogin'
import StaffLogin from './pages/StaffLogin'
import AdminLogin from './pages/AdminLogin'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App