import React from "react";

const EmployeeTicketsList = () => {
  const employees = [
    { name: "Alice Smith", ticketCount: 4 },
    { name: "John Doe", ticketCount: 6 },
    { name: "Peter Parker", ticketCount: 3 },
  ];

  return (
    <div className="widget">
      <h3>All Active Tickets by Employee</h3>
      <ul>
        {employees.map((employee, index) => (
          <li key={index}>
            {employee.name} - {employee.ticketCount} tickets
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeTicketsList;
