'use client';


import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();

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
      const response = await fetch(`http://localhost:8000/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.detail || "Login failed");
        throw new Error(result.detail || "Login failed");
      }

      localStorage.setItem("token", result.access_token);

      const profileRes = await fetch(`http://localhost:8000/users/profile`, {
        headers: {
          Authorization: `Bearer ${result.access_token}`,
        },
      });

      const profileData = await profileRes.json();

      if (!profileRes.ok || !profileData.role) {
        throw new Error("Failed to fetch profile");
      }

      if (profileData.role !== "user") {
        localStorage.removeItem("token");
        toast.error("🚫 Only normal users are allowed to login here", {
          style: {
            background: "#ffe5e5",
            color: "#b30000",
            fontWeight: "bold",
            border: "1px solid #b30000",
          },
          duration: 5000,
        });
        return;
      }

      window.dispatchEvent(new Event("tokenSet"));
      toast.success("🎉 Login successful!");
      router.push("/profile");

    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="login-page-wrapper">
      <Card className="login-card">
        <CardContent className="login-card-content">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="login-form-group">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="login-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="login-error">{errors.password.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="login-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {errors.root && (
              <p className="login-error login-error-center">{errors.root.message}</p>
            )}
          </form>

          <div className="login-footer">
            <Link href="/forgot-password" className="login-link">
              Forgot password?
            </Link>
            <div>
              Don’t have an account?{" "}
              <Link href="/signup" className="login-link">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
