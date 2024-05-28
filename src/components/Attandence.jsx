import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import DataTable from 'react-data-table-component';
import upper from '../imgs/pooltecuper.jpeg';
import { onValue, ref } from 'firebase/database';
import { db } from '../Firbase';
import { Locationmodel } from './Locationmodal';


const Attandence = () => {

    let [mylist, setmylist] = useState([])
    const [search, setsearch] = useState('');
    const [filtered, setfiltered] = useState([]);
    const [datefiltered, setdatefiltered] = useState([]);
    let [loc, setloc] = useState('')
    let [showmod, setshowmod] = useState(false)
    let [date, setdate] = useState('');
    const [selectedDate, setSelectedDate] = useState("");

    // const formatDate = (e) => {
    //     setSelectedDate(e)
    //     const dateObj = new Date(selectedDate);
    //     const options = {
    //         month: "long",
    //         day: "numeric",
    //         year: "numeric",
    //     };
    //     return dateObj.toLocaleDateString('en-US', options);
    // };

    useEffect(() => {
        let getingdata = async () => {

            const starCountRef = ref(db, '/attendance');
            onValue(starCountRef, async (snapshot) => {
                const data = await snapshot.val();
                //  console.log(data)
                MediaKeyStatusMap
                setmylist(Object.values(data))
                // setmylist(data)
                setfiltered(Object.values(data))

                // updateStarCount(postElement, data);
            });
        }

        getingdata();


    }, [])

    const fetchData = () => {
        const starCountRef = ref(db, '/attendance');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setmylist(Object.values(data));
            setfiltered(Object.values(data));
       
        });
    };

    useEffect(() => {
        fetchData();
    }, []);
    const refreshData = () => {
        fetchData();
        setSelectedDate("")
        setsearch("")
    };

    let showLocation = (id) => {
        const starCountRef = ref(db, `attendance/${id}`);
        onValue(starCountRef, async (snapshot) => {
            const data = await snapshot.val();
            setloc(data)

            // updateStarCount(postElement, data);
        });
        setshowmod(true)
    }

    let hidemodal = () => {
        setshowmod(false)
    }
    console.log(mylist)

  
    useEffect(() => {
        const result = mylist?.filter((user) => {
            return user?.name?.toLowerCase().match(search.toLowerCase()) || user?.date?.toLowerCase().match(search.toLowerCase())
            // || user.email.toLowerCase().match(search.toLowerCase()) || user.cnic.toLowerCase().match(search.toLowerCase());

        })

        setfiltered(result);
    }, [search])


    useEffect(() => {
        const result = mylist?.filter((user) => {
            return user?.filterdate?.match(selectedDate)
            // || user.email.toLowerCase().match(search.toLowerCase()) || user.cnic.toLowerCase().match(search.toLowerCase());

        })

        setfiltered(result);
    }, [selectedDate])

  


    const columns = [
        {
            name: "#",
            selector: (_, index) => index + 1,
            sortable: false,
            width: "50px"
        },
        // { name: 'Sr', cell: (row) => { sr += 0.5; return sr }, sortable: true, },
        { name: 'Worker name', selector: (row) => { return row.name }, sortable: true, width: '150px' },
        { name: 'Date', selector: (row) => { return row.date }, sortable: true, },
        { name: 'Image', selector: (row) => (<img src={row.imageUrl?row.imageUrl:"https://placehold.co/45"} className='h-[40px] w-[40px] object-cover' />), sortable: true, },
        { name: 'Time in', selector: (row) => { return row.timein }, sortable: true, },
        { name: 'Time out', selector: (row) => { return row.timeout }, sortable: true, },
        // { name: 'Locations', selector: (row) => { return row.phone }, sortable: true, },
        { name: 'Locations', cell: (row) => (<div className='flex '><button className='h-[40px] w-[70px] border bg-[#35A1CC] rounded-md text-white mr-2' onClick={() => showLocation(row.id)}>Locations</button></div>), width: '175px' },
        // onClick={() => Editdata(row.id)}
        // { name: 'View', cell: (row) => (<div className='flex '><button className='h-[40px] w-[70px] border bg-[#35A1CC] rounded-md text-white mr-2' onClick={() => view(row.id)}>View</button></div>), width: '175px' },


    ];



    return (
        <>
            {showmod && <Locationmodel checkinloc={loc.checkinLocation} checkoutloc={loc.checkoutLocation} hidemod={hidemodal} />}
            <div className='flex w-[100%]'>
                <Sidebar />
                <div className='relative  h-[125vh] overflow-x-auto w-[88%]'>
                    {/* {deletemodal && <Model delfunc={handleDelete} msg={delmsg} />} */}
                    <img src={upper} />
                    <div className='w-[95%]  ml-[45px] mt-[60px] relative'>
                        <div className='border relative w-[100%]' >

                            {/* <select className=' bg-white w-[150px] outline-none border border-black absolute left-[500px] top-[30px] z-10' >
                                <option value="">Filter on month</option>
                                <option value="blue" >March</option>
                            </select>
                            <select className=' bg-white w-[150px] outline-none border border-black absolute left-[800px] top-[30px] z-10' >
                                <option value="">Filter on Date</option>
                                <option value="blue" >1</option>
                            </select> */}
                            <div className=' absolute left-[500px] top-[4px] w-[200px] z-10'>
                                <h2 className='text-xl  font-[450]'>Filter on date</h2>
                                <input type="date" className='border-b w-[270px] mt-[2px]' onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate} />
                            </div>
                           <div className='absolute right-[78px] top-[20px] flex justify-end z-20'>
                           <button className='h-[35px] w-[100px] flex items-center justify-center rounded-2xl bg-[#35A1CC] text-white' onClick={()=> refreshData()}>Refresh</button>
                           </div>
                            <DataTable columns={columns} data={filtered} style={{ width: '1200px' }} wrapperStyle={{ backgroundColor: '#DAECF3' }} pagination fixedHeader subHeader subHeaderComponent={<div className=' h-[70px]'><h2 className='text-xl  font-[450]'>Search</h2> <input type='search' placeholder='Search here' className=' h-[25px] w-[310px] border-b-[1px]   p-1 outline-none placeholder:text-sm' value={search} onChange={(e) => { setsearch(e.target.value) }} /> </div>} subHeaderAlign='left' />
                            {/* value={search} onChange={(e) => { setsearch(e.target.value) }} */}
                        </div>
                        <br />

                    </div>
                </div>
            </div>
        </>
    )
}

export default Attandence