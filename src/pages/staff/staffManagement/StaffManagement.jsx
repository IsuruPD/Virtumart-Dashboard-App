import React from 'react';
import './staffManagement.scss';
import SideBar from '../../../components/sideBar/SideBar';
import NavBar from '../../../components/navBar/NavBar';
import Datatable from '../../../components/dataTable/DataTable';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { useParams } from 'react-router-dom';

const StaffManagement = () => {
    const { isNew } = useParams();
    const [file, setFile] = useState("");
    let title="";

    switch(isNew){
        case "new":
            title="Add New Employee"
            break;
        case "edit":
            title="Edit Employee Details"
            break;
        default:
            title="Add New Employee"
            break;
    }

    return (
        <div className="staffManagement">
          <SideBar />
    
          <div className="staffManagementContainer">
            <NavBar />
            <div className="staffManagementTitle">
              Staff Management
            </div>

            <div className="newItem">
            <div className="newContainer">
                <div className="top">
                    <h1>{title}</h1>
                </div>

                <div className="bottom">
                    <div className="left">
                        <img
                        src={
                            file
                            ? URL.createObjectURL(file)
                            : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                        alt=""
                        />
                    </div>
                    <div className="right">
                        <form>
                        <div className="formInput">
                            <label>Full Name: </label>
                            <input type="text" placeholder="Enter full name" required/>
                        </div>
                        <div className="formInput">
                            <label>Employee ID: </label>
                            <input type="text" placeholder="Enter ID" required/>
                        </div>
                        <div className="formInput">
                            <label>Email</label>
                            <input type="email" placeholder="Enter email" required/>
                        </div>
                        <div className="formInput">
                            <label>NIC</label>
                            <input type="text" placeholder="Enter NIC" required/>
                        </div>
                        <div className="formInput">
                            <label>Contact Number</label>
                            <input type="number" placeholder="Enter email" required/>
                        </div>
                        <div className="formInput">
                            <label>Address</label>
                            <input type="text" placeholder="Enter address" required/>
                        </div>
                        <div className="formInput">
                            <label>Username</label>
                            <input type="text" placeholder="Enter username" required/>
                        </div>
                        <div className="formInput">
                            <label>Password</label>
                            <input type="password" placeholder="Enter password" required/>
                        </div>
                        <div className="formInput">
                            <label htmlFor="file">
                            Profile Image: <DriveFolderUploadOutlinedIcon className="icon" />
                            </label>
                            <input
                            type="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ display: "none" }}
                            required
                            />
                        </div>

                        <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            </div>
            </div>
          </div>
        </div>
      )
}

export default StaffManagement