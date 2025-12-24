"use client"

import { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import { AvatarDropdown } from '../../components/AvatarDropDown'
import { FloatingOrbs, MoonIcon, SparkleIcon } from "../../components/Icons/icons"
import Sidebar from "../../components/SideBar"
import { convertMarkdownToHTML } from '../../lib/MarkDown'
import { useAuthStore } from '../../Store/authStore'
import { useDreamStore } from '../../Store/DreamStore'

function DreamDecoderContent() {
  const {
    title,
    content,
    emotions,
    decodedDream,
    loading,
    error,
    setTitle,
    setContent,
    setEmotions,
    decodeDream,
    clearForm,
    setDecodedDream
  } = useDreamStore();

  const [emotionInput, setEmotionInput] = useState("");
  const {checkAuth} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[])

  // Parse emotions from comma-separated string to array
  const handleEmotionsChange = (value: string) => {
    setEmotionInput(value);
    // Split by comma and trim whitespace
    const emotionsArray = value.split(',').map(e => e.trim()).filter(e => e);
    setEmotions(emotionsArray);
  };

  const handleDecode = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please provide both a title and description for your dream");
      return; }// ✅ Exit early if validation fails
    try {
    // ✅ Call decodeDream and wait for result
    const result = await decodeDream();
    
    // ✅ Check if successful
    if (result) {
      toast.success("Dream decoded successfully! 🌙✨");
      console.log("Dream decoded:", result);
    } else {
      // ✅ If result is null, decodeDream already set an error in the store
      toast.error("Failed to decode dream. Please try again.");
    }
  } catch (error) {
    // ✅ Catch any unexpected errors
    console.error("Error decoding dream:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    toast.error(`Error: ${errorMessage}`);
  }

    }


    
    // Success feedback
    

  


  const handleReset = () => {
    clearForm();
    setEmotionInput("");
    setDecodedDream();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
          <MoonIcon className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600 animate-pulse-slow" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Dream Decoder
          </h1>
          <SparkleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 animate-sparkle" />
        </div>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto text-pretty">
          Share your dream with our AI and unlock the hidden meanings within your subconscious mind
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fade-in">
          <p className="text-red-700 text-sm sm:text-base">{error}</p>
        </div>
      )}

      {/* Main content card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/50 shadow-2xl animate-slide-up">
        <div className="space-y-5 sm:space-y-6">
          {/* Title input */}
          <div>
            <label htmlFor="dream-title" className="block text-sm sm:text-base font-semibold text-slate-800 mb-2">
              Dream Title
            </label>
            <input
              id="dream-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Flying Over Mountains"
              maxLength={100}
              className="w-full px-4 py-3 sm:py-4 bg-white/90 border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 text-sm sm:text-base"
              disabled={loading}
            />
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{title.length} / 100 characters</p>
          </div>

          {/* Dream description textarea */}
          <div>
            <label htmlFor="dream-text" className="block text-sm sm:text-base font-semibold text-slate-800 mb-2">
              Describe Your Dream
            </label>
            <textarea
              id="dream-text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share every detail you remember... colors, emotions, people, places, symbols... Tell a little bit about yourself and recent events or actions to make interpretation more precise."
              rows={8}
              maxLength={2000}
              className="w-full px-4 py-3 sm:py-4 bg-white/90 border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 resize-none text-sm sm:text-base leading-relaxed"
              disabled={loading}
            />
            <p className="text-xs sm:text-sm text-slate-500 mt-2">{content.length} / 2000 characters</p>
          </div>

          {/* Emotions input */}
          <div>
            <label htmlFor="dream-emotions" className="block text-sm sm:text-base font-semibold text-slate-800 mb-2">
              Emotions (comma-separated)
            </label>
            <input
              id="dream-emotions"
              value={emotionInput}
              onChange={(e) => handleEmotionsChange(e.target.value)}
              placeholder="e.g., fear, happiness, confusion, excitement"
              className="w-full px-4 py-3 sm:py-4 bg-white/90 border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 text-sm sm:text-base"
              disabled={loading}
            />
            {emotions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {emotions.map((emotion, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs sm:text-sm font-medium"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleDecode}
              disabled={loading || !title.trim() || !content.trim()}
              className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Decoding Dream...</span>
                </>
              ) : (
                <>
                  <SparkleIcon className="w-5 h-5" />
                  <span>Decode Dream</span>
                </>
              )}
            </button>

            {(title || content || decodedDream) && (
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 sm:py-4 bg-slate-200 text-slate-700 font-semibold rounded-xl sm:rounded-2xl hover:bg-slate-300 hover:shadow-lg active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Result section */}
        {decodedDream?.analysis && (
          <div className="mt-6 sm:mt-8 p-5 sm:p-6 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl sm:rounded-2xl border-2 border-violet-200/50 animate-fade-in">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <SparkleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600 animate-sparkle" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">AI Interpretation</h3>
            </div>
            
            {/* Summary */}
            {decodedDream.analysis.summary && (
              <div className="mb-4 p-4 bg-white/60 rounded-lg">
                <h4 className="font-semibold text-slate-700 mb-2">Summary</h4>
                <p className="text-slate-600 text-sm"
                dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(decodedDream.analysis.summary) }} />
              </div>
            )}

            {/* Full interpretation */}
            <div className="prose prose-sm sm:prose-base max-w-none">
              <div 
                className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML( decodedDream.analysis.interpretation )}}
              />
            </div>

            {/* Detected emotions */}
            {decodedDream.analysis.emotions && decodedDream.analysis.emotions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-violet-200">
                <h4 className="font-semibold text-slate-700 mb-2 text-sm">Emotions Analyzed:</h4>
                <div className="flex flex-wrap gap-2">
                  {decodedDream.analysis.emotions.map((emotion, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/80 text-violet-700 rounded-full text-xs font-medium"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dream metadata */}
            <div className="mt-4 pt-4 border-t border-violet-200 text-xs text-slate-500">
              <p>Dream ID: {decodedDream.id}</p>
              <p>Analyzed: {new Date(decodedDream.date).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tips section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/50">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3">
            <SparkleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base">Be Detailed</h4>
          <p className="text-xs sm:text-sm text-slate-600">Include colors, emotions, and sensations you experienced. Also tell about yourself to get the most precise interpretation</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/50">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3">
            <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base">Record Quickly</h4>
          <p className="text-xs sm:text-sm text-slate-600">Dreams fade fast - write them down as soon as you wake up</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/50 sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3">
            <SparkleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base">Note Symbols</h4>
          <p className="text-xs sm:text-sm text-slate-600">
            Pay attention to recurring themes and symbols across dreams
          </p>
        </div>
      </div>
    </div>
  )
}

function DreamDecoder() {
  const [activeTab, setActiveTab] = useState("decoder")
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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Dream Decoder</h1>
              <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">Decode your dreams with AI</p>
            </div>
          </div>

          <AvatarDropdown />
        </div>

        {/* Main content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "decoder" && <DreamDecoderContent />}
        </div>
      </div>
    </div>
  )
}

export default DreamDecoder