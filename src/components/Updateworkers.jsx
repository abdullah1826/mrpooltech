import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import avatar from '../imgs/noimg.jpg';
import { useParams } from 'react-router-dom';
import { onValue, ref, update } from 'firebase/database';
import { db, storage } from '../Firbase';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { ref as sRef } from 'firebase/storage';

const Updateworkers = () => {

    const [data, setData] = useState({
        workerName: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        sallary: '',
        joiningdate: '',
        cnic: '',
        profileUrl: ''
    })

    let [img, setimg] = useState(null)
    let [tempimg, settempimg] = useState(null)

    const handleImageChange = (e) => {

        if (e.target.files[0]) {
            settempimg(e.target.files[0])
            setimg(null)

        }
    }


    const params = useParams()
    const uid = params.userid
    useEffect(() => {
        let getingdata = async () => {

            const starCountRef = ref(db, `/workers/${uid}`);
            onValue(starCountRef, async (snapshot) => {
                const data = await snapshot.val();
                //  console.log(data)
                MediaKeyStatusMap

                setData({
                    workerName: data.workerName,
                    phone: data.phone,
                    email: data.email,
                    password: data.password,
                    address: data.address,
                    sallary: data.sallary,
                    joiningdate: data.joiningdate,
                    cnic: data.cnic,
                    profileUrl: data.profileUrl
                })
                setimg(data.profileUrl)
                // setfiltered(Object.values(data))

                // updateStarCount(postElement, data);
            });
        }

        getingdata();


    }, [])

    const updateData = () => {
        if (data.workerName && data.email && data.password) {
            update(ref(db, `workers/${uid}`), data)


            if (tempimg) {

                let name = new Date().getTime() + tempimg.name;
                const storageRef = sRef(storage, name);
                uploadBytes(storageRef, tempimg).then(() => {
                    console.log('img testing')
                    getDownloadURL(storageRef).then((URL) => {
                        // console.log(user.uid)
                        update(ref(db, `workers/${uid}`), { profileUrl: URL });

                    }).catch((error) => {
                        console.log(error)
                    });
                    settempimg(null)
                }).catch((error) => {
                    console.log(error)
                })
            }



            setData({
                workerName: '',
                phone: '',
                email: '',
                password: '',
                address: '',
                sallary: '',
                joiningdate: '',
                cnic: '',
                profileUrl: ''
            })



        }
    }


    let addData = () => {

    }
    return (
        <div className='flex w-[100%] border'>
            <Sidebar />

            <div className='relative'>


                <div className='h-[120px] w-[120px] border rounded-full absolute left-[52%] top-[2%] '>

                    <label htmlFor="img" className='w-[0px] h-[0px] absolute top-[95px] left-[86px]'>
                        <div className=' border rounded-full w-[20px] h-[20px] flex justify-center items-center text-sm font-[1500] text-white bg-blue-400' >+</div>
                        <input type="file" name="img" id='img' className='opacity-0 w-[0px] h-[0px]' onChange={handleImageChange} />
                    </label>
                    <img src={img ? img : tempimg ? URL.createObjectURL(tempimg) : avatar} alt="profile " className='rounded-full w-[120px] h-[120px]' />
                </div>
                <div className='ml-[170px] mt-[90px] '>
                    <div className='flex  '>
                        {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}

                        <div className='flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px] flex-col'>

                            <div className='flex flex-col'>
                                <h2 className='text-xl font-[400]' >Worker Name</h2>
                                <input type="text" placeholder='Worker' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, workerName: e.target.value }) }} value={data.workerName} />
                            </div>
                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-xl font-[450]'>Email</h2>
                                <input type="email" placeholder='Email' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, email: e.target.value }) }} value={data.email} />
                            </div>
                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-xl font-[450]'>Phone Number</h2>
                                <input type="text" placeholder='Phone' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, phone: e.target.value }) }} value={data.phone} />
                            </div>
                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-xl font-[450]'>Address</h2>
                                <input type="text" placeholder='Address' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, address: e.target.value }) }} value={data.address} />
                            </div>
                        </div>

                        <div className='flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px]  flex-col'>
                            <div className='flex flex-col '>
                                <h2 className='text-xl font-[450]'>CNIC</h2>
                                <input type="text" placeholder='Id card number' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, cnic: e.target.value }) }} value={data.cnic} />
                            </div>
                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-xl font-[450]'>Sallary</h2>
                                <input type="text" placeholder='Sallary' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, sallary: e.target.value }) }} value={data.sallary} />
                            </div>


                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-xl font-[450]'>Password</h2>
                                <input type="text" placeholder='Password' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, password: e.target.value }) }} value={data.password} />
                            </div>

                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-xl font-[450]'>Joining Date</h2>
                                <input type="date" placeholder='Joining Date' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, joiningdate: e.target.value }) }} value={data.joiningdate} />
                            </div>


                        </div>






                    </div>
                    <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] absolute left-[50%] mt-[30px]' onClick={updateData}>Submit</button>
                </div>

            </div>
        </div>
    )
}

export default Updateworkers