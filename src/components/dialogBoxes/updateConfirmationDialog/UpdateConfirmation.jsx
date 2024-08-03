import React, { useState, useEffect } from 'react';
import './updateConfirmationDialog.scss';

const UpdateConfirmationDialog = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="updateConfirmationDialog">
      <div className="updateConfirmationDialogContent">
        <h3>Are you sure you want to update product details?</h3>
        <div className="updateConfirmationDialogActions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};
export default UpdateConfirmationDialog;