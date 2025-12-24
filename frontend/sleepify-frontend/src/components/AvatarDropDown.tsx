import { useEffect, useRef, useState } from 'react'
import { GrUpgrade } from "react-icons/gr"
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../Store/authStore'
import { useUserStore } from '../Store/userStore'
import { ChevronDownIcon, LogoutIcon, ProfileIcon, SettingsIcon } from './Icons/icons'

export function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore();
  const { user, getUserData } = useUserStore();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>(''); // ✅ Track current image URL
  const nav = useNavigate();
  
  // ✅ Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  const imageLoadRef = useRef<HTMLImageElement | null>(null);
  const retryCountRef = useRef(0); // ✅ Track retry attempts

  // ✅ Load user data with proper cleanup
  useEffect(() => {
    isMountedRef.current = true;

    const loadUser = async () => {
      try {
        setLoading(true);
        await getUserData();
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadUser();

    // ✅ Cleanup function
    return () => {
      isMountedRef.current = false;
      // Cancel any pending image loads
      if (imageLoadRef.current) {
        imageLoadRef.current.onload = null;
        imageLoadRef.current.onerror = null;
        imageLoadRef.current = null;
      }
    };
  }, [getUserData]);

  // ✅ Function to try different URL variations for Google images
  const getAlternativeImageUrl = (originalUrl: string, attempt: number): string => {
    if (!originalUrl.includes('googleusercontent.com')) {
      return originalUrl;
    }

    // Try different size parameters
    const sizeParams = ['s96-c', 's128-c', 's256-c', 's512-c'];
    
    // Remove existing size parameter
    let newUrl = originalUrl.replace(/\/s\d+-c/, '');
    
    // Try different variations
    switch (attempt) {
      case 0:
        return originalUrl; // Original URL
      case 1:
        return newUrl + '/s96-c'; // Standard size
      case 2:
        return newUrl + '/s256-c'; // Larger size
      case 3:
        return originalUrl.replace('=s96-c', ''); // Remove size param entirely
      case 4:
        return originalUrl.replace(/\?.*$/, ''); // Remove all query params
      default:
        return originalUrl;
    }
  };

  // ✅ Preload image with retry logic
  useEffect(() => {
    if (!user?.picture) {
      setImageError(true);
      setImageLoaded(false);
      return;
    }

    // Reset retry count for new user
    retryCountRef.current = 0;
    
    const tryLoadImage = (attempt: number) => {
      // ✅ Add safety check here too
      if (!user?.picture) {
        setImageError(true);
        setImageLoaded(false);
        return;
      }

      const urlToTry = getAlternativeImageUrl(user.picture, attempt);
      setImageUrl(urlToTry);

      console.log(`🖼️ Attempt ${attempt + 1}: Loading avatar from:`, urlToTry);

      const img = new Image();
      imageLoadRef.current = img;

      const timeout = setTimeout(() => {
        if (!img.complete) {
          console.warn('⏱️ Avatar loading timeout');
          // Try next variation
          if (attempt < 4) {
            tryLoadImage(attempt + 1);
          } else {
            setImageError(true);
            setImageLoaded(false);
          }
        }
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        if (isMountedRef.current) {
          console.log('✅ Avatar loaded successfully on attempt', attempt + 1);
          setImageLoaded(true);
          setImageError(false);
        }
      };

      img.onerror = (e) => {
        clearTimeout(timeout);
        if (isMountedRef.current) {
          console.error(`❌ Attempt ${attempt + 1} failed:`, e);
          
          // Try next variation
          if (attempt < 4) {
            console.log(`   🔄 Retrying with different URL...`);
            tryLoadImage(attempt + 1);
          } else {
            console.error('   ❌ All attempts failed, showing fallback');
            setImageError(true);
            setImageLoaded(false);
          }
        }
      };

      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      img.src = urlToTry;

      return () => {
        clearTimeout(timeout);
        img.onload = null;
        img.onerror = null;
      };
    };

    // Start with first attempt
    const cleanup = tryLoadImage(0);

    return cleanup;
  }, [user?.picture]);

  // ✅ Function to get initials fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    const first = words[0]?.charAt(0).toUpperCase() || "";
    const second = words[1]?.charAt(0).toUpperCase() || "";
    return (first + second) || "U";
  };

  // ✅ Handle logout with cleanup
  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logout();
      nav('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.avatar-dropdown-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ✅ Don't render until user data is loaded
  if (loading || !user) return null;

  return (
    <div className="relative avatar-dropdown-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/50 transition-all duration-300"
        aria-label="User menu"
      >
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={user.name || "User avatar"}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`w-10 h-10 rounded-full border border-gray-300 object-cover transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => {
              console.log('🎉 Image rendered in DOM');
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.warn('⚠️ Image error in DOM render');
              setImageError(true);
              setImageLoaded(false);
            }}
          />
        ) : null}
        
        {/* ✅ Show fallback avatar when: no picture, error, or image not loaded yet */}
        {(imageError || !imageUrl || !imageLoaded) && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {getInitials(user.name || user.email)}
          </div>
        )}

        <ChevronDownIcon
          className={`w-4 h-4 cursor-pointer text-slate-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/50 overflow-hidden animate-slide-up z-50">
          <div className="p-4 border-b border-slate-200/50">
            <div className="flex items-center gap-3 mb-2">
              {!imageError && imageUrl && imageLoaded ? (
                <img
                  src={imageUrl}
                  alt={user.name || "User avatar"}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border-2 border-violet-200 object-cover"
                  onError={() => {
                    console.warn('⚠️ Dropdown image error');
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {getInitials(user.name || user.email)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-all duration-300 cursor-pointer" 
              onClick={() => {
                setIsOpen(false);
                nav('/profile');
              }}
            >
              <ProfileIcon className="w-5 h-5" />
              <span>My Profile</span>
            </button>

            <button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-all duration-300"
              onClick={() => {
                setIsOpen(false);
                nav('/settings');
              }}
            >
              <SettingsIcon className="w-5 h-5" />
              <span>Settings</span>
            </button>

            <button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-orange-400/20 transition-all duration-300 bg-gradient-to-r from-purple-500/10 to-orange-400/10 cursor-pointer mt-1"
              onClick={() => {
                setIsOpen(false);
                nav('/subscriptions');
              }}
            >
              <GrUpgrade className="w-5 h-5" />
              <span className="font-medium">Upgrade Plan</span>
            </button>
          </div>

          <div className="p-2 border-t border-slate-200/50">
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
              onClick={handleLogout}
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}