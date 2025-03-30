import React, { useState } from "react";
import { Button, Input, List, Modal } from "semantic-ui-react";
import "./SearchBarWithFilters.css";

const SearchBarWithFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchSearchResults();
    }
  };

  const openSearchModal = () => {
    fetchSearchResults();
  };

  const fetchSearchResults = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/tickets/search?title=${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // makes sure cookies set with request
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      setSearchResults(data);
      setIsModalOpen(true); // Only open the modal if the request is successful
    } catch (err) {
      console.error(err.message);
      setError("Error fetching search results");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
    setIsSearchOpen(false);
    setSearchResults([]);
  };

  return (
    <div style={{ marginRight: "20px" }}>
      <Input
        icon="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        onClick={handleSearchClick}
        onKeyDown={handleSearchKeyPress}
        className={`search-input ${isSearchOpen ? "expanded" : ""}`}
        style={{
          transition: "width 0.3s",
          width: isSearchOpen ? "300px" : "150px",
        }}
      />
      {isSearchOpen && (
        <Button
          icon="search"
          onClick={openSearchModal}
          style={{ marginLeft: "10px" }}
        />
      )}

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          className="custom-search-modal"
          closeIcon
          dimmer="blurring"
          style={{
            width: "60%",
            marginTop: "100px",
            backgroundColor: "#f0f0f0", // Lighter background color
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Modal.Header
            style={{
              backgroundColor: "#e0e0e0",
              borderRadius: "8px 8px 0 0",
              padding: "10px",
            }}
          >
            Search Results
          </Modal.Header>
          <Modal.Content>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "65%" }}>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && searchResults.length === 0 && (
                  <p>No results found.</p>
                )}
                {!loading && searchResults.length > 0 && (
                  <List divided>
                    {searchResults.map((ticket) => (
                      <List.Item key={ticket.id}>
                        <List.Content>
                          <List.Header>{ticket.title}</List.Header>
                          <List.Description>
                            {ticket.description} <br />
                            <strong>Tracking Number:</strong>{" "}
                            {ticket.ticketTrackingNumber}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List>
                )}
              </div>

              {/* Filters Panel */}
              <div
                style={{
                  width: "30%",
                  padding: "20px",
                  backgroundColor: "#e9e9e9",
                  borderRadius: "10px",
                  marginLeft: "20px",
                }}
              >
                <h3>Filters</h3>

                {/* Last Updated Filter */}
                <div style={{ marginBottom: "15px" }}>
                  <label>
                    <strong>Last Updated:</strong>
                  </label>
                  <select
                    style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                  >
                    <option value="">Anytime</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="7days">Past 7 Days</option>
                    <option value="30days">Past 30 Days</option>
                    <option value="year">Past Year</option>
                  </select>
                </div>

                {/* Assigned Employee Filter */}
                <div style={{ marginBottom: "15px" }}>
                  <label>
                    <strong>Assigned Employee:</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Search employee..."
                    style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                  />
                </div>

                {/* Ticket Status Filter */}
                <div style={{ marginBottom: "15px" }}>
                  <label>
                    <strong>Status:</strong>
                  </label>
                  <div>
                    <label>
                      <input type="checkbox" value="open" /> Open
                    </label>
                    <br />
                    <label>
                      <input type="checkbox" value="published" /> Published
                    </label>
                    <br />
                    <label>
                      <input type="checkbox" value="in_progress" /> In Progress
                    </label>
                    <br />
                    <label>
                      <input type="checkbox" value="complete" /> Complete
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Content>
        </Modal>
      )}
    </div>
  );
};

export default SearchBarWithFilters;
