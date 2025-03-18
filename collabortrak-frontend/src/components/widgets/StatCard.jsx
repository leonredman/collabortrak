import React from "react";

const StatCard = ({ title, count }) => {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p>{count}</p>
    </div>
  );
};

export default StatCard;
