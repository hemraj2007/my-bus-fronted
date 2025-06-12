"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getStripe from "@/lib/getStripe";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BookNow() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [seats, setSeats] = useState(1);

  const router = useRouter();

  // Fetch all travels
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/all`);
        const data = await res.json();
        setBookings(data);
        setFiltered(data);
      } catch (err) {
        toast.error("Error fetching bookings");
      }
    };
    fetchBookings();
  }, []);

  // Filter logic
  useEffect(() => {
    const lowFrom = fromFilter.toLowerCase().trim();
    const lowTo = toFilter.toLowerCase().trim();
    const result = bookings.filter(
      (b) =>
        b.from_location.toLowerCase().includes(lowFrom) &&
        b.to_location.toLowerCase().includes(lowTo)
    );
    setFiltered(result);
  }, [fromFilter, toFilter, bookings]);

  const handleBookNow = (booking) => {
    setSelectedBooking(booking);
    setSeats(1);
  };

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book!");
      router.push("/admin");
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

      const { id: sessionId } = await res.json();
      toast.loading("Redirecting to payment...");
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      toast.error("Booking failed.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this travel?");
    if (!confirmed) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/travels/delete/${id}`, {
        method: "DELETE",
      });
      toast.success("Deleted successfully!");
      setBookings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const handleExportExcel = () => {
    const data = filtered.map((item) => ({
      From: item.from_location,
      To: item.to_location,
      Time: new Date(item.time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      Price: item.price,
      Seats: item.seats,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Travels");
    XLSX.writeFile(wb, "travels.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const rows = filtered.map((item) => [
      item.from_location,
      item.to_location,
      new Date(item.time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      item.price,
      item.seats,
    ]);

    autoTable(doc, {
      head: [["From", "To", "Time", "Price", "Seats"]],
      body: rows,
    });

    doc.save("travels.pdf");
  };


  return (
    <div className="page">
      <h1 className="heading">Book Your Travel</h1>

      {/* Top buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
        <button onClick={() => router.push("/admin/book-now/add")}>➕ Add Travel</button>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportExcel}>📤 Export Excel</button>
          <button onClick={handleExportPDF}>📄 Export PDF</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="From..."
          value={fromFilter}
          onChange={(e) => setFromFilter(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />
        <input
          type="text"
          placeholder="To..."
          value={toFilter}
          onChange={(e) => setToFilter(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>From → To</th>
              <th>Time</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Book</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((booking, idx) => (
                <tr key={idx}>
                  <td>
                    <img
                      src={booking.image}
                      alt="bus"
                      style={{ width: 100, borderRadius: 8 }}
                    />
                  </td>
                  <td>
                    {booking.from_location} → {booking.to_location}
                  </td>
                  <td>
                    {new Date(booking.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>₹ {booking.price}</td>
                  <td>{booking.seats}</td>
                  <td>
                    <button onClick={() => handleBookNow(booking)}>Book Now</button>
                  </td>
                  <td>
                    <button
                      onClick={() => router.push(`/admin/book-now/edit/${booking.id}`)}
                      style={{ marginRight: 8 }}
                    >
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(booking.id)}>❌ Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No matching results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Modal */}
      {selectedBooking && (
        <div className="overlay">
          <div className="booking-form">
            <h2>Confirm Booking</h2>
            <img
              src={selectedBooking.image}
              alt="Bus"
              style={{ width: "100%", borderRadius: 10, marginBottom: 10 }}
            />
            <p><strong>From:</strong> {selectedBooking.from_location}</p>
            <p><strong>To:</strong> {selectedBooking.to_location}</p>
            <p><strong>Price:</strong> ₹ {selectedBooking.price}</p>
            <p><strong>Time:</strong> {new Date(selectedBooking.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}</p>

            <div style={{ display: "flex", gap: 20, margin: "15px 0" }}>
              <button onClick={() => setSeats(Math.max(seats - 1, 1))}>-</button>
              <span>{seats}</span>
              <button onClick={() => setSeats(seats + 1)}>+</button>
            </div>

            <p><strong>Total:</strong> ₹ {selectedBooking.price * seats}</p>

            <button onClick={handleConfirmBooking}>Confirm</button>
            <button onClick={() => setSelectedBooking(null)} style={{ marginTop: 10 }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
