import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, FormHelperText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import './login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is already logged in
        setOpenDialog(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    let tempErrors = {};
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Email is not valid';
    if (!password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in successfully
          const user = userCredential.user;
          console.log('Logged in as:', user.email);
          navigate('/dashboard'); 
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Login error:', errorCode, errorMessage);
          setErrors({ ...errors, password: 'Invalid credentials' });
        });
    }
  };

  ////////////////
  // Logout functions
  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful, navigate to the login page
      navigate('/');
      setOpenDialog(false);
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  };

  const handleCancel = () => {
    setOpenDialog(false);
    navigate('/dashboard');  // Navigate back to the dashboard
  };

  ////////////////

  ////////////////
  // Forgot Password functionality
  const handleForgotPassword = () => {
    setOpenResetDialog(true);
  };

  const handleResetPassword = () => {
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address.');
      return;
    }
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setResetSuccess('Password reset email sent! Please check your inbox.');
        setResetError('');
      })
      .catch((error) => {
        console.error('Password reset error:', error);
        setResetError('Failed to send password reset email.');
        setResetSuccess('');
      });
  };

  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess('');
  };

  ////////////////

  ////////////////
  useEffect(() => {
    const circleElement1 = document.querySelector('.circlea');
    const circleElement2 = document.querySelector('.circleb');

    if (!circleElement1 || !circleElement2) return; // Make sure the element exists

    const mouse = { x: 0, y: 0 }, circlea = { x: 0, y: 0 }, circleb = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    const speeda = 0.05;
    const speedb = 0.1;
    const tick = () => {
      // Update circlea position
      circlea.x += (mouse.x - circlea.x) * speeda;
      circlea.y += (mouse.y - circlea.y) * speeda;
      circleElement1.style.transform = `translate(${circlea.x+20}px, ${circlea.y+20}px)`;

      // Update circleb position
      circleb.x += (mouse.x - circleb.x) * speedb;
      circleb.y += (mouse.y - circleb.y) * speedb;
      circleElement2.style.transform = `translate(${circleb.x+20}px, ${circleb.y+20}px)`;

      window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    tick();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  ////////////////

  return (
    <Box className="loginContent">
      <div class="circlea"></div>
      <div class="circleb"></div>

      <Box className="formContainer">
        <Box className="logoContainer"></Box>
        <Typography variant="h4" className='title' sx={{marginBottom: 2}}>Login here,</Typography>
        <form className="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            className="inputTexts"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'transparent' } } }}
          />
          {errors.email && (
            <FormHelperText sx={{margin: 0, padding: 0}} error>{errors.email}</FormHelperText>
          )}

          <div className="lineBreak"></div>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            className="inputTexts"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'transparent' } } }}
          />
          {errors.password && (
            <FormHelperText sx={{margin: 0, padding: 0}} error>{errors.password}</FormHelperText>
          )}

          <Link className="forgotPassword" onClick={handleForgotPassword}>Forgot Password?</Link>

          <Button sx={{ borderRadius: '25px', color: '#42027f', fontWeight: '300'}} type="submit" variant="primary" className="button">
            Login
          </Button>
        </form>
      </Box>
      <Box className="imageContainer"></Box>

      {/* Log out confirmation dialog box */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>{"Already Logged In"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are already logged in. Do you want to log out and log in with a different account, or go back to the dashboard?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">Cancel</Button>
          <Button onClick={handleLogout} color="primary">Log Out</Button>
        </DialogActions>
      </Dialog>

      {/* Forgot password dialog box */}
      <Dialog open={openResetDialog} onClose={handleCloseResetDialog}>
        <DialogTitle>{"Reset Password"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email address. You will receive a link to create a new password via email.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            error={!!resetError}
            helperText={resetError}
          />
          {resetSuccess && (
            <Typography sx={{ color: 'green', marginTop: 1 }}>{resetSuccess}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog} color="primary">Cancel</Button>
          <Button onClick={handleResetPassword} color="primary">Send Reset Link</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
