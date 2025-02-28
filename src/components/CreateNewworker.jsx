import { createUserWithEmailAndPassword } from 'firebase/auth'
import { push, ref, update } from 'firebase/database'
import React, { useState } from 'react'
import { auth, db } from '../Firbase'
import Sidebar from './Sidebar'

export const Createworker = () => {

    const [data, setData] = useState({
        workerName: '',
        email: '',
        password: '',
        phone: '',
        Mobile: '',
        isWorker: true,
    })

    // const date = new Date();

    // let day = date.getDate();
    // let month = date.getMonth() + 1;
    // let year = date.getFullYear();
    // let currentDate = `${year}-${month}-${day}`;
    const addData = async() => {
        const res = await createUserWithEmailAndPassword(auth , data.email,data.password)
            update(ref(db, `workers/${pushKey}`), { id: pushKey, creationDate: currentDate })
            setData({
                workerName: '',
                area: '',
                phase: '',
                siteName: '',
                Mobile: '',
                visits: '',
            })

        
    }
    return (
        <div className='flex'>
            <Sidebar />
            <div className='relative'>
                <div className='flex  '>
                    {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}

                    <div className='flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px] flex-col'>

                        <div className='flex flex-col'>
                            <h2 className='text-xl font-[400]' >Worker Name</h2>
                            <input type="text" placeholder='Worker' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, sideName: e.target.value }) }} value={data.sideName} />
                        </div>
                        <div className='flex flex-col mt-[25px]'>
                            <h2 className='text-xl font-[450]'>Area</h2>
                            <input type="text" placeholder='Area' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, area: e.target.value }) }} value={data.area} />
                        </div>
                        <div className='flex flex-col mt-[25px]'>
                            <h2 className='text-xl font-[450]'>Phase</h2>
                            <input type="text" placeholder='Phase' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, phase: e.target.value }) }} value={data.phase} />
                        </div>
                    </div>

                    <div className='flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px]  flex-col'>
                        <div className='flex flex-col '>
                            <h2 className='text-xl font-[450]'>Site Name</h2>
                            <input type="text" placeholder='Site' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, reference: e.target.value }) }} value={data.reference} />
                        </div>
                        <div className='flex flex-col mt-[25px]'>
                            <h2 className='text-xl font-[450]'>Phone Number</h2>
                            <input type="text" placeholder='Phone' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, ownerName: e.target.value }) }} value={data.ownerName} />
                        </div>


                        <div className='flex flex-col mt-[25px]'>
                            <h2 className='text-xl font-[450]'>Visits</h2>
                            <input type="text" placeholder='visits' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, ownerMobile: e.target.value }) }} value={data.ownerMobile} />
                        </div>


                    </div>






                </div>
                <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] absolute left-[40%] mt-[30px]' onClick={addData}>Submit</button>

            </div>
        </div>
    )
}
