import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ReactQuill from "react-quill";
import "../../node_modules/react-quill/dist/quill.snow.css";
import "../App.css";
import avatar from "../imgs/noimg.jpg";
import { db, storage } from "../Firbase";
import { push, ref, update } from "firebase/database";
import { getDownloadURL, uploadBytes, uploadString } from "firebase/storage";
import { ref as sRef } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FadeLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Cropper from "./Cropper";
const Addproducts = () => {
  const navigate = useNavigate();
  let [img, setimg] = useState(null);
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
    

  const [data, setData] = useState({
    productName: "",
    price: "",
    description: "",
    imgUrl: "",
  });
  console.log(data.description);

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
    if (data.productName) {
      setLoading(true)
      let pushkey = push(ref(db, `products/`), data).key;
      update(ref(db, `products/${pushkey}`), { id: pushkey }).then(()=>{
        if (img && returnIfHttps(img) === false) {
          let name = pushkey;
          const storageRef = sRef(storage, name);
          uploadString(storageRef, img.slice(23), "base64", {
            contentType: "image/png",
          })
            .then(() => {
              console.log("img testing");
              getDownloadURL(storageRef)
                .then((URL) => {
                  console.log(URL);
                  update(ref(db, `products/${pushkey}`), { imgUrl: URL }).then(()=>{
                    setLoading(false)
                    navigate(`/allproducts`);
                  })
               
                
                })
                
                .catch((error) => {
                  console.log(error);
                });
              setimg(null);
            })
            
            .catch((error) => {
              console.log(error);
            });
        }
        setLoading(false)
        navigate(`/allproducts`);
        setData({
          productName: "",
          price: "",
          description: "",
          imgUrl: "",
        }); 
      });
     
    

      
      
    }else{
      toast.error("Product name is required!")
    }
  };
let [loading,setLoading]=useState(false)
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
    <div className="flex border">
      <Sidebar />
      <div className="flex w-[100%] border relative">
      {loading && 
      <div className="flex absolute justify-center items-center h-[100%] w-[100%]"><FadeLoader  color="#36d7b7" /></div>
      }
        <div className="relative">
          <div className="h-[120px] w-[120px] border rounded-full absolute left-[50%] top-[2%] ">
            <label
              htmlFor="img"
              className="w-[0px] h-[0px] absolute top-[95px] left-[86px]"
            >
              <div className=" border rounded-full w-[20px] h-[20px] flex justify-center items-center text-sm font-[1500] text-white bg-blue-400">
                +
              </div>
              <input
                type="file"
                name="img"
                id="img"
                className="opacity-0 w-[0px] h-[0px]"
                onChange={handleImageChange}
                key={key}
              />
            </label>
            <img
              src={img ? img : avatar}
              alt="profile "
              className="rounded-full w-[120px] h-[120px] object-cover"
            />
          </div>
          <div className="ml-[170px] mt-[100px] ">
            <div className="flex  ">
              {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}

              <div className="flex justify-between flex-wrap ml-[5px] h-[60px] mt-[50px] flex-col">
                <div className="flex flex-col">
                  <h2 className="text-xl font-[400]">Product name</h2>
                  <input
                    type="text"
                    placeholder="Product"
                    className="h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                    onChange={(e) => {
                      setData({ ...data, productName: e.target.value });
                    }}
                    value={data.productName}
                  />
                </div>
              </div>

              <div className="flex justify-between flex-wrap ml-[50px] h-[60px] mt-[50px]  flex-col">
                <div className="flex flex-col ">
                  <h2 className="text-xl font-[450]">Price</h2>
                  <input
                    type="number"
                    placeholder="Price"
                    className="h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                    onChange={(e) => {
                      setData({ ...data, price: e.target.value });
                    }}
                    value={data.price}
                  />
                </div>
              </div>
            </div>
            <div className="flex  items-end  h-[60px] text-xl font-[400] mb-4">
              Add Description
            </div>
            <ReactQuill
            style={{height:"250px",width:"680px"}}
              placeholder="Write description..."
              onChange={(e) => {
                setData({ ...data, description: e });
              }}
              value={data.description}
            />
            <button
              className="h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] absolute left-[50%] mt-[70px]"
              onClick={addData}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
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
  );
};

export default Addproducts;
