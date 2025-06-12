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

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdminContext } from "@/context/AdminContext";

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
      console.log("Login Payload:", data);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Login Result:", result);

      if (!response.ok) {
        toast.error(result.detail || "Login failed", { duration: 4000 });
        throw new Error(result.detail || "Login failed");
      }

      localStorage.setItem("token", result.access_token);

      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${result.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileResponse.json();
      console.log("Profile Data:", profileData);

      if (profileData.role !== "admin") {
        localStorage.removeItem("token");

        toast.error("🚫 Only Admin Access Allowed!", {
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

      setUserInfo(profileData);
      toast.success("✅ Login successful! Welcome Admin.", { duration: 3000 });
      router.push("/admin/profile");

    } catch (error) {
      console.error("Login Error:", error);
      setError("root", {
        type: "manual",
        message: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardContent className="login-card-content">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
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
