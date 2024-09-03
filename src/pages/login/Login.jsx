import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, FormHelperText } from '@mui/material';
import './login.scss';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

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
      // Handle login
    }
  };

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

          <Link className="forgotPassword">Forgot Password?</Link>

          <Button sx={{ borderRadius: '25px', color: '#42027f', fontWeight: '300'}} type="submit" variant="primary" className="button">
            Login
          </Button>
        </form>
      </Box>
      <Box className="imageContainer"></Box>
    </Box>
  );
};

export default Login;
