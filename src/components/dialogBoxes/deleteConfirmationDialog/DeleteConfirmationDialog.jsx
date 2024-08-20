import React, { useState, useEffect } from 'react';
import './deleteConfirmationDialog.scss';
import '../../../components/dataTable/dataTable.scss';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="deleteConfirmationDialog">
      <div className="deleteConfirmationDialogContent">
        <h3>Are you sure you want to delete this?</h3>
        <div className="deleteConfirmationDialogActions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationDialog;