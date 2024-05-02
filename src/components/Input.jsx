import { push, ref, update } from 'firebase/database'
import React, { useState } from 'react'
import { db } from '../Firbase'
import './components.css'
// import Sidebar from './Sidebar'

export const Input = () => {

    const [data, setData] = useState({

        sideName: '',
        area: '',
        phase: '',
        operater: '',
        reference: '',
        ownerName: '',
        ownerMobile: '',
        manager: '',
        mobileManager: '',
        status: true,
        activeDate: '',
        inactiveDate: ''

    })

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    const addData = () => {
        if (data.sideName && data.area) {
            let pushKey = push(ref(db, `userdata/`), data).key
            update(ref(db, `userdata/${pushKey}`), { id: pushKey, creationDate: currentDate })
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
                amount: '',
                status: true,
                activeDate: '',
                inactiveDate: ''

            })

        }
    }
    return (
        <div className='relative'>
            <div className='flex w-[100%] '>
                {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}
                {/* <Sidebar />[p-0] */}
                <div className='flex justify-between w-[200px] flex-wrap ml-[50px] h-[320px] mt-[50px] flex-col'>

                    <div className='flex flex-col'>
                        <h2 className='text-xl font-[400]' >Site Name</h2>
                        <input type="text" placeholder='Site Name' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, sideName: e.target.value }) }} value={data.sideName} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Area</h2>
                        <input type="text" placeholder='Area' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, area: e.target.value }) }} value={data.area} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Phase</h2>
                        <input type="text" placeholder='Phase' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, phase: e.target.value }) }} value={data.phase} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Operater</h2>
                        <input type="text" placeholder='Operater' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, operater: e.target.value }) }} value={data.operater} />
                    </div>
                </div>

                <div className='flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px]  flex-col'>
                    <div className='flex flex-col '>
                        <h2 className='text-xl font-[450]'>Reference</h2>
                        <input type="text" placeholder='Reference' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, reference: e.target.value }) }} value={data.reference} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Owner Name</h2>
                        <input type="text" placeholder='Owner Name' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, ownerName: e.target.value }) }} value={data.ownerName} />
                    </div>


                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Owner Mobile</h2>
                        <input type="number" placeholder='Owner Mobile' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, ownerMobile: e.target.value }) }} value={data.ownerMobile} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Manager/Worker</h2>
                        <input type="text" placeholder='Manager/worker' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, manager: e.target.value }) }} value={data.manager} />
                    </div>

                </div>
                <div className='flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px]  flex-col'>
                    <div className='flex flex-col '>
                        <h2 className='text-lg font-[450]'>Mobile/Manager</h2>

                        <input type="number" placeholder='Mobile/Manager' className=' h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none  placeholder:text-sm' onChange={(e) => { setData({ ...data, mobileManager: e.target.value }) }} value={data.mobileManager} />

                    </div>


                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-lg font-[450]'>Amount</h2>
                        <input type="number" placeholder='Amount' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, amount: e.target.value }) }} value={data.amount} />
                    </div>

                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>Active Date</h2>
                        <input type="date" placeholder='Active Date' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, activeDate: e.target.value }) }} value={data.activeDate} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-xl font-[450]'>InActive Date</h2>
                        <input type="date" placeholder='InActive Date' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, inactiveDate: e.target.value }) }} value={data.inactiveDate} />
                    </div>
                </div>





            </div>
            <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] absolute right-[3%] mt-[50px]' onClick={addData}>Submit</button>

        </div>
    )
}
