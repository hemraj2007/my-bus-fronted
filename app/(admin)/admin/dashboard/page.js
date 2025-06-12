'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [travelCount, setTravelCount] = useState(0);  // State for travels
  const [bookingCount, setBookingCount] = useState(0);  // State for bookings
  const [userCount, setUserCount] = useState(0);  // State for bookings


  useEffect(() => {
    // Fetch all travels
    fetch(`http://localhost:8000/travels/all`)
      .then(res => res.json())
      .then(data => setTravelCount(data.length));

    // Fetch all bookings
    fetch(`http://localhost:8000/booking/bookings`)
      .then(res => res.json())
      .then(data => setBookingCount(data.length));

    fetch(`http://localhost:8000/users/users`)
      .then(res => res.json())
      .then(data => setUserCount(data.length));

  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* Travel Card */}
        <DashboardCard title="Total Travels" count={travelCount} color="#FF5722" />
        
        {/* Booking Card */}
        <DashboardCard title="Total Bookings" count={bookingCount} color="#9C27B0" />

         {/* Booking Card */}
         <DashboardCard title="Total Users" count={userCount} color="#9C27B0" />
      </div>
    </div>
  );
}

function DashboardCard({ title, count, color }) {
  return (
    <div style={{
      flex: 1,
      padding: '1.5rem',
      backgroundColor: color,
      color: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      textAlign: 'center'
      
      
    }}>
      <h3>{title}</h3>
      <h1>{count}</h1>
    </div>
  );
}
