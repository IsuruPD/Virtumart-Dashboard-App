import React from 'react';
import "./home.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Card from '../../components/widgets/Card';
import UserAccountDetails from '../../components/loggedInUser/UserAccountDetails';
import Chart from '../../components/generalCharts/Chart';
import Table from '../../components/tables/Table';

const Home = () => {
  return (
    <div className="home">
        <SideBar/>

        <div className="homeContainer">
          <NavBar/>
            <div className="widgets" >
                <Card type="users" amount={24}/>
                <Card type="orders" amount={23}/>
                <Card type="analytics" amount={0}/>
                <Card type="employees" amount={18}/>
            </div>
            <div className="charts">
              <Chart/>
              <UserAccountDetails/>
            </div>
            {/* <div className="listContainer">
              <div className="listTitle">Latest Transactions</div>
                <Table/>
            </div> */}
        </div>
    </div>
  )
}

export default Home