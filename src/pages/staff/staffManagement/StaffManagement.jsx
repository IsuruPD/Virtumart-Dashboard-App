import React, { useState, useEffect } from 'react';
import './staffManagement.scss';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage, firestore } from '../../../firebase';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import SideBar from '../../../components/sideBar/SideBar';
import NavBar from '../../../components/navBar/NavBar';
import { useParams } from 'react-router-dom';


const StaffManagement = () => {
  const { isNew} = useParams();
  const { employeeId } = useParams(); 
  const [employee, setEmployee] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [imageUploads, setImageUploads] = useState([]);
  
  let title = "";

  switch (isNew) {
    case "new":
      title = "Add New Employee";
      break;
    case "edit":
      title = "Edit Employee Details";
      break;
    default:
      title = "Staff Management";
      break;
  }

  // If existing
  useEffect(() => {
    console.log(employeeId);
    const fetchEmployee = async () => {
      try {
        const employeeDocRef = doc(firestore, 'employees', employeeId);
        const employeeDocSnap = await getDoc(employeeDocRef);
  
        if (employeeDocSnap.exists()) {
          // If employee exists, set the data
          setEmployee({ id: employeeDocSnap.id, ...employeeDocSnap.data() });
        } else {
          //console.error(`Employee with ID ${employeeId} not found`);
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };
  
    fetchEmployee(); // Fetch employee data on component mount
  }, [employeeId]); // Re-fetch employee data if employeeId changes

  //If new
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleCustomRoleChange = (e) => {
    setCustomRole(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const files = e.target.files;
    setImageUploads(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const fullName = e.target.elements.fullName.value;
    const employeeId = e.target.elements.employeeId.value;
    const nic = e.target.elements.nic.value;
    const gender = e.target.elements.gender.value;
    const dob = e.target.elements.dob.value;
    const phoneNumber = e.target.elements.phoneNumber.value;
    const address = e.target.elements.address.value;
    const username = e.target.elements.username.value;

    try {
      // Create user account
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Upload profile image to Firebase Storage
      const imageURLs = [];
      for (const imageUpload of imageUploads) {
        const imageRef = ref(storage, `employeeProfileImages/${user.uid}/${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        const imageURL = await getDownloadURL(snapshot.ref);
        imageURLs.push(imageURL);
      }


      // Add user data to Firestore
      const employeesRef = collection(firestore, 'employees');
      await addDoc(employeesRef, {
        fullName,
        employeeId,
        nic,
        gender,
        dob,
        email,
        phoneNumber,
        address,
        username,
        role: selectedRole === 'custom' ? customRole : selectedRole,
        profileImageURL: imageURLs.length > 0 ? imageURLs[0] : '',
      });

      console.log('Employee added successfully');
    } catch (error) {
      console.error('Error registering employee:', error.message);
    }
  };
  /////////////////////
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const updatedEmployee = {};
  
    // Retrieve form field values
    const fullName = e.target.elements.fullName.value;
    const nic = e.target.elements.nic.value;
    const gender = e.target.elements.gender.value;
    const dob = e.target.elements.dob.value;
    const email = e.target.elements.email.value;
    const phoneNumber = e.target.elements.phoneNumber.value;
    const address = e.target.elements.address.value;
    const username = e.target.elements.username.value;
    const role = selectedRole === 'custom' ? customRole : selectedRole;
    //const profileImageFile = e.target.elements.profileImage.files[0];
    const imageURLs = [];
  
    // Check if fields are changed and not empty, then update in updatedEmployee
    if (fullName !== employee.fullName && fullName.trim() !== '') {
      updatedEmployee.fullName = fullName;
    }
    if (nic !== employee.nic && nic.trim() !== '') {
      updatedEmployee.nic = nic;
    }
    if (gender !== employee.gender && gender.trim() !== '') {
      updatedEmployee.gender = gender;
    }
    if (dob !== employee.dob && dob.trim() !== '') {
      updatedEmployee.dob = dob;
    }
    if (email !== employee.email && email.trim() !== '') {
      updatedEmployee.email = email;
    }
    if (phoneNumber !== employee.phoneNumber && phoneNumber.trim() !== '') {
      updatedEmployee.phoneNumber = phoneNumber;
    }
    if (address !== employee.address && address.trim() !== '') {
      updatedEmployee.address = address;
    }
    if (username !== employee.username && username.trim() !== '') {
      updatedEmployee.username = username;
    }
    if (role !== employee.role && role.trim() !== '') {
      updatedEmployee.role = role;
    }
  
    try {
      const employeeDocRef = doc(firestore, 'employees', employeeId);
      const employeeDocSnap = await getDoc(employeeDocRef);
  
      if (employeeDocSnap.exists()) {

        for (const imageUpload of imageUploads) {
            const imageRef = ref(storage, `employeeProfileImages/${employeeId}/${imageUpload.name}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const imageURL = await getDownloadURL(snapshot.ref);
            imageURLs.push(imageURL);
            updatedEmployee.profileImageURL = imageURL;
        }

        // Update the existing employee document with the updatedEmployee object
        await updateDoc(employeeDocRef, updatedEmployee);
        console.log('Record updated successfully');
        alert("Record updated successfully!")
      } else {
        console.error(`Employee with ID ${employeeId} not found`);
        alert("Employee with ID ${employeeId} not found!")
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee:', error);
    }
  };
  
  ////////////////////

  return (
    <div className="staffManagement">
      <SideBar />
      <div className="staffManagementContainer">
        <NavBar />
        <div className="staffManagementTitle">Staff Management</div>
        <div className="newItem">
          <div className="newContainer">
            <div className="top">
              <h1>{title}</h1>
            </div>
            {employee && (
                <div className="bottom">
                <div className="left">
                    <img src={file ? URL.createObjectURL(file) : `${employee.profileImageURL}`} alt="" />
                </div>
                <div className="right">
                        
                        <form onSubmit={handleUpdate}>
                        <div className="formInput">
                            <label>Full Name:</label>
                            <input type="text" name="fullName" placeholder="Enter full name" defaultValue={employee.fullName} required />
                        </div>
                        <div className="formInput">
                            <label>Employee ID:</label>
                            <input type="text" name="employeeId" placeholder="Enter ID" defaultValue={employee.employeeId} required />
                        </div>
                        <div className="formInput">
                            <label>NIC:</label>
                            <input type="text" name="nic" placeholder="Enter NIC" defaultValue={employee.nic} required />
                        </div>
                        <div className="formInput">
                            <label>Gender:</label>
                            <select name="gender" onChange={handleRoleChange} defaultValue={employee.gender} required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="formInput">
                            <label>Date of Birth:</label>
                            <input type="date" name="dob" defaultValue={employee.dob} required />
                        </div>
                        <div className="formInput">
                            <label>Email:</label>
                            <input type="email" name="email" placeholder="Enter email"  defaultValue={employee.email} required />
                        </div>
                        <div className="formInput">
                            <label>Contact Number:</label>
                            <input type="text" name="phoneNumber" placeholder="Enter phone number" pattern="[0-9]{10}" maxLength="10"  defaultValue={employee.phoneNumber} required />
                        </div>
                        <div className="formInput">
                            <label>Address:</label>
                            <input type="text" name="address" placeholder="Enter address"  defaultValue={employee.address}  required />
                        </div>
                        <div className="formInput">
                            <label>Username:</label>
                            <input type="text" name="username" placeholder="Enter username"  defaultValue={employee.username}  required />
                        </div>
                        <div className="formInput">
                            <label>Password:</label>
                            <input type="password" name="password" placeholder="Enter password" />
                        </div>
                        <div className="formInput">
                            <label>Role:</label>
                            <select name="role"  defaultValue={employee.role}  onChange={handleRoleChange} required>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="inventory manager">Inventory Manager</option>
                            <option value="customer support">Customer Support</option>
                            <option value="accountant">Accountant</option>
                            <option value="custom">Custom Role</option>
                            </select>
                            {selectedRole === 'custom' && (
                            <input type="text" name="customRole" placeholder="Enter custom role" onChange={handleCustomRoleChange} required />
                            )}
                        </div>
                        <div className="formInput">
                            <label htmlFor="file">
                            Profile Image:
                            <DriveFolderUploadOutlinedIcon className="icon" />
                            </label>
                            <input type="file" id="file" onChange={handleFileChange} style={{ display: 'none' }} />
                        </div>
                        <button type="submit">Update</button>
                        </form>
                    
                </div>
                </div>
            )}

            {!employee && (  
                <div className="bottom">
                <div className="left">
                    <img src={file ? URL.createObjectURL(file) : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}  alt="" />
                </div>
                <div className="right">
                           
                    <form onSubmit={handleSubmit}>
                    <div className="formInput">
                        <label>Full Name:</label>
                        <input type="text" name="fullName" placeholder="Enter full name" required />
                    </div>
                    <div className="formInput">
                        <label>Employee ID:</label>
                        <input type="text" name="employeeId" placeholder="Enter ID" required />
                    </div>
                    <div className="formInput">
                        <label>NIC:</label>
                        <input type="text" name="nic" placeholder="Enter NIC" required />
                    </div>
                    <div className="formInput">
                        <label>Gender:</label>
                        <select name="gender" onChange={handleRoleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="formInput">
                        <label>Date of Birth:</label>
                        <input type="date" name="dob" required />
                    </div>
                    <div className="formInput">
                        <label>Email:</label>
                        <input type="email" name="email" placeholder="Enter email" required />
                    </div>
                    <div className="formInput">
                        <label>Contact Number:</label>
                        <input type="text" name="phoneNumber" placeholder="Enter phone number" pattern="[0-9]{10}" maxLength="10" required />
                    </div>
                    <div className="formInput">
                        <label>Address:</label>
                        <input type="text" name="address" placeholder="Enter address" required />
                    </div>
                    <div className="formInput">
                        <label>Username:</label>
                        <input type="text" name="username" placeholder="Enter username" required />
                    </div>
                    <div className="formInput">
                        <label>Change Password:</label>
                        <input type="password" name="password" placeholder="Enter password" required />
                    </div>
                    <div className="formInput">
                        <label>Role:</label>
                        <select name="role" value={selectedRole} onChange={handleRoleChange} required>
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="inventory manager">Inventory Manager</option>
                        <option value="customer support">Customer Support</option>
                        <option value="accountant">Accountant</option>
                        <option value="custom">Custom Role</option>
                        </select>
                        {selectedRole === 'custom' && (
                        <input type="text" name="customRole" placeholder="Enter custom role" onChange={handleCustomRoleChange} required />
                        )}
                    </div>
                    <div className="formInput">
                        <label htmlFor="file">
                        Profile Image:
                        <DriveFolderUploadOutlinedIcon className="icon" />
                        </label>
                        <input type="file" id="file" onChange={handleFileChange} style={{ display: 'none' }} required />
                    </div>
                    <button type="submit">Register</button>
                    </form>
                </div>
                </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
