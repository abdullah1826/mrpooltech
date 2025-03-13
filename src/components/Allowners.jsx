import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { db, auth } from "../Firbase";
import upper from "../imgs/pooltecuper.jpeg";
import lower from "../imgs/poolteclower.jpeg";
import { Link, useNavigate } from "react-router-dom";
import Widgets from "./Widgets";
import { Model } from "./Model";
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
        }));
        setOwners(ownerList);
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

  const deleteOwner = async () => {
    if (!deleteOwnerId) return;

    try {
      const db = getDatabase();
      await remove(ref(db, `Owners/${deleteOwnerId}`));
      setOwners(owners.filter((owner) => owner.id !== deleteOwnerId)); // Update UI
      console.log("Owner deleted successfully.");
    } catch (error) {
      console.error("Error deleting owner:", error);
    } finally {
      setShowModal(false);
      setDeleteOwnerId(null);
    }
  };

  let delmsg = "Are you sure to delete this worker ?";

  return (
    <>
      {deletemodal && <Model delfunc={handleDelete} msg={delmsg} />}
      <div className="flex w-[100%]">
        <Sidebar />
        <div className="relative  overflow-x-auto  w-[83%]">
          {/* {deletemodal && <Model delfunc={handleDelete} msg={delmsg} />} */}
          <img src={upper} className="w-[100%]" />
          {/* <Link to="/">
            <div className="h-[45px] border w-[200px] absolute rounded-md right-6 flex justify-center items-center bg-[#35A1CC] text-white cursor-pointer">
              Add New Worker +
            </div>
          </Link> */}
          <div className="w-[95%]  ml-[45px] mt-[60px] relative">
            <div className="p-4 border rounded-md shadow-md bg-white w-full">
              <h2 className="text-lg font-semibold mb-3">Owner List</h2>

              {loading ? (
                <p>Loading owners...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : owners.length === 0 ? (
                <p>No owners found.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                    <th className="border p-2">S. No.</th> {/* New Serial Number Column */}
                    <th className="border p-2">Site</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Mobile</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owners.map((owner, index) => (
                      <tr key={owner.id} className="text-center">
                        <td className="border p-2">{index + 1}</td>{" "}
                        <td className="border p-2">{owner.site}</td> 
                        <td className="border p-2">{owner.name}</td>
                        <td className="border p-2">{owner.email}</td>
                        <td className="border p-2">{owner.mobile}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => confirmDelete(owner.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Delete Confirmation Modal */}
              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-md w-96">
                    <h2 className="text-lg font-semibold mb-4">
                      Confirm Deletion
                    </h2>
                    <p>Are you sure you want to delete this owner?</p>
                    <div className=" flex  justify-between mt-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="mr-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        No
                      </button>
                      <button
                        onClick={deleteOwner}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Yes
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
