import React, { useState } from "react";
import { Button, Dropdown, Icon, Input, Table } from "semantic-ui-react";

const TicketsTable = ({ columns, data, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn] || "";
    const bValue = b[sortColumn] || "";

    if (sortOrder === "asc") return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  const filteredData = sortedData.filter(
    (ticket) =>
      (!filterStatus || ticket.status === filterStatus) &&
      (!filterType || ticket.ticketType === filterType) &&
      (!searchQuery ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get the data for the current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Filtering Controls */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <Dropdown
          placeholder="Filter by Status"
          selection
          options={[
            { key: "open", text: "OPEN", value: "OPEN" },
            { key: "ready", text: "READY", value: "READY" },
            { key: "published", text: "PUBLISHED", value: "PUBLISHED" },
          ]}
          onChange={(e, { value }) => setFilterStatus(value)}
          value={filterStatus}
        />

        <Dropdown
          placeholder="Filter by Ticket Type"
          selection
          options={[
            { key: "epic", text: "Epic", value: "EPIC" },
            { key: "story", text: "Story", value: "STORY" },
            { key: "task", text: "Task", value: "TASK" },
            { key: "bug", text: "Bug", value: "BUG" },
          ]}
          onChange={(e, { value }) => setFilterType(value)}
          value={filterType}
        />

        <Input
          icon="search"
          placeholder="Search by Title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button
          onClick={() => {
            setFilterStatus("");
            setFilterType("");
            setSearchQuery("");
          }}
        >
          Clear Filters
        </Button>
      </div>

      <Table celled>
        <Table.Header>
          <Table.Row>
            {columns.map((col) => (
              <Table.HeaderCell
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{ cursor: "pointer" }}
              >
                {col.label}{" "}
                {sortColumn === col.key && (sortOrder === "asc" ? "▲" : "▼")}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedData.map((row) => (
            <Table.Row key={row.id}>
              {columns.map((col) => (
                <Table.Cell key={col.key}>
                  {typeof col.render === "function"
                    ? col.render(row)
                    : row[col.key]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Pagination Controls */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          icon
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon name="arrow left" />
        </Button>

        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            active={currentPage === index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          icon
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Icon name="arrow right" />
        </Button>
      </div>
    </>
  );
};

export default TicketsTable;
