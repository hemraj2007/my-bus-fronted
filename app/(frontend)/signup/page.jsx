"use client"; // ✅ Next.js 13+ me client-side rendering enforce karne ke liye

// 🔽 Required React and Next.js hooks
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 🔽 Toast notifications ke liye library
import { toast } from "sonner";

// 🔽 Custom UI components (Card, Button, Input, Label)
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 🔽 Loader icon for button
import { ReloadIcon } from "@radix-ui/react-icons";

// 🔽 Next.js built-in Link component
import Link from "next/link";

// 🔽 Signup page component start
export default function SignupPage() {
  const router = useRouter(); // 🔁 Page redirect ke liye useRouter hook

  // 🔽 Initial state for form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mob_number: "",
    role: "user",
  });

  const [errors, setErrors] = useState({}); // 🔽 Form field errors store karne ke liye
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔽 Submit button disable/loader ke liye

  // 🔽 Agar user already login hai to /profile pe redirect karo
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/profile");
    }
  }, [router]);

  // 🔽 Form validation function
  const validate = () => {
    const errs = {};

    // 🔽 Name validation
    if (form.name.trim().length < 2) errs.name = "Name is required";

    // 🔽 Email format validation
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";

    // 🔽 Password length check
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";

    // 🔽 Mobile number validation
    if (form.mob_number.length < 10) errs.mob_number = "Mobile number is required";

    if (!form.role) errs.role = "Role is required";


    return errs;
  };

  // 🔽 Form input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // 🔁 Har field ka value update karna
  };

  // 🔽 Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔽 Pehle form validate karo
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // 🔁 Errors state me set karo
      toast.error("Please fix the form errors."); // 🔔 Toast show karo
      return;
    }

    setErrors({}); // 🔁 Errors reset
    setIsSubmitting(true); // 🔁 Submit button ko disable karo (loader dikhane ke liye)

    try {
      // 🔽 FastAPI signup API call
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json(); // 🔁 Response JSON me convert karo

      // 🔽 Agar response ok nahi hai to error throw karo
      if (!res.ok) throw new Error(result.detail || "Something went wrong");

      toast.success("Account created successfully! You can now log in."); // ✅ Success message
      setForm({ name: "", email: "", password: "", mob_number: "" }); // 🔁 Form reset
      router.push("/login"); // 🔁 Redirect to login page
    } catch (error) {
      // 🔽 Agar koi error aaye to toast aur error message dikhao
      toast.error(error.message || "Signup failed. Please try again.");
      setErrors({ root: error.message });
    } finally {
      setIsSubmitting(false); // 🔁 Submit button ko wapas enable karo
    }
  };

  // 🔽 Signup form return (UI part)
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200">
        <CardContent className="px-6 py-8 space-y-6">

          {/* 🔽 Heading section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 text-sm">Join us by filling in your details</p>
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role}</p>}
          </div>


          {/* 🔽 Form start */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* 🔽 Form fields (dynamic rendering using map) */}
            <div className="space-y-4">
              {["name", "email", "password", "mob_number"].map((field) => (
                <div key={field}>
                  <Label htmlFor={field}>
                    {field === "mob_number" ? "Mobile Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    placeholder={`Enter your ${field}`}
                    value={form[field]}
                    onChange={handleChange}
                  />
                  {/* 🔽 Field-wise error show */}
                  {errors[field] && <p className="text-red-600 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>

            {/* 🔽 Submit button */}
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : "Sign up"}
            </Button>
          </form>

          {/* 🔽 Login page link */}
          <div className="text-center text-sm pt-4">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
