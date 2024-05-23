import { onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../Firbase';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Otherprojectinput1 = () => {
    const navigate = useNavigate();



    const [mydata, setData] = useState({
        site: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        owner: "",
        ownerMobile: "",
        worker: "",
        area: "",
        ourCost:"",
        id:"",
        projectType:"",
        qoutation:"",
        workerAmount:"",

    })

    const params = useParams()
    const uid = params.userid
    useEffect(() => {
        let getingdata = async () => {

            const starCountRef = ref(db, `/OtherProjects/${uid}`);
            onValue(starCountRef, async (snapshot) => {
                const data = await snapshot.val();
                //  console.log(data)
                MediaKeyStatusMap

                setData(data)
                // setfiltered(Object.values(data))

                // updateStarCount(postElement, data);
            });
        }

        getingdata();


    }, [])





    const updateData = () => {
        if (!mydata.site || !mydata.area ) {
            toast.warn("Site and area fields should not be empty.");
            return;
          }
        if (mydata.site && mydata.area) {
            update(ref(db, `OtherProjects/${uid}`), mydata)
            setData({
                site: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        owner: "",
        ownerMobile: "",
        worker: "",
        area: "",
        ourCost:"",
        id:"",
        projectType:"",
        qoutation:"",
        workerAmount:"",

        
            })
        }
        toast.success("Update record successfully")
        setTimeout(() => {
            navigate(`/otherproject`);
          }, 1500);
    }
    return (
        <>
            <div className='flex w-[100%] '>
                <Sidebar />
                {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}
                <div className=' flex justify-between flex-wrap ml-[20px] h-[340px] mt-[50px] flex-col'>

                    <div className='flex flex-col'>
                        <h2 className='text-xl font-[400]' >Site</h2>
                        <input type="text" placeholder='Side number' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, site: e.target.value }) }} value={mydata?.site} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                    <h2 className='text-xl font-[450]'>Area</h2>
                    <input type="text" placeholder='Area' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, area: e.target.value }) }} value={mydata?.area} />
                </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Project type</h2>
                        <input type="text" placeholder='Pool shape' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, projectType: e.target.value }) }} value={mydata?.projectType} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Worker amount</h2>
                        <input type="text" placeholder='Pool size' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, workerAmount: e.target.value }) }} value={mydata?.workerAmount} />
                    </div>
                </div>

                <div className='  flex justify-between flex-wrap ml-[20px] h-[340px] mt-[50px]  flex-col'>
                    <div className='flex flex-col '>
                        <h2 className='text-xl font-[450]'>Owner Name</h2>
                        <input type="text" placeholder='Owner Name' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, owner: e.target.value }) }} value={mydata?.owner} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Owner Mobile</h2>
                        <input type="text" placeholder='Owner Mobile' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, ownerMobile: e.target.value }) }} value={mydata?.ownerMobile} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                    <h2 className='text-xl font-[450]'>Active Date</h2>
                    <input type="date" placeholder='Active Date' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, activeDate: e.target.value }) }} value={mydata?.activeDate} />
                </div>
                <div className='flex flex-col mt-[25px]'>
                    <h2 className='text-xl font-[450]'>InActive Date</h2>
                    <input type="date" placeholder='InActive Date' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, inactiveDate: e.target.value }) }} value={mydata?.inactiveDate} />
                </div>
                </div>

                <div className='flex  flex-wrap ml-[20px] h-[340px] mt-[50px]  flex-col'>
                <div className='flex flex-col '>
                    <h2 className='text-lg font-[450]'>Our cost</h2>
                    <input type="text" placeholder='Operator' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, ourCost: e.target.value }) }} value={mydata?.ourCost} />
                </div>
            
        <div className='flex flex-col mt-[39px] '>
        <h2 className='text-xl font-[450]'>Qoutation amount</h2>
        <input type="text" placeholder='Attendant Phone' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, qoutation: e.target.value }) }} value={mydata?.qoutation} />
    </div>
            </div>
            </div>
            <div className="w-[95%] mt-[-250px] flex justify-end">
            <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px]' onClick={updateData}>Update</button>
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

export default Otherprojectinput1