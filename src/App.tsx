import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'

// Pages
import { LoginPage } from './pages/auth/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { LeaveRequestsPage } from './pages/leave-requests/LeaveRequestsPage'
import { CreateLeaveRequestPage } from './pages/leave-requests/CreateLeaveRequestPage'
import { UsersPage } from './pages/users/UsersPage'
import { NotFoundPage } from './pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              
              {/* Employee routes */}
              <Route path="leave-requests" element={
                <ProtectedRoute requiredRole={[3]}>
                  <LeaveRequestsPage />
                </ProtectedRoute>
              } />
              <Route path="leave-requests/create" element={
                <ProtectedRoute requiredRole={[3]}>
                  <CreateLeaveRequestPage />
                </ProtectedRoute>
              } />
              
              {/* Manager routes */}
              <Route path="team-requests" element={
                <ProtectedRoute requiredRole={[1, 2]}>
                  <LeaveRequestsPage />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="all-requests" element={
                <ProtectedRoute requiredRole={[1]}>
                  <LeaveRequestsPage />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute requiredRole={[1, 2]}>
                  <UsersPage />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App