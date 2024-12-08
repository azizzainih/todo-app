import React from 'react';

const HealthTracker = ({ dateKey, healthData, updateHealthData }) => {
  return (
    <div className="health-tracker">
      <div className="checklist-row">
        <div className="checklist-item">
          <input
            type="checkbox"
            checked={healthData[dateKey]?.vitamins || false}
            onChange={(e) => updateHealthData(dateKey, 'vitamins', e.target.checked)}
            className={`checklist-checkbox ${healthData[dateKey]?.vitamins ? 'checked' : ''}`}
          />
          <span className="checklist-label">Daily Vitamins</span>
        </div>
      </div>

      <div className="meal-tracking-row">
        {['breakfast', 'lunch', 'dinner'].map((meal) => (
          <div key={meal} className="meal-input-group">
            <label className="meal-label">
              {meal}
            </label>
            <input
              type="text"
              value={healthData[dateKey]?.[meal] || ''}
              onChange={(e) => updateHealthData(dateKey, meal, e.target.value)}
              placeholder={`${meal} meal`}
              className="meal-input"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthTracker;
