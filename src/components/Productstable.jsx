import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios';
import { db, auth } from '../Firbase';
import upper from '../imgs/pooltecuper.jpeg';
import lower from '../imgs/poolteclower.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import Widgets from './Widgets';
import { Model } from './Model';
import { getDatabase, set, ref, update, push, onValue, remove } from 'firebase/database';
import Sidebar from './Sidebar';
import { ModalContext } from '../context/Modalcontext';
import { Descriptionmodal } from './Descriptionmodal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Productstable = () => {


    let { showmodal, deletemodal } = useContext(ModalContext)
    const [mylist, setmylist] = useState([]);
    const [search, setsearch] = useState('');
    const [filtered, setfiltered] = useState([]);
    const navigate = useNavigate();
    let { productData, setproductData } = useContext(ModalContext)
    const [showmodal2, setshowmodal] = useState(false);
    const [delid, setdelid] = useState('');

    // let { showmodal, deletemodal } = useContext(ModalContext)
    let [mydescription, setmydescription] = useState('')
    // let [showmodal, setshowmodal] = useState(false)

    let updateLinks = () => {
        if (mylist?.length === 1) {
            setmylist([]);
            setfiltered([]);
        }
      };

    const handleDelete = () => {
        remove(ref(db, `/products/${delid}`))
        updateLinks()
        toast.success("Product delete successfuly!")
    }

    let modalseter = (id) => {
        showmodal()
        setdelid(id)
    }




    // --------------------------geting the user data from firebase------------------------

    useEffect(() => {
        let getingdata = async () => {

            const starCountRef = ref(db, '/products');
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
            return user.productName.toLowerCase().match(search.toLowerCase())

        })

        setfiltered(result);
    }, [search])









    console.log('list', mylist)

    const Editdata = (id) => {
        navigate(`/editproduct/${id}`)
    }



    let showdescription = (description) => {
        setmydescription(description)
        setshowmodal(true)
    }

    let hisedescription = () => {
        setmydescription('')
        setshowmodal(false)
    }


    let [rows, setrows] = useState([])
    let [myrow, setmyrow] = useState([])
    let handleSelected = ({ selectedRows }) => {
        selectedRows.forEach((item) => {
            if (!item.qty) {
                item.qty = 1;
            }
            localStorage.setItem(`${item.id}`, `${item.price}`);
        });
        setrows(selectedRows);
        setproductData(selectedRows);
        setmyrow(selectedRows);
    };
    console.log(myrow)
    let [qty, setqty] = useState(1)

    let calculatingProducts = (id, operation) => {
        const updatedProductData = productData.map((item) => {
            if (item.id === id) {
                let currentQty = item.qty || 1;
                if (operation === 'plus') {
                    item.qty = currentQty + 1;
                    item.price = parseInt(item.price) + parseInt(localStorage.getItem(`${item.id}`));
                } else if (operation === 'minus' && currentQty > 1) {
                    item.qty = currentQty - 1;
                    item.price = parseInt(item.price) - parseInt(localStorage.getItem(`${item.id}`));
                }
            }
            return item;
        });

        setproductData(updatedProductData);
    };





    let sr = 0;



    const columns = [
        {
            name: "Sr",
            selector: (_, index) => index + 1,
            sortable: false,
            width: "60px"
        },
        // { name: 'Sr', cell: (row) => { sr += 0.5; return sr }, sortable: true, },
        { name: 'Product name', selector: (row) => { return row.productName }, sortable: true, width: '150px' },
        { name: 'price', selector: (row) => { return row.price===""?0:row.price }, sortable: true, },
        { name: 'Image', selector: (row) => (<img src={row.imgUrl?row.imgUrl:"https://placehold.co/45"} className='h-[40px] w-[40px] object-cover' />), sortable: true, },
        rows.length > 0 && { 
            name: 'Quantity', 
            selector: (row) => (
                <div className='h-[50px] w-[70px] flex items-center justify-between'>
                    <div className='h-[20px] w-[20px] flex justify-center items-center text-xl cursor-pointer bg-[#35A1CC] rounded-[4px] text-white' onClick={() => calculatingProducts(row.id, 'minus')}>-</div> 
                    <div className='h-[20px] w-[20px] flex justify-center items-center text-lg '>{row.qty || 1}</div>
                    <div className='h-[20px] w-[20px] flex justify-center items-center text-xl cursor-pointer bg-[#35A1CC] rounded-[4px] text-white' onClick={() => calculatingProducts(row.id, 'plus')}>+</div>
                </div>
            ), 
        },
        // <input type="number" className='border-none outline-none' placeholder='1' onChange={(e) => calculatingProducts(row.id, e.target.value)} />
        { name: 'Description', cell: (row) => (<div className='flex '><button className='h-[40px] w-[70px] border bg-[#35A1CC] rounded-md text-white mr-2' onClick={() => showdescription(row.description)}>View</button></div>), width: '175px' },
        { name: 'Actions', cell: (row) => (<div className='flex '><button className='h-[40px] w-[70px] border bg-[#35A1CC] rounded-md text-white mr-2' onClick={() => Editdata(row.id)}>Edit</button> <button className='h-[40px] w-[70px] border bg-[#f44336] rounded-md text-white' onClick={() => { return modalseter(row.id) }}>Delete</button></div>), width: '175px' },

        // { name: 'Status', cell: (row) => row.status === true ? (<div className='h-[24px] w-[45px] bg-[#35A1CC] rounded-xl relative'><div className='h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border right-[-1px]' onClick={() => { return toglesetter(row.status, row.id) }} ></div></div>) : (<div className='h-[24px] w-[45px] bg-[#707070] rounded-xl relative'><div className='h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border left-[-1px]' onClick={() => { return toglesetter(row.status, row.id) }}></div></div>) },

    ];

    let delmsg = 'Are you sure to delete this product ?'
    return (
        <>{deletemodal && <Model delfunc={handleDelete} msg={delmsg} />}
            <div className='flex w-[100%]'>
                <Sidebar />
                <div className='relative h-[125vh] overflow-x-auto w-[90%]'>
                    {showmodal2 && <Descriptionmodal description={mydescription} hidemodal={hisedescription} />}

                    <img src={upper} />
                    <div className='absolute right-5 flex w-[100%] justify-end'>
                        {rows.length > 0 && <Link to='/invoice'><div className='h-[45px] border w-[110px] mr-5  flex justify-center items-center bg-[#35A1CC] text-white cursor-pointer rounded-lg'>Create Invoice</div></Link>}
                        <Link to='/addproducts'><div className='h-[45px] border w-[210px]  flex justify-center items-center bg-[#35A1CC] text-white cursor-pointer rounded-lg'>Add new Product +</div></Link>
                    </div>

                    <div className='w-[95%]  ml-[45px] mt-[60px] relative'>
                        <div className='border' >
                            <DataTable columns={columns} data={filtered} style={{ width: '1200px' }} wrapperStyle={{ backgroundColor: '#DAECF3' }} pagination fixedHeader subHeader subHeaderComponent={<div className=' h-[70px]'><h2 className='text-xl  font-[450]'>Search</h2> <input type='search' placeholder='Search here' className=' h-[25px] w-[310px] border-b-[1px]   p-1 outline-none placeholder:text-sm' value={search} onChange={(e) => { setsearch(e.target.value) }} /> </div>} subHeaderAlign='left' selectableRows={true} onSelectedRowsChange={handleSelected} />
                        </div>
                        <br />

                    </div>
                    {/* <img src={lower} /> */}
                </div>
            </div>
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
        </>
    )
}



export default Productstable