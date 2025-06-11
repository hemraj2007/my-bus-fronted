"use client"; // Next.js me ye bataata hai ki ye component sirf client side pe run karega

// React ke important hooks aur tools import kar rahe hain
import React, { createContext, useContext, useEffect, useState } from "react";

// 1️⃣ Ek naya context bana rahe hain jiska naam hai UserContext
const UserContext = createContext();

// 2️⃣ UserProvider component banaya jo context provider ka kaam karega
export const UserProvider = ({ children }) => {
  // 🔄 User info, loading status aur error message ke liye state
  const [userInfo, setUserInfo] = useState(null); // User ki profile info
  const [loading, setLoading] = useState(true);   // API call loading indicator
  const [error, setError] = useState(null);       // Error message agar kuch galat ho

  // 3️⃣ Component mount hote hi user ka profile fetch karna
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // LocalStorage se JWT token fetch karna

      // 🔐 Agar token nahi mila to user authenticated nahi hai
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        // ✅ API call to fetch user profile
        const res = await fetch("http://127.0.0.1:8000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Token header ke through bhejna
            "Content-Type": "application/json",
          },
        });

        const data = await res.json(); // Response ko JSON me convert karna

        // ❌ Agar response ok nahi hai to error throw karo
        if (!res.ok) throw new Error(data.detail || "Failed to fetch profile.");

        setUserInfo(data); // ✅ User info set karo
      } catch (err) {
        setError(err.message || "Something went wrong."); // Catch block for error
      } finally {
        setLoading(false); // Loading khatam ho gaya
      }
    };

    fetchProfile(); // Mount pe fetch call
  }, []);

  // 4️⃣ Saare context values provide kar rahe hain
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading, error }}>
      {children} {/* ✅ Children components ko wrap kiya hua hai */}
    </UserContext.Provider>
  );
};

// 5️⃣ Custom hook jisse kisi bhi component me user context ko access kiya ja sakta hai
export const useUserContext = () => useContext(UserContext);
