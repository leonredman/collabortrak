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
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

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

    // Trim input before submit
    const trimmedData = Object.fromEntries(
      Object.entries(formData).map(([Key, value]) => [Key, value.trim()])
    );

    try {
      const response = await fetch(`${backendUrl}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(trimmedData),
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
              maxLength={100}
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
              maxLength={100}
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
            maxLength={150}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" // reg-ex for email characters
            placeholder="Email"
          />
        </div>

        <div className="field">
          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            maxLength={20}
            placeholder="Phone Number"
          />
        </div>

        <div className="field">
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            maxLength={255}
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
              maxLength={100}
              placeholder="City"
            />
          </div>
          <div className="field">
            <label>State</label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              maxLength={100}
              placeholder="State"
            />
          </div>
          <div className="field">
            <label>Zip</label>
            <input
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              maxLength={20}
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
            maxLength={100}
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
