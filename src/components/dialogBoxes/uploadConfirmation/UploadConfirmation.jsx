import React, { useState, useEffect } from 'react';
import './uploadConfirmationDialog.scss';

const UploadConfirmationDialog = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="uploadConfirmationDialog">
      <div className="uploadConfirmationDialogContent">
        <h3>Are you sure you want to add this product to the catalogue?</h3>
        <div className="uploadConfirmationDialogActions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};
export default UploadConfirmationDialog;