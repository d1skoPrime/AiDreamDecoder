"use client"


import { FcGoogle } from "react-icons/fc"
import { FloatingOrbs, SparkleIcon } from '../../components/Icons/icons'
import { API_URL } from '../../Store/authStore'

// Custom Link component (as requested, not importing from Next.js)


// Floating orbs background component


export default function LoginPage() {




  


  

  const GoogleAuth = () => {
      window.location.href = `${API_URL}/api/auth/google/login`;
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingOrbs />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4 gap-2">
            <SparkleIcon className="w-8 h-8 text-violet-600 animate-sparkle" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Sleepify
            </h1>
            <SparkleIcon className="w-8 h-8 text-blue-600 animate-sparkle-delayed" />
          </div>
          <p className="text-slate-600 text-lg">Dream Decoding Using AI</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 animate-slide-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-600">Sign in to decode your dreams</p>
          </div>

          
            

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={GoogleAuth}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:shadow-md transition-all duration-300 text-slate-700 font-medium cursor-pointer"
            >
              <FcGoogle  size={5} className="w-5 h-5">
               
              </FcGoogle>
              Sign In with Google
            </button>
            
          </div>

          {/* Divider */}
          

        
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-slate-500 mt-6 animate-fade-in-delayed">
          Unlock the secrets of your subconscious with AI-powered dream analysis
        </p>
      </div>
    </div>
  )
}
