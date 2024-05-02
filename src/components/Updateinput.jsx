import { onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../Firbase';
import Sidebar from './Sidebar';

const Updateinput = () => {




    const [mydata, setData] = useState({
        sideName: '',
        area: '',
        phase: '',
        operater: '',
        reference: '',
        ownerName: '',
        ownerMobile: '',
        manager: '',
        mobileManager: '',
        activeDate: '',
        inactiveDate: '',
        status: ''
    })

    const params = useParams()
    const uid = params.userid
    useEffect(() => {
        let getingdata = async () => {

            const starCountRef = ref(db, `/userdata/${uid}`);
            onValue(starCountRef, async (snapshot) => {
                const data = await snapshot.val();
                //  console.log(data)
                MediaKeyStatusMap

                setData({
                    sideName: data.sideName,
                    area: data.area,
                    phase: data.phase,
                    operater: data.operater,
                    reference: data.reference,
                    ownerName: data.ownerName,
                    ownerMobile: data.ownerMobile,
                    manager: data.manager,
                    mobileManager: data.mobileManager,
                    activeDate: data.activeDate,
                    inactiveDate: data.inactiveDate,
                    status: data.status
                })
                // setfiltered(Object.values(data))

                // updateStarCount(postElement, data);
            });
        }

        getingdata();


    }, [])




    console.log(mydata.sideName)

    const updateData = () => {
        if (mydata.sideName && mydata.area) {
            update(ref(db, `userdata/${uid}`), mydata)
            setData({
                sideName: '',
                area: '',
                phase: '',
                operater: '',
                reference: '',
                ownerName: '',
                ownerMobile: '',
                manager: '',
                mobileManager: '',
                activeDate: '',
                inactiveDate: '',
                status: ''
            })
        }
    }
    return (
        <>
            <div className='flex w-[70%] '>
                <Sidebar />
                {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}
                <div className='w-[33%] flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px] flex-col'>

                    <div className='flex flex-col'>
                        <h2 className='text-xl font-[400]' > Side Name</h2>
                        <input type="text" placeholder='Side Name' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, sideName: e.target.value }) }} value={mydata?.sideName} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Area</h2>
                        <input type="text" placeholder='Area' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, area: e.target.value }) }} value={mydata?.area} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Phase</h2>
                        <input type="text" placeholder='Phase' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, phase: e.target.value }) }} value={mydata?.phase} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Operater</h2>
                        <input type="text" placeholder='Operater' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, operater: e.target.value }) }} value={mydata?.operater} />
                    </div>
                </div>

                <div className='  flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px]  flex-col'>
                    <div className='flex flex-col '>
                        <h2 className='text-xl font-[450]'>Reference</h2>
                        <input type="text" placeholder='Reference' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, reference: e.target.value }) }} value={mydata?.reference} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Owner Name</h2>
                        <input type="text" placeholder='Owner Name' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, ownerName: e.target.value }) }} value={mydata?.ownerName} />
                    </div>


                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Owner Mobile</h2>
                        <input type="text" placeholder='Owner Mobile' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, ownerMobile: e.target.value }) }} value={mydata?.ownerMobile} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Manager/Worker</h2>
                        <input type="text" placeholder='Manager/worker' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, manager: e.target.value }) }} value={mydata?.manager} />
                    </div>
                    <div className='flex justify-between flex-wrap ml-[20px] h-[300px] mt-[85px]  flex-col'>
                        <div className='flex flex-col '>
                            <h2 className='text-lg font-[450]'>Mobile/Manager</h2>
                            <input type="text" placeholder='Mobile/Manager' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, mobileManager: e.target.value }) }} value={mydata?.mobileManager} />
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

                </div>


            </div>
            <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] relative left-[1000px] bottom-[300px]' onClick={updateData}>Update</button>

        </>




    )
}

export default Updateinput