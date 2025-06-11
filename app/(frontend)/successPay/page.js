"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SuccessPay() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id");

  useEffect(() => {
    const saveBooking = async () => {
      try {
        // 1. Stripe se payment details lo
        const sessionRes = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        const session = await sessionRes.json();

        // 2. Database mein save karo
        const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            user_id: session.metadata.user_id,
            from_location: session.metadata.from_location,
            to_location: session.metadata.to_location,
            seats: session.metadata.seats,
            price_per_seat: session.metadata.price_per_seat,
            total_price: session.metadata.amount
          })
        });

        if (!bookingRes.ok) throw new Error("Booking save nahi hui");

        // 3. Bookings page pe redirect karo
        router.push("/booking?payment=success");
      } catch (error) {
        toast.error(`Error: ${error.message}`);
        router.push("/book-now");
      }
    };

    if (sessionId) saveBooking();
    else router.push("/book-now");
  }, [sessionId, router]);

  return (
    <div className="container">
      <h1>Processing Your Booking...</h1>
      <p>Kripya wait karein, hum aapki booking confirm kar rahe hain</p>
    </div>
  );
}