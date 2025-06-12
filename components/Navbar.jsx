'use client';

import { FaBusAlt } from "react-icons/fa";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CgUser } from 'react-icons/cg';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../public/assets/Logo.png';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch profile.");
      setUserInfo(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    window.addEventListener("tokenSet", fetchProfile);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("tokenSet", fetchProfile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchProfile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
    setShowDropdown(false);
    router.replace('/login');
  };

  return (
    <nav>
      {/* Navbar ke liye bus icon aur brand name */}
      <Link href='/' className='navbar-logo'>
        <FaBusAlt size={30} color="black" /> {/* Bus icon */}
        <span className="brand-name">MyBus Service</span> {/* Brand Name */}
      </Link>

      <ul className='nav-links'>
        <Link href='/'><li>Home</li></Link>
        <Link href='/about'><li>About</li></Link>
        <Link href='/book-now'><li>Book Now</li></Link>
        <Link href='/booking'><li>Booking</li></Link>
        <Link href='/contact'><li>Contact Us</li></Link>
      </ul>

      {userInfo ? (
        <div className='user-dropdown' ref={dropdownRef}>
          <div className='user-info' onClick={() => setShowDropdown(!showDropdown)}>
            <CgUser size={22} /><span>{userInfo.name}</span>
          </div>
          {showDropdown && (
            <div className='dropdown-menu'>
              <Link href='/profile'><p>Profile</p></Link>
              <Link href='/update-password'><p>Update Password</p></Link>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
        </div>
      ) : (
        <Link href='/login'>
          <button className='login'><CgUser size={22} /><span>Login</span></button>
        </Link>
      )}

      <div className='navbar-smallscreen'>
        <RiMenu3Line fontSize={27} onClick={() => setToggleMenu(true)} />
        {toggleMenu && (
          <div className='navbar-smallscreen_overlay'>
            {/* Logo ko bus icon aur brand name se replace kiya */}
            <Link href='/' className='navbar-logo'>
              <FaBusAlt size={30} color="black" />
              <span className="brand-name">MyBus Service</span>
            </Link>
            <RiCloseLine className='close_icon' fontSize={27} onClick={() => setToggleMenu(false)} />
            <ul className='navbar-smallscreen_links'>
              <Link href='/'><li>Home</li></Link>
              <Link href='/about'><li>About</li></Link>
              <Link href='/book-now'><li>Book Now</li></Link>
              <Link href='/booking'><li>Booking</li></Link>
              <Link href='/contact'><li>Contact Us</li></Link>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
