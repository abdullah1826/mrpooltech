import { push, ref, update } from 'firebase/database'
import { getDownloadURL, getStorage, uploadBytes } from 'firebase/storage';
import { ref as sRef } from 'firebase/storage';
import React, { useState } from 'react'
import { auth, db, storage } from '../Firbase'
import Sidebar from './Sidebar'
import avatar from '../imgs/noimg.jpg';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import './components.css'

export const Addnewworker = () => {

    // let storage = getStorage()

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

    // const date = new Date();

    // let day = date.getDate();
    // let month = date.getMonth() + 1;
    // let year = date.getFullYear();
    // let currentDate = `${year}-${month}-${day}`;


    let [img, setimg] = useState(null)

    const handleImageChange = (e) => {

        if (e.target.files[0]) {
            setimg(e.target.files[0])

        }
    }
    console.log(img)

    const handleSubmit = () => {

    }


    const addData = async () => {
        if (data.workerName && data.email && data.password) {
            await createUserWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // console.log(user.uid)
                    update(ref(db, `workers/${user.uid}`), { ...data, id: user.uid })


                    if (img) {

                        let name = new Date().getTime() + img.name;
                        const storageRef = sRef(storage, name);
                        uploadBytes(storageRef, img).then(() => {
                            console.log('img testing')
                            getDownloadURL(storageRef).then((URL) => {
                                console.log(user.uid)
                                update(ref(db, `workers/${user.uid}`), { profileUrl: URL });

                            }).catch((error) => {
                                console.log(error)
                            });
                            setimg(null)
                        }).catch((error) => {
                            console.log(error)
                        })
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    //   const errorMessage = error.message;
                    console.log(error.message)
                    if (error.message === 'Firebase: Error (auth/invalid-email).') {
                        toast.error('Please enter valid email')
                    }
                    else if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
                        toast.error('Email already exits')
                    }
                    else if (error.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
                        toast.error('Password must be at least 6 characters')
                    }

                    // ..
                });





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
        else {
            toast.error('Email , password and worker name should not be empty')
        }
    }


    return (
        <>
            <div className='flex w-[100%] '>
                <Sidebar />

                <div className='relative'>


                    <div className='h-[120px] w-[120px] border rounded-full absolute left-[52%] top-[2%] '>

                        <label htmlFor="img" className='w-[0px] h-[0px] absolute top-[95px] left-[86px]'>
                            <div className=' border rounded-full w-[20px] h-[20px] flex justify-center items-center text-sm font-[1500] text-white bg-blue-400' >+</div>
                            <input type="file" name="img" id='img' className='opacity-0 w-[0px] h-[0px]' onChange={handleImageChange} />
                        </label>
                        <img src={img ? URL.createObjectURL(img) : avatar} alt="profile " className='rounded-full w-[120px] h-[120px]' />
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
                                    <input type="number" placeholder='Phone' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, phone: e.target.value }) }} value={data.phone} />
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
                                    <input type="number" placeholder='Sallary' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, sallary: e.target.value }) }} value={data.sallary} style={{ MozAppearance: "textfield", WebkitAppearance: "none", appearance: "none" }} />
                                </div>


                                <div className='flex flex-col mt-[25px]'>
                                    <h2 className='text-xl font-[450]'>Password</h2>
                                    <input type="text" placeholder='Password must be at least 6 characters' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, password: e.target.value }) }} value={data.password} />
                                </div>

                                <div className='flex flex-col mt-[25px]'>
                                    <h2 className='text-xl font-[450]'>Joining Date</h2>
                                    <input type="date" placeholder='Joining Date' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, joiningdate: e.target.value }) }} value={data.joiningdate} />
                                </div>


                            </div>






                        </div>
                        <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] absolute left-[50%] mt-[30px]' onClick={addData}>Submit</button>
                    </div>

                </div>
            </div>
            <ToastContainer position="top-center" autoClose={2000} />
        </>
    )
}

