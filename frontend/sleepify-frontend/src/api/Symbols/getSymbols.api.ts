import { API_URL } from '../../Store/authStore'

export const getAllSymbols = async () => {
  try {
    const response = await fetch(`${API_URL}/api/symbols`, {
      method: "GET",
      credentials: "include",
    })

    const data = await response.json()

    if (!response.ok) {
      // Return the error message from backend if exists
      throw new Error(data.message || "Failed to fetch symbols")
    }

    return data
  } catch (error: any) {
    // You can log the error or rethrow it
    console.error("Error fetching symbols:", error)
    throw new Error(error.message || "Something went wrong")
  }
}
