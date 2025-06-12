'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    setLoading(false);
    return;
  }

  // Agar token hai toh profile fetch karo
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setUserInfo(null);
        throw new Error("Unauthorized");
      }

      const data = await res.json();
      
      if (data.role && data.role.toLowerCase() === "admin") {
        setUserInfo(data);
      } else {
        localStorage.removeItem("token");
        setUserInfo(null);
        throw new Error("Access denied: Not an admin");
      }
    } catch (error) {
      console.error("AdminContext error:", error.message || error);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);

  return (
    <AdminContext.Provider value={{ userInfo, setUserInfo, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
