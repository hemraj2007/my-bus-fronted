"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";

export default function Profile() {
  const { userInfo, setUserInfo } = useUserContext();
  const [loading, setLoading] = useState(!userInfo);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(userInfo || null);

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
      if (!res.ok) throw new Error(data.detail || "Error fetching profile");

      setProfile(data);
      setUserInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;

    try {
      const res = await fetch(`http://127.0.0.1:8000/users/update_profile/${profile.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: profile.name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Update failed");

      setSuccess("✅ Name updated successfully.");
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
        <p className="loading-text">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="profile-error">
        <p className="error-text">{error}</p>
      </div>
    );

  return (
    <div className="profile-container">
      {/* Display Card */}
      <div className="profile-card">
        <h2 className="profile-title">👤 My Profile</h2>
        <p className="profile-info"><strong>Name:</strong> {profile.name}</p>
        <p className="profile-info"><strong>Mobile:</strong> {profile.mob_number}</p>
        <p className="profile-info"><strong>Email:</strong> {profile.email}</p>

        <button
          onClick={() => setEditMode(!editMode)}
          className="edit-button"
        >
          {editMode ? "Cancel Edit" : "✏️ Edit profile"}
        </button>
      </div>

      {editMode && (
        <div className="edit-form-container">
          <h2 className="edit-title">✏️ Edit Name</h2>
          <form onSubmit={handleUpdate} className="edit-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mob_number" className="form-label">Mobile Number</label>
              <input
                type="tel"
                id="mob_number"
                name="mob_number"
                value={profile.mob_number}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength={10}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="form-input-disabled"
              />
            </div>

            <button type="submit" className="submit-button">
              ✅ Update Name
            </button>
          </form>

          {success && <p className="success-text">{success}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      )}
    </div>
  );
}
