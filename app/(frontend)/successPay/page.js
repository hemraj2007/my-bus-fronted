"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// 👇 Nested client component with Suspense
function SuccessHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const saveBooking = async () => {
      try {
        const sessionRes = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        const session = await sessionRes.json();

        if (!session?.metadata) throw new Error("Stripe session metadata missing!");

        const {
          user_id,
          from_location,
          to_location,
          seats,
          price_per_seat,
          amount,
        } = session.metadata;

        const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            user_id: parseInt(user_id),
            from_location,
            to_location,
            seats: parseInt(seats),
            price_per_seat: parseFloat(price_per_seat),
            total_price: parseFloat(amount),
            travel_date: today,
          }),
        });

        if (!bookingRes.ok) throw new Error("Booking save nahi hui");

        router.push("/booking?payment=success");
      } catch (error) {
        console.error("Booking Save Error:", error);
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
      <p>Please wait, we are confirming your booking.</p>
    </div>
  );
}

export default function SuccessPay() {
  return (
    <Suspense fallback={<div>Loading booking info...</div>}>
      <SuccessHandler />
    </Suspense>
  );
}
