import React from 'react';
import './statsCard.scss';

const StatsCard = ({ title, value }) => {
  return (
    <div className="statsCard">
      <h2>{title}</h2>
      <p>{value}</p>
    </div>
  );
}

export default StatsCard;
