"use client"

import { useNavigate } from 'react-router-dom'

function Cancel() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200/50">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </div>

        {/* Cancel Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            Payment Cancelled
          </h1>
          <p className="text-slate-600 mb-2">
            Your subscription payment was cancelled.
          </p>
          <p className="text-sm text-slate-500">
            No charges were made to your account.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6">
          <p className="text-sm text-slate-700 text-center">
            💡 You can try subscribing again anytime. We're here if you need help choosing the right plan!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/subscriptions')}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            View Plans Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cancel