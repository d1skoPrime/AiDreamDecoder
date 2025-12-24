"use client"

import { useEffect, useState } from "react"
import { AvatarDropdown } from '../../components/AvatarDropDown'
import { EyeIcon, FloatingOrbs, HistoryIcon, MoonIcon, SearchIcon, SparkleIcon, TrashIcon } from "../../components/Icons/icons"
import Sidebar from "../../components/SideBar"
import { formatDate } from '../../lib/FormatTheDate'
import { convertMarkdownToHTML } from '../../lib/MarkDown'
import { useDreamStore } from '../../Store/DreamStore'
import type { Dream } from '../../types'

// Function to search/filter dreams
function filterDreams(dreams: Dream[], searchTerm: string): Dream[] {
  if (!searchTerm.trim()) return dreams

  const term = searchTerm.toLowerCase()
  return dreams.filter(
    (dream) =>
      dream.title.toLowerCase().includes(term) ||
      dream.content.toLowerCase().includes(term) ||
      dream.analysis?.interpretation.toLowerCase().includes(term)
  )
}

// Helper to format date


function HistoryContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null)

  const { fetchHistory, deleteDream, history, loading, error } = useDreamStore()

  // Load history on component mount
  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleDelete = async (dreamId: string) => {
    if (!confirm("Are you sure you want to delete this dream?")) return

    try {
      await deleteDream(dreamId)
      // If deleted dream was selected, clear selection
      if (selectedDream?.id === dreamId) {
        setSelectedDream(null)
      }
    } catch (error) {
      console.error("Failed to delete dream:", error)
      alert("Failed to delete dream. Please try again.")
    }
  }

  const filteredDreams = filterDreams(history, searchTerm)

  // Calculate stats
  const totalDreams = history.length
  const recentDreams = history.filter(d => {
    const dreamDate = new Date(d.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return dreamDate >= weekAgo
  }).length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <HistoryIcon className="w-6 h-6 opacity-80" />
            <SparkleIcon className="w-5 h-5 animate-sparkle" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{totalDreams}</h3>
          <p className="text-violet-100 text-sm">Total Dreams Decoded</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <MoonIcon className="w-6 h-6 opacity-80" />
            <SparkleIcon className="w-5 h-5 animate-sparkle-delayed" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{recentDreams}</h3>
          <p className="text-blue-100 text-sm">This Week</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <SparkleIcon className="w-6 h-6 opacity-80" />
            <SparkleIcon className="w-5 h-5 animate-sparkle" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{history.length > 0 ? '✨' : '—'}</h3>
          <p className="text-indigo-100 text-sm">Dream Journey</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fade-in">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Search bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/50 shadow-lg">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your dreams..."
            className="w-full pl-12 pr-4 py-3 bg-white/90 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dream list */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 shadow-lg text-center">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading your dreams...</p>
            </div>
          ) : filteredDreams.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 shadow-lg text-center">
              <MoonIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No dreams found</h3>
              <p className="text-slate-600">
                {searchTerm ? "Try a different search term" : "Start by decoding your first dream!"}
              </p>
            </div>
          ) : (
            filteredDreams.map((dream) => (
              <div
                key={dream.id}
                className={`bg-white/80 backdrop-blur-xl rounded-2xl p-5 border-2 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer ${
                  selectedDream?.id === dream.id
                    ? "border-violet-500 ring-4 ring-violet-100"
                    : "border-slate-200/50 hover:border-violet-300"
                }`}
                onClick={() => setSelectedDream(dream)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1 text-lg">{dream.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{dream.content}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg flex-shrink-0">
                    <MoonIcon className="w-5 h-5 text-violet-600" />
                  </div>
                </div>

                {/* Emotions tags */}
                {dream.analysis?.emotions && dream.analysis.emotions.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {dream.analysis.emotions.map((emotion, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formatDate(dream.date)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedDream(dream)
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View details"
                    >
                      <EyeIcon className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(dream.id)
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete dream"
                    >
                      <TrashIcon className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail view */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {selectedDream ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 shadow-lg space-y-5 animate-fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedDream.title}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedDream.analysis?.emotions && selectedDream.analysis.emotions.map((emotion, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium"
                      >
                        {emotion}
                      </span>
                    ))}
                    <span className="text-sm text-slate-500 ml-2">{formatDate(selectedDream.date)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDream(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <MoonIcon className="w-5 h-5 text-violet-600" />
                  Dream Description
                </h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{selectedDream.content}</p>
              </div>

              {selectedDream.analysis?.summary && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-slate-800 mb-2 text-sm">Quick Summary</h4>
                  <p dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(selectedDream.analysis.summary) }} />
                </div>
              )}

              {selectedDream.analysis?.interpretation && (
                <div className="p-5 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border-2 border-violet-200/50">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <SparkleIcon className="w-5 h-5 text-violet-600 animate-sparkle" />
                    AI Interpretation
                  </h3>
                  <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(selectedDream.analysis.interpretation) }} />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => handleDelete(selectedDream.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                >
                  Delete
                </button>
                <button className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-all duration-300">
                  Export
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 border border-slate-200/50 shadow-lg text-center">
              <MoonIcon className="w-20 h-20 text-slate-300 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Dream</h3>
              <p className="text-slate-600">Click on any dream card to view its full details and interpretation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function History() {
  const [activeTab, setActiveTab] = useState("history")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Dream History</h1>
              <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">View and manage your past dreams</p>
            </div>
          </div>

          <AvatarDropdown />
        </div>

        {/* Main content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <HistoryContent />
        </div>
      </div>
    </div>
  )
}

export default History