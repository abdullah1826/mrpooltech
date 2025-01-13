import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import avatar from '../imgs/noimg.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { onValue, ref, update } from 'firebase/database';
import { db, storage } from '../Firbase';
import { getDownloadURL, uploadBytes, uploadString } from 'firebase/storage';
import { ref as sRef } from 'firebase/storage';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Cropper from './Cropper';
const Updateworkers = () => {
    const navigate = useNavigate();
    
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
    let [cropModal, setcropModal] = useState(false);
    const [profile, setProfile] = useState('');
    const [profileImage, setProfileImage] = useState('');
    let [myprflimg, setmyprflimg] = useState(null);
    const [key, setKey] = useState('');
    let [cropPrfl, setCropPrfl] = useState({
      unit: "%",
      x: 50,
      y: 50,
      width: 25,
      height: 25,
    });
    const handleclosecropper =()=>{

        setcropModal(false)
       }
    let [img, setimg] = useState(null)
    let [tempimg, settempimg] = useState(null)

    let handleImageChange = (event) => {
        // profileImage
        setProfile("");
        const { files } = event.target;
      
        // setKey(key + 1);
        if (files && files?.length > 0) {
          const reader = new FileReader();
          reader.readAsDataURL(files[0]);
          reader.addEventListener("load", () => {
            setProfile(reader.result);
            setKey(key+1)
            setcropModal(true);
          });
        } else {
          // If no file selected (e.g., user canceled cropping), clear the input field
          event.target.value = null;
        }
      };



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
                settempimg(data.profileUrl)
               
                // setfiltered(Object.values(data))

                // updateStarCount(postElement, data);
            });
            
        }

        getingdata();


    }, [])

    const updateData = () => {
        let returnIfHttps = (string) => {
            if (string != "") {
              if (string.slice(0, 4) === "http") {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          };
        if (data.workerName && data.email && data.password) {
            update(ref(db, `workers/${uid}`), data)


            if (tempimg && returnIfHttps(tempimg) === false) {
                let name = uid;
                const storageRef = sRef(storage, name);
                uploadString(storageRef, tempimg.slice(23), "base64", {
                  contentType: "image/png",
                })
                  .then(() => {
                    console.log("img testing");
                    getDownloadURL(storageRef)
                      .then((URL) => {
                        // console.log(URL)
                        update(ref(db, `workers/${uid}`), { profileUrl: URL });
                        settempimg(null)
                        // window.location.reload();
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    // setimg(null)
                  })
                  .catch((error) => {
                    console.log(error);
                  });
               
              }
            toast.success("Record update successfuly!")
            setTimeout(() => {
                navigate(`/Permanentworkers`);
              }, 1500);


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
        <>
        <Cropper
        cropModal={cropModal}
        handleclosecropper={handleclosecropper}
        theimg={profile}
        myimg={myprflimg}
        setmyimg={setmyprflimg}
        setcrop={setCropPrfl}
        crop={cropPrfl}
        aspect={1 / 1}
        setReduxState={settempimg}
        isCircle={true}
      />
        <div className='flex w-[100%] border'>
            <Sidebar />

            <div className='relative'>


                <div className='h-[120px] w-[120px] border rounded-full absolute left-[52%] top-[2%] '>

                    <label htmlFor="img" className='w-[0px] h-[0px] absolute top-[95px] left-[86px]'>
                        <div className=' border rounded-full w-[20px] h-[20px] flex justify-center items-center text-sm font-[1500] text-white bg-blue-400' >+</div>
                        <input  key={key} type="file" name="img" id='img' className='opacity-0 w-[0px] h-[0px]' onChange={handleImageChange} />
                    </label>
                    <img src={tempimg ? tempimg : avatar} alt="profile " className='rounded-full w-[120px] h-[120px]' />
                </div>
                <div className='ml-[170px] mt-[90px] '>
                    <div className='flex  '>
                        {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}

                        <div className='flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px] flex-col'>

                            <div className='flex flex-col'>
                                <h2 className='text-[17px]' >Worker Name</h2>
                                <input type="text" placeholder='Worker' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, workerName: e.target.value }) }} value={data.workerName} />
                            </div>
                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-[17px]'>Email</h2>
                                <input type="email" placeholder='Email' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, email: e.target.value }) }} value={data.email} />
                            </div>
                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-[17px]'>Phone Number</h2>
                                <input type="text" placeholder='Phone' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, phone: e.target.value }) }} value={data.phone} />
                            </div>
                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-[17px]'>Address</h2>
                                <input type="text" placeholder='Address' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, address: e.target.value }) }} value={data.address} />
                            </div>
                        </div>

                        <div className='flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px]  flex-col'>
                            <div className='flex flex-col '>
                                <h2 className='text-[17px]'>CNIC</h2>
                                <input type="text" placeholder='Id card number' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, cnic: e.target.value }) }} value={data.cnic} />
                            </div>
                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-[17px]'>Salary</h2>
                                <input type="text" placeholder='Salary' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, sallary: e.target.value }) }} value={data.sallary} />
                            </div>


                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-[17px]'>Password</h2>
                                <input type="text" placeholder='Password' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, password: e.target.value }) }} value={data.password} />
                            </div>

                            <div className='flex flex-col mt-[25px]'>
                                <h2 className='text-[17px]'>Joining Date</h2>
                                <input type="date" placeholder='Joining Date' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, joiningdate: e.target.value }) }} value={data.joiningdate} />
                            </div>


                        </div>






                    </div>
                    <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] absolute left-[50%] mt-[30px]' onClick={updateData}>Submit</button>
                </div>

            </div>
        </div>
        <ToastContainer position="top-center" autoClose={2000} />
        </>
    )
}

export default Updateworkers