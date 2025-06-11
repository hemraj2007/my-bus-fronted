'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAdminContext } from "@/context/AdminContext";

// ✅ ADD THIS: Define the formSchema
const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const { setUserInfo } = useAdminContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.detail || "Login failed", { duration: 4000 });
        throw new Error(result.detail || "Login failed");
      }

      const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // reset error

        const user = await login(email, password);

        if (user && user.role === 'admin') {
        } else {
          setErrorMessage('Access Denied: Only admins are allowed');
        }
      };

      localStorage.setItem("token", result.access_token);
      setUserInfo(result);

      toast.success("Login successful! Welcome Admin.", { duration: 3000 });
      router.push("/admin/profile");

    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="admin-login-form"></form>
      <Card className="login-card">
        <CardContent className="login-card-content">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="login-fields">
              <div className="form-group">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="error-message">{errors.password.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ReloadIcon className="loading-icon" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {errors.root && (
              <p className="error-message center-text">{errors.root.message}</p>
            )}
          </form>


        </CardContent>
      </Card>
    </div>
  );
}
