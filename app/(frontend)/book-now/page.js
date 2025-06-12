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
        const res = await fetch(`http://localhost:8000/travels/all`);
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
    const lowTo = toFilter.trim().toLowerCase();
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
          user_id: "123", // Hardcoded for now — replace with actual logged-in user_id if you have
          bus_id: selectedBooking.id,
          seats: seats,
          amount: selectedBooking.price * seats,
          from_location: selectedBooking.from_location,
          to_location: selectedBooking.to_location,
          name: `${selectedBooking.from_location} → ${selectedBooking.to_location}`
        }),
      });

      if (res.status === 500) return;

      const { id: sessionId } = await res.json();
      toast.loading("Redirecting to Payment...");
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Frontend Stripe Error:", err);
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

    </div>
  );
}
