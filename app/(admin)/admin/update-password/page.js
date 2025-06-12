// app/(admin)/update-password/page.jsx

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const UpdatePassword = () => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleUpdate = async () => {
    if (newPass !== confirmPass) {
      setMsg("❌ Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("⚠️ Please login first.");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update_password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        new_password: newPass,
        confirm_password: confirmPass
      })
    });

    const data = await res.json();
    if (res.ok) {
      setMsg("✅ Password updated successfully!");
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => router.push('/admin/profile'), 2000);
    } else {
      setMsg(data.detail || "❌ Failed to update password.");
    }
  };

  return (
    <div className="password-container">
      <h2 className="password-heading">🔒 Update Password</h2>
      <input
        className="password-input"
        type="password"
        placeholder="New Password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />
      <input
        className="password-input"
        type="password"
        placeholder="Confirm Password"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
      />
      <button className="password-btn" onClick={handleUpdate}>
        ✅ Update Password
      </button>
      <p className="password-message">{msg}</p>
    </div>
  );
};

export default UpdatePassword;
