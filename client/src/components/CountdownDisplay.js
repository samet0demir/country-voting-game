import React, { useState, useEffect, useRef } from 'react';

const CountdownDisplay = ({ initialTimeMs, onComplete, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeMs);
  const timerRef = useRef(null);

  useEffect(() => {
    // Update the initial time if it changes from parent
    setTimeLeft(initialTimeMs);
  }, [initialTimeMs]);

  useEffect(() => {
    // Interval'ı temizle ve yeniden başlat
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Start the countdown timer if time is remaining
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      
      console.log("Timer started/updated:", timeLeft);
    }

    // Clear interval on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [initialTimeMs, onComplete]);

  // Calculate hours, minutes, seconds
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Format display values
  const displayHours = String(hours).padStart(2, '0');
  const displayMinutes = String(minutes).padStart(2, '0');
  const displaySeconds = String(seconds).padStart(2, '0');

  return (
    <div className={`countdown-display d-inline-flex align-items-center ${className}`}>
      <div className="d-flex">
        <div className="timer-item bg-danger text-white px-2 py-1 rounded mx-1">
          <span className="timer-value fw-bold">{displayHours}</span>
        </div>
        <div className="timer-separator d-flex align-items-center mx-0">:</div>
        <div className="timer-item bg-danger text-white px-2 py-1 rounded mx-1">
          <span className="timer-value fw-bold">{displayMinutes}</span>
        </div>
        <div className="timer-separator d-flex align-items-center mx-0">:</div>
        <div className="timer-item bg-danger text-white px-2 py-1 rounded mx-1">
          <span className="timer-value fw-bold">{displaySeconds}</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownDisplay;