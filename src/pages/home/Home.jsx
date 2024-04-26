import React from 'react';
import "./home.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Card from '../../components/widgets/Card';
import Featured from '../../components/featuredCharts/Featured';
import Chart from '../../components/generalCharts/Chart';
import Table from '../../components/tables/Table';

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
            <div className="charts">
              <Chart/>
              <Featured/>
            </div>
            <div className="listContainer">
              <div className="listTitle">Latest Transactions</div>
                <Table/>
            </div>
        </div>
    </div>
  )
}

export default Home