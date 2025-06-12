"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function BookingClient() {
  const [bookings, setBookings] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const bookingId = searchParams.get("booking_id");

    if (paymentStatus === "success") {
      toast.success("Booking successful!");
      router.replace("/booking", undefined, { shallow: true });
    }

    const fetchUserBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);

        if (bookingId && document.getElementById(bookingId)) {
          document.getElementById(bookingId).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load your bookings.");
      }
    };

    fetchUserBookings();
  }, [searchParams, router]);

  return (
    <div className="booking-wrapper">
      <h1 className="booking-heading">My Booking History</h1>

      {searchParams.get("payment") === "success" && (
        <div className="booking-success-banner">
          ✅ Booking Successful! Thank you for your purchase.
        </div>
      )}

      <div className="booking-table-container">
        {bookings.length > 0 ? (
          <table className="booking-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Seats</th>
                <th>Per Seat Price</th>
                <th>Total Price</th>
                <th>Travel Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} id={booking.id}>
                  <td>{booking.from_location}</td>
                  <td>{booking.to_location}</td>
                  <td>{booking.seats}</td>
                  <td>₹{booking.price_per_seat}</td>
                  <td>₹{booking.total_price}</td>
                  <td>{booking.travel_date || "N/A"}</td>
                  <td>{booking.booking_status || "confirmed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="booking-empty-msg">No bookings found.</p>
        )}
      </div>
    </div>
  );
}

// ✅ Page component that wraps BookingClient in Suspense
export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingClient />
    </Suspense>
  );
}
