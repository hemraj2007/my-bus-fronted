// pages/about.js
'use client';
import React from 'react';

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1 className="heading">About Us</h1>

      <section className="section">
        <h2 className="subheading">Our Story</h2>
        <p>
          Founded in 2025, <strong>QuickBus</strong> was created to offer  
          safe, comfortable, and budget-friendly bus journeys. We started  
          with a Next.js frontend and FastAPI backend to make your booking  
          experience lightning-fast ⚡.
        </p>
      </section>

      <section className="section">
        <h2 className="subheading">Our Mission</h2>
        <p>
          Our mission is to provide every traveler with a seamless travel  
          solution, featuring transparent pricing, real-time seat availability,  
          and 24/7 customer support. Your trust is our identity.
        </p>
      </section>

      <section className="section">
        <h2 className="subheading">Meet the Team</h2>
        <ul className="team-list">
          <li><strong>vishnu</strong> – Founder &amp; CEO</li>
          <li><strong>rawat</strong> – Head of Design</li>
          <li><strong>rajawat</strong> – CTO</li>
        </ul>
      </section>

      <style jsx>{`
        .about-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 80px 20px;
          background-color: #f4f6f9;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.8;
        }
        .heading {
          font-size: 42px;
          text-align: center;
          margin-bottom: 50px;
          color: #2c3e50;
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 1.5px;
        }
        .section {
          margin-bottom: 40px;
        }
        .subheading {
          font-size: 28px;
          color: #3498db;
          margin-bottom: 20px;
          font-weight: bold;
        }
        p {
          font-size: 18px;
          line-height: 1.6;
          color: #555;
        }
        .team-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }
        .team-list li {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease-in-out;
        }
        .team-list li:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        .team-list li strong {
          font-size: 20px;
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
}
