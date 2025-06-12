'use client';

import './globals.css';
import Link from 'next/link';
import { AdminProvider } from '../../context/AdminContext';
import { useAdminContext } from '../../context/AdminContext';
import { CgUser } from 'react-icons/cg';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  return (
    <AdminProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminProvider>
  );
}

function AdminLayout({ children }) {
  const { userInfo, setUserInfo, loading } = useAdminContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin"; // 🔒 login page only

  // 🔐 Redirect to login if not logged in & not already on login page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isLoginPage) {
      router.replace("/admin");
    }
  }, [pathname]);

  // Sync user info with localStorage token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userInfo && !loading) {
      // If token exists but userInfo is null, fetch user profile
      fetch(`http://localhost:8000/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            localStorage.removeItem("token");
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data?.role?.toLowerCase() === "admin") {
            setUserInfo(data);
          }
        })
        .catch(console.error);
    }
  }, [userInfo, loading, setUserInfo]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
    router.replace("/admin");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <html lang="en">
      <body>
        {/* Show loading state while checking auth */}
        {loading && !isLoginPage ? (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            {/* Agar login page hai to plain children show karo (no sidebar/header/footer) */}
            {isLoginPage ? (
              <>{children}</>
            ) : (
              userInfo && (
                <div className="admin-dashboard">
                  {/* Sidebar */}
                  <div className="sidebar">
                    <div className="logo">Admin Panel</div>
                    <nav>
                      <ul>
                        <li><Link href="/admin/dashboard">Dashboard</Link></li>
                        <li><Link href="/admin/book-now">Travels</Link></li>
                        <li><Link href="/admin/booking">Booking</Link></li>
                      </ul>
                    </nav>
                  </div>

                  {/* Main Panel */}
                  <div className="main-area">
                    {/* Header */}
                    <header className="header">
                      <h1>Welcome to Admin Panel</h1>
                      <div className="header-user">
                        <div className="user-dropdown" ref={dropdownRef}>
                          <div
                            className="user-info"
                            onClick={() => setShowDropdown((prev) => !prev)}
                          >
                            <CgUser size={22} />
                            <span>{userInfo?.name || userInfo?.email}</span>
                          </div>
                          {showDropdown && (
                            <div className="dropdown-menu">
                              <Link href="/admin/profile">
                                <p>Update Profile</p>
                              </Link>
                              <Link href="/admin/update-password">
                                <p>Update Password</p>
                              </Link>
                              <p onClick={handleLogout}>Logout</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </header>

                    {/* Main Content */}
                    <main className="main-content">{children}</main>

                    {/* Footer */}
                    <footer className="footer">
                      <p>&copy; 2025 Hemraj Admin Panel. All rights reserved.</p>
                    </footer>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </body>
    </html>
  );
}