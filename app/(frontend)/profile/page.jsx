"use client"; // Next.js 13+ client component banane ke liye

import { useEffect, useState } from "react"; // React ke hooks

// Default export ho raha hai Profile component ka
export default function Profile() {
  // React states:
  const [profile, setProfile] = useState(null); // Profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message
  const [success, setSuccess] = useState(""); // Success message
  const [editMode, setEditMode] = useState(false); // Edit mode on/off

  // Profile fetch karne wali function
  const fetchProfile = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Agar token nahi mila to error dikhana
    if (!token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      // API call to get profile data
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      // Agar response OK nahi hai to error throw karo
      if (!res.ok) {
        const errorMessage = typeof data.detail === "string" ? data.detail : JSON.stringify(data);
        throw new Error(errorMessage);
      }

      setProfile(data); // Profile data set karo
    } catch (err) {
      setError(err.message || "Something went wrong."); // Error handle
    } finally {
      setLoading(false); // Loading false kar do
    }
  };

  // Component mount hote hi profile fetch karo
  useEffect(() => {
    fetchProfile();
  }, []);

  // Input field me value change hone par state update
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Name update karne wali function
  const handleUpdate = async (e) => {
    e.preventDefault(); // Page reload na ho

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      // API call to update name
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update-name/${profile.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: profile.name }), // Sirf name update ho raha hai
      });

      const data = await res.json();

      // Agar error aaya to show karo
      if (!res.ok) {
        const errorMessage = typeof data.detail === "string" ? data.detail : JSON.stringify(data);
        throw new Error(errorMessage);
      }

      setSuccess("✅ Name updated successfully."); // Success message
      setError(""); // Clear error
      setEditMode(false); // Edit mode off
      fetchProfile(); // Updated profile wapas fetch karo
    } catch (err) {
      setError(err.message); // Error message set karo
      setSuccess(""); // Clear success
    }
  };

  // Jab data load ho raha ho
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading profile...</p>
      </div>
    );

  // Agar error ho
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600 font-semibold">{error}</p>
      </div>
    );

  // Actual profile view aur edit UI
  return (
    <div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 space-y-6 md:space-y-0 md:space-x-10">

      {/* Profile Display Card */}
      <div className="bg-white shadow-xl rounded-xl p-8 w-full md:max-w-sm">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">👤 My Profile</h2>
        <p className="text-gray-700"><strong>Name:</strong> {profile.name}</p>
        <p className="text-gray-700 mt-2"><strong>Email:</strong> {profile.email}</p>

        {/* Edit button */}
        <button
          onClick={() => setEditMode(!editMode)}
          className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {editMode ? "Cancel Edit" : "✏️ Edit Name"}
        </button>
      </div>

      {/* Edit Form Show only if editMode true */}
      {editMode && (
        <div className="bg-white shadow-xl rounded-xl p-8 w-full md:max-w-sm">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">✏️ Edit Name</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="border border-gray-200 p-3 rounded-lg w-full bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-300"
            >
              ✅ Update Name
            </button>
          </form>

          {/* Success aur Error messages */}
          {success && <p className="text-green-600 mt-3">{success}</p>}
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
      )}
    </div>
  );
}
