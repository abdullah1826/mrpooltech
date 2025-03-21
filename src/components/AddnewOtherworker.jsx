import { push, ref, update } from 'firebase/database'
import { getDownloadURL, getStorage, uploadBytes, uploadString } from 'firebase/storage';
import { ref as sRef } from 'firebase/storage';
import React, { useState } from 'react'
import { auth, db, storage } from '../Firbase'
import Sidebar from './Sidebar'
import avatar from '../imgs/noimg.jpg';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import './components.css'
import { useNavigate } from 'react-router-dom';
import Cropper from './Cropper';
import { Eye, EyeOff } from "lucide-react";


export const AddnewOtherworker = () => {

    // let storage = getStorage()

    const [data, setData] = useState({
      workerName: "",
      fatherName: "",
      phone1: "",
      phone2: "",
      email: "",
      password: "",
      address: "",
      salary: "",
      joiningDate: "",
      endingDate: "",
      cnic: "",
      profileUrl: "",
      checkin: false,
    })

    // const date = new Date();

    // let day = date.getDate();
    // let month = date.getMonth() + 1;
    // let year = date.getFullYear();
    // let currentDate = `${year}-${month}-${day}`;

    let [cropModal, setcropModal] = useState(false);
    const [profile, setProfile] = useState('');
    const [profileImage, setProfileImage] = useState('');
    let [myprflimg, setmyprflimg] = useState(null);
    const [key, setKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);


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
    let [img, setimg] = useState(null)

 
  

    const handleSubmit = () => {

    }

    const navigate = useNavigate();
    const addData = async () => {
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
            await createUserWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // console.log(user.uid)
                    update(ref(db, `otherWorkers/${user.uid}`), { ...data, id: user.uid })


                    if (returnIfHttps(img) === false) {
                        let name = user.uid;
                        const storageRef = sRef(storage, name);
                        uploadString(storageRef, img.slice(23), "base64", {
                          contentType: "image/png",
                        })
                          .then(() => {
                            console.log("img testing");
                            getDownloadURL(storageRef)
                              .then((URL) => {
                                // console.log(URL)
                                update(ref(db, `otherWorkers/${user.uid}`), { profileUrl: URL });
                                setimg("");
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
              workerName: "",
              fatherName: "",
              phone1: "",
              phone2: "",
              email: "",
              password: "",
              address: "",
              salary: "",
              joiningDate: "",
              endingDate: "",
              cnic: "",
              profileUrl: "",
              checkin: false,
            })
            toast.success("Worker added successfuly!")
            setTimeout(() => {
                navigate(`/otherworker`);
              }, 1500);
        }
        else {
            toast.error('Email , password and worker name should not be empty')
        }
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
        setReduxState={setimg}
        isCircle={true}
      />
            <div className='flex w-[100%] '>
                <Sidebar />

                <div className="relative w-[90%] flex items-center mt-10 ">
          <div className="h-[120px] w-[120px] border rounded-full absolute left-[44%] top-[-3%] ">
            <label
              htmlFor="img"
              className="w-[0px] h-[0px] absolute top-[95px] left-[86px]"
            >
              <div className=" border rounded-full w-[20px] h-[20px] flex justify-center items-center text-sm font-[1500] text-white bg-blue-400 cursor-pointer">
                +
              </div>
              <input
                type="file"
                key={key}
                name="img"
                id="img"
                className="opacity-0 w-[0px] h-[0px]"
                onChange={handleImageChange}
              />
            </label>
            <img
              src={img ? img : avatar}
              alt="profile "
              className="rounded-full w-[120px] h-[120px] object-cover"
            />
          </div>

          <div className="w-[70%] mx-auto mt-10 p-8 rounded-lg ">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Other Employee
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Worker Name"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) =>
                    setData({ ...data, workerName: e.target.value })
                  }
                  value={data.workerName}
                />
              </div>

              {/* Father Name */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Father Name</label>
                <input
                  type="text"
                  placeholder="Father Name"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) =>
                    setData({ ...data, fatherName: e.target.value })
                  }
                  value={data.fatherName}
                />
              </div>

              {/* Address (Full Width) */}
              <div className="flex flex-col ">
                <label className="text-gray-600 font-medium">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) =>
                    setData({ ...data, address: e.target.value })
                  }
                  value={data.address}
                />
              </div>

              {/* CNIC */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">CNIC</label>
                <input
                  type="text"
                  placeholder="ID Card Number"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) => setData({ ...data, cnic: e.target.value })}
                  value={data.cnic}
                />
              </div>

              {/* Mobile#1 */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Mobile#1</label>
                <input
                  type="number"
                  placeholder="Phone"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) => setData({ ...data, phone1: e.target.value })}
                  value={data.phone1}
                />
              </div>

              {/* Mobile#2 */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Mobile#2</label>
                <input
                  type="number"
                  placeholder="Phone"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) => setData({ ...data, phone2: e.target.value })}
                  value={data.phone2}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  value={data.email}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col relative">
                <label className="text-gray-600 font-medium">Password</label>
                <div className="relative w-[90%]">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    className="h-[40px] w-full border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition pr-10"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    value={data.password}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center justify-center h-full text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Joining Date */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">
                  Joining Date
                </label>
                <input
                  type="date"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) =>
                    setData({ ...data, joiningDate: e.target.value })
                  }
                  value={data.joiningDate}
                />
              </div>

              {/* Ending Date */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Ending Date</label>
                <input
                  type="date"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) =>
                    setData({ ...data, endingDate: e.target.value })
                  }
                  value={data.endingDate}
                />
              </div>

              {/* Salary */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Salary</label>
                <input
                  type="number"
                  placeholder="Salary"
                  className="h-[40px] w-[90%] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                  onChange={(e) => setData({ ...data, salary: e.target.value })}
                  value={data.salary}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={addData}
                className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
            </div>
            <ToastContainer position="top-center" autoClose={2000} />
        </>
    )
}

