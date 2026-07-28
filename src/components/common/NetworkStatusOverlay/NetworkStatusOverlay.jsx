import React, { useState, useEffect, useCallback } from 'react';
import { LuWifiOff, LuWifi, LuRefreshCw } from 'react-icons/lu';

export const NetworkStatusOverlay = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleOffline = useCallback(() => {
    setIsOffline(true);
    setShowRestored(false);
  }, []);

  const handleOnline = useCallback(() => {
    setIsOffline(false);
    setShowRestored(true);
    const timer = setTimeout(() => {
      setShowRestored(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    const handleNetworkError = () => {
      if (!navigator.onLine) {
        setIsOffline(true);
      }
    };
    window.addEventListener('app-network-error', handleNetworkError);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('app-network-error', handleNetworkError);
    };
  }, [handleOffline, handleOnline]);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Ping check
      const res = await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
      if (res.ok || navigator.onLine) {
        setIsOffline(false);
        setShowRestored(true);
        setTimeout(() => setShowRestored(false), 3000);
      } else {
        setIsOffline(true);
      }
    } catch {
      setIsOffline(true);
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOffline && !showRestored) return null;

  return (
    <div
      className="position-fixed top-0 start-0 end-0 z-3 p-2 d-flex justify-content-center"
      style={{ zIndex: 9999, pointerEvents: 'none' }}
    >
      {isOffline && (
        <div
          className="card border-0 shadow-lg bg-danger text-white px-3 py-2 rounded-3 d-flex flex-row align-items-center gap-3 animate-fade-in"
          style={{ pointerEvents: 'auto', maxWidth: '600px', width: '90%' }}
        >
          <div
            className="rounded-circle bg-white text-danger d-flex align-items-center justify-content-center p-2 flex-shrink-0"
            style={{ width: '40px', height: '40px' }}
          >
            <LuWifiOff className="fs-5" />
          </div>

          <div className="flex-grow-1 text-start">
            <h6 className="mb-0 fw-bold fs-7">Internet aloqasi uzildi!</h6>
            <p className="mb-0 fs-8 text-white-50">
              Tizim to'g'ri ishlashi uchun internetga ulaning. Aloqa tiklanganda davom etasiz.
            </p>
          </div>

          <button
            className="btn btn-sm btn-light text-danger fw-semibold d-flex align-items-center gap-1 flex-shrink-0"
            onClick={checkConnection}
            disabled={isChecking}
          >
            <LuRefreshCw className={`fs-7 ${isChecking ? 'spin-animation' : ''}`} />
            <span className="d-none d-sm-inline">Qayta tekshirish</span>
          </button>
        </div>
      )}

      {showRestored && !isOffline && (
        <div
          className="card border-0 shadow-lg bg-success text-white px-3 py-2 rounded-3 d-flex flex-row align-items-center gap-2 animate-fade-in"
          style={{ pointerEvents: 'auto', maxWidth: '450px' }}
        >
          <div
            className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center p-2 flex-shrink-0"
            style={{ width: '32px', height: '32px' }}
          >
            <LuWifi className="fs-6" />
          </div>
          <div className="text-start">
            <span className="fw-bold fs-7 d-block">Internet aloqasi tiklandi!</span>
            <small className="fs-8 opacity-75">Tizim ish tartibi davom etmoqda.</small>
          </div>
        </div>
      )}
    </div>
  );
};
