import React, { useState, useEffect } from 'react';
import './mousePointer.scss';

const Login = () => {
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
    <>
      <div class="circlea"></div>
      <div class="circleb"></div>
    </>
  );
};

export default Login;
