"use client";

import React from 'react';
import { FaBusAlt } from "react-icons/fa";
import Image from 'next/image';
import {
  GrFacebookOption,
  GrInstagram,
  GrTwitter,
  GrYoutube,
} from 'react-icons/gr';

const Footer = () => (
  <footer className="footer">
    <div className="inner">
    <FaBusAlt />

      {/* Brand & Tagline */}
      <div className="brand">
        <p>Your journey, our passion. Book buses across India with comfort, safety and ease.</p>
      </div>
      {/* Quick Links */}
      <div className="links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/bookings">Book Now</a></li>
          <li><a href="/routes">View Routes</a></li>
          <li><a href="/deals">Hot Deals</a></li>
          <li><a href="/track">Track Booking</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </div>

      {/* Support */}
      <div className="links">
        <h4>Support</h4>
        <ul>
          <li><a href="/contact-us">Contact Us</a></li>
          <li>24/7 Customer Care</li>
          <li>Live Chat</li>
          <li>Help Center</li>
        </ul>
      </div>

      {/* Contact Info & Social */}
      <div className="links">
        <h4>Contact</h4>
        <ul>
          <li>Email: support@bookmybus.com</li>
          <li>Phone: +91 123 456 7890</li>
          <li>WhatsApp: +91 987 654 3210</li>
        </ul>
        <div className="social">
          <a href="#"><GrFacebookOption size={24} /></a>
          <a href="#"><GrInstagram size={24} /></a>
          <a href="#"><GrTwitter size={24} /></a>
          <a href="#"><GrYoutube size={24} /></a>
        </div>
      </div>
    </div>

    <div className="bottom">
      &copy; {new Date().getFullYear()} BookMyBus. All Rights Reserved.
    </div>
  </footer>
);

export default Footer;
