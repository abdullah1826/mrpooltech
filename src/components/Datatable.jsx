import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { db, auth } from '../Firbase';
import upper from '../imgs/pooltecuper.jpeg';
import lower from '../imgs/poolteclower.jpeg';
import { useNavigate } from 'react-router-dom';
import Widgets from './Widgets';
import { Model } from './Model';
import { getDatabase, set, ref, update, push, onValue, remove } from 'firebase/database';
import { ModalContext } from '../context/Modalcontext';
const Datatable = () => {

  const [mylist, setmylist] = useState([]);
  const [search, setsearch] = useState('');
  const [filtered, setfiltered] = useState([]);
  const navigate = useNavigate();
  // const [showmodal, setshowmodal] = useState(false);
  const [delid, setdelid] = useState('');

  let { showmodal, deletemodal } = useContext(ModalContext)


  const handleDelete = () => {
    remove(ref(db, `/userdata/${delid}`))
    setdelid('')
  }


  let modalseter = (id) => {
    showmodal()
    setdelid(id)
  }

  // let hidemodal = () => {
  //   setshowmodal(false)
  //   setdelid('')
  // }




  // ------------------------geting the user data from firebase---------------------

  useEffect(() => {
    let getingdata = async () => {

      const starCountRef = ref(db, '/userdata');
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
      return user.sideName.toLowerCase().match(search.toLowerCase()) || user.area.toLowerCase().match(search.toLowerCase()) || user.phase.toLowerCase().match(search.toLowerCase());

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
      update(ref(db, `/userdata/${id}`), { status: false })
    }
    else {
      update(ref(db, `/userdata/${id}`), { status: true })
    }
  }
  const Editdata = (id) => {
    navigate(`/update/${id}`)
  }


  // const handleDelete = (id) => {
  //   //  try {
  //   remove(ref(db, `/userdata/${id}`))
  // }

  let sr = 0;

  const columns = [
    {
      name: "Sr",
      selector: (_, index) => index + 1,
      sortable: false,
      width: "60px"
    },
    // { name: 'Sr', cell: (row) => { sr += 0.5; return sr }, sortable: true, width: '60px', },
    { name: 'Site Name', selector: (row) => { return row.sideName }, sortable: true, width: '120px' },
    { name: 'Area', selector: (row) => { return row.area }, sortable: true, },
    { name: 'Phase', selector: (row) => { return row.phase }, sortable: true, width: '80px' },
    { name: 'Owner', selector: (row) => { return row.ownerName }, sortable: true, width: '90px' },
    { name: 'Owner Mobile', selector: (row) => { return row.ownerMobile }, sortable: true, width: '150px' },
    { name: 'Worker', selector: (row) => { return row.manager }, sortable: true, },
    { name: 'Worker Mobile', selector: (row) => { return row.mobileManager }, sortable: true, width: '150px' },
    { name: 'Operator', selector: (row) => { return row.operater }, sortable: true, },
    { name: 'Referance', selector: (row) => { return row.reference }, sortable: true, width: '120px' },
    { name: 'Amount', selector: (row) => { return row.amount }, sortable: true, },
    // { name: 'Status', selector: (row) => { return row.email }, sortable: true, width: '80px' },
    { name: 'Active Date', selector: (row) => { return row.activeDate }, sortable: true, width: '120px' },
    { name: 'InActive Date', selector: (row) => { return row.inactiveDate }, sortable: true, width: '120px' },
    { name: 'Creation Date', selector: (row) => { return row.creationDate }, sortable: true, width: '130px' },
    // { name: 'Age', selector: 'age', sortable: true ,},
    { name: 'Actions', cell: (row) => (<div className='flex '><button className='h-[40px] w-[70px] border bg-[#35A1CC] rounded-md text-white mr-2' onClick={() => Editdata(row.id)}>Edit</button> <button className='h-[40px] w-[70px] border bg-[#f44336] rounded-md text-white' onClick={() => { return modalseter(row.id) }}>Delete</button></div>), width: '175px' },
    { name: 'Status', cell: (row) => row.status === true ? (<div className='h-[24px] w-[45px] bg-[#35A1CC] rounded-xl relative'><div className='h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border right-[-1px]' onClick={() => { return toglesetter(row.status, row.id) }} ></div></div>) : (<div className='h-[24px] w-[45px] bg-[#707070] rounded-xl relative'><div className='h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border left-[-1px]' onClick={() => { return toglesetter(row.status, row.id) }}></div></div>) },

  ];

  let delmsg = 'Are you sure to delete this field ??';

  return (
    <>
      {deletemodal && <Model delfunc={handleDelete} msg={delmsg} />}
      <img src={upper} />
      <div className='w-[100%]  ml-[45px] mt-[60px] relative'>
        <Widgets />
        {/* <h2 className='text-xl font-[500]] mb-[20px]'>{`All users[${mylist.length}]`}</h2> */}
        <div className='border' >
          <DataTable columns={columns} data={filtered} style={{ width: '1200px' }} wrapperStyle={{ backgroundColor: '#DAECF3' }} pagination fixedHeader subHeader subHeaderComponent={<div className=' h-[70px]'><h2 className='text-xl  font-[450]'>Search</h2> <input type='search' placeholder='Search here' className=' h-[25px] w-[310px] border-b-[1px]   p-1 outline-none placeholder:text-sm' value={search} onChange={(e) => { setsearch(e.target.value) }} /> </div>} subHeaderAlign='left' />
        </div>
        <br />

      </div>
      {/* <img src={lower} /> */}
    </>
  )
}

export default Datatable
