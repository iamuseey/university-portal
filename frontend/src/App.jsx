import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StudentLogin from './pages/StudentLogin'
import StaffLogin from './pages/StaffLogin'
import AdminLogin from './pages/AdminLogin'
import StudentDashboard from './pages/StudentDashboard'
import StaffDashboard from './pages/StaffDashboard'
import AdminDashboard from './pages/AdminDashboard'
import HODDashboard from './pages/HODDashboard'
import CourseRegistration from './pages/CourseRegistration'
import FeePayment from './pages/FeePayment'
import ResultsPage from './pages/ResultsPage'
import ExamCard from './pages/ExamCard'
import ScoreEntry from './pages/ScoreEntry'
import StudentManagement from './pages/StudentManagement'
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

        {/* STAFF ROUTE */}
        <Route path="/staff/scores" element={
          <ProtectedRoute>
            <ScoreEntry />
          </ProtectedRoute>
        } />

        {/* HOD ROUTE */}
        <Route path="/hod/dashboard" element={
          <ProtectedRoute>
            <HODDashboard />
          </ProtectedRoute>
        } />

        {/* COURSE ROUTES */}
        <Route path="/student/courses" element={
          <ProtectedRoute>
            <CourseRegistration />
          </ProtectedRoute>
        } />
        <Route path="/student/courses/add" element={
          <ProtectedRoute>
            <CourseRegistration />
          </ProtectedRoute>
        } />
        <Route path="/student/courses/drop" element={
          <ProtectedRoute>
            <CourseRegistration />
          </ProtectedRoute>
        } />

        {/* PAYMENT ROUTE */}
        <Route path="/student/fees" element={
          <ProtectedRoute>
            <FeePayment />
          </ProtectedRoute>
        } />

        {/* RESULTS ROUTE */} 
        <Route path="/student/results" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />

        {/* EXAM CARD ROUTE */}
        <Route path="/student/examcard" element={
          <ProtectedRoute>
            <ExamCard />
          </ProtectedRoute>
        } />

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/students" element={ // <-- ADDED
          <ProtectedRoute>
            <StudentManagement />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App