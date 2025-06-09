import React from 'react';

interface TimerBarProps {
  remainingTime: number;
  maxTime: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ remainingTime, maxTime }) => {
  const percentage = maxTime > 0 ? Math.max(0, (remainingTime / maxTime) * 100) : 0;
  
  let barColor = 'bg-green-300'; 
  if (percentage <= 25) {
    barColor = 'bg-red-300'; 
  } else if (percentage <= 50) {
    barColor = 'bg-yellow-300'; 
  }
  // For an orange theme, let's use shades of white or lighter orange for the bar itself
  // on a slightly darker orange track.
  
  // New color logic for orange theme:
  if (percentage <= 25) {
    barColor = 'bg-orange-100'; // Progress bar color, more intense as time runs out
  } else if (percentage <= 50) {
    barColor = 'bg-orange-200';
  } else {
    barColor = 'bg-white';
  }


  return (
    <div className="w-full h-3 sm:h-4 bg-orange-700/50 rounded-full overflow-hidden my-4 shadow-inner max-w-md">
      <div
        className={`h-full rounded-full transition-all duration-200 ease-linear ${barColor}`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={remainingTime}
        aria-valuemin={0}
        aria-valuemax={maxTime}
        aria-label="Geratzen den denbora"
      ></div>
    </div>
  );
};

export default TimerBar;