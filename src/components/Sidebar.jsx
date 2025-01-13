import React, { useContext, useState } from 'react'
import logo from '../imgs/pooltechlogo.png';
import { FaHome } from 'react-icons/fa'
import { ImPriceTags } from 'react-icons/im';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoIosPerson } from 'react-icons/io'
import { BsPeopleFill } from 'react-icons/bs'
import { GiArchiveRegister } from 'react-icons/gi'
import { FaShoppingCart } from 'react-icons/fa';
import { Box, Button, Modal, Typography } from '@mui/material';
import { FaFileInvoiceDollar } from "react-icons/fa";
const Sidebar = () => {


  const params = useParams()
  const page = window.location.pathname
  // console.log(window.location.href)

  let { Nulluser } = useContext(AuthContext)
  const navigate = useNavigate()
  const logout = () => {
    navigate('/login')
    Nulluser()
  }

  let [borderb, setborderb] = useState({
    home: false,
    worker: false,
    Adddata: false

  })

  const homeborder = () => {
    setborderb({
      home: true,
      worker: false,
      Adddata: false

    })
  }

  const workerborder = () => {
    setborderb({
      home: false,
      worker: true,
      Adddata: false

    })
  }

  const adddataborder = () => {
    setborderb({
      home: false,
      worker: false,
      Adddata: true

    })
  }
  console.log(window.location.pathname)

  const [deleteaccount, setDeleteaccount] = useState(false);
  const handledelete=()=>{
    setDeleteaccount(!deleteaccount)
  }
  let handleinvoice = () =>{ 
    window.open("https://tangerine-stardust-d0de91.netlify.app/", "_blank");
  }
  return (
    <>
    <div className='w-[215px] border h-[125vh]'>
      <div className=' flex flex-col items-center h-[130px] w-[210px]  mt-4 '>
        <img src={logo} alt={logo} className='h-[100px] w-[130px] ' />
        {/* <BsBuilding className='h-[50px] w-[50px] text-[#35A1CC]' />*/}
        <h2 className='text-lg font-bold mt-2 text-[#35A1CC]'>Mr. Pool Tech</h2>
      </div>
      <NavLink to='/'>

        <div className='flex w-[85%] ml-[20px] mt-[60px] items-center p-1' style={page === '/' || page === "/newproject" || page === "/maintenance" || page === "/repairing" || page === "/otherproject" || page === "/newinput" || page?.includes("/update/") || page === "/maintenceInput" || page?.includes("/maintenceupdate/") || page === "/repareInput" || page?.includes("/repareupdate/") || page === "/otherprojectinput" || page?.includes("/otherprojectinput1/")   ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null} >
          <FaHome className='text-2xl ml-2  ' style={page === '/' || page === "/newproject" || page === "/maintenance" || page === "/repairing" || page === "/otherproject" || page === "/newinput" || page?.includes("/update/") || page === "/maintenceInput" || page?.includes("/maintenceupdate/") || page === "/repareInput" || page?.includes("/repareupdate/") || page === "/otherprojectinput" || page?.includes("/otherprojectinput1/") ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-1 text-lg  mt-1' style={page === '/' || page === "/newproject" || page === "/maintenance" || page === "/repairing" || page === "/otherproject" || page === "/newinput" || page?.includes("/update/") || page === "/maintenceInput" || page?.includes("/maintenceupdate/") || page === "/repareInput" || page?.includes("/repareupdate/") || page === "/otherprojectinput" || page?.includes("/otherprojectinput1/") ? { color: 'white' } : { color: '#35A1CC' }}>All Projects</h2>
        </div>
        {/* <div className='w-[50px] mt-1 bg-[#35A1CC] h-1'></div> */}

      </NavLink>

    
      <NavLink to='/workertype'>
        <div className='flex w-[85%] ml-[20px] mt-[24px] items-center p-1' style={page === '/workertype' || page === "/Permanentworkers" || page === "/Visitingworkers" || page === "/otherworker" || page?.includes("/singleWorker/") || page?.includes("/singleVister/") || page?.includes("/singleotherworker/") || page === "/addnewWorker" || page?.includes("/updateworker/") || page === "/addnewVisterWorker" || page?.includes("/updateVister/") || page === "/AddnewOtherworker" || page?.includes("/updateotherworker/")   ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null}>
          <BsPeopleFill className='text-2xl ml-2 ' style={page === '/workertype' || page === "/Permanentworkers" || page === "/Visitingworkers" || page === "/otherworker" || page?.includes("/singleWorker/") || page?.includes("/singleVister/") || page?.includes("/singleotherworker/") || page === "/addnewWorker" || page?.includes("/updateworker/") || page === "/addnewVisterWorker" || page?.includes("/updateVister/") || page === "/AddnewOtherworker" || page?.includes("/updateotherworker/") ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-1 text-lg  ' style={page === '/workertype' || page === "/Permanentworkers" || page === "/Visitingworkers" || page === "/otherworker" || page?.includes("/singleWorker/") || page?.includes("/singleVister/") || page?.includes("/singleotherworker/") || page === "/addnewWorker" || page?.includes("/updateworker/") || page === "/addnewVisterWorker" || page?.includes("/updateVister/") || page === "/AddnewOtherworker" || page?.includes("/updateotherworker/") ? { color: 'white' } : { color: '#35A1CC' }}>All Workers</h2>
        </div>
      </NavLink>

      <NavLink to='/attendance'>
        <div className='flex w-[85%] ml-[20px] mt-[24px] items-center p-1' style={page === '/attendance' ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null}>
          <GiArchiveRegister className='text-2xl ml-2 ' style={page === '/attendance' ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-2 text-lg  ' style={page === '/attendance' ? { color: 'white' } : { color: '#35A1CC' }}>Attendance</h2>
        </div>
      </NavLink>

      <NavLink to='/allproducts'>
        <div className='flex w-[85%] ml-[20px] mt-[24px] items-center p-1' style={page === '/allproducts' || page === "/addproducts" || page?.includes("/editproduct/") ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null}>
          <FaShoppingCart className='text-2xl ml-2 ' style={page === '/allproducts' || page === "/addproducts" || page?.includes("/editproduct/") ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-2 text-lg  ' style={page === '/allproducts' || page === "/addproducts" || page?.includes("/editproduct/") ? { color: 'white' } : { color: '#35A1CC' }}>Products</h2>
        </div>
      </NavLink>
     
      <div onClick={()=>handleinvoice()} className='flex cursor-pointer w-[85%] ml-[20px] mt-[24px] items-center p-1' >
        <FaFileInvoiceDollar className='text-2xl ml-2  text-[#35A1CC] '  />
        <h2 className=' ml-2 text-lg  text-[#35A1CC] ' >Invoice</h2>
      </div>






      <div className='w-[190px] border-t  mt-[80px]'>
        <div className='ml-[45px] mt-4'>
        
          <button className='h-[40px] w-[90px] bg-[#f44336] rounded-md text-white mt-5' onClick={() => { return handledelete() }}>Log Out</button>
          {/* <h2 className='mt-3 cursor-pointer' onClick={logout} >Log Out</h2> */}

        </div>

      </div>

    </div>
        <Modal open={deleteaccount} onClose={handledelete}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
     outline:"none",
     borderRadius:"10px",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography variant="h6" component="h2" >
        Are you sure you want to logout this account?
      </Typography>
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="outlined" className='bg-[#0B6E99] text-white mr-5' onClick={handledelete}>
          No
        </Button>
        <Button variant="contained" className='bg-[#0B6E99]' onClick={() => { return logout() }} >
        Yes
      </Button>
      </Box>
    </Box>
  </Modal>
    </>
  )
}

export default Sidebar
