'use client';

import React, { useState } from 'react';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // STOP BROWSER RELOAD

    try {
      const response = await fetch('http://127.0.0.1:8000/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Message send failed');
      }

      setResponseMessage('✅ Message sent successfully!');
      alert('✅ Message sent successfully!');

      // Clear fields
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setResponseMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="subheading">📧 Send Us a Message</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message:</label>
            <textarea
              className="form-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>

        {responseMessage && (
          <p style={{ color: responseMessage.startsWith('✅') ? 'green' : 'red' }}>
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
