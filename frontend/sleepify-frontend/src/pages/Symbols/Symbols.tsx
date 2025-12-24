import { useState } from 'react'
import { AvatarDropdown } from '../../components/AvatarDropDown'
import { FloatingOrbs } from '../../components/Icons/icons'
import Sidebar from '../../components/SideBar'
import { SymbolsContent } from './SymbolsContent'

export const Symbols = () => {

	const [activeTab, setActiveTab] = useState("Dream Symbols")
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
								<button
									onClick={() => setIsMobileMenuOpen(true)}
									className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors"
								>
									<svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								</button>
								<div>
									<h1 className="text-xl sm:text-2xl font-bold text-slate-800">Symbols</h1>
									<p className="text-xs sm:text-sm text-slate-600 hidden sm:block">Find Meaning of The Symbols in Dreams</p>
								</div>
							</div>
		
							<AvatarDropdown />
						</div>

						<div className="p-4 sm:p-6 lg:p-8">
          	<SymbolsContent />
        		</div>
				</div>
			</div>
	)
}
