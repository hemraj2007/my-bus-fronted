"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const bookingId = searchParams.get('booking_id');
    
    if (paymentStatus === 'success') {
      toast.success('Booking successful!');
      // Remove query params without reload
      router.replace('/booking', undefined, { shallow: true });
    }

    const fetchUserBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/bookings`, {
          headers: { 
            "Authorization": `Bearer ${token}`
          },
        });
        
        if (!res.ok) throw new Error("Failed to fetch bookings");
        
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
        
        // Scroll to newly created booking if exists
        if (bookingId && document.getElementById(bookingId)) {
          document.getElementById(bookingId).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
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
    <div className="page">
      <h1 className="heading">My Booking History</h1>
      
      {/* Add success message if needed */}
      {searchParams.get('payment') === 'success' && (
        <div className="success-banner">
          Booking Successful! Thank you for your purchase.
        </div>
      )}

      <div className="table-container">
        {/* ... rest of your table code ... */}
      </div>

      <style jsx>{`
        .success-banner {
          background: #4CAF50;
          color: white;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 5px;
          text-align: center;
        }
        /* ... rest of your styles ... */
      `}</style>
    </div>
  );
}