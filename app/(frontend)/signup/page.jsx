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
    role: 'user'
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
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
    <div className="auth-container">
      <Card className="auth-card">
        <CardContent className="auth-card-content">

          <div className="auth-heading">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us by filling in your details</p>
          </div>

          <div className="auth-field">
            <Label htmlFor="role">Role</Label>
            <input
              type="text"
              id="role"
              name="role"
              value="user"
              readOnly
              className="auth-input readonly"
            />
            {errors.role && <p className="auth-error">{errors.role}</p>}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-group">
              {["name", "email", "password", "mob_number"].map((field) => (
                <div key={field} className="auth-field">
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
                    className="auth-input"
                  />
                  {errors[field] && <p className="auth-error">{errors[field]}</p>}
                </div>
              ))}
            </div>

            <Button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ReloadIcon className="loader-icon" />
                  <span>Creating account...</span>
                </>
              ) : "Sign up"}
            </Button>
          </form>

          <div className="auth-footer">
            <span>Already have an account? </span>
            <Link href="/login" className="auth-link">Sign in</Link>
          </div>

        </CardContent>
      </Card>
    </div>

  );
}
