'use client';
import React from 'react';

export default function AboutPage() {
  return (
    <div className="aboutContainer">
      <h1 className="aboutTitle">About Us</h1>

      <section className="aboutSection">
        <h2 className="sectionTitle">Our Story</h2>
        <p className="sectionText">
          Founded in 2025, <strong>QuickBus</strong> was created to offer  
          safe, comfortable, and budget-friendly bus journeys. We started  
          with a Next.js frontend and FastAPI backend to make your booking  
          experience lightning-fast ⚡.
        </p>
      </section>

      <section className="aboutSection">
        <h2 className="sectionTitle">Our Mission</h2>
        <p className="sectionText">
          Our mission is to provide every traveler with a seamless travel  
          solution, featuring transparent pricing, real-time seat availability,  
          and 24/7 customer support. Your trust is our identity.
        </p>
      </section>

      <section className="aboutSection">
        <h2 className="sectionTitle">Meet the Team</h2>
        <ul className="teamGrid">
          <li className="teamMember"><strong>vishnu</strong> – Founder &amp; CEO</li>
          <li className="teamMember"><strong>rawat</strong> – Head of Design</li>
          <li className="teamMember"><strong>rajawat</strong> – CTO</li>
        </ul>
      </section>

  
    </div>
  );
}
