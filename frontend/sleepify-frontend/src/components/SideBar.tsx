"use client"

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../Store/authStore'
import { CrownIcon, DashboardIcon, HistoryIcon, LogoutIcon, MoonIcon, QuestionIcon, SparkleIcon } from "./Icons/icons"

export default function Sidebar({

  
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}) {
  console.log("dashboard")
  const navigate = useNavigate();
  const {logout} = useAuthStore()

   const logoutClick = () => {
    logout()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 h-screen flex flex-col
        fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo section */}
        <div className="p-4 sm:p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparkleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600 animate-sparkle" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Sleepify
              </h1>
            </div>
            {/* Close button for mobile */}
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Dream Decoding AI</p>
        </div>

        {/* Navigation buttons */}
        <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => {
              onTabChange("Dashboard")
              onClose()
              navigate ("/dashboard")
            }}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "Dashboard"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <DashboardIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium cursor-pointer">Dashboard</span>
          </button>


          <button
            onClick={() => {
              onTabChange("decoder")
              onClose()
              navigate ("/dream")
            }}
            
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "decoder"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <MoonIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium cursor-pointer">Dream Decoder</span>
          </button>

          <button
            onClick={() => {
              onTabChange("history")
              onClose()
              navigate ("/history")
            }}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <HistoryIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium cursor-pointer">History</span>
          </button>

          

          <button
            onClick={() => {
              onTabChange("Subscriptions")
              onClose()
              navigate ("/subscriptions")
            }}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "Subscriptions"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <CrownIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium cursor-pointer">Subscriptions</span>
          </button>

          <button
            onClick={() => {
              onTabChange("Dream Symbols")
              navigate('/symbols')
              onClose()
            }}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "Dream Symbols"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <QuestionIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium cursor-pointer">Dream Symbols</span>
          </button>
        </nav>

        {/* Logout button at bottom */}
        <div className="p-3 sm:p-4 border-t border-slate-200/50">
          <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 cursor-pointer"
          onClick={logoutClick}>
            <LogoutIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium cursor-pointer" >Log Out</span>
          </button>
        </div>
      </div>
    </>
  )
}
