import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllSymbols } from '../../api/Symbols/getSymbols.api'

export const SymbolsContent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [symbols, setSymbols] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    const fetchSymbols = async () => {
      try {
        const data = await getAllSymbols()
        setSymbols(data)
      } catch (err: any) {
        setError(err.message || "Error loading symbols")
      } finally {
        setIsLoading(false)
      }
    }
    fetchSymbols()
  }, [])

  const filteredSymbols = symbols.filter((symbol) => {
    // Check if search query is empty - if so, don't filter by search
    if (searchQuery.trim() === "") {
      const matchesCategory = selectedCategory === "All" || symbol.category === selectedCategory
      return matchesCategory
    }

    // Search logic with safe checks
    const lowerQuery = searchQuery.toLowerCase()
    const matchesName = symbol.name?.toLowerCase().includes(lowerQuery) || false
    const matchesDescription = symbol.description?.toLowerCase().includes(lowerQuery) || false
    const matchesTags = symbol.tags?.some((tag: any) => 
      tag?.toLowerCase().includes(lowerQuery)
    ) || false

    const matchesSearch = matchesName || matchesDescription || matchesTags
    const matchesCategory = selectedCategory === "All" || symbol.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-violet-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="text-red-600 text-lg font-semibold text-center ">{error}
        </div>
        <div className="flex mt-5 flex-col">
          <button className="w-full sm:w-auto px-6 py-3 bg-violet-500 text-white cursor-pointer font-semibold rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap" onClick={()=>{navigate("/subscriptions")}}>
            Get Access
          </button>
        </div>
        
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6 w-full max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search symbols..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Results count */}
      <div className="text-center mb-4 text-gray-600">
        Showing {filteredSymbols.length} of {symbols.length} symbols
      </div>

      {/* Symbols Grid */}
      {filteredSymbols.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No symbols found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSymbols.map((symbol) => (
            <div
              key={symbol.id}
              className="bg-white shadow-lg rounded-2xl p-6 transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{symbol.name}</h2>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-semibold">
                  {symbol.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-4">{symbol.description}</p>
              {symbol.tags && symbol.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {symbol.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-purple-300 to-pink-300 text-purple-900 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}