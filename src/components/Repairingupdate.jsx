import { onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../Firbase';
import Sidebar from './Sidebar';

const Repairingupdate = () => {




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
        repairingType:"",
        qoutation:"",
        workerAmount:"",
    })

    const params = useParams()
    const uid = params.userid
    useEffect(() => {
        let getingdata = async () => {

            const starCountRef = ref(db, `/Repairing/${uid}`);
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
        if (mydata.site && mydata.area) {
            update(ref(db, `Repairing/${uid}`), mydata)
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
                repairingType:"",
                qoutation:"",
                workerAmount:"",
        
            })
        }
    }
    return (
        <>
            <div className='flex w-[70%] '>
                <Sidebar />
                {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}
                <div className=' flex justify-between flex-wrap ml-[50px] h-[340px] mt-[50px] flex-col'>

                    <div className='flex flex-col'>
                        <h2 className='text-xl font-[400]' >Site</h2>
                        <input type="text" placeholder='Side number' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, site: e.target.value }) }} value={mydata?.site} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                    <h2 className='text-xl font-[450]'>Area</h2>
                    <input type="text" placeholder='Area' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, area: e.target.value }) }} value={mydata?.area} />
                </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Repairing type</h2>
                        <input type="text" placeholder='Pool shape' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, repairingType: e.target.value }) }} value={mydata?.repairingType} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Worker amount</h2>
                        <input type="text" placeholder='Pool size' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, workerAmount: e.target.value }) }} value={mydata?.workerAmount} />
                    </div>
                </div>

                <div className='  flex justify-between flex-wrap ml-[50px] h-[340px] mt-[50px]  flex-col'>
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
            
        <div className='flex flex-col '>
        <h2 className='text-xl font-[450]'>Repairing qoutation</h2>
        <input type="text" placeholder='Attendant Phone' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, qoutation: e.target.value }) }} value={mydata?.qoutation} />
    </div>
            </div>
            </div>
            <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] relative left-[1000px] bottom-[250px]' onClick={updateData}>Update</button>

        </>




    )
}

export default Repairingupdate