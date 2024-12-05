import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarPicker.css';

const CalendarPicker = ({ onSelectDate, onClose }) => {
  const UTC_OFFSET = 7; // Same UTC offset as TodoApp
  const calendarRef = useRef(null);
  
  const getLocalDate = (date = new Date()) => {
    const utcDate = new Date(date);
    utcDate.setUTCHours(utcDate.getUTCHours() + UTC_OFFSET);
    return new Date(utcDate.toISOString().split('T')[0]);
  };

  // Initialize with local date
  const [currentMonth, setCurrentMonth] = useState(getLocalDate());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getMonthData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = getLocalDate(new Date(year, month, 1));
    const lastDay = getLocalDate(new Date(year, month + 1, 0));
    const startingDayIndex = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const weeks = [];
    let days = [];
    
    for (let i = 0; i < startingDayIndex; i++) {
      days.push({ date: null, empty: true });
    }
    
    for (let day = 1; day <= totalDays; day++) {
      days.push({
        date: getLocalDate(new Date(year, month, day)),
        empty: false
      });
      
      if (days.length === 7) {
        weeks.push(days);
        days = [];
      }
    }
    
    if (days.length > 0) {
      while (days.length < 7) {
        days.push({ date: null, empty: true });
      }
      weeks.push(days);
    }
    
    return weeks;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date) => {
    if (date) {
      const localDate = getLocalDate(date);
      onSelectDate(localDate);
    }
  };

  const weeks = getMonthData();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="calendar-picker-overlay">
      <div ref={calendarRef} className="calendar-picker-container">
        <div className="calendar-header">
          <button 
            onClick={handlePrevMonth} 
            className="calendar-nav-btn"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="month-title">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button 
            onClick={handleNextMonth} 
            className="calendar-nav-btn"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="calendar-grid">
          {weekDays.map(day => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
          
          {weeks.flatMap((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <button
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => day.date && handleDateSelect(day.date)}
                disabled={day.empty}
                className="calendar-day"
              >
                {day.date?.getDate()}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;