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

  const { userInfo, loading, error, setUserInfo } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
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
        <li><Link href='/'><span>Home</span></Link></li>
        <li><Link href='/about'><span>About</span></Link></li>
        <li><Link href='/book-now'><span>Book Now</span></Link></li>
        <li><Link href='/booking'><span>Booking</span></Link></li>
        <li><Link href='/contact'><span>Contact Us</span></Link></li>
      </ul>

      {userInfo ? (
        <div className='user-dropdown-wrapper' ref={dropdownRef}>
          <div className='user-dropdown-toggle' onClick={() => setShowDropdown(!showDropdown)}>
            <CgUser size={22} /><span>{userInfo.name}</span>
          </div>
          {showDropdown && (
            <div className='user-dropdown-menu'>
              <Link href='/profile'><span>Profile</span></Link>
              <Link href='/update-password'><span>Update Password</span></Link>
              <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
            </div>
          )}
        </div>
      )
        : (
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
              <li><Link href='/'><span>Home</span></Link></li>
              <li><Link href='/about'><span>About</span></Link></li>
              <li><Link href='/book-now'><span>Book Now</span></Link></li>
              <li><Link href='/booking'><span>Booking</span></Link></li>
              <li><Link href='/contact'><span>Contact Us</span></Link></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
