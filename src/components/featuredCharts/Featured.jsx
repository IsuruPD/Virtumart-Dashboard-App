import React, { useEffect, useState } from 'react'
import "./featured.scss";
import "react-circular-progressbar/dist/styles.css";
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import profileImg from '../../assets/logoimg.png';

const Featured = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(firestore, 'employees', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.error('User document not found');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">User Account</h1>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <img className="profileImage" src={userData?.profileImageUrl || `${profileImg}`} alt="User Profile" />
        </div>
        <p className="subTitle">{userData?.fullName || 'N/A'}</p>
        <p className="empId">ID: {userData?.id || 'N/A'}</p>
        <p className="role">({userData?.role || 'N/A'})</p>
        <p className="desc">
        </p>
      </div>
    </div>
  );
};

export default Featured;