import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { db } from "../Firbase";
import upper from "../imgs/pooltecuper.jpeg";
import lower from "../imgs/poolteclower.jpeg";
import { Link, useNavigate } from "react-router-dom";
import Widgets from "./Widgets";
import { Model } from "./Model";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { toast } from "react-toastify";

import {
  getDatabase,
  set,
  ref,
  get,
  update,
  push,
  onValue,
  remove,
} from "firebase/database";
import Sidebar from "./Sidebar";
import { ModalContext } from "../context/Modalcontext";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ReactPaginate from "react-paginate";

const PermentWorker = () => {
  const [mylist, setmylist] = useState([]);
  const [search, setsearch] = useState("");
  const [filtered, setfiltered] = useState([]);
  const navigate = useNavigate();
  // const [showmodal, setshowmodal] = useState(false);
  const [delid, setdelid] = useState("");

  let { showmodal, deletemodal } = useContext(ModalContext);

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOwnerId, setDeleteOwnerId] = useState(null); // Store owner ID for deletion
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const db = getDatabase();
      const ownersRef = ref(db, "Owners");
      const snapshot = await get(ownersRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const ownerList = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name || "Unknown",
          email: data[key].email || "No Email",
          mobile: data[key].mobile || "No Mobile",
          assignedSites: data[key].assignedSites
            ? Object.values(data[key].assignedSites) // Convert object to an array
            : [], // If no assigned sites, return an empty array
        }));

        setOwners(ownerList);
        // setOwners(data);
      } else {
        setOwners([]);
      }
    } catch (err) {
      setError("Failed to fetch owners.");
      console.error("Error fetching owners:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (ownerId) => {
    setDeleteOwnerId(ownerId);
    setShowModal(true);
  };

  // const deleteOwner = async () => {
  //   if (!deleteOwnerId) return;

  //   try {
  //     const db = getDatabase();
  //     await remove(ref(db, `Owners/${deleteOwnerId}`));
  //     setOwners(owners.filter((owner) => owner.id !== deleteOwnerId)); // Update UI
  //     console.log("Owner deleted successfully.");
  //   } catch (error) {
  //     console.error("Error deleting owner:", error);
  //   } finally {
  //     setShowModal(false);
  //     setDeleteOwnerId(null);
  //   }
  // };

  const db = getDatabase();

  const deleteOwner = async () => {
    if (!deleteOwnerId) return;

    try {
      // Remove owner from Firebase database
      await remove(ref(db, `Owners/${deleteOwnerId}`));

      // Update the state to reflect the changes
      setOwners((prevOwners) =>
        prevOwners.filter((owner) => owner.id !== deleteOwnerId)
      );

      // Close the modal and reset state
      setDeleteOwnerId(null);
      setShowModal(false);

      console.log("Owner deleted successfully!");
    } catch (error) {
      console.error("Error deleting owner:", error);
    }
  };

  const createOrUpdateOwner = async (ownerData) => {
    try {
      if (!ownerData || !ownerData.ownerEmail || !ownerData.ownerPassword) {
        toast.error("Owner email and password are required.");
        return;
      }

      console.log("Creating owner with data:", ownerData);

      // Initialize database
      const db = getDatabase();

      // Generate a new push key for the owner
      const pushKey = push(ref(db, "Owners")).key;

      // Save owner details in Firebase Realtime Database
      await update(ref(db, `Owners/${pushKey}`), {
        
        name: ownerData.owner || "N/A",
        mobile: ownerData.ownerMobile || "N/A",
        email: ownerData.ownerEmail || "N/A",
      });

      toast.success("New owner created successfully!");

      // Refresh the owners list after adding a new owner
      fetchOwners();
    } catch (error) {
      console.error("Error creating owner:", error.message);
      toast.error("Failed to create owner.");
    }
  };

  const submitData = async () => {
    try {
      if (!ownerData) {
        throw new Error("No data provided for submission.");
      }

      await createOrUpdateOwner(ownerData); // Pass `data` to create a new owner

      setEditModalOpen(false); // Close modal after submission
      toast.success("Client added successfully!");

      // Refresh the list of owners after submission
      fetchOwners();
    } catch (error) {
      console.error("Error adding data:", error);
      toast.error("Failed to add client.");
    }
  };

  let delmsg = "Are you sure to delete this worker ?";

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log(selectedOwner);

  // Open the modal with selected owner
  const openModal = (owner) => {
    setSelectedOwner(owner);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOwner(null);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const ownersPerPage = 5; // Number of owners per page

  // Calculate displayed owners
  const pageCount = Math.ceil(owners.length / ownersPerPage);
  const currentOwners = owners.slice(
    currentPage * ownersPerPage,
    (currentPage + 1) * ownersPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const openEditModal = (owner = null) => {
    if (owner) {
      setEditData(owner); // Set data for editing
      setIsEditing(true);
    } else {
      setEditData({ owner: "", ownerEmail: "", ownerMobile: "" }); // Empty fields for new client
      setIsEditing(false);
    }
    setEditModalOpen(true); // ✅ Corrected this line
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // const submitData = async () => {
  //   await createOrUpdateOwner(editData);
  //   setEditModalOpen(false);
  //   toast.success(isEditing ? "Client details updated!" : "New client added!");
  // };

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.id === "modalOverlay") {
      setEditModalOpen(false);
    }
  };

  return (
    <>
      {deletemodal && <Model delfunc={handleDelete} msg={delmsg} />}
      <div className="flex w-[100%]">
        <Sidebar />
        <div className="relative  overflow-x-auto  w-[83%]">
          {/* {deletemodal && <Model delfunc={handleDelete} msg={delmsg} />} */}
          <img src={upper} className="w-[100%]" />
          {/* Add New Client */}
          <div
            onClick={() => openEditModal()}
            className="h-[45px] border w-[200px] absolute rounded-md right-6 flex justify-center items-center bg-[#35A1CC] text-white cursor-pointer"
          >
            Add New Client +
          </div>

          <div className="w-[95%]  ml-[45px] mt-[60px] relative">
            <div>
              {/* Owners Table */}
              <table className="border-collapse border w-full">
                <thead>
                  <tr className="bg-gray-200 text-center">
                    <th className="border p-2">#</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Mobile</th>
                    <th className="border p-2">Sites</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOwners.map((owner, index) => (
                    <tr key={owner.id} className="text-center">
                      <td className="border p-2">
                        {currentPage * ownersPerPage + index + 1}
                      </td>
                      <td className="border p-2">{owner.name || "N/A"}</td>
                      <td className="border p-2">{owner.email || "N/A"}</td>
                      <td className="border p-2">{owner.mobile || "N/A"}</td>
                      <td className="border p-2">
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-800"
                          onClick={() => openModal(owner)}
                        >
                          View Sites
                        </button>
                      </td>
                      <td className="border flex justify-evenly p-2">
                        {/* Edit Button */}
                        <button
                          onClick={() =>
                            openEditModal({
                              ownerId: selectedOwner,
                              ...owners.find((o) => o.id === selectedOwner),
                            })
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => confirmDelete(owner.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>

                      {/* Modal for Adding & Editing */}
                      {editModalOpen && (
                        <div
                          id="modalOverlay"
                          onClick={handleOverlayClick}
                          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20"
                        >
                          <div className="bg-white p-5 rounded shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-2">
                              {isEditing
                                ? "Edit Client Details"
                                : "Add New Client"}
                            </h2>
                            <div className="flex flex-col gap-3 mb-2">
                              <input
                                type="text"
                                name="owner"
                                value={editData.owner}
                                onChange={handleEditChange}
                                placeholder="Client Name"
                                className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="email"
                                name="ownerEmail"
                                value={editData.ownerEmail}
                                onChange={handleEditChange}
                                placeholder="Client Email"
                                className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="number"
                                name="ownerMobile"
                                value={editData.ownerMobile}
                                onChange={handleEditChange}
                                placeholder="Client Mobile"
                                className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                              />

                              {/* Show password field only when adding a new client */}
                              {!isEditing && (
                                <input
                                  type="password"
                                  name="ownerPassword"
                                  value={editData.ownerPassword || ""}
                                  onChange={handleEditChange}
                                  placeholder="Password"
                                  className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              )}
                            </div>

                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={async () => {
                                  await createOrUpdateOwner(editData);
                                  setEditModalOpen(false); // Close modal after submission
                                }}
                                className="px-3 py-1 bg-blue-500 text-white rounded"
                              >
                                {isEditing ? "Save Changes" : "Save Client"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Delete Confirmation Modal */}
                      {showModal && (
                        <div
                          className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-20"
                          onClick={() => setShowModal(false)}
                        >
                          <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold">
                              Are you sure?
                            </h2>
                            <p>You are about to delete this owner.</p>

                            <div className="flex  justify-between mt-4">
                              <button
                                onClick={() => setShowModal(false)}
                                className="mr-2 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={deleteOwner}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination using react-paginate */}
              <div className="flex justify-end mt-4">
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={"flex space-x-2"}
                  activeClassName={"bg-blue-500 text-white px-3 py-1 rounded"}
                  pageClassName={"border px-3 py-1 rounded cursor-pointer"}
                  previousClassName={"border px-3 py-1 rounded cursor-pointer"}
                  nextClassName={"border px-3 py-1 rounded cursor-pointer"}
                  disabledClassName={"text-gray-400 cursor-not-allowed"}
                />
              </div>

              {/* Modal for Showing Sites */}
              {isModalOpen && selectedOwner && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                    <h2 className="text-xl font-semibold mb-4">
                      Assigned Sites for {selectedOwner.name}
                    </h2>
                    <ul className="">
                      {selectedOwner.assignedSites &&
                      Object.keys(selectedOwner.assignedSites).length > 0 ? (
                        Object.values(selectedOwner.assignedSites).map(
                          (site, index) => (
                            <li key={site.id} className="mb-2">
                              <span className="font-small text-sm">
                                {index + 1}. {site.siteName} {site.siteName}
                              </span>{" "}
                              (Project ID: {site.projectId})
                            </li>
                          )
                        )
                      ) : (
                        <p className="text-gray-500">No Assigned Sites</p>
                      )}
                    </ul>

                    <div className="w-full flex justify-end">
                      <button
                        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <br />
          </div>
          {/* <img src={lower} /> */}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default PermentWorker;
