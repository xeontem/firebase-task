import React from 'react';
import './progress.css';

export const ProgressBar = ({ progress }) =>
  <div className={`progress__wrapper ${progress === 100 ? 'progress__wrapper--done' : ''}`} >
    <div className="progress__progress-bar" style={{ width: progress + '%' }} />
  </div>;
