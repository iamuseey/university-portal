import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StudentLogin from './pages/StudentLogin'
import StaffLogin from './pages/StaffLogin'
import AdminLogin from './pages/AdminLogin'
import StudentDashboard from './pages/StudentDashboard'
import StaffDashboard from './pages/StaffDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './ProtectedRoute'

function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/login" element={<StudentLogin />} />
<Route path="/staff/login" element={<StaffLogin />} />
<Route path="/admin/login" element={<AdminLogin />} />

<Route path="/student/dashboard" element={
<ProtectedRoute>
<StudentDashboard />
</ProtectedRoute>
} />

<Route path="/staff/dashboard" element={
<ProtectedRoute>
<StaffDashboard />
</ProtectedRoute>
} />

<Route path="/admin/dashboard" element={
<ProtectedRoute>
<AdminDashboard />
</ProtectedRoute>
} />
</Routes>
</BrowserRouter>
)
}

export default App