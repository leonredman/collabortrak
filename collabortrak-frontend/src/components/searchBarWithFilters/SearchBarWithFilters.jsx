import React, { useState } from "react";
import { Button, Input, Modal } from "semantic-ui-react";
import "./SearchBarWithFilters.css";

const SearchBarWithFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      openSearchModal();
    }
  };

  const openSearchModal = () => {
    if (searchQuery.trim() !== "") {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
    setIsSearchOpen(false);
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
          style={{ width: "60%", marginTop: "100px" }}
          closeIcon
        >
          <Modal.Header>Search Results</Modal.Header>
          <Modal.Content>
            <div>
              <p>Search results will be displayed here...</p>
            </div>
          </Modal.Content>
        </Modal>
      )}
    </div>
  );
};

export default SearchBarWithFilters;
