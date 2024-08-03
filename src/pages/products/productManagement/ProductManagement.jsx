import React, { useState, useEffect, useRef, Component } from 'react';
import { collection, doc, getDoc, addDoc, updateDoc, query, where, getDocs, setDoc, deleteDoc} from 'firebase/firestore'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage, firestore } from '../../../firebase';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import SideBar from '../../../components/sideBar/SideBar';
import NavBar from '../../../components/navBar/NavBar';
import { useParams } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import UploadConfirmationDialog from '../../../components/dialogBoxes/uploadConfirmation/UploadConfirmation';
import UpdateConfirmationDialog from '../../../components/dialogBoxes/updateConfirmationDialog/UpdateConfirmation';
import DeleteConfirmationDialog from '../../../components/dialogBoxes/deleteConfirmationDialog/DeleteConfirmationDialog';
import './productManagement.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ProductManagement = () => {

  const reference = collection(firestore, "products");
  const productNameRef = useRef();
  const productIdRef = useRef();
  //const categoryRef = useRef();
  const descriptionRef = useRef();
  const modelUrlRef = useRef();
  const sizeRef = useRef();
  const priceRef = useRef();
  const quantityRef = useRef();
  const offerPercentageRef = useRef();
  const fileInputRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [selectedColors, setSelectedColors] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { isNew} = useParams();
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [imageUploads, setImageUploads] = useState([]);
  const [deals, setDeals] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [showOfferPercentage, setShowOfferPercentage] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Set Categories
  useEffect(() => {
    const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'Categories'));
    const categoryData = [];
    querySnapshot.forEach((doc) => {
      categoryData.push(doc.data().name);
    });
    setCategories(categoryData);
  };
  
    fetchCategories();
  }, []);

  // Set view for offer field   
  useEffect(() => {
    if (deals) {
      setShowOfferPercentage(true);
      //offerPercentageRef.current.value = 0;
    } else {
      setShowOfferPercentage(false);
    }
  }, [deals]);

  // If existing
  useEffect(() => {
    console.log(productId);
    const fetchProduct = async () => {
      try {
        const productDocRef = doc(firestore, 'products', productId);
        const productDocSnap = await getDoc(productDocRef);
  
        if (productDocSnap.exists()) {
          // If product exists, set the data
          const productData = { id: productDocSnap.id, ...productDocSnap.data() };
          setProduct(productData);
          setCategoryFilter(productData.category);
          setSelectedColors(productData.colors || []);
          setFeatured(productData.featured);
          setFreeShipping(productData.freeShipping);
          setDeals(productData.deals);

          // Set image previews
          if (productData.imageURLs && productData.imageURLs.length > 0) {
            setImagePreviews(productData.imageURLs);
          }

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
        setSelectedColors([...selectedColors, currentColor]);
    }
  };
  
  // Clear the selected colors list
  const clearAddedList = () => {
    setSelectedColors([]);  
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


  /////////////////////

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
      category: categoryFilter,
      description: descriptionRef.current.value,
      size: sizeRef.current.value.split(",").map(size => size.trim()),
      colors: selectedColors,
      imageURLs: imageURLs,
      price: parseFloat(priceRef.current.value),
      offerPercentage: deals ? parseFloat(offerPercentageRef.current.value) : 0,
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
    //categoryRef.current.value = "";
    descriptionRef.current.value = "";
    sizeRef.current.value = "";
    priceRef.current.value = "";
    //offerPercentageRef.current.value = "";
    modelUrlRef.current.value = "";
    quantityRef.current.value = "";
    setCurrentColor("#ffffff");
    setSelectedColors([]);
    setCategoryFilter("");
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
    e.preventDefault();
    setIsUpdateDialogOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsUpdateDialogOpen(false);

    const productDocRef = doc(firestore, 'products', productId);

    const updatedData = {};
    const productName = productNameRef.current.value;
    const productIdInput = productIdRef.current.value;
    const category = categoryFilter;
    const description = descriptionRef.current.value;
    const size = sizeRef.current.value.split(",").map(size => size.trim());
    const colors = selectedColors;
    const price = parseFloat(priceRef.current.value);
    const offerPercentage = deals ? parseFloat(offerPercentageRef.current?.value || 0) : 0;
    const modelUrl = modelUrlRef.current.value;
    const quantity = parseFloat(quantityRef.current.value);
    const dealsChecked = deals;
    const featuredChecked = featured;
    const freeShippingChecked = freeShipping;

    if (productName !== product.productName) {
      updatedData.productName = productName;
    }
    if (productIdInput !== product.productId) {
      updatedData.productId = productIdInput;
    }
    if (category !== product.category) {
      updatedData.category = category;
    }
    if (description !== product.description) {
      updatedData.description = description;
    }
    if (JSON.stringify(size) !== JSON.stringify(product.size)) {
      updatedData.size = size;
    }
    if (JSON.stringify(colors) !== JSON.stringify(product.colors)) {
      updatedData.colors = colors;
    }
    if (price !== product.price) {
      updatedData.price = price;
    }
    if (offerPercentage !== product.offerPercentage) {
      updatedData.offerPercentage = offerPercentage;
    }
    if (modelUrl !== product.modelUrl) {
      updatedData.modelUrl = modelUrl;
    }
    if (quantity !== product.quantity) {
      updatedData.quantity = quantity;
    }
    if (dealsChecked !== product.deals) {
      updatedData.deals = dealsChecked;
    }
    if (featuredChecked !== product.featured) {
      updatedData.featured = featuredChecked;
    }
    if (freeShippingChecked !== product.freeShipping) {
      updatedData.freeShipping = freeShippingChecked;
    }

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

    if (imageURLs.length > 0) {
      updatedData.imageURLs = imageURLs;
    }

    if (Object.keys(updatedData).length > 0) {
      try {
        await setDoc(productDocRef, updatedData, { merge: true });
        alert('Product updated successfully!');
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      alert('No changes detected');
    }
  };
  

  ////////////////////


  ////////////////////

  // Remove selected product
  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteDialogOpen(false);

    try {
        await deleteDoc(doc(firestore, 'products', product.id));
        alert('Product deleted successfully!');
        window.location.href="/products/manage/";
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product:', error);
    }
};

  ////////////////////

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
                    <form onSubmit={handleUpdate}>
                      <div className="formInput">
                          <label>Product Name :</label>
                          <input 
                              type="text" 
                              id="productName" 
                              ref={productNameRef} 
                              defaultValue={product.productName}
                              required 
                          />                    
                      </div>
                      <div className="formInput">
                          <label>Product ID :</label>
                          <input 
                              type="text" 
                              id="productId" 
                              ref={productIdRef} 
                              defaultValue={product.productId}
                              required 
                          />                    
                      </div>
                      <div className="formInput">
                          <label>Category :</label>
                          <select
                            id="category"
                            value={categoryFilter}
                            defaultValue={product.category}
                            onChange={(e) => setCategoryFilter(e.target.value)}>
                            
                            {categories.map((category, index) => (
                              <option key={index} value={category}>
                                  {category}
                              </option>
                            ))}
                        </select>                   
                      </div>
                      
                      <div className="formInput">
                          <label>Price :</label>
                          <input 
                              type="text" 
                              id="price" 
                              ref={priceRef} 
                              defaultValue={product.price}
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
                              defaultValue={product.modelUrl} 
                              required                                   
                          />
                      </div>
                      <div className="formInput">
                          <label>Model :</label>
                          <input 
                              type="text" 
                              id="size" 
                              ref={sizeRef} 
                              defaultValue={product.size.join(", ")}
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
                            <p id="selectedColors">{selectedColors.join(", ")}</p>
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
                              defaultValue={product.description}
                              required 
                          />
                      </div>
                      <div className="formInput checkboxGroup">  
                          <label>
                            <input
                              type="checkbox"
                              checked={featured}
                              onChange={(e) => setFeatured(e.target.checked)}
                              defaultValue={product.featured}
                            />Featured
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={freeShipping}
                              onChange={(e) => setFreeShipping(e.target.checked)}
                              defaultValue={product.freeShipping}
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
                              min="0"
                              defaultValue={product.quantity}
                              required 
                          />
                      </div>

                      {showOfferPercentage && (
                        <div className="formInput">
                          <label>Offer Fraction :</label>
                          <input 
                            type="number" 
                            id="offerPercentage" 
                            ref={offerPercentageRef} 
                            step="0.01" 
                            min="0"
                            max="1"
                            defaultValue={product.offerPercentage} 
                            required />
                        </div>
                      )}
                      <div className="formInput">
                          <label htmlFor="file">
                          Product Images :
                          <DriveFolderUploadOutlinedIcon className="icon" />
                          </label>
                          <input type="file" id="file" onChange={handleFileChange} style={{ display: 'none' }} ref={fileInputRef} multiple />
                      </div>
                      <div className="formInput"></div>
                        <button type="submit">Update</button>
                        <button className="btnDelete" onClick={handleDelete}>Delete</button>
                    </form>
                  </div>
                </div>
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
                          <select
                            id="category"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}>
                            {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                            ))}
                        </select>                   
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
                            <p id="selectedColors">{selectedColors.join(", ")}</p>
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
                              min="0"
                              required 
                          />
                      </div>
                      {showOfferPercentage && (
                        <div className="formInput">
                          <label>Offer Fraction :</label>
                          <input type="number" id="offerPercentage" ref={offerPercentageRef} step="0.01" min="0" max="1" required />
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
      <UpdateConfirmationDialog 
        open={isUpdateDialogOpen} 
        onClose={() => setIsUpdateDialogOpen(false)} 
        onConfirm={handleConfirmUpdate} 
      />
      <DeleteConfirmationDialog 
              open={isDeleteDialogOpen} 
              onClose={() => setIsDeleteDialogOpen(false)} 
              onConfirm={handleConfirmDelete} 
            />
    </div>
  );
}

export default ProductManagement;