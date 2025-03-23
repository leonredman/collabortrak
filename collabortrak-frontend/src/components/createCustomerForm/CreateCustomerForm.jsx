import React, { useState } from "react";

const CreateCustomerForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setMessage("Customer created successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        });
      } else if (response.status === 400) {
        setIsSuccess(false);
        setMessage("A customer with this email already exists.");
      } else {
        const errorData = await response.json();
        setIsSuccess(false);
        setMessage(errorData.message || "Failed to create customer.");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      setIsSuccess(false);
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="ui segment">
      <form className="ui form" onSubmit={handleSubmit}>
        <h3>Create New Customer</h3>

        <div className="two fields">
          <div className="field">
            <label>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="First Name"
            />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="field">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
          />
        </div>

        <div className="field">
          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>

        <div className="field">
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address"
          />
        </div>

        <div className="three fields">
          <div className="field">
            <label>City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div className="field">
            <label>State</label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
          <div className="field">
            <label>Zip</label>
            <input
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="Zip Code"
            />
          </div>
        </div>

        <div className="field">
          <label>Country</label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
          />
        </div>

        <button type="submit" className="ui primary button">
          Submit
        </button>

        {message && (
          <div
            className={`ui ${isSuccess ? "positive" : "negative"} message`}
            style={{ marginTop: "1rem" }}
          >
            <p>{message}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateCustomerForm;
