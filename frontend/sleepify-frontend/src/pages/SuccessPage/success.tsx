"use client"

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckIcon, CrownIcon } from '../../components/Icons/icons'

function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      navigate('/subscriptions')
      return
    }

    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stripe/success?session_id=${sessionId}`
        )
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          return
        }

        setSessionData(data)
      } catch (err) {
        console.error('Error fetching session:', err)
        setError('Failed to verify payment. Please contact support.')
      } finally {
        setLoading(false)
      }
    }

    fetchSessionDetails()
  }, [sessionId, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Payment Failed</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/subscriptions')}
            className="py-3 px-6 bg-red-500 text-white rounded-xl font-semibold hover:shadow-md transition"
          >
            Go to Subscriptions
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200/50">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckIcon className="w-10 h-10 text-white" />
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-slate-600 mb-2">
            Welcome to Sleepify! Your subscription is now active.
          </p>
          <p className="text-sm text-slate-500">
            You now have access to all  features that are available for your plan..
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-violet-50 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <CrownIcon className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">What's Next?</h3>
              <p className="text-sm text-slate-600">
                Start analyzing your dreams with advanced AI interpretations and unlock deeper insights.
              </p>
            </div>
          </div>
        </div>

        {/* Session Info */}
        {sessionData?.subscription && (
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm">
            <p className="text-slate-600">
              <span className="font-semibold">Session ID:</span>
              <br />
              <span className="text-xs font-mono break-all">{sessionData.sessionId}</span>
            </p>
            <p className="text-slate-600">
              <span className="font-semibold">Subscription Tier:</span> {sessionData.subscription.tier}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/subscriptions')}
            className="w-full py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-300"
          >
            View Subscription
          </button>
        </div>

        {/* Confirmation Email Note */}
        <p className="text-center text-xs text-slate-500 mt-6">
          📧 A confirmation email has been sent to your inbox
        </p>
      </div>
    </div>
  )
}

export default Success
