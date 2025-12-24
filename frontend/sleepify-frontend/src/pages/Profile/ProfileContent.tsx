"use client"

import { useEffect, useState } from 'react'
import { FaArrowLeft, FaCalendarAlt, FaCrown, FaEnvelope, FaUser } from "react-icons/fa"
import { SiDreamstime } from "react-icons/si"
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../Store/authStore'
import { useUserStore } from "../../Store/userStore"

export const ProfileContent = () => {
  const { user, getUserData } = useUserStore()
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const nav = useNavigate()

  const expiresAt = user?.subscription.expiresAt;

  const formatted = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No expiration";

  useEffect(() => {
    getUserData()
  }, [getUserData])

  const handleBackToDashboard = () => {
    nav("/dashboard")
  }

  // ✅ Function to get initials for fallback avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    const first = words[0]?.charAt(0).toUpperCase() || "";
    const second = words[1]?.charAt(0).toUpperCase() || "";
    return (first + second) || "U";
  }


  // In your account/subscription settings page
const handleManageSubscription = async () => {
  try {
    setIsLoading(true);

    // Get the user's Stripe customer ID
    const stripeCustomerId = user?.stripeCustomerId;

    if (!stripeCustomerId) {
      alert('No subscription found');
      return;
    }

    // Call your backend to create portal session
    const response = await fetch(
      `${API_URL}/api/stripe/create-portal-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: stripeCustomerId,
        }),
      }
    );

    const data = await response.json();

    // Redirect to Stripe's customer portal
    window.location.href = data.url;
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to open billing portal');
  } finally {
    setIsLoading(false);
  }
};

// In your component


  return (
    <main className="border-slate-200/50 w-full h-full flex justify-center py-8 px-4">
      <div className="flex flex-col items-center min-h-screen w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 animate-slide-up">
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        <div className="w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 text-center">Profile</h1>
          <hr className="mt-2 w-full border-t border-gray-300" />
        </div>

        <div className="flex flex-col sm:flex-row w-full items-center mt-8 gap-6 pb-8 border-b border-gray-200">
          <div className="relative">
            {/* ✅ Fixed avatar with fallback */}
            {!imageError && user?.picture ? (
              <img
                src={user.picture}
                alt="User avatar"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="rounded-full w-32 h-32 border-4 border-violet-200 shadow-lg object-cover"
                onError={() => {
                  console.warn('❌ Profile avatar failed to load');
                  setImageError(true);
                }}
              />
            ) : (
              <div className="rounded-full w-32 h-32 border-4 border-violet-200 shadow-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl">
                {getInitials(user?.name || user?.email)}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">{user?.name || 'User'}</h1>
            <p className="text-slate-500 mt-1">Dream Explorer</p>
          </div>
        </div>

        <div className="w-full mt-8 space-y-4">
          {/* Name Card */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <FaUser className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-medium">Full Name</p>
                <p className="text-lg text-slate-800 font-semibold">{user?.name || "User"}</p>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaEnvelope className="w-10 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 font-medium">Email Address</p>
                <p className="text-sm sm:text-lg text-slate-800 font-semibold break-all">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaCrown className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-medium">Subscription Plan</p>
                <p className="text-lg text-slate-800 font-semibold">{user?.subscription.tier || 'FREE'}</p>
              </div>
              <button
        onClick={handleManageSubscription}
        
        className="px-4 py-2 bg-slate-600 text-white rounded-lg cursor-pointer animate-bounce transition-colors duration-500 hover:bg-slate-400"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Manage Subscription'}
      </button>
            </div>
          </div>

          {/* Expiry Date Card */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-medium">Subscription Expires</p>
                <p className="text-lg text-slate-800 font-semibold">{formatted}</p>
              </div>
            </div>
          </div>

          {/* Requests Left Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <SiDreamstime className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-medium">Dream Requests Left</p>
                <p className="text-lg text-slate-800 font-semibold">{user?.requestsLeft ?? 0}</p>
              </div>
            </div>
                  
          </div>
        </div>
      </div>
    </main>
  )
}