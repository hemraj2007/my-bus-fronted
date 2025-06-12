'use client';

import { FaBusAlt } from "react-icons/fa";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { CgUser } from 'react-icons/cg';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();
  
  // Using context instead of local state
  const { userInfo, loading, error, setUserInfo } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null); // Clear user info in context
    setShowDropdown(false);
    router.replace('/login');
  };

  return (
    <nav>
      <Link href='/' className='navbar-logo'>
        <FaBusAlt size={30} color="black" />
        <span className="brand-name">MyBus Service</span>
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