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
import { Button, Modal, Typography, Box } from '@mui/material';
const Maintence = () => {

    const [mylist, setmylist] = useState([]);
    const [search, setsearch] = useState('');
    const [filtered, setfiltered] = useState([]);
    const navigate = useNavigate();
    // const [showmodal, setshowmodal] = useState(false);
    const [delid, setdelid] = useState('');
  
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

      remove(ref(db, `/Maintenance/${delid}`))
      setdelid('')
      updateLinks();
      setModal(false);
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
  
        const starCountRef = ref(db, '/Maintenance');
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
        update(ref(db, `/Maintenance/${id}`), { status: false })
      }
      else {
        update(ref(db, `/Maintenance/${id}`), { status: true })
      }
    }
    const Editdata = (id) => {
      navigate(`/maintenceupdate/${id}`)
    }
  
  
    // const handleDelete = (id) => {
    //   //  try {
    //   remove(ref(db, `/userdata/${id}`))
    // }
  
console.log(mylist)

    let sr = 0;
  
    const columns = [
      {
        name: "Sr",
        selector: (_, index) => index + 1,
        sortable: false,
        width: "60px"
      },
      // { name: 'Sr', cell: (row) => { sr += 0.5; return sr }, sortable: true, width: '60px', },
      { name: 'Site Number', selector: (row) => { return row.site }, sortable: true, width: '120px' },
      { name: 'Area', selector: (row) => { return row.area }, sortable: true, },
      { name: 'Attendant', selector: (row) => { return row.attendant}, sortable: true, width: '120px' },
      { name: 'Pool size', selector: (row) => { return row.poolSize}, sortable: true,width: '100px' },
      { name: 'Attendant phone', selector: (row) => { return row.attendantPhone}, sortable: true,width: '130px' },
      { name: 'Owner', selector: (row) => { return row.owner }, sortable: true, width: '120px' },
      { name: 'Owner Mobile', selector: (row) => { return row.ownerMobile }, sortable: true, width: '150px' },
      { name: 'Operator', selector: (row) => { return row.operater}, sortable: true,width: '100px' },
      { name: 'referance', selector: (row) => { return row.referance}, sortable: true,width: '100px' },
      { name: 'Amount', selector: (row) => { return row.poolSize }, sortable: true, width: '150px' },
    //   { name: 'Amount', selector: (row) => { return row.amount }, sortable: true, },
      // { name: 'Status', selector: (row) => { return row.email }, sortable: true, width: '80px' },
      { name: 'Active Date', selector: (row) => { return row.activeDate }, sortable: true, width: '120px' },
      { name: 'InActive Date', selector: (row) => { return row.inactiveDate }, sortable: true, width: '120px' },
    //   { name: 'Creation Date', selector: (row) => { return row.creationDate }, sortable: true, width: '130px' },
      // { name: 'Age', selector: 'age', sortable: true ,},
      { name: 'Actions', cell: (row) => (<div className='flex '><button className='h-[40px] w-[70px] border bg-[#35A1CC] rounded-md text-white mr-2' onClick={() => Editdata(row.id)}>Edit</button> <button className='h-[40px] w-[70px] border bg-[#f44336] rounded-md text-white' onClick={() => { return modalseter(row.id) }}>Delete</button></div>), width: '175px' },
      { name: 'Status', cell: (row) => row.status === true ? (<div className='h-[24px] w-[45px] bg-[#35A1CC] rounded-xl relative'><div className='h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border right-[-1px]' onClick={() => { return toglesetter(row.status, row.id) }} ></div></div>) : (<div className='h-[24px] w-[45px] bg-[#707070] rounded-xl relative'><div className='h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border left-[-1px]' onClick={() => { return toglesetter(row.status, row.id) }}></div></div>) },
  
    ];
  
    let delmsg = 'Are you sure to delete this field ??';



  return (
    <>
    <div className='flex w-[100%]'>
<Sidebar/>

<div className='w-[79%]  ml-[45px] mt-[30px] relative'>
<div class="w-[100%] flex justify-center mb-5"><h2 class="text-4xl font-[500]  text-[#0b6e99]">Maintenance Projects</h2></div>

<div className='w-max h-max'>
<h2 class="text-2xl font-[500] ml-[50px] text-[#0b6e99]">Overview</h2>
<Widgets mylist={mylist}/>
</div>

<div class="flex absolute z-10 right-6 mt-3"><Link to="/maintenceInput"><div class="h-[45px] border w-[180px]  rounded-xl  flex justify-center items-center bg-[#35A1CC] text-white cursor-pointer">Add new data +</div></Link></div>
<div className='border' >
          <DataTable columns={columns} data={filtered} style={{ width: '1200px' }} wrapperStyle={{ backgroundColor: '#DAECF3' }} pagination fixedHeader subHeader subHeaderComponent={<div className=' h-[70px]'><h2 className='text-xl  font-[450]'>Search</h2> <input type='search' placeholder='Search here' className=' h-[25px] w-[310px] border-b-[1px]   p-1 outline-none placeholder:text-sm' value={search} onChange={(e) => { setsearch(e.target.value) }} /> </div>} subHeaderAlign='left' />
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
      <Typography variant="h6" component="h2" gutterBottom>
        Are you sure you want to delete this member?
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={handleclose} color="primary" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </Box>
    </Box>
  </Modal>
    </>
  )
}

export default Maintence