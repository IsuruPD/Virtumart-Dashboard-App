import React, { useRef, useState } from "react";
import { firestore, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SketchPicker } from 'react-color';

export default function AddProducts() {
    const reference = collection(firestore, "products");
    const productNameRef = useRef();
    const categoryRef = useRef();
    const descriptionRef = useRef();
    const sizeRef = useRef();
    const [currentColor, setCurrentColor] = useState("#ffffff");
    const [selectedColors, setSelectedColors] = useState(""); // Initialize as empty string
    const [imageUploads, setImageUploads] = useState([]);

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
    
    // Function to handle file input change
    const handleFileChange = (event) => {
        const files = event.target.files;
        setImageUploads(files);
    };

    //Submit the product details to Firebase Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Upload images selected to Firebase Storage
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
    
        // Add product to Firestore
        const productData = {
            productName: productNameRef.current.value,
            category: categoryRef.current.value,
            description: descriptionRef.current.value,
            size: sizeRef.current.value.split(",").map(size => size.trim()),
            colors: selectedColors.split(", ").map(color => color.trim()),
            imageURLs: imageURLs,
        };
    
        try {
            await addDoc(reference, productData);
            console.log("Product added successfully");
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };
    
    return (
        <div>
            <div>Products Add Page</div>
            <div>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td><label >Product Name :</label></td>
                                <td><input 
                                    type="text" 
                                    id="productName" 
                                    ref={productNameRef} 
                                    required 
                                /></td>
                            </tr>
                            <tr>
                                <td><label >Category :</label></td>
                                <td><input 
                                    type="text" 
                                    id="category" 
                                    ref={categoryRef} 
                                    required 
                                /></td>
                            </tr>
                            <tr>
                                <td><label >Description :</label></td>
                                <td><textarea 
                                    id="description" 
                                    ref={descriptionRef} 
                                    required 
                                /></td>
                            </tr>
                            <tr>
                                <td><label >Size :</label></td>
                                <td><input 
                                    type="text" 
                                    id="size" 
                                    ref={sizeRef} 
                                    placeholder="Enter multiple sizes separated by commas" 
                                     
                                /></td>
                            </tr>
                            <tr>
                                <td><label>Product Image :</label></td>
                                <td><input 
                                        type="file" 
                                        accept="image/*" 
                                        id="image"
                                        multiple 
                                        required
                                        onChange={handleFileChange}  
                                    /></td>
                            </tr>
                            <tr>
                                <td>Select Available Colors :</td>
                                <td>
                                    <SketchPicker
                                        color={currentColor}
                                        onChangeComplete={handleOnChange}
                                    />
                                </td>
                                <td>
                                    <button type="button" onClick={handleAddColor}>Add Color</button>
                                    <br/>
                                    <button type="button" onClick={clearAddedList}>Clear</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Added color codes :</td>
                                <td><p id="selectedColors">{selectedColors}</p></td>
                            </tr>
                            
                        </tbody>
                    </table>
                    <button type="submit">Add Product</button>
                </form>
            </div>
        </div>
    );
}
