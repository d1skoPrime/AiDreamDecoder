"use client"

import { memo } from "react"
import { SparkleIcon } from "./Icons/icons"

function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="w-full h-20 bg-[#edede9]/80 backdrop-blur-md border-b border-gray-200">
      <nav className="flex h-full px-6 items-center">
        <header className="font-semibold text-xl flex items-center gap-2">
          <SparkleIcon className="w-7 h-7 text-violet-600 animate-sparkle" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            SleepiFy
          </h1>
          <SparkleIcon className="w-7 h-7 text-violet-600 animate-sparkle" />
        </header>

        <ul className="flex flex-row items-center ml-auto gap-3">
          <li>
            <button
              className="px-4 py-2 rounded-xl text-gray-700 hover:text-black transition-all duration-200 hover:bg-gray-200/60"
              onClick={() => scrollToSection("home")}
            >
              Home
            </button>
          </li>

          <li>
            <button
              className="px-4 py-2 rounded-xl text-gray-700 hover:text-black transition-all duration-200 hover:bg-gray-200/60"
              onClick={() => scrollToSection("about")}
            >
              About
            </button>
          </li>

          <li>
            <button
              className="px-4 py-2 rounded-xl text-gray-700 hover:text-black transition-all duration-200 hover:bg-gray-200/60"
              onClick={() => scrollToSection("pricing")}
            >
              Pricing
            </button>
          </li>

          <li>
            <button
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.04] active:scale-[0.98] transition-all duration-200"
              onClick={() => scrollToSection("contact")}
            >
              Contact Us
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default memo(Navbar)
