"use client"

import { memo, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { AvatarDropdown } from '../../components/AvatarDropDown'
import { FloatingOrbs, HistoryIcon, MoonIcon, SparkleIcon } from '../../components/Icons/icons'
import Sidebar from '../../components/SideBar'
import { useAuthStore } from '../../Store/authStore'
import { useDreamStore } from '../../Store/DreamStore'
import { useUserStore } from '../../Store/userStore'






// Main dashboard content
function DashboardContent() {

  const { history, fetchHistory } = useDreamStore()
  const navigate = useNavigate()


useEffect(()=>{
  const init = async() =>{
    
      await fetchHistory()
    

  }

  init()

}, [])

const totalDreams = history.length
const recentDreams = history.filter(d => {
    const dreamDate = new Date(d.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return dreamDate >= weekAgo
  }).length

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/50 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl sm:rounded-2xl">
            <MoonIcon className="w-6 h-6 sm:w-8 sm:h-8 text-violet-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-balance">
              Welcome to Your Dream Sanctuary
            </h2>
            <p className="text-slate-600 text-base sm:text-lg text-pretty">
              Unlock the mysteries of your subconscious mind with AI-powered dream analysis. Your dreams hold the keys
              to understanding yourself better.
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl">
              <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <SparkleIcon className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 animate-sparkle" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold mb-1">{totalDreams}</h3>
          <p className="text-violet-100 text-sm sm:text-base">Dreams Decoded</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl">
              <SparkleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <SparkleIcon className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 animate-sparkle-delayed" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold mb-1">89%</h3>
          <p className="text-blue-100 text-sm sm:text-base">Insight Accuracy</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl">
              <HistoryIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <SparkleIcon className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 animate-sparkle" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold mb-1">7d</h3>
          <p className="text-indigo-100 text-sm sm:text-base">Tracking Streak</p>
        </div>
      </div>

      {/* Recent dreams section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/50 shadow-lg">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Recent Dream Insights</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-violet-200/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-1 text-sm sm:text-base">Flying Over Mountains</h4>
                <p className="text-xs sm:text-sm text-slate-600 mb-2">
                  This dream suggests a desire for freedom and overcoming obstacles in your life.
                </p>
                <span className="text-xs text-violet-600 font-medium">2 hours ago</span>
              </div>
              <div className="p-2 bg-violet-100 rounded-lg self-start">
                <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl border border-blue-200/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-1 text-sm sm:text-base">Walking Through a Forest</h4>
                <p className="text-xs sm:text-sm text-slate-600 mb-2">
                  Forests represent the unknown and personal growth through exploration.
                </p>
                <span className="text-xs text-blue-600 font-medium">Yesterday</span>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg self-start">
                <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-indigo-200/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-1 text-sm sm:text-base">Meeting an Old Friend</h4>
                <p className="text-xs sm:text-sm text-slate-600 mb-2">
                  This reflects nostalgia and unresolved feelings about past relationships.
                </p>
                <span className="text-xs text-indigo-600 font-medium">3 days ago</span>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg self-start">
                <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to decode a new dream?</h3>
            <p className="text-violet-100 text-sm sm:text-base">
              Share your latest dream and discover its hidden meanings
            </p>
          </div>
          <button className="w-full sm:w-auto px-6 py-3 bg-white text-violet-600 font-semibold rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap" onClick={()=>{navigate("/dream")}}>
            Start Decoding
          </button>
        </div>
      </div>
    </div>
  )
}

// Main dashboard page component
function Dashboard() {

  console.log("dashboard")
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Add loading state



  const {  isAuthenticated, checkAuth} = useAuthStore()
  const {getUserData, user} = useUserStore()


  useEffect(() => {
  const init = async () => {
    
      await checkAuth()
    

    if (!user) {
      await getUserData()
    }

    

    setIsLoading(false)
  }

  init()
}, [])


  // Redirect to login if not authenticated (after check completes)
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     navigate('/login')
  //     console.log('User not authenticated, redirecting to login.')
  //   }
  // }, [isLoading, isAuthenticated, navigate])

  // Show loading spinner while checking auth
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   )
  // }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <FloatingOrbs />

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main content area */}
      <div className="lg:ml-64 relative z-10">
        {/* Top bar */}
        <div className="bg-white/60 backdrop-blur-xl border-b border-slate-200/50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">Explore your dream journey</p>
            </div>
          </div>

          <AvatarDropdown />
        </div>

        {/* Main content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <DashboardContent />
        </div>
      </div>
    </div>
  )
}

export default memo(Dashboard)
