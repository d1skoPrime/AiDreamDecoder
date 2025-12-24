import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { fetchAPI } from './authStore'

interface User {
  id: string;
  stripeCustomerId: string | null
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
  createdAt: string;
}

// ✅ Match your existing interface name: userState (lowercase 'u')
interface userState {
  user: User | null;
  loading: boolean;
  error: string | null;
  stripeCustomerId: string | null
  
  getUserData: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<userState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      stripeCustomerId: null,

      /**
       * ✅ Get current user data from /user/me endpoint
       */
      getUserData: async () => {
        try {
          set({ loading: true, error: null });
          

          // ✅ Use /user/me endpoint which returns current user's data
          const userData = await fetchAPI('/user/me', {
            method: 'GET',
            credentials: 'include',
          });

          

          if (!userData || !userData.email) {
            
            throw new Error('Invalid user data received');
          }

          set({ 
            user: userData,
            stripeCustomerId: userData.stripeCustomerId,
            loading: false,
            error: null,
          });
        } catch (error: any) {
          
          set({ 
            error: error.message || 'Failed to load user data',
            loading: false,
          });
        }
      },

      /**
       * Update user data locally
       */
      updateUser: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      /**
       * Clear user data
       */
      clearUser: () => {
        set({ user: null, error: null });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);