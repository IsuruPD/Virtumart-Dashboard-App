import React from 'react';
import "./staffDetails.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Datatable from '../../components/dataTable/DataTable';
import BadgeIcon from '@mui/icons-material/Badge';
import { Link } from 'react-router-dom';

const StaffDetails = () => {

  return (
    <div className="staffDetails">
      <SideBar />

      <div className="staffDetailsContainer">
        <NavBar />
        <div className="staffDetailsTitle">
          Staff Management
          <Link to="/staff/manage/new" className="link">
            Add New
          </Link>
        </div>

          <div className='singleStaff'>
            <div className="singleItemContainer">
                <div className="top">
                <div className="left">

                  <div className="editButton">
                    <Link to="/staff/manage/edit" className="link">
                      Edit
                    </Link>
                  </div>

                  <div className="cardHeader">
                    <div className="cardIcon">
                      <BadgeIcon/>
                    </div>
                    <h1 className="title">Employee Card</h1>
                  </div>

                  <div className="item">
                    <img
                      src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                      alt=""
                      className="itemImg"
                    />
                    <div className="details">
                      <h1 className="itemTitle">Admin <span className='id'>(1234567890)</span></h1>
                      <table>
                        <tr>
                          <td><div className="detailItem">
                                <span className="itemKey">Email:</span>
                                <span className="itemValue">admin@virtumart.com</span>
                              </div>
                          </td>
                          <td>
                              <div className="detailItem">
                                <span className="itemKey">NIC:</span>
                                <span className="itemValue">20001234567890</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="detailItem">
                              <span className="itemKey">Phone:</span>
                              <span className="itemValue">+1 2345 67 89</span>
                            </div>
                          </td>
                          <td>
                            <div className="detailItem">
                              <span className="itemKey">DOB:</span>
                              <span className="itemValue">
                                01/01/2024
                              </span>
                          </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="detailItem">
                                <span className="itemKey">Address:</span>
                                <span className="itemValue">
                                  221 B. Baker Street, London
                                </span>
                            </div>
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <div className="detailItem">
                              <span className="itemKey">Role:</span>
                              <span className="itemValue">Administrator</span>
                            </div>
                          </td>
                          <td>
                            
                          </td>
                        </tr>
                      </table>  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Datatable />
      </div>
    </div>
  )
}
export default StaffDetails;