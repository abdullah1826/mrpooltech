import React from 'react'
import Sidebar from '../../components/Sidebar'
import { onValue, ref, remove, update } from 'firebase/database';
import { db } from '../../Firbase';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Widgets from '../../components/Widgets'
import { ModalContext } from '../../context/Modalcontext';
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Modal, Typography, Box, IconButton } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
const Otherproject = () => {

    const [mylist, setmylist] = useState([]);
    const [search, setsearch] = useState('');
    const [filtered, setfiltered] = useState([]);
    const navigate = useNavigate();
    // const [showmodal, setshowmodal] = useState(false);
    const [delid, setdelid] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [modal1, setModal1] = useState(false);
    const viewUserData = (row) => {
      setSelectedUser(row);
      setModal1(true);
  };
    const handleCloseModal = () => {
      setSelectedUser(null);
      setModal1(false);
  };



    let { showmodal, deletemodal } = useContext(ModalContext)
    const [modal, setModal] = useState(false);
    console.log(mylist)
    let updateLinks = () => {
        if (mylist?.length === 1) {
            setmylist([]);
            setfiltered([]);
        }
      };
    const handleDelete = () => {

      remove(ref(db, `/OtherProjects/${delid}`))
      setdelid('')
      updateLinks();
      setModal(false);
      toast.success("Record delete successfully!")
    }
    const handleclose = () => {
        setModal(false);
    }
  
  
    let modalseter = (id) => {
        setModal(true);
      setdelid(id)
    }
  
    // let hidemodal = () => {
    //   setshowmodal(false)
    //   setdelid('')
    // }
  
  
  
  
    // ------------------------geting data from firebase---------------------
  
    useEffect(() => {
      let getingdata = async () => {
  
        const starCountRef = ref(db, '/OtherProjects');
        onValue(starCountRef, async (snapshot) => {
          const data = await snapshot.val();
          //  console.log(data)
          MediaKeyStatusMap
          setmylist(Object.values(data))
          setfiltered(Object.values(data))
  
          // updateStarCount(postElement, data);
        });
      }
  
      getingdata();
  
  
    }, [])
  
  
    //----------------------Filtering the userdata (search functionality)--------------------
  
    useEffect(() => {
      const result = mylist.filter((user) => {
        return user.owner.toLowerCase().match(search.toLowerCase()) || user.area.toLowerCase().match(search.toLowerCase()) || user.site.toLowerCase().match(search.toLowerCase());
  
      })
  
      setfiltered(result);
    }, [search])
  
  
  
  
  
  
  
  
  
    console.log('list', mylist)
  
    // const handleDelete = (id) => {
    //   //  try {
    //   remove(ref(db, `users/${id}`))
    // }
  
  
    let [toggle, settoggle] = useState([])
    let toglesetter = (status, id) => {
      // let togllearay = toggle.slice()
      // let index = togllearay.indexOf(id)
      if (status === true) {
        update(ref(db, `/OtherProjects/${id}`), { status: false })
      }
      else {
        update(ref(db, `/OtherProjects/${id}`), { status: true })
      }
    }
    const Editdata = (id) => {
      navigate(`/otherprojectinput1/${id}`)
    }
  
  
    // const handleDelete = (id) => {
    //   //  try {
    //   remove(ref(db, `/userdata/${id}`))
    // }
  
console.log(selectedUser)

    let sr = 0;
  
    const columns = [
      {
        name: "Sr",
        selector: (_, index) => index + 1,
        sortable: false,
        width: "60px"
      },
      // { name: 'Sr', cell: (row) => { sr += 0.5; return sr }, sortable: true, width: '60px', },
      { name: 'Site', selector: (row) => { return row.site }, sortable: true, width: '120px' },
      { name: 'Area', selector: (row) => { return row.area }, sortable: true,width:"120px" },
      { name: 'Owner', selector: (row) => { return row.owner }, sortable: true, width: '120px' },
      { name: 'Project type', selector: (row) => { return row.projectType}, sortable: true,width: '130px' },
    //   { name: 'Amount', selector: (row) => { return row.amount }, sortable: true, },
      // { name: 'Status', selector: (row) => { return row.email }, sortable: true, width: '80px' },
      { name: ' Worker', selector: (row) => { return row.worker}, sortable: true,width: '120px' },

    //   { name: 'Creation Date', selector: (row) => { return row.creationDate }, sortable: true, width: '130px' },
      // { name: 'Age', selector: 'age', sortable: true ,},
      { name: 'Actions', cell: (row) => (<div className='flex '><button className='h-[40px] w-[70px] border bg-[#35A1CC] rounded-md text-white mr-2' onClick={() => viewUserData(row)}>View</button><button className='h-[40px] w-[70px] border bg-[#35A1CC] rounded-md text-white mr-2' onClick={() => Editdata(row.id)}>Edit</button> <button className='h-[40px] w-[70px] border bg-[#f44336] rounded-md text-white' onClick={() => { return modalseter(row.id) }}>Delete</button></div>), width: '240px' },
      { name: 'Status', cell: (row) => row.status === true ? (<div className='h-[24px] w-[45px] bg-[#35A1CC] rounded-xl relative'><div className='h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border right-[-1px]' onClick={() => { return toglesetter(row.status, row.id) }} ></div></div>) : (<div className='h-[24px] w-[45px] bg-[#707070] rounded-xl relative'><div className='h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border left-[-1px]' onClick={() => { return toglesetter(row.status, row.id) }}></div></div>) },
  
    ];
  
    let delmsg = 'Are you sure to delete this field ??';



  return (
    <>
    <div className='flex w-[100%]'>
<Sidebar/>

<div className='w-[79%] h-[120vh] overflow-x-auto   ml-[20px] mt-[30px] relative'>
<div class="w-[100%] flex justify-center mb-5"><h2 class="text-4xl font-[500]  text-[#0b6e99]">Other Projects</h2></div>

<div className='w-max h-max'>
<h2 class="text-2xl font-[500] ml-[50px] text-[#0b6e99]">Overview</h2>
<Widgets mylist={mylist}/>
</div>

<div class="flex absolute z-10 right-6 mt-3"><Link to="/otherprojectinput"><div class="h-[45px] border w-[180px]  rounded-xl  flex justify-center items-center bg-[#35A1CC] text-white cursor-pointer">Add new site +</div></Link></div>
<div className='border' >
          <DataTable columns={columns} data={filtered} style={{ width: '1200px' }} wrapperStyle={{ backgroundColor: '#DAECF3' }} pagination fixedHeader subHeader subHeaderComponent={<div className=' h-[70px]'><h2 className='text-[17px]'>Search</h2> <input type='search' placeholder='Search here' className=' h-[25px] w-[310px] border-b-[1px]   p-1 outline-none placeholder:text-sm' value={search} onChange={(e) => { setsearch(e.target.value) }} /> </div>} subHeaderAlign='left' />
        </div>
</div>
    </div>
    <Modal open={modal} onClose={handleclose}>
    <Box
      sx={{
        position: 'absolute',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
    <div className='fixed top-0 bottom-0 right-0 left-0' style={{ backgroundColor: 'rgba(189,189,189,0.9) ', zIndex: '10' }}>
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '25rem', backgroundColor: '#fff', display: 'flex', justifyContent: "center", alignItems: 'center', flexDirection: 'column', height: '100px' }}>
        <h1>Are you sure you want to delete this member?</h1>

        <div className=' flex w-[185px] justify-between mt-3'>
            <button className='border flex justify-center items-center w-[75px] h-[30px]  text-white bg-[#35A1CC] rounded-md' onClick={() => handleclose()}>Cancel</button>
            <button className='border flex justify-center items-center w-[75px] h-[30px]  text-white bg-red-600 rounded-md' onClick={() => handleDelete()}>Yes</button>
        </div>
    </div>
</div>
    </Box>
  </Modal>
  <ToastContainer
  position="top-center"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
  />
  <Modal open={modal1} onClose={handleCloseModal}>
  <Box
  sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'white',
    borderRadius: '5px',
    background: '#FFF',
    outline: 'none',
    boxShadow: 24,
    maxHeight: "90vh",
    overflowY: "auto",
    
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }}>
  <IconButton
  aria-label="close"
  onClick={handleCloseModal}
  sx={{
    position: 'absolute',
    top: 22,
    right: 18,
    width: '24px',
   height: '24px',
  background: '#ECECEC',
  }}
  >
  <CloseIcon />
  </IconButton>
      {selectedUser && (
          <>
          <div className='flex justify-start items-center flex-col w-[100%]'>
          <div className=' flex justify-start items-center w-[90%] '>
              <Typography variant='h5' className='mt-5 mb-5' gutterBottom>
                Project details
              </Typography>
              </div>
              <div className=' flex justify-start items-center gap-4 flex-wrap w-[90%] '>
              <div className='flex  items-center w-[46%]'>  <p className='font-[450] text-[14px] mr-2 flex  items-center '>Worker Name:</p><span className='text-[13px]'>{selectedUser.worker}</span></div>
              <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Site:</p><span className='text-[13px]'>{selectedUser.site}</span></div>
              <div className='flex  items-center  w-[46%]'>  <p className='font-[450] text-[14px] mr-2 flex  items-center '>Area :</p><span className='text-[13px]'>{selectedUser.area}</span></div>
              <div className='flex  items-center  w-[46%]'>  <p className='font-[450] text-[14px] mr-2 flex  items-center '>Owner :</p><span className='text-[13px]'>{selectedUser.owner}</span></div>
              <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Owner Mobile:</p><span className='text-[13px]'>{selectedUser.ownerMobile}</span></div>
              <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Project Type:</p><span className='text-[13px]'>{selectedUser.projectType}</span></div>
              <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Worker Amount :</p><span className='text-[13px]'>{selectedUser.workerAmount}</span></div>
              <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Qoutation:</p><span className='text-[13px]'>{selectedUser.qoutation}</span></div>
              <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Our Cost:</p><span className='text-[13px]'>{selectedUser.ourCost}</span></div>
              <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Start Project:</p><span className='text-[13px]'>{selectedUser.activeDate}</span></div>
              <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Complete Project:</p><span className='text-[13px]'>{selectedUser.inactiveDate}</span></div>
                 </div>
       </div>
       <br></br>
          </>
      )}
  </Box>
  </Modal>
    </>
  )
}

export default Otherproject