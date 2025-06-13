import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, user_id, bus_id, seats, from_location, to_location } = await req.json();

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
            unit_amount: Math.round(amount * 100), // Stripe amount is in paisa
          },
          quantity: 1,
        },
      ],
      mode: 'payment',

      // ✅ Yeh env variables se set hoga
      success_url: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL,
      cancel_url: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL,

      metadata: {
        user_id: user_id.toString(),
        bus_id: bus_id.toString(),
        seats: seats.toString(),
        from_location,
        to_location,
        amount: amount.toString(),
        price_per_seat: (amount / seats).toString()
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
