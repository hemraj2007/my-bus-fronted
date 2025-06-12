import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return Response.json(session);
  } catch (error) {
    console.error("Stripe Session Fetch Error:", error);
    return Response.json({ error: "Failed to retrieve session" }, { status: 500 });
  }
}
