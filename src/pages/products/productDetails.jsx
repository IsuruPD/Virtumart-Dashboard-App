import React from 'react'
import "./productDetails.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import { Link } from 'react-router-dom';

const productDetails = () => {
  return (
    <div className="productDetails">    

      <SideBar />

      <div className="productDetailsContainer">
        <NavBar />
        <div className="productDetailsTitle">
          Product Management
        </div>

        <div>
            <div className="optionsCards">
                <Link to="/products/manage/new/create">
                    <div className="card" id="addProduct"> 
                        <div className="cardContent">
                            <h3>Add New Product</h3>
                        </div>
                    </div>
                </Link>
                <Link to="/products/manage/">
                    <div className="card" id="viewProducts"> 
                            <div className="cardContent">
                                <h3>View Products</h3>
                            </div>
                    </div>
                </Link>
                <Link to="/products/manage/categories">
                    <div className="card" id="manageCategories">
                        <div className="cardContent">
                            <h3>Manage Categories</h3>
                        </div>     
                    </div>
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default productDetails