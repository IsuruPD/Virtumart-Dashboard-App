import React, { useState, useEffect, useRef, Component } from 'react';
import { collection, doc, getDoc, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage, firestore } from '../../../firebase';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import SideBar from '../../../components/sideBar/SideBar';
import NavBar from '../../../components/navBar/NavBar';
import { useParams } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import UploadConfirmationDialog from '../../../components/dialogBoxes/uploadConfirmation/UploadConfirmation';
import './productManagement.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ProductManagement = () => {

  const reference = collection(firestore, "products");
  const productNameRef = useRef();
  const productIdRef = useRef();
  const categoryRef = useRef();
  const descriptionRef = useRef();
  const modelUrlRef = useRef();
  const sizeRef = useRef();
  const priceRef = useRef();
  const quantityRef = useRef();
  const offerPercentageRef = useRef();
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [selectedColors, setSelectedColors] = useState(""); // Initialize as empty string
  const [imagePreviews, setImagePreviews] = useState([]);

  const { isNew} = useParams();
  const { productId } = useParams(); 
  const [product, setEmployee] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUploads, setImageUploads] = useState([]);
  const [deals, setDeals] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [showOfferPercentage, setShowOfferPercentage] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef(null);
  
  let title = "";

  switch (isNew) {
    case "new":
      title = "Add New Product";
      break;
    case "edit":
      title = "Edit Product Details";
      break;
    default:
      title = "Product Management";
      break;
  }

  // If existing
  useEffect(() => {
    console.log(productId);
    const fetchProduct = async () => {
      try {
        const productDocRef = doc(firestore, 'products', productId);
        const productDocSnap = await getDoc(productDocRef);
  
        if (productDocSnap.exists()) {
          // If product exists, set the data
          setEmployee({ id: productDocSnap.id, ...productDocSnap.data() });
        } else {
          //console.error(`Employee with ID ${productId} not found`);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
  
    fetchProduct(); // Fetch product data on component mount
  }, [productId]); // Re-fetch product data if productId changes

  //If new 
  // Change the color on Color Picker Dialog
  const handleOnChange = (color) => {
    setCurrentColor(color.hex);
  };

  // Add the color to the array if duplicated do not exist
  const handleAddColor = () => {
      if (!selectedColors.includes(currentColor)) {
          setSelectedColors(selectedColors === "" ? currentColor : `${selectedColors}, ${currentColor}`);
      }
  };
  
  // Clear the selected colors list
  const clearAddedList = () => {
      setSelectedColors(""); 
  };

  // Set Image Carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px'
  };

  // Function to handle file input change
  const handleFileChange = (e) => {

    const files = Array.from(e.target.files);
    setImageUploads(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  //Check for duplicate entries
  const checkForDuplicate = async (productId, productName) => {
    const querySnapshot = await getDocs(query(reference, where("productId", "==", productId)));
    if (!querySnapshot.empty) {
      return true; // Duplicate productId found
    }

    const querySnapshot2 = await getDocs(query(reference, where("productName", "==", productName)));
    if (!querySnapshot2.empty) {
      return true; // Duplicate productName found
    }

    return false; 
  };

  // Confirm Submission to submit the product details
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productName = productNameRef.current.value;
    const productId = productIdRef.current.value;

    // Check for duplicates
    const isDuplicate = await checkForDuplicate(productId, productName);
    if (isDuplicate) {
      alert("Duplicate product with the same Product ID or Product Name found.");
      return;
    }

    // Open confirmation dialog
    setIsDialogOpen(true);
  };

  // Submit data to the Firestore
  const handleConfirmSubmit = async () => {
    setIsDialogOpen(false);

    const imageURLs = [];
    for (const imageUpload of imageUploads) {
      const imageRef = ref(storage, `products/images/${imageUpload.name}`);
      
      try {
        const snapshot = await uploadBytes(imageRef, imageUpload);
        const imageURL = await getDownloadURL(snapshot.ref);
        console.log("Image uploaded successfully. URL:", imageURL);
        imageURLs.push(imageURL);
      } catch (error) {
        console.error("Error uploading image: ", error);
        return;
      }
    }

    const productData = {
      productName: productNameRef.current.value,
      productId: productIdRef.current.value,
      category: categoryRef.current.value,
      description: descriptionRef.current.value,
      size: sizeRef.current.value.split(",").map(size => size.trim()),
      colors: selectedColors.split(", ").map(color => color.trim()),
      imageURLs: imageURLs,
      price: parseFloat(priceRef.current.value),
      offerPercentage: parseFloat(offerPercentageRef.current.value),
      modelUrl: modelUrlRef.current.value,
      quantity: parseFloat(quantityRef.current.value),
      deals: deals,
      featured: featured,
      freeShipping: freeShipping
    };

    try {
      await addDoc(reference, productData);
      console.log("Product added successfully");

      // Display success message
    alert("Product added successfully!");

    // Clear form fields
    productNameRef.current.value = "";
    productIdRef.current.value = "";
    categoryRef.current.value = "";
    descriptionRef.current.value = "";
    sizeRef.current.value = "";
    priceRef.current.value = "";
    offerPercentageRef.current.value = "";
    modelUrlRef.current.value = "";
    quantityRef.current.value = "";
    setCurrentColor("#ffffff");
    setSelectedColors("");
    setFile(null);
    setImageUploads([]);
    setDeals(false);
    setFeatured(false);
    setFreeShipping(false);
    setImageUploads([]);
    setImagePreviews([]);

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    } catch (error) {
      alert("Error adding product: ", error);
    }
  };
  /////////////////////
  const handleUpdate = async (e) => {
  };
  
  ////////////////////

  useEffect(() => {
    if (deals) {
      setShowOfferPercentage(true);
      //offerPercentageRef.current.value = 0;
    } else {
      setShowOfferPercentage(false);
    }
  }, [deals]);

  return (
    <div className="productManagement">
      <SideBar />
      <div className="productManagementContainer">
        <NavBar />
        <div className="productManagementTitle">Product Management</div>
        <div className="newProductItem">
          <div className="newContainer">
            <div className="top">
              <h1>{title}</h1>
            </div>
            {product && (
                <div></div>
            )}

            {!product && (  
                <div className="bottom">
                  <div className="left">
                    {imagePreviews.length > 1 ? (
                      <Slider {...settings} className="imgSlider">
                        {imagePreviews.map((preview, index) => (
                          <div key={index}>
                            <img src={preview} alt={`Preview ${index}`} />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div>
                        <img
                          src={
                            imagePreviews.length === 1
                              ? imagePreviews[0]
                              : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
                          }
                          alt="Preview"
                          className="singleImage"
                        />
                      </div>
                    )}
                  </div>
                  <div className="right">       
                    <form onSubmit={handleSubmit}>
                      <div className="formInput">
                          <label>Product Name :</label>
                          <input 
                              type="text" 
                              id="productName" 
                              ref={productNameRef} 
                              required 
                          />                    
                      </div>
                      <div className="formInput">
                          <label>Product ID :</label>
                          <input 
                              type="text" 
                              id="productId" 
                              ref={productIdRef} 
                              required 
                          />                    
                      </div>
                      <div className="formInput">
                          <label>Category :</label>
                          <input 
                              type="text" 
                              id="category" 
                              ref={categoryRef} 
                              required 
                          />                    
                      </div>
                      <div className="formInput">
                          <label>Price :</label>
                          <input 
                              type="text" 
                              id="price" 
                              ref={priceRef} 
                              required 
                          />                    
                      </div>
                      <div className="formInput">
                          <label>AR Model :</label>
                          <input 
                              type="text" 
                              id="modelUrl" 
                              ref={modelUrlRef}  
                              placeholder="Enter the model URL" 
                              required                                   
                          />
                      </div>
                      <div className="formInput">
                          <label>Model :</label>
                          <input 
                              type="text" 
                              id="size" 
                              ref={sizeRef} 
                              placeholder="Enter the model" 
                          />                    
                      </div>
                      <div className="formInput">
                          <label>Select Available Colors :</label>
                          <SketchPicker
                              color={currentColor}
                              onChangeComplete={handleOnChange}
                          /> 
                          <div>
                            <br></br>
                            <label>Added color codes :</label>
                            <p id="selectedColors">{selectedColors}</p>
                          </div>
                          <div className="formInput">
                            <button type="button" onClick={handleAddColor}>Add Color</button>
                            
                            <button type="button" onClick={clearAddedList}>Clear</button>
                          </div>                   
                      </div>
                      <div className="formInput">
                          <label>Description :</label>
                          <textarea 
                              id="description" 
                              className='descriptionTextArea'
                              ref={descriptionRef} 
                              required 
                          />
                      </div>
                      <div className="formInput checkboxGroup">  
                          <label>
                            <input
                              type="checkbox"
                              checked={featured}
                              onChange={(e) => setFeatured(e.target.checked)}
                            />Featured
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={freeShipping}
                              onChange={(e) => setFreeShipping(e.target.checked)}
                            />Free Shipping
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={deals}
                              onChange={(e) => setDeals(e.target.checked)}
                            />Deals
                          </label>
                      </div>
                      <div className="formInput">
                          <label>Total Quantity :</label>
                          <input 
                              type='number'
                              id="quantity" 
                              ref={quantityRef} 
                              required 
                          />
                      </div>
                      {showOfferPercentage && (
                        <div className="formInput">
                          <label>Offer Fraction :</label>
                          <input type="number" id="offerPercentage" ref={offerPercentageRef} step="0.01" min="0" required />
                        </div>
                      )}
                      <div className="formInput">
                          <label htmlFor="file">
                          Product Images :
                          <DriveFolderUploadOutlinedIcon className="icon" />
                          </label>
                          <input type="file" id="file" onChange={handleFileChange} style={{ display: 'none' }} ref={fileInputRef} multiple required />
                      </div>
                      <div className="formInput"></div>
                        <button type="submit">Create</button>
                    </form>
                  </div>
                </div>
                )}
          </div>
        </div>
      </div>
      {/* Confirmation Dialog */}
      <UploadConfirmationDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}

export default ProductManagement;