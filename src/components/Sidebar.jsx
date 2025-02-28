import React, { useContext, useState } from "react";
import logo from "../imgs/pooltechlogo.png";
import { FaHome } from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosPerson } from "react-icons/io";
import { BsPeopleFill } from "react-icons/bs";
import { GiArchiveRegister } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { Box, Button, Modal, Typography } from "@mui/material";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import Invoice2 from "./Invoic/Invoice";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const params = useParams();
  const page = window.location.pathname;
  // console.log(window.location.href)

  let { Nulluser } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = () => {
    navigate("/login");
    Nulluser();
  };

  let [borderb, setborderb] = useState({
    home: false,
    worker: false,
    Adddata: false,
  });

  const homeborder = () => {
    setborderb({
      home: true,
      worker: false,
      Adddata: false,
    });
  };

  const workerborder = () => {
    setborderb({
      home: false,
      worker: true,
      Adddata: false,
    });
  };

  const adddataborder = () => {
    setborderb({
      home: false,
      worker: false,
      Adddata: true,
    });
  };
  // console.log(window.location.pathname)

  const [deleteaccount, setDeleteaccount] = useState(false);
  const handledelete = () => {
    setDeleteaccount(!deleteaccount);
  };
  let handleinvoice = () => {
    window.open("https://tangerine-stardust-d0de91.netlify.app/", "_blank");
  };
  return (
    <>
      {/* Toggle Button */}
      {/* <button
        className="fixed top-5 left-5 z-50 p-2 bg-[#0b6e99] text-white rounded-md shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaBars className="text-xl" />
        )}
      </button> */}

      {/* Sidebar */}
      <div
        className=" w-[215px]  bg-white shadow-2xl"
        style={{ width: "215px" }}
      >
        <div className="w-[225px] h-[100vh] overflow-y-scroll py-2 px-2">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="h-[100px] w-[130px]" />
            <h2 className="text-lg font-bold mt-2 text-[#35A1CC]">
              Mr. Pool Tech
            </h2>
          </div>

          <NavLink to="/">
            <div
              className={`flex w-[85%] ml-[20px] mt-[40px] items-center p-1 rounded-lg ${
                page === "/" ? "bg-[#0b6e99] text-white" : "text-[#35A1CC]"
              }`}
            >
              <FaHome className="text-2xl ml-2" />
              <h2 className="ml-1 text-lg">All Projects</h2>
            </div>
          </NavLink>

          <NavLink to="/workertype">
            <div
              className={`flex w-[85%] ml-[20px] mt-[20px] items-center p-1 rounded-lg ${
                page === "/workertype"
                  ? "bg-[#0b6e99] text-white"
                  : "text-[#35A1CC]"
              }`}
            >
              <BsPeopleFill className="text-2xl ml-2" />
              <h2 className="ml-1 text-lg">All Employees</h2>
            </div>
          </NavLink>

          <NavLink to="/attendance">
            <div
              className={`flex w-[85%] ml-[20px] mt-[20px] items-center p-1 rounded-lg ${
                page === "/attendance"
                  ? "bg-[#0b6e99] text-white"
                  : "text-[#35A1CC]"
              }`}
            >
              <GiArchiveRegister className="text-2xl ml-2" />
              <h2 className="ml-2 text-lg">Attendance</h2>
            </div>
          </NavLink>

          <NavLink to="/allproducts">
            <div
              className={`flex w-[85%] ml-[20px] mt-[20px] items-center p-1 rounded-lg ${
                page === "/allproducts"
                  ? "bg-[#0b6e99] text-white"
                  : "text-[#35A1CC]"
              }`}
            >
              <FaShoppingCart className="text-2xl ml-2" />
              <h2 className="ml-2 text-lg">Products</h2>
            </div>
          </NavLink>

          <div
            onClick={() => navigate(`/Invoice3`)}
            className="flex cursor-pointer w-[85%] ml-5 mt-5 items-center p-1 text-[#35A1CC] hover:text-[#1E7BA6] transition duration-200"
          >
            <FaFileInvoiceDollar className="text-2xl ml-2" />
            <h2 className="ml-2 text-lg font-medium">Invoice</h2>
          </div>

          {/* Logout Button */}
          <div className="w-[190px] border-t mt-[80px]">
            <div className="ml-[45px] mt-4">
              <button
                className="h-[40px] w-[90px] bg-[#f44336] rounded-md text-white mt-5"
                onClick={handledelete}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal open={deleteaccount} onClose={handledelete}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            outline: "none",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Are you sure you want to logout this account?
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              className="bg-[#0B6E99] text-white mr-5"
              onClick={handledelete}
            >
              No
            </Button>
            <Button
              variant="contained"
              className="bg-[#0B6E99]"
              onClick={() => {
                return logout();
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Sidebar;
