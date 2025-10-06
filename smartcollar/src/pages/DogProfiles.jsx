import React from 'react';
import './DogProfiles.css';

const DogProfiles = () => {
  return (
    <div className="dog-profiles-container">
      <div className="location-selector">
        <select>
          <option value="zone1">Zone 1</option>
        </select>
      </div>
      <div className="dog-profiles-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="dog-profile-card">
                        <p>Dog ID: {123 + index}</p>
          </div>
        ))}
        <div className="add-dog-profile-card">
          <p>+</p>
        </div>
      </div>
    </div>
  );
};

export default DogProfiles;
