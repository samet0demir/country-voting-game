import React from 'react';

const VotingTimer = ({ countdown, variant = "primary" }) => {
  const { hours, minutes, seconds } = countdown;
  
  // Format display values
  const displayHours = String(hours).padStart(2, '0');
  const displayMinutes = String(minutes).padStart(2, '0');
  const displaySeconds = String(seconds).padStart(2, '0');
  
  return (
    <div className={`voting-timer d-inline-flex align-items-center`}>
      <div className="timer-container d-flex">
        <div className={`timer-item bg-${variant} text-white px-2 py-1 rounded mx-1`}>
          <span className="timer-value fw-bold">{displayHours}</span>
        </div>
        <div className="timer-separator d-flex align-items-center mx-0">:</div>
        <div className={`timer-item bg-${variant} text-white px-2 py-1 rounded mx-1`}>
          <span className="timer-value fw-bold">{displayMinutes}</span>
        </div>
        <div className="timer-separator d-flex align-items-center mx-0">:</div>
        <div className={`timer-item bg-${variant} text-white px-2 py-1 rounded mx-1`}>
          <span className="timer-value fw-bold">{displaySeconds}</span>
        </div>
      </div>
    </div>
  );
};

export default VotingTimer;