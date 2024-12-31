import React from 'react';

const TimeProgress = () => {
  const now = new Date();
  
  // Calculate year progress
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const daysInYear = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24);
  const dayOfYear = Math.ceil((now - startOfYear) / (1000 * 60 * 60 * 24));
  const yearProgress = (dayOfYear / daysInYear) * 100;
  const daysLeftYear = Math.ceil(daysInYear - dayOfYear);
  
  // Calculate month progress
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const monthProgress = (dayOfMonth / daysInMonth) * 100;
  const daysLeftMonth = daysInMonth - dayOfMonth;
  
  // Calculate day progress
  const currentHour = now.getHours();
  const dayProgress = (currentHour / 24) * 100;
  const hoursLeftDay = 24 - currentHour;
  
  const createProgressMarks = (total) => {
    return Array.from({ length: total }, (_, i) => (
      <div 
        key={i}
        className={`time-progress-mark ${i % 5 === 0 ? 'highlight' : 'regular'}`}
      />
    ));
  };

  return (
    <div className="time-progress-container">
      <div className="time-progress-wrapper">
        {/* Year Progress */}
        <div className="time-progress-bar">
          <div 
            className="time-progress-fill year"
            style={{ width: `${yearProgress}%` }}
          />
          <div className="time-progress-marks">
            {createProgressMarks(366)}
          </div>
        </div>
        
        {/* Month Progress */}
        <div className="time-progress-bar">
          <div 
            className="time-progress-fill month"
            style={{ width: `${monthProgress}%` }}
          />
          <div className="time-progress-marks">
            {createProgressMarks(31)}
          </div>
        </div>
        
        {/* Day Progress */}
        <div className="time-progress-bar">
          <div 
            className="time-progress-fill day"
            style={{ width: `${dayProgress}%` }}
          />
          <div className="time-progress-marks">
            {createProgressMarks(24)}
          </div>
        </div>
        
        <div className="time-remaining">
          <span>{daysLeftYear} days left this year</span>
          <span>{daysLeftMonth} days left this month</span>
          <span>{hoursLeftDay} hours left today</span>
        </div>
      </div>
    </div>
  );
};

export default TimeProgress;