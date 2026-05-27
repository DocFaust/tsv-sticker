import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MatchesPage from './pages/MatchesPage'
import Layout from './components/Layout'
import { useUser } from './context/UserContext'

export default function App() {
  const { user } = useUser()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/" replace />} />
        <Route path="/matches" element={user ? <MatchesPage /> : <Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
