import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetReset } from '@/store/authSlice';
import { useAuthentication } from '@/hooks/useAuthentication';

/**
 * Hook that automatically logs out the user after a specified period of inactivity
 * @param timeout - Timeout in milliseconds (default: 30 minutes = 1800000ms)
 */
export function useInactivityLogout(timeout = 1800000) {
  const navigate = useNavigate();
  const setReset = useSetReset();
  const isAuthenticated = useAuthentication();
  const timerRef = useRef<NodeJS.Timeout>();

  const resetTimer = () => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      // Clear auth state using the store's reset function
      setReset();
      
      // Navigate to login page
      navigate('/');
    }, timeout);
  };

  useEffect(() => {
    // Only run if user is authenticated
    if (!isAuthenticated) {
      return;
    }

    // Events that indicate user activity
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'];

    // Add event listeners for all activity events
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Set initial timer
    resetTimer();

    // Cleanup function
    return () => {
      // Remove all event listeners
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      
      // Clear timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeout, navigate, setReset, isAuthenticated]);

  // Return a function to manually reset the timer if needed
  return { resetTimer };
}