import { useNavigate } from 'react-router-dom'
import { ToastContainer } from "react-toastify"
import { CheckIcon, StarIcon } from "./components/Icons/icons"
import Navbar from "./components/navbar"

function App() {
  const nav = useNavigate();
  return (
    <>
      <nav className="sticky top-0 z-50">
        <Navbar />
      </nav>

      {/* Hero/Home Section */}
      <section id="home" className="bg-[#f5ebe0] min-h-screen w-full flex items-center">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Sleep Better,
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Live Better
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Transform your dreams with personalized insights into future predictions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.04] active:scale-[0.98] transition-all duration-200" onClick={()=>{nav("/login")}}>
                Start Your Journey
              </button>
              
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <StarIcon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Smart Tracking</h3>
                <p className="text-gray-600 leading-relaxed">Get to know your dream's meaning to your life.</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <StarIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Near-Future insights and warnings"</h3>
                <p className="text-gray-600 leading-relaxed">Understand meaning of your dream and be prepared for future events</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <StarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Personal Insights</h3>
                <p className="text-gray-600 leading-relaxed">Get customized recommendations for better sleep</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white min-h-screen w-full flex items-center py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">About SleepiFy</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We're on a mission to help millions achieve better sleep through science-backed technology and
                personalized care
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-violet-100 to-indigo-100 rounded-3xl p-12 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                      5K+
                    </div>
                    <p className="text-xl text-gray-700 font-medium">Happy Dream Explorers</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Science-Backed Methods</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our approach is rooted in dream science research and validated by experts in the field
                    </p>


                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Experience</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Every user gets a tailored experience based on their unique dream patterns.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Continuous Innovation</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We're constantly improving our platform with the latest dream decoding and user feedback
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[#f5ebe0] min-h-screen w-full flex items-center py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Start your journey to decode your dreams with a plan that fits your needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">5 Dream interpretations per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Basic AI interpretations, without advices, insights and real-life connections</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">No Access to Dream Symbols</span>
                  </li>
                </ul>
                <button className="w-full px-6 py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-all duration-200" onClick={()=>{nav("/login")}}>
                  Get Started
                </button>
              </div>

              {/* BASIC Plan */}
              <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 transform scale-105">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 inline-block mb-4">
                  <span className="text-white font-semibold text-sm">MOST POPULAR</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">BASIC</h3>
                <p className="text-violet-100 mb-6">Great for regular dream explorers. More detailed interpretations than Free, uncover deeper insights, and keep your dreams for longer.</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$9.99</span>
                  <span className="text-violet-100">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">40 dream decodes per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">Advanced moderate depth AI interpretations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">Symbols and their meaning are included in interpretation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">Detailed symbol analysis for richer understanding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">Access to Dream Symbols</span>
                  </li>
                </ul>
                <button className="w-full px-6 py-3 rounded-xl bg-white text-violet-600 font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" onClick={()=>{nav("/login")}}>
                  Get Basic
                </button>
              </div>

              {/* Premium Plan */}
              <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <p className="text-gray-600 mb-6">Ultimate dream decoding experience. Unlock unlimited dreams, the most insightful AI interpretations, and in-depth psychological analysis.</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$24.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Unlimited dream decodes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Premium AI with deep, detailed interpretation of all symbols</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Near-future insights and warnings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">n-depth psychological insights for personal growth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority feature access for new tools and updates</span>
                  </li>
                </ul>
                <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" onClick={()=>{nav("/login")}}>
                  Get Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Footer Section */}
      <footer id="contact" className="bg-[#edede9] w-full py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    SleepiFy
                  </h2>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Transform your dream's meaning with our science-backed platform. Join thousands of users who have
                  already improved their dream understanding.
                </p>
                <div className="flex gap-4">
                  <button className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center hover:bg-violet-700 transition-colors duration-200">
                    <span className="text-white font-semibold"><img src="/instagram.png" alt="" /></span>
                  </button>
                  
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 transition-all duration-200"
                  />
                  <textarea
                    placeholder="Your message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 transition-all duration-200 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 text-sm">© 2025 SleepiFy. All rights reserved.</p>
                <div className="flex gap-6">
                  <a href="#" className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
    </>
  )
}

export default App
