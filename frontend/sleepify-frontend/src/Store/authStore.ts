import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Types
interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
  subscription: {
    tier: string;
    expiresAt: string | null;
    nextReset?: string | null;
  };
  requestsLeft: number;
  lastRequestDate: string | null;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// API base URL
export const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Helper function for fetch with error handling
export async function fetchAPI(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Logout
      logout: async () => {
        try {
          const res = await fetchAPI('/auth/logout', { 
            method: 'POST', 
            credentials: 'include' 
          });

          if (res.success === true) {
            console.log('✅ Logout successful');
          }
          
        } catch (error) {
          console.error('❌ Logout error:', error);
        } finally {
          // Clear state regardless of API success
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });

          // Clear localStorage
          localStorage.removeItem('user-storage'); 
          localStorage.removeItem('auth-storage');

          // Redirect to login
          window.location.href = '/login';
        }
      },

      // Refresh Access Token
      refreshToken: async () => {
        try {
          const data = await fetchAPI('/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          console.log('✅ Token refreshed');
        } catch (error) {
          console.error('❌ Token refresh failed:', error);
          // Refresh failed - logout user
          get().logout();
          throw error;
        }
      },

      // Update User Data
      updateUser: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      // ✅ FIXED: Check Auth Status with better error handling
      checkAuth: async () => {
        try {
          
          
          set({ isLoading: true }); // ✅ Set loading state
          
          const response = await fetch(`${API_URL}/api/user/authorized`, {
            method: 'GET',
            credentials: 'include', // Send cookies
          });

          

          if (response.ok) {
            const data = await response.json();
            

            // ✅ FIXED: Backend returns user data directly, not wrapped in {user: ...}
            // Check if response has email directly OR is wrapped in user object
            const userData = data.user || data; // Try data.user first, fall back to data itself
            
            if (userData && userData.email) {
              set({ 
                isAuthenticated: true,
                user: userData,
                error: null,
                isLoading: false,
              });
              
            } else {
              console.warn('⚠️ No user data in response:', data);
              set({ 
                isAuthenticated: false, 
                user: null,
                isLoading: false,
              });
              // get().logout()
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.warn('⚠️ Auth check failed - Status:', response.status);
            console.warn('⚠️ Error data:', errorData);
            set({ 
              isAuthenticated: false, 
              user: null,
              isLoading: false,
            });
            // get().logout()
          }
        } catch (error: unknown) {
          console.error('❌ Auth check error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Authentication check failed';
          set({ 
            isAuthenticated: false, 
            user: null, 
            error: errorMessage,
            isLoading: false,
          });
          // get().logout()
          // ❌ DON'T clear localStorage here - let the user stay logged in if it's just a network error
          // localStorage.clear();
        }
      },

      // Clear Error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);