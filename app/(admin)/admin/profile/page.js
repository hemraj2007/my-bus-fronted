"use client";

import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);

  const fetchProfile = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = typeof data.detail === "string" ? data.detail : JSON.stringify(data);
        throw new Error(errorMessage);
      }

      setProfile(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const res = await fetch(`http://localhost:8000/users/update_profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          mob_number: profile.mob_number,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = typeof data.detail === "string" ? data.detail : JSON.stringify(data);
        throw new Error(errorMessage);
      }

      setSuccess("✅ Profile updated successfully.");
      setError("");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  if (loading)
    return (
      <div className="profile-loading">
        <p>Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="profile-error">
        <p className="error-message">{error}</p>
      </div>
    );

  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <h2>👤 My Profile</h2>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Mobile Number:</strong> {profile.mob_number}</p>

        <button
          onClick={() => setEditMode(!editMode)}
          className="button-primary"
        >
          {editMode ? "Cancel Edit" : "✏️ Edit Profile"}
        </button>
      </div>

      {/* Edit Form */}
      {editMode && (
        <div className="edit-form">
          <h2>✏️ Edit Profile</h2>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
              />
            </div>

            <div>
              <label>Mobile Number</label>
              <input
                type="text"
                name="mob_number"
                value={profile.mob_number}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="button-primary">
              ✅ Update Profile
            </button>
          </form>

          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}
