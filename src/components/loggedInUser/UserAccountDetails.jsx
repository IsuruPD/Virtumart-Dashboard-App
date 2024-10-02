import React, { useEffect, useState } from 'react';
import './userAccountDetails.scss';
import 'react-circular-progressbar/dist/styles.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import profileImg from '../../assets/logoimg.png';
import { onAuthStateChanged } from 'firebase/auth';

const UserAccountDetails = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Log the user email to verify it's correct
          const userEmail = user.email;
          console.log('Current user email:', userEmail);

          const q = query(collection(firestore, 'employees'), where('email', '==', userEmail));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            console.log('User data:', userDoc);
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
          <img
            className="profileImage"
            src={userData?.profileImageURL || profileImg}
            alt="User Profile"
          />
        </div>
        <p className="subTitle">{userData?.fullName || 'N/A'}</p>
        <p className="empId">ID: {userData?.employeeId || 'N/A'}</p>
        <p className="role">({userData?.role || 'N/A'})</p>
      </div>
    </div>
  );
};

export default UserAccountDetails;
