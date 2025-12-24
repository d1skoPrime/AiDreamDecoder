import { create } from 'zustand'
import type { Dream } from '../types'
import { fetchAPI } from './authStore'

interface DreamStoreState {
  // Current dream being created
  title: string;
  content: string;
  emotions: string[];
  
  // Decoded result
  decodedDream: Dream | null;
  
  // Dream history
  history: Dream[];
  
  // UI state
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  historyPage: number;

  // Setters
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setEmotions: (emotions: string[]) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setHistoryPage: (page: number) => void;
  setError: (error: string | null) => void;
  setDecodedDream:() => void
  
  // Actions
  decodeDream: () => Promise<Dream | null>;
  fetchHistory: () => Promise<void>;
  deleteDream: (id: string) => Promise<void>;
  clearForm: () => void;
  clearHistory: () => void;
}

export const useDreamStore = create<DreamStoreState>((set, get) => ({
  // Initial state
  title: '',
  content: '',
  emotions: [],
  decodedDream: null,
  history: [],
  loading: false,
  error: null,
  theme: 'light',
  historyPage: 0,

  // Setters
  setTitle: (title: string) => set({ title, error: null }),
  
  setContent: (content: string) => {
    // Enforce character limit on the client side
    if (content.length <= 2000) {
      set({ content, error: null });
    }
  },
  
  
  setEmotions: (emotions: string[]) => set({ emotions, error: null }),
  
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  
  setHistoryPage: (page: number) => set({ historyPage: page }),
  
  
  setError: (error: string | null) => set({ error }),

  /**
   * ✅ FIXED: Properly send dream data to backend
   * Returns the created dream with interpretation
   */
  decodeDream: async () => {
    const { title, content, emotions } = get();

    // Validation
    if (!title.trim()) {
      set({ error: 'Please provide a title for your dream' });
      return null;
    }

    if (!content.trim()) {
      set({ error: 'Please describe your dream' });
      return null;
    }

    if (content.length > 2000) {
      set({ error: 'Dream description is too long (max 2000 characters)' });
      return null;
    }

    set({ loading: true, error: null, decodedDream: null });

    try {
      // ✅ Send correct data structure matching CreateDreamDto
      const response = await fetchAPI('/dreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Send cookies with request
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          emotions: emotions.filter(e => e.trim()), // Remove empty strings
        }),
      });

      // Backend returns the created dream with analysis
      set({ 
        decodedDream: response,
        loading: false,
      });

      // Optionally refresh history to include the new dream
      // You might want to do this or just prepend the new dream
      get().fetchHistory();

      return response;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to decode dream. Please try again.';
      set({ 
        error: errorMessage,
        loading: false,
        decodedDream: null,
      });
      return null;
    }
  },

  /**
   * ✅ FIXED: Fetch dream history from backend
   * Uses cookies for auth (no localStorage token needed)
   */
  fetchHistory: async () => {
    set({ loading: true, error: null });

    try {
      // ✅ SECURITY: Use fetchAPI which handles cookies properly
      // No need to manually get token from localStorage
      const data = await fetchAPI('/dreams', {
        method: 'GET',
        credentials: 'include', // ✅ Cookies are sent automatically
      });

      set({ 
        history: Array.isArray(data) ? data : [],
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch dream history';
      set({ 
        error: errorMessage,
        loading: false,
      });
    }
  },

  /**
   * ✅ NEW: Delete a specific dream
   */
  deleteDream: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await fetchAPI(`/dreams/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      // Remove from local state
      set(state => ({
        history: state.history.filter(dream => dream.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete dream';
      set({ 
        error: errorMessage,
        loading: false,
      });
    }
  },

  /**
   * ✅ NEW: Clear the form after successful decode
   */
  clearForm: () => set({ 
    title: '', 
    content: '', 
    emotions: [],
    error: null,
  }),


  setDecodedDream: ()=>{
    set({decodedDream:null})
  },

  /**
   * Clear history (local state only)
   */
  clearHistory: () => set({ 
    history: [], 
    decodedDream: null,
  }),
}));