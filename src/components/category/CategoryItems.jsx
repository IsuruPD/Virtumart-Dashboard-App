import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteConfirmationDialog from '../../../src/components/dialogBoxes/deleteConfirmationDialog/DeleteConfirmationDialog';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import './categoryItems.scss';

const CategoryItem = ({ category, index, moveCategory, updateCategory, onRemoveCategory}) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [, ref] = useDrag({
    type: 'CATEGORY',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'CATEGORY',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCategory(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleSave = () => {
    updateCategory(category.id, { name, description });
    setEditing(false);
  };

  const handleRemove = async () => {
    setShowDeleteDialog(false);
    const db = getFirestore();
    const categoryRef = doc(db, 'Categories', category.id);
    await deleteDoc(categoryRef);
    alert("Successfully removed the category!");

    // Remove category from the state
    onRemoveCategory(category.id);
  };

  return (
    <div 
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} 
      ref={(node) => ref(drop(node))} 
      className="categoryItem"
    >
      {editing ? (
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className='saveButton' onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <div>
            <span><h3>{index + 1}. {name}</h3></span> {/* Displaying the index as the rank number */}
            <div style={{ marginLeft: 16 }}>
              <h5>Description: </h5><h5><span className='desc'>{description ? description : "N/A"}</span></h5>
            </div>
            <button className='editButton' onClick={() => setEditing(true)}>Edit</button>
            <button className='removeButton' onClick={() => setShowDeleteDialog(true)}>Remove</button>
          </div>
        </div>
      )}
      <DragIndicatorIcon />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleRemove}
      />
    </div>
  );
};

export default CategoryItem;
