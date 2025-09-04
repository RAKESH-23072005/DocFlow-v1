import React, { useEffect, useState } from 'react';
import { useAdAnalytics } from '@/hooks/use-ad-analytics';

interface AdSlotProps {
  type: 'banner' | 'sidebar' | 'inline' | 'sticky' | 'interstitial';
  className?: string;
  fallbackContent?: React.ReactNode;
  position?: string;
}

export default function AdSlot({ type, className = '', fallbackContent, position = 'unknown' }: AdSlotProps) {
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { trackAdImpression, trackAdBlocked, trackAdLoaded } = useAdAnalytics();

  // Detect ad blocking
  useEffect(() => {
    const checkAdBlocking = () => {
      // Create a test ad element
      const testAd = document.createElement('div');
      testAd.className = 'adsbygoogle';
      testAd.style.display = 'block';
      testAd.style.width = '1px';
      testAd.style.height = '1px';
      testAd.style.position = 'absolute';
      testAd.style.left = '-10000px';
      
      document.body.appendChild(testAd);
      
      // Check if ad was blocked after a short delay
      setTimeout(() => {
        const isBlocked = testAd.offsetHeight === 0 || testAd.offsetWidth === 0;
        setIsAdBlocked(isBlocked);
        document.body.removeChild(testAd);
        setIsLoaded(true);
        
        // Track analytics
        if (isBlocked) {
          trackAdBlocked(type, position);
        } else {
          trackAdLoaded(type, position);
          trackAdImpression(type, position);
        }
      }, 100);
    };

    checkAdBlocking();
  }, [type, position, trackAdBlocked, trackAdLoaded, trackAdImpression]);

  // Ad slot dimensions and styles based on type
  const getAdSlotStyles = () => {
    switch (type) {
      case 'banner':
        return {
          container: 'w-full min-h-[250px] lg:min-h-[90px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center',
          text: 'text-gray-500 text-sm font-medium',
          label: 'Banner Ad Space',
          mobileLabel: '728x90 • 970x90'
        };
      case 'sidebar':
        return {
          container: 'w-full min-h-[300px] lg:min-h-[600px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center',
          text: 'text-gray-500 text-sm font-medium',
          label: 'Sidebar Ad Space',
          mobileLabel: '300x600 • 300x250'
        };
      case 'inline':
        return {
          container: 'w-full min-h-[250px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center',
          text: 'text-gray-500 text-sm font-medium',
          label: 'Inline Ad Space',
          mobileLabel: '300x250 • 728x90'
        };
      case 'sticky':
        return {
          container: 'fixed bottom-0 left-0 right-0 z-50 w-full h-[50px] bg-gray-100 border-t border-gray-200 flex items-center justify-center',
          text: 'text-gray-500 text-xs font-medium',
          label: 'Sticky Ad',
          mobileLabel: '320x50'
        };
      case 'interstitial':
        return {
          container: 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center',
          text: 'text-gray-500 text-sm font-medium',
          label: 'Interstitial Ad',
          mobileLabel: 'Full Screen'
        };
      default:
        return {
          container: 'w-full min-h-[250px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center',
          text: 'text-gray-500 text-sm font-medium',
          label: 'Ad Space',
          mobileLabel: '300x250 • 728x90'
        };
    }
  };

  const styles = getAdSlotStyles();

  // Show loading state
  if (!isLoaded) {
    return (
      <div className={`${styles.container} ${className} animate-pulse`}>
        <div className="text-center p-4">
          <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto mb-2"></div>
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  // Show fallback content if ad is blocked
  if (isAdBlocked && fallbackContent) {
    return <div className={className}>{fallbackContent}</div>;
  }

  // Show ad blocked message
  if (isAdBlocked) {
    return (
      <div className={`${styles.container} ${className} bg-blue-50 border-blue-200`}>
        <div className="text-center p-4">
          <div className={`${styles.text} mb-2 text-blue-600`}>
            Ad Blocker Detected
          </div>
          <div className="text-blue-400 text-xs">
            Please disable your ad blocker to support our free service
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-slot ${styles.container} ${className}`}>
      {/* Replace with AdSense script later */}
      <div className="text-center p-4">
        <div className={`${styles.text} mb-2`}>
          {styles.label}
        </div>
        <div className="text-gray-400 text-xs">
          {/* Show different sizes for mobile vs desktop */}
          <span className="lg:hidden">{styles.mobileLabel}</span>
          <span className="hidden lg:inline">
            {type === 'banner' && '728x90 • 970x90 • 970x250'}
            {type === 'sidebar' && '300x600 • 300x250'}
            {type === 'inline' && '300x250 • 728x90'}
            {type === 'sticky' && '320x50'}
            {type === 'interstitial' && 'Full Screen'}
          </span>
        </div>
      </div>
    </div>
  );
}
