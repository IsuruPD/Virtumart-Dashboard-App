import React from 'react';
import "./home.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Card from '../../components/widgets/Card';

const Home = () => {
  return (
    <div className="home">
        <SideBar/>

        <div className="homeContainer">
          <NavBar/>
            <div className="widgets">
                <Card type="users"/>
                <Card type="orders"/>
                <Card type="analytics"/>
                <Card type="employees"/>
            </div>
        </div>
    </div>
  )
}

export default Home