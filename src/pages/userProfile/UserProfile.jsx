import React, { useEffect, useState } from 'react';
import './userProfile.scss';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import profileImg from '../../assets/logoimg.png';
import { onAuthStateChanged } from 'firebase/auth';
import { CircularProgress, Backdrop, Button } from "@mui/material";
import SideBar from '../../components/sideBar/SideBar';

const UserAccountDetails = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setLoading(true);
          const userEmail = user.email;
          const q = query(collection(firestore, 'employees'), where('email', '==', userEmail));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            setUserData(userDoc);
          } else {
            console.error('User document not found for email:', userEmail);
          }
        } else {
          console.error('No user is logged in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="userProfile">
      <SideBar />
      <div className="userProfileContainer">

        <div className="userProfileTitle">
            <div>User Profile</div>
        </div>

        <div className="profileCard">
          <div className="profileContent">
            <div className="profileImageContainer">
              <img
                className="profileImage"
                src={userData?.profileImageURL || profileImg}
                alt="User Profile"
              />
            </div>
            <div className="profileDetails">
              <p className="fullName">{userData?.fullName || 'N/A'}</p>
              <p className="role">Role: {userData?.role || 'N/A'}</p>
              <p className="empId">Employee ID: {userData?.employeeId || 'N/A'}</p>
              <p className="dob">Date of Birth: {userData?.dob || 'N/A'}</p>
              <p className="address">Address: {userData?.address || 'N/A'}</p>
              <p className="gender">Gender: {userData?.gender || 'N/A'}</p>
              <p className="phoneNumber">Phone: {userData?.phoneNumber || 'N/A'}</p>
              <p className="username">Username: {userData?.username || 'N/A'}</p>
            </div>
          </div>
        </div>
        {/* Loading State */}
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </div>
  );
};

export default UserAccountDetails;
