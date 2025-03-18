import React from "react";

const ActivityStream = () => {
  const activities = [
    "Developer updated ticket #123",
    "QA marked ticket #234 as 'Needs Edits'",
    "New ticket #345 created",
  ];

  return (
    <div className="widget">
      <h3>Activity Stream</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityStream;
