// Device detection utilities
export const isMobileDevice = (): boolean => {
  // Check for touch capability and screen size
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return hasTouchScreen && (isSmallScreen || isMobileUserAgent);
};

export const isDesktopDevice = (): boolean => {
  return !isMobileDevice();
};

// Keyboard detection for mobile devices
export const detectMobileKeyboard = (): boolean => {
  if (!isMobileDevice()) return false;
  
  // Use Visual Viewport API if available
  if (window.visualViewport) {
    const viewportHeight = window.visualViewport.height;
    const windowHeight = window.innerHeight;
    return viewportHeight < windowHeight * 0.75;
  }
  
  // Fallback: detect significant height reduction
  const currentHeight = window.innerHeight;
  const screenHeight = window.screen.height;
  return currentHeight < screenHeight * 0.75;
};

// Hook for responsive layout
export const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = React.useState(isMobileDevice());
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
      setIsKeyboardVisible(detectMobileKeyboard());
    };

    // Listen for viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    // Initial check
    handleResize();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return { isMobile, isKeyboardVisible };
};

// Import React for the hook
import React from 'react';