import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
    if(!stripePromise) {
        // stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
        stripePromise = loadStripe("pk_test_51R8xOS4PY15pkOmFuoEH6I2z6fu3T0OBIjqLYyKvrbHm8MmuzRnDdnyj6ti6pu9wZKN6Oz6qQl7pyVF4XN9i55ln00pnRl3c8H");
    }

    return stripePromise;
}

export default getStripe;