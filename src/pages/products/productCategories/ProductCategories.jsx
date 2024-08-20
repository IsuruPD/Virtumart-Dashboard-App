import React, { useState, useEffect } from 'react';
import SideBar from '../../../components/sideBar/SideBar';
import NavBar from '../../../components/navBar/NavBar';
import CategoryItem from '../../../components/category/CategoryItems';
import { getFirestore, collection, getDocs, addDoc, writeBatch, doc } from 'firebase/firestore';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './productCategories.scss';

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const db = getFirestore();
      const categoriesCollection = collection(db, 'Categories');
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList = categorySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.rank - b.rank); // Sorting by rank initially

      setCategories(categoryList);
    };

    fetchCategories();
  }, []);

  const moveCategory = (fromIndex, toIndex) => {
    const updatedCategories = [...categories];
    const [movedCategory] = updatedCategories.splice(fromIndex, 1);
    updatedCategories.splice(toIndex, 0, movedCategory);
    setCategories(updatedCategories); // Update the state with the new order
  };

  const updateRanks = async () => {
    const db = getFirestore();
    const batch = writeBatch(db);

    categories.forEach((category, index) => {
      const categoryRef = doc(db, 'Categories', category.id);
      batch.update(categoryRef, { rank: index + 1 });
    });

    await batch.commit();
    alert('Category ranks updated successfully');
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const db = getFirestore();
    const newCategory = {
      name: newCategoryName,
      description: newCategoryDescription,
      rank: categories.length + 1, // Assigning the last rank
    };

    const docRef = await addDoc(collection(db, 'Categories'), newCategory);
    setCategories([...categories, { id: docRef.id, ...newCategory }]);
    setNewCategoryName('');
    setNewCategoryDescription('');
    alert('Successfully added the category: ' + newCategoryName )
  };

  const removeCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="productCategories">
        <SideBar />
        <div className="productCategoriesContainer">
          <NavBar />
          <div className="productCategoriesTitle">
            Category Management
          </div>

          <div className="addCategoryForm">
            <h3>Add New</h3>
            <form onSubmit={addCategory}>
              <input 
                type="text" 
                placeholder="Category Name" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                required 
              />
              <textarea
                placeholder="Category Description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
              />
              <button type="submit">Add Category</button>
            </form>
          </div>

          <div className="productCategoriesContainerBody">
            <div className="updateRanksButton" >
              <h3>Edit</h3>
              <button onClick={updateRanks}>Update Ranks</button>
            </div>
          
            {categories.map((category, index) => (
              <CategoryItem
                key={category.id}
                index={index}
                category={category}
                moveCategory={moveCategory}
                updateCategory={(id, updatedFields) => setCategories(categories.map(category => (category.id === id ? { ...category, ...updatedFields } : category)))}
                onRemoveCategory={removeCategory}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ProductCategories;
