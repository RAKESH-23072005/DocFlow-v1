import { useCallback } from 'react';

interface AdEvent {
  type: 'impression' | 'click' | 'blocked' | 'loaded';
  adType: string;
  position: string;
  timestamp: number;
}

interface AdAnalytics {
  trackAdImpression: (adType: string, position: string) => void;
  trackAdClick: (adType: string, position: string) => void;
  trackAdBlocked: (adType: string, position: string) => void;
  trackAdLoaded: (adType: string, position: string) => void;
  getAdStats: () => AdEvent[];
}

export function useAdAnalytics(): AdAnalytics {
  const trackEvent = useCallback((event: AdEvent) => {
    // Store in localStorage for now, can be sent to analytics service later
    const events = JSON.parse(localStorage.getItem('ad_events') || '[]');
    events.push(event);
    localStorage.setItem('ad_events', JSON.stringify(events));
    
    // Log to console for debugging
    console.log('Ad Event:', event);
  }, []);

  const trackAdImpression = useCallback((adType: string, position: string) => {
    trackEvent({
      type: 'impression',
      adType,
      position,
      timestamp: Date.now()
    });
  }, [trackEvent]);

  const trackAdClick = useCallback((adType: string, position: string) => {
    trackEvent({
      type: 'click',
      adType,
      position,
      timestamp: Date.now()
    });
  }, [trackEvent]);

  const trackAdBlocked = useCallback((adType: string, position: string) => {
    trackEvent({
      type: 'blocked',
      adType,
      position,
      timestamp: Date.now()
    });
  }, [trackEvent]);

  const trackAdLoaded = useCallback((adType: string, position: string) => {
    trackEvent({
      type: 'loaded',
      adType,
      position,
      timestamp: Date.now()
    });
  }, [trackEvent]);

  const getAdStats = useCallback(() => {
    return JSON.parse(localStorage.getItem('ad_events') || '[]');
  }, []);

  return {
    trackAdImpression,
    trackAdClick,
    trackAdBlocked,
    trackAdLoaded,
    getAdStats
  };
}
