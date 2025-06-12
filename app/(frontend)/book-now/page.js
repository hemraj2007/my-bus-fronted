"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getStripe from "@/lib/getStripe";

export default function BookNow() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [fromFilter, setFromFilter] = useState(""); // From filter state
  const [toFilter, setToFilter] = useState("");     // To filter state

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [seats, setSeats] = useState(1);
  const router = useRouter();

  // Fetch all travels once
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/all`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setBookings(arr);
        setFiltered(arr);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  // Re-filter whenever filters or bookings change
  useEffect(() => {
    const lowFrom = fromFilter.trim().toLowerCase();
    const lowTo   = toFilter.trim().toLowerCase();
    const arr = bookings.filter((b) => {
      return (
        b.from_location.toLowerCase().includes(lowFrom) &&
        b.to_location.toLowerCase().includes(lowTo)
      );
    });
    setFiltered(arr);
  }, [fromFilter, toFilter, bookings]);

  const handleBookNow = (booking) => {
    setSelectedBooking(booking);
    setSeats(1);
  };

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to book!");
      router.push("/login");
      return;
    }
    try {
      const stripe = await getStripe();
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: selectedBooking.id,
          amount: selectedBooking.price * seats,
          name: `${selectedBooking.from_location} → ${selectedBooking.to_location}`,
        }),
      });
      if (res.status === 500) return;
      const { id: sessionId } = await res.json();
      toast.loading("Redirecting to Payment...");
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="page">
      <h1 className="heading">Available Bus Bookings</h1>

      {/* FILTER INPUTS */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="From location..."
          value={fromFilter}
          onChange={(e) => setFromFilter(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />
        <input
          type="text"
          placeholder="To location..."
          value={toFilter}
          onChange={(e) => setToFilter(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />
      </div>

      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>FROM → TO</th>
              <th>TIME</th>
              <th>PRICE</th>
              <th>SEATS</th>
              <th>BOOK</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((booking, idx) => (
                <tr key={idx}>
                  <td>
                    <img src={booking.image} alt="Bus" className="bus-image" />
                  </td>
                  <td>{booking.from_location} → {booking.to_location}</td>
                  <td>{new Date(booking.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>₹ {booking.price}</td>
                  <td>{booking.seats} Seats</td>
                  <td>
                    <button className="seat-button" onClick={() => handleBookNow(booking)}>
                      Book Now
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No matching bookings.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Book Now Form Modal */}
      {selectedBooking && (
        <div className="overlay">
          <div className="booking-form">
            <h2>Confirm Your Booking</h2>
            <img src={selectedBooking.image} alt="Bus" className="bus-image-large" />
            <p><strong>From:</strong> {selectedBooking.from_location}</p>
            <p><strong>To:</strong> {selectedBooking.to_location}</p>
            <p><strong>Time:</strong> {new Date(selectedBooking.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Price per Seat:</strong> ₹ {selectedBooking.price}</p>

            <div className="seat-control">
              <button onClick={() => setSeats(seats > 1 ? seats - 1 : 1)}>-</button>
              <span>{seats}</span>
              <button onClick={() => setSeats(seats + 1)}>+</button>
            </div>

            <p><strong>Total Price:</strong> ₹ {selectedBooking.price * seats}</p>

            <button className="confirm-button" onClick={handleConfirmBooking}>
              Confirm Booking
            </button>

            <button className="cancel-button" onClick={() => setSelectedBooking(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Styling */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(to right, #74ebd5, #acb6e5);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
        }
        .heading {
          font-size: 36px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
          text-shadow: 1px 1px 2px white;
        }
        .table-container {
          width: 100%;
          max-width: 1200px;
          background: white;
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          overflow-x: auto;
        }
        .booking-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 16px;
        }
        thead tr {
          background: linear-gradient(to right, #3498db, #2980b9);
          color: white;
        }
        th, td {
          padding: 15px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }
        tbody tr:hover {
          background-color: #f0f8ff;
          transition: 0.3s;
        }
        .bus-image {
          width: 120px;
          height: 80px;
          object-fit: cover;
          border-radius: 10px;
        }

        /* Modal styling */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .booking-form {
          background: white;
          padding: 30px;
          border-radius: 15px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          text-align: center;
        }
        .bus-image-large {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 15px;
        }
        .seat-control {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin: 20px 0;
        }
        .seat-control button {
          background-color: #3498db;
          color: white;
          border: none;
          font-size: 20px;
          padding: 10px 15px;
          border-radius: 50%;
          cursor: pointer;
        }
        .confirm-button {
          background-color: #2ecc71;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          margin-top: 20px;
          cursor: pointer;
        }
        .confirm-button:hover {
          background-color: #27ae60;
        }
        .cancel-button {
          background-color: #e74c3c;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          margin-top: 10px;
          cursor: pointer;
        }
        .cancel-button:hover {
          background-color: #c0392b;
        }

          

        
      `}</style>
    </div>
  );
}
