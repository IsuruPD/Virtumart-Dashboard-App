import React, { useEffect, useState } from 'react';
import './featured.scss';
import 'react-circular-progressbar/dist/styles.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import profileImg from '../../assets/logoimg.png';
import { onAuthStateChanged } from 'firebase/auth';

const Featured = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Log the user email to verify it's correct
          const userEmail = user.email;
          console.log('Current user email:', userEmail);

          // Query the "employees" collection where the email matches the logged-in user's email
          const q = query(collection(firestore, 'employees'), where('email', '==', userEmail));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Assuming there is only one document matching the user's email
            const userDoc = querySnapshot.docs[0].data();
            console.log('User data:', userDoc); // Log fetched data
            setUserData(userDoc);
          } else {
            console.error('User document not found for email:', userEmail);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.error('No user is logged in');
      }
      setLoading(false); // Stop loading after the process is complete
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  // Show a loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">User Account</h1>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          {/* Show profile image, fallback to default image if none is available */}
          <img
            className="profileImage"
            src={userData?.profileImageUrl || profileImg}
            alt="User Profile"
          />
        </div>
        {/* Show user's full name, employee ID, and role, fallback to 'N/A' if data is missing */}
        <p className="subTitle">{userData?.fullName || 'N/A'}</p>
        <p className="empId">ID: {userData?.employeeID || 'N/A'}</p>
        <p className="role">({userData?.role || 'N/A'})</p>
      </div>
    </div>
  );
};

export default Featured;
