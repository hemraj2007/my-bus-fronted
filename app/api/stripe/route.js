import Stripe from 'stripe';

// Use your existing key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, user_id, bus_id, seats, from_location, to_location } = await req.json();

    // Improved success URL with all needed params
    const success_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/successPay?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/bus-booking`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Bus Ticket (${from_location} → ${to_location})`,
              description: `${seats} seat(s) | ${new Date().toLocaleDateString()}`
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: {
        user_id: user_id.toString(), // Ensure string format
        bus_id: bus_id.toString(),
        seats: seats.toString(),
        from_location,
        to_location,
        amount: amount.toString(),
        price_per_seat: (amount/seats).toString() // Calculate price per seat
      },
    });

    return Response.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    return Response.json({ 
      error: error.message,
      type: error.type,
      code: error.code 
    }, { status: 500 });
  }
}