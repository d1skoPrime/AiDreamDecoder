"use client"

import { useState } from "react"
import { AvatarDropdown } from '../../components/AvatarDropDown'
import { CheckIcon, CrownIcon, FloatingOrbs, LockIcon, SparkleIcon } from "../../components/Icons/icons"
import Sidebar from "../../components/SideBar"
import { API_URL } from '../../Store/authStore'
import { useUserStore } from '../../Store/userStore'










function SubscriptionsContent() {
  // const [selectedPlan, setSelectedPlan] = useState("free")

  const plans = [
  {
    id: "free",
    name: "FREE",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with dream analysis. Ideal if you just want to explore your dreams occasionally.",
    features: [
      "5 dream decodes per month",
      "Basic AI interpretations, without advices, insights and real-life connections",
      "No Access to Dream Symbols",
      "Community support",
    ],
    buttonText: "FREE",
    gradient: "from-slate-500 to-slate-600",
    icon: SparkleIcon,
  },
  {
    id: "basic",
    name: "BASIC",
    price: "$9.99",
    priceId:"price_1SZOQICOYz6viehWkr64Egke",
    period: "per month",
    description: "Great for regular dream explorers. More detailed interpretations than Free, uncover deeper insights, and keep your dreams for longer.",
    features: [
      "40 dream decodes per month",
      "Advanced moderate depth AI interpretations",
      "Symbols and their meaning are included in interpretation",
      "Priority support for faster help",
      "Access to Dream Symbols",
      "Detailed symbol analysis for richer understanding",
    ],
    buttonText: "Upgrade to Basic",
    gradient: "from-violet-500 to-indigo-600",
    icon: SparkleIcon,
    popular: true,
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "$24.99",
    priceId:"price_1SZOR5COYz6viehWiPMc4uj2",
    period: "per month",
    description: "Ultimate dream decoding experience. Unlock unlimited dreams, the most insightful AI interpretations, and in-depth psychological analysis.",
    features: [
      "Unlimited dream decodes",
      "Premium AI with deep, detailed interpretation of all symbols",
      "Personal life context connections",
      "Near-future insights and warnings",
      "Access to Dream Symbols",
      "24/7 VIP support whenever you need it",
      "In-depth psychological insights for personal growth",
      "Priority feature access for new tools and updates",
    ],
    buttonText: "Upgrade to Premium",
    gradient: "from-indigo-600 to-purple-600",
    icon: CrownIcon,
    
  },
];



 
const [isLoading, setLoading] = useState(false)

  const { user } = useUserStore();

 const handleSubscribe = async (priceId: string) => {
  try {
    setLoading(true);

    // Get current user info
    const userId = user?.id;
    const email = user?.email;

    // Validate user data
    if (!userId || !email) {
      alert('Please log in to subscribe');
      return;
    }

    // Call your backend to create checkout session
    const response = await fetch(
      `${API_URL}/api/stripe/create-checkout-session`, // ← Add /api if you have global prefix
      {
        method: 'POST', // ← IMPORTANT: Specify POST method
        headers: {
          'Content-Type': 'application/json', // ← IMPORTANT: Set content type
        },
        body: JSON.stringify({ // ← IMPORTANT: Put data in body
          userId: userId,
          priceId: priceId,
          email: email,
        }),
      }
    );

    // Check if response is ok
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json(); // ← Add 'await' here

    // Redirect to Stripe checkout
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};
   

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
          <CrownIcon className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600 animate-pulse-slow" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
        </div>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto text-pretty">
          Unlock deeper insights into your dreams with our flexible subscription plans
        </p>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div
              key={plan.id}
              className={`relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                plan.popular ? "border-violet-500 lg:scale-105" : "border-slate-200/50"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{plan.period}</p>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}

              <button
                  onClick={() => {
                    if (plan.priceId) {
                      handleSubscribe(plan.priceId);
                    }
                  }}
                  className={`w-full py-3 sm:py-4 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 ${
                    user?.subscription?.tier === plan.name
                      ? "bg-slate-200 text-slate-600 cursor-default"
                      : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-xl hover:scale-105 active:scale-95`
                  }`}
                  disabled={user?.subscription?.tier === plan.name || isLoading || !plan.priceId}
                >
                  {isLoading 
                    ? "Processing..." 
                    : user?.subscription?.tier === plan.name 
                    ? "Current Plan" 
                    : plan.buttonText
                  }
                </button>

            </div>
          )
        })}
      </div>

      {/* FAQ or additional info */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/50 shadow-lg">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">Subscription Benefits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 ">
              <SparkleIcon className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Cancel Anytime</h4>
              <p className="text-sm text-slate-600">
                No long-term commitments. Cancel your subscription whenever you want.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <LockIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Secure Payments</h4>
              <p className="text-sm text-slate-600">Your payment information is encrypted and secure with Stripe.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 sm:col-span-2 sm:justify-center sm:max-w-md sm:mx-auto">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CrownIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              
              <h4 className="font-semibold text-slate-800 mb-1">Instant Upgrade</h4>
              <p className="text-sm text-slate-600">Upgrade or downgrade your plan instantly with immediate access.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            {/* <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ProfileIcon className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Money-Back Guarantee</h4>
              <p className="text-sm text-slate-600">Try risk-free with our 30-day money-back guarantee.</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

function Subscriptions() {
  const [activeTab, setActiveTab] = useState("Subscriptions")
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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Subscriptions</h1>
              <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">Choose the perfect plan for you</p>
            </div>
          </div>

          <AvatarDropdown />
        </div>

        {/* Main content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <SubscriptionsContent />
        </div>
      </div>
    </div>
  )
}

export default Subscriptions
