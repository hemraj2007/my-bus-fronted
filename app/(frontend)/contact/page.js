'use client';  

import React, { useState } from 'react';

const ContactUs = () => {
  // Form data ke liye state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Form submit hone par
  const handleSubmit = async (e) => {
    e.preventDefault();  // Default form submission ko rokhna

    // Data jo POST request mein bhejna hai
    const requestData = {
      name: name,
      email: email,
      message: message,
    };


    // Form fields ko reset karna
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="container">
      <div className="card">
        <p className="text">
        </p>



        <h2 className="subheading">📧 Send Us a Message</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name:</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Your Name" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email:</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="Your Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message:</label>
            <textarea 
              className="form-textarea" 
              placeholder="Your Message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)} 
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
