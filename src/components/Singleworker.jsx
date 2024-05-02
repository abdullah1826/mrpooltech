import { onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../Firbase'
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom'

const Singleworker = () => {
    const params = useParams()
    const uid = params.userid
    let navigate = useNavigate()
    let [mydata, setmydata] = useState({})
    useEffect(() => {
        let getingdata = async () => {

            const starCountRef = ref(db, `/workers/${uid}`);
            onValue(starCountRef, async (snapshot) => {
                const data = await snapshot.val();
                //  console.log(data)
                MediaKeyStatusMap
                setmydata(data)
                // setfiltered(Object.values(data))

                // updateStarCount(postElement, data);
            });
        }

        getingdata();


    }, [])

    const Editdata = (id) => {
        navigate(`/updateworker/${id}`)
    }

    console.log(mydata)
    return (
        <div className='flex'>
            <Sidebar />
            <div className='w-[100%] flex justify-center'>
                <div className=" w-[400px] h-[460px] bg-white  rounded-lg shadow-lg mt-[100px]">
                    <div className="flex justify-end px-4 pt-4">
                    </div>
                    <div className="flex flex-col items-center pb-10">
                        <img className="w-[110px] h-[110px] mb-3 rounded-full shadow-lg" src={mydata.profileUrl} alt="Bonnie image" />
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Usman</h5>

                        <div className='w-[360px] flex flex-col '>
                            {/* <span className="text-md text-gray-500 dark:text-gray-400">Worker</span>
                            <span className="text-md text-gray-500 dark:text-gray-400">abc123@gmail.com</span>
                            <span className="text-md text-gray-500 dark:text-gray-400">03244288217</span> */}
                            <h5 className=" text-md font-medium text-gray-900 dark:text-white flex items-center mt-2">Email : <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{mydata.email}</span></h5>
                            <h5 className=" text-md font-medium text-gray-900 dark:text-white flex items-center mt-4">Phone : <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{mydata.phone}</span></h5>
                            <h5 className=" text-md font-medium text-gray-900 dark:text-white flex items-center mt-4">CNIC : <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{mydata.cnic}</span></h5>
                            <h5 className=" text-md font-medium text-gray-900 dark:text-white flex items-center mt-4">Sallary : <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{mydata.sallary}</span></h5>
                            <h5 className=" text-md font-medium text-gray-900 dark:text-white flex items-center mt-4">Joining Date : <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{mydata.joiningdate}</span></h5>
                        </div>
                        {/* <div className="flex mt-4 space-x-3 md:mt-6"> */}
                        <button className=" w-[200px] mt-5 h-[40px] flex items-center justify-center text-lg font-medium text-center text-white bg-[#35A1CC] rounded-3xl  focus:outline-none " onClick={() => Editdata(uid)}>Edit</button>
                        {/* <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700" onClick={() => Editdata(uid)}>Edit</a> */}
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Singleworker