"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const res = await fetch(`http://localhost:8000/booking/bookings`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Could not load your bookings.");
      }
    };
    fetchUserBookings();
  }, []);

  return (
    <div className="page">
      <h1 className="heading">My Booking History</h1>
      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER ID</th>
              <th>FROM → TO</th>
              <th>SEATS</th>
              <th>PRICE/SEAT</th>
              <th>TOTAL PRICE</th>
              <th>CREATED AT</th>
              <th>UPDATED AT</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b, i) => (
                <tr key={i}>
                  <td>{b.id}</td>
                  <td>{b.user_id}</td>
                  <td>
                    {b.from_location} → {b.to_location}
                  </td>
                  <td>{b.seats}</td>
                  <td>₹ {b.price_per_seat.toFixed(2)}</td>
                  <td>₹ {(b.price_per_seat * b.seats).toFixed(2)}</td>
                  <td>{new Date(b.created_at).toLocaleString()}</td>
                  <td>{new Date(b.updated_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
