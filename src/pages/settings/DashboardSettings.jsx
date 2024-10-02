import React, { useEffect, useState } from 'react';
import './dashboardSettings.scss';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import profileImg from '../../assets/logoimg.png';
import { onAuthStateChanged } from 'firebase/auth';
import { CircularProgress, Backdrop, Button } from "@mui/material";
import SideBar from '../../components/sideBar/SideBar';

const DashboardSettings = () => {
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
    <div className="dashboardSettings">
      <SideBar />
      <div className="settingsContainer">

        <div className="settingsTitle">
            <div>Settings</div>
        </div>

        <div className="settingsCard">
          <div className="settingsContent">
            Under Developement
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

export default DashboardSettings;
