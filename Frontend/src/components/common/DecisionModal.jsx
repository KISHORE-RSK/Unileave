import React, { useState } from "react";

const DecisionModal = ({ isOpen, onClose, onConfirm, status }) => {
  const [remark, setRemark] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(remark);
    setRemark("");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>{status === "Approved" ? "Approve Leave" : "Reject Leave"}</h3>
        <p className="modal-subtitle">
          {status === "Approved" 
            ? "Add an optional remark for the student." 
            : "Please provide a reason for rejection."}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <textarea
              placeholder="Type your remark here..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              required={status === "Rejected"}
              autoFocus
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className={status === "Approved" ? "approve-confirm-btn" : "reject-confirm-btn"}
            >
              Confirm {status}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DecisionModal;
