import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // <-- fixed
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'
import Cancel from './pages/CancelPage/cancel'
import Dashboard from './pages/DashBoard/dashboard'
import DreamDecoder from './pages/DreamDecoder/dreamD'
import History from './pages/History/History'
import LoginPage from './pages/LoginPage/Login'
import { Profile } from './pages/Profile/Profile'
import Settings from './pages/Settings/Settings'
import Subscriptions from './pages/Subscriptions/subscriptions'
import Success from './pages/SuccessPage/success'
import { Symbols } from './pages/Symbols/Symbols'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<App />} />
    <Route path="/login" element={<LoginPage />} />
    {/* <Route path="/signup" element={<SignupPage />} /> */}

    {/* Protected routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route path="/success" element={<Success/>}/>
    <Route path="/cancel" element={<Cancel/>}/>
    

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/dream"
      element={
        <ProtectedRoute>
          <DreamDecoder />
        </ProtectedRoute>
      }
    />


    <Route
      path="/history"
      element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      }
    />
    <Route
      path="/subscriptions"
      element={
        <ProtectedRoute>
          <Subscriptions />
        </ProtectedRoute>
      }
    />

    <Route
      path="/symbols"
      element={
        <ProtectedRoute>
          <Symbols />
        </ProtectedRoute>
      }
    />

    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
  </Routes>
</BrowserRouter>
  </StrictMode>,
)