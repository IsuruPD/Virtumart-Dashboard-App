import React, { useState, useEffect } from 'react';
import './productDisplay.scss';
import SideBar from '../../../components/sideBar/SideBar';
import NavBar from '../../../components/navBar/NavBar';
import DeleteConfirmationDialog from '../../../components/dialogBoxes/deleteConfirmationDialog/DeleteConfirmationDialog';
import { Link } from 'react-router-dom';
import BadgeIcon from '@mui/icons-material/ShoppingCart';
import '../../../components/dataTable/dataTable.scss';
import { DataGrid } from '@mui/x-data-grid';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebase';

const ProductDisplay = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [dealsFilter, setDealsFilter] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [freeShippingFilter, setFreeShippingFilter] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      const productData = [];
      querySnapshot.forEach((doc) => {
        productData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productData);
    };

    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'Categories'));
      const categoryData = [];
      querySnapshot.forEach((doc) => {
        categoryData.push(doc.data().name);
      });
      setCategories(categoryData);
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleEditClick = (selectedProduct) => {
    window.location.href = `/products/manage/edit/${selectedProduct.id}`;
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      await deleteDoc(doc(firestore, 'products', productToDelete.id));
      setProducts(products.filter(product => product.id !== productToDelete.id));
      setIsConfirmationDialogOpen(false);
      setProductToDelete(null);
    }
  };  

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsConfirmationDialogOpen(true);
  };
  

  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery =
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productId.toString().includes(searchQuery);
    const matchesCategoryFilter =
      categoryFilter === '' || product.category === categoryFilter;
    const matchesDealsFilter = !dealsFilter || product.deals;
    const matchesFeaturedFilter = !featuredFilter || product.featured;
    const matchesFreeShippingFilter = !freeShippingFilter || product.freeShipping;
    return (
      matchesSearchQuery &&
      matchesCategoryFilter &&
      matchesDealsFilter &&
      matchesFeaturedFilter &&
      matchesFreeShippingFilter
    );
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setDealsFilter(false);
    setFeaturedFilter(false);
    setFreeShippingFilter(false);
  };

  const columns = [
    {
      field: 'fullName',
      headerName: 'Product',
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.imageURLs[0]} alt="avatar" />
            {params.row.productName}
          </div>
        );
      },
    },
    { field: 'productId', headerName: 'Product ID', width: 100 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'price', headerName: 'Price (Rs.)' },
    { field: 'deals', headerName: 'On Sale' },
    { field: 'offerPercentage', headerName: 'Discount (frac)' },
    { field: 'freeShipping', headerName: 'Free Shipping' },
    { field: 'featured', headerName: 'Featured' },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className="viewButton" onClick={() => handleView(params.row)}>
              View
            </div>
            <div className="disableButton" onClick={() => handleDeleteClick(params.row)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="productDetails">
      <SideBar />
      <div className="productDetailsContainer">
        <NavBar />
        <div className="productDetailsTitle">Product Management</div>

        <div className="singleProduct">
          {selectedProduct && (
            <div className="singleItemContainer">
              <div className="top">
                <div className="left">
                  <div className="editButtonContainer" onClick={() => handleEditClick(selectedProduct)}>
                    <Link className="link">
                      <div className="editButton">Edit</div>
                    </Link>
                  </div>
                  <div className="cardHeader">
                    <div className="cardIcon">
                      <BadgeIcon />
                    </div>
                    <h1 className="title">Product Details</h1>
                  </div>
                  <div className="item">
                    <img
                      src={selectedProduct.imageURLs[0]}
                      alt="Profile Image"
                      className="itemImg"
                    />
                    <div className="details">
                      <h1 className="itemTitle">{selectedProduct.productName} <span className="id">&nbsp;({selectedProduct.productId})</span></h1>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                                <div className="detailItem">
                                    <span className="itemKey">Category:</span>
                                    <span className="itemValue">{selectedProduct.category}</span>
                                </div>
                            </td>
                            <td>
                                <div className="detailItem">
                                    <span className="itemKey">Price:</span>
                                    <span className="itemValue">Rs. {selectedProduct.price}/=</span>
                                </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                                <div className="detailItem">
                                    <span className="itemKey">On Sale:</span>
                                    <span className="itemValue">{selectedProduct.deals ? 'Yes' : 'No'}</span>
                                </div>
                            </td>
                            <td>
                                <div className="detailItem">
                                    <span className="itemKey">Selling Price:</span>
                                    <span className="itemValue">Rs. {selectedProduct.price* (1-selectedProduct.offerPercentage)}/=</span>
                                </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                                <div className="detailItem">
                                    <span className="itemKey">Free Shipping:</span>
                                    <span className="itemValue">{selectedProduct.freeShipping ? 'Yes' : 'No'}</span>
                                </div>
                            </td>
                            <td rowspan="2">
                                <div className="detailItem">
                                    <span className="itemKey">Description:</span>
                                    <span className="itemValue">{truncateText(selectedProduct.description, 100)}</span>
                                </div>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <div className="detailItem">
                                    <span className="itemKey">Discount Percentage:</span>
                                    <span className="itemValue">{selectedProduct.offerPercentage*100}%</span>
                                </div>
                            </td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="datatable">
            <div className="datatableTitle">
                Inventory
                <Link to="/products/manage/new/create" className="link">
                Add New
                </Link>
            </div>

            <div className="filterContainer">
                <input
                    type="text"
                    placeholder="Search by product name or ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="searchInput"/>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="categoryFilter">
                    
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                    <option key={index} value={category}>
                        {category}
                    </option>
                    ))}
                </select>

                <div className="checkboxContainer">
                    <label>
                        <input
                            type="checkbox"
                            checked={dealsFilter}
                            onChange={(e) => setDealsFilter(e.target.checked)}
                        />
                        Deals
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={featuredFilter}
                            onChange={(e) => setFeaturedFilter(e.target.checked)}
                        />
                        Featured
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={freeShippingFilter}
                            onChange={(e) => setFreeShippingFilter(e.target.checked)}
                        />
                        Free Shipping
                    </label>
                </div>

                <button onClick={handleResetFilters} className="resetButton">
                    Reset Filters
                </button>
                
            </div>

            <DataGrid
                className="datagrid"
                rows={filteredProducts}
                columns={columns}
                pageSize={4}
            />
        </div>
        <DeleteConfirmationDialog
          open={isConfirmationDialogOpen}
          onClose={() => setIsConfirmationDialogOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
};

export default ProductDisplay;
