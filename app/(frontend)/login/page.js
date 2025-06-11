'use client'; // Next.js ko batata hai ki yeh client-side component hai

// React Hook Form se form validation ke liye useForm import kar rahe hain
import { useForm } from "react-hook-form";
// Zod se schema validation likhne ke liye import kar rahe hain
import { z } from "zod";
// Zod ko React Hook Form ke saath integrate karne ke liye
import { zodResolver } from "@hookform/resolvers/zod";

// UI ke liye components (Card, Input, Button, etc.)
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons"; // Spinner icon for loading (ghoomta h) 

// Page navigation ke liye
import Link from "next/link";
import { useRouter } from "next/navigation";
// Toast notification ke liye
import { toast } from "sonner";

import { useEffect } from "react";

// ✅ Zod schema define kar rahe hain form ke liye
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Login page ka main component
export default function LoginPage() {
  const router = useRouter(); // Page navigate karne ke liye

  // useForm se form handle kar rahe hain aur validation resolver laga rahe hain
  const {
    register,           // input fields ko form se bind karta hai
    handleSubmit,       // form submit handler
    formState: { errors, isSubmitting }, // form errors aur loading state
    setError,           // custom error set karne ke liye
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  // ✅ Form submit hone par backend se login API call
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // user data bhejna
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.detail || "Login failed");
        throw new Error(result.detail || "Login failed");
      }

      // if (result.role !== "user") {
      //   toast.error("Only users are allowed to login.");
      //   throw new Error("Access denied. Only users can login.");
      // }

      // 🔐 Token localStorage me save karna
      localStorage.setItem("token", result.access_token);

      // 🔁 Event dispatch karna taaki dusre components (jaise navbar) token change detect kar saken
      window.dispatchEvent(new Event("tokenSet"));

      toast.success("Login successful!");

      // ✅ Login ke baad redirect to products page
      router.push("/");

    } catch (error) {
      // Agar error aata hai toh form ke root level pe error dikhana
      setError("root", {
        type: "manual",
        message: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Card box jisme login form hai */}
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200">
        <CardContent className="px-6 py-8 space-y-6">
          {/* Heading and welcome text */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 text-sm">Please sign in to your account</p>
          </div>

          {/* Login form start */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              {/* Email field */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")} // useForm ka register
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Submit button with loading spinner */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {/* Custom errors dikhana (like API error) */}
            {errors.root && (
              <p className="text-red-600 text-sm text-center mt-2">{errors.root.message}</p>
            )}
          </form>

          {/* Forgot password and signup links */}
          <div className="text-center text-sm pt-4">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
            <div className="text-gray-600">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
