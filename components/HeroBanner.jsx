'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const images = [
  'https://t3.ftcdn.net/jpg/05/70/65/04/240_F_570650424_yUIcZ8w0QHRe5aXwwk48LjnJ7u326Kj4.jpg',
  'https://media.istockphoto.com/id/533261705/photo/carrus-9700hd.jpg?s=612x612&w=0&k=20&c=RWAPaNHwp-iDuABOweJzJIU2Ou_a9gAWZ2sQkN-b3aI=',
  'https://media.istockphoto.com/id/458138667/photo/tourist-bus.jpg?s=612x612&w=0&k=20&c=vSA-V-puG1YWFFyC0q8SfQ76m5EMQG-_4AYo4uUsnxk=',
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentIndex(i => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const handleBookNow = () => {
    router.push('/book-now');
  };

  return (
    <div className="home-container">
      {/* 🖼 Image Slider */}
      <div className="image-slider">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Slide ${idx + 1}`}
            className={`image-slide ${idx === currentIndex ? 'active' : ''}`}
          />
        ))}
        <button className="book-now-btn" onClick={handleBookNow}>
          Book Now
        </button>
      </div>

      {/* ✨ Offers Section */}
      <div className="offers-section">
        <h2 className="offers-heading">🚌 Bus Booking Offers</h2>
        <div className="offers-grid">
          <div className="offer-card bg-blue-500 text-white">
            <h3 className="offer-heading">🚀 Flat 20% OFF</h3>
            <p className="offer-description">
              Use code: <strong>TRAVEL20</strong> for first booking
            </p>
          </div>
          <div className="offer-card bg-green-500 text-white">
            <h3 className="offer-heading">🧳 Group Travel</h3>
            <p className="offer-description">
              Book 5+ seats and get ₹500 cashback
            </p>
          </div>
          <div className="offer-card bg-yellow-500 text-white">
            <h3 className="offer-heading">💳 Pay Later</h3>
            <p className="offer-description">
              Book now and pay later with zero interest
            </p>
          </div>
        </div>
      </div>

      {/* 📞 Contact Us Section */}
      <div className="contact-section">
        <h2 className="contact-heading">📞 Contact Us</h2>
        <div className="contact-form">
          <form className="form-container">
            <input
              type="text"
              placeholder="Your Name"
              className="form-input"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="form-input"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="form-input"
            ></textarea>
            <button className="form-button">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
