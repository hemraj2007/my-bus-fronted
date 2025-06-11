'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update_password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        new_password: newPassword,
        confirm_password: confirmPassword
      })
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Password updated successfully!");
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => router.push('/admin/profile'), 2000);
    } else {
      setMessage(data.detail || "Failed to update password.");
    }
  };

  return (
    <div className="update-password-page">
      <h2>Update Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleUpdatePassword}>Update Password</button>
      <p>{message}</p>
    </div>
  );
};

export default UpdatePassword;
