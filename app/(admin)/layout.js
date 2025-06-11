'use client';

import './globals.css';
import Link from 'next/link';
import { AdminProvider } from '../../context/AdminContext'; // ✅ Import AdminProvider
import { useAdminContext } from '../../context/AdminContext'; // ✅ Updated
import { CgUser } from 'react-icons/cg';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  // Now you can safely use AdminContext inside the AdminProvider
  return (
    <AdminProvider>
      <AdminLayout>{children}</AdminLayout> {/* Wrap everything in AdminProvider */}
    </AdminProvider>
  );
}

function AdminLayout({ children }) {
  const { userInfo, setUserInfo, loading } = useAdminContext(); // ✅ Admin context used
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
    setShowDropdown(false);
    router.replace('/admin');
  };

  const handleLogin = () => {
    // Assuming login logic is handled here and if login is successful:
    // Redirect user to /admin page
    router.push('/admin');  // Redirect to admin page
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

          {/* Right Area */}
          <div className="main-area">
            {/* Header */}
            <header className="header">
              <h1>Welcome to Admin Panel</h1>
              <div className="header-user">
                {userInfo ? (
                  <div className="user-dropdown" ref={dropdownRef}>
                    <div
                      className="user-info"
                      onClick={() => setShowDropdown((prev) => !prev)} // Toggling dropdown visibility
                    >
                      <CgUser size={22} />
                      <span>{userInfo.name || userInfo.email}</span>
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
                ) : (
                  // Show Login button if user is not logged in
                  <button onClick={handleLogin} className="login-btn">Login</button>
                )}
              </div>
            </header>

            {/* Main */}
            <main className="main-content">
              {children}
            </main>

            {/* Footer */}
            <footer className="footer">
              <p>&copy; 2025 Hemraj Admin Panel. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
