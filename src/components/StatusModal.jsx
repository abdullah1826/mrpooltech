import React, { useState, useEffect } from "react";
import { Box, Button, Modal } from "@mui/material";
import { db } from "../Firbase";
import { get, ref, update } from "firebase/database";

const StatusModal = ({ open, onClose, id , path }) => {
  // Change 'id' to 'projectId'
// console.log(id)
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    if (open && id) {
      // console.log(id);
      const fetchReason = async () => {
        try {
          const snapshot = await get(ref(db, `/{path}/${id}/reason`));
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setReason(snapshot.val()); // Set the fetched reason
          } else {
            setReason(""); // Keep it empty if no reason is found
          }
        } catch (error) {
          console.error("Error fetching reason:", error);
        }
      };
      fetchReason();
    }
  }, [open, id]); // Runs whenever modal opens or id changes

  const [reason, setReason] = useState("");
  const handleReasonChange = (e) => {
    const value = e.target.value;
    setReason(value);
  };
  const handleSave = () => {
    console.log("path", id);
    
    if (!id || typeof id !== "string") {
      console.error("Error: Invalid projectId! It should be a string.");
      return;
    }
    
    if (!path || typeof path !== "string") {
      console.error("Error: Invalid path! It should be a string.");
      return;
    }
  
    update(ref(db, `/${path}/${id}`), { reason: reason })
      .then(() => {
        onClose(); // Close modal after saving
      })
      .catch((error) => console.error("Database update failed:", error));
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            width: 400,
            bgcolor: "background.paper",
            border: "none",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-[100%] bg-white rounded-lg">
            <h1 className="text-lg w-[100%] text-start font-bold text-gray-800 mb-2">
              Reason for Inactivating Site
            </h1>
            <textarea
              rows="4"
              value={reason}
              onChange={handleReasonChange}
              placeholder="Enter reason..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <div className="flex w-full justify-between mt-3">
            <Button variant="contained" color="error" onClick={onClose}>
              Cancel
            </Button>
          
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
export default StatusModal;
