import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import ReactQuill from 'react-quill'
import '../../node_modules/react-quill/dist/quill.snow.css';
import '../App.css'
import avatar from '../imgs/noimg.jpg';
import { db, storage } from '../Firbase';
import { onValue, push, ref, update } from 'firebase/database';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { ref as sRef } from 'firebase/storage';
import { useParams } from 'react-router-dom';

const Editproducts = () => {

    let [img, setimg] = useState(null)
    let [tempimg, settempimg] = useState(null)
    const [data, setData] = useState({
        productName: '',
        price: '',
        description: '',
        imgUrl: ''
    })

    const handleImageChange = (e) => {

        if (e.target.files[0]) {
            settempimg(e.target.files[0])
            setimg(null)

        }
    }


    const params = useParams()
    const uid = params.productid

    console.log(uid)
    useEffect(() => {
        let getingdata = async () => {

            const starCountRef = ref(db, `/products/${uid}`);
            onValue(starCountRef, async (snapshot) => {
                const data2 = await snapshot.val();
                //  console.log(data)
                MediaKeyStatusMap
                console.log(data2)
                setData({
                    productName: data2.productName,
                    price: data2.price,
                    description: data2.description,
                    imgUrl: data2.imgUrl
                })
                setimg(data2.imgUrl)


                // setfiltered(Object.values(data))

                // updateStarCount(postElement, data);
            });
        }

        getingdata();


    }, [])

    const updateData = () => {
        if (data.productName) {
            update(ref(db, `products/${uid}`), data)

            console.log(tempimg)
            if (tempimg) {

                let name = new Date().getTime() + tempimg.name;
                const storageRef = sRef(storage, name);
                uploadBytes(storageRef, tempimg).then(() => {
                    console.log(tempimg)
                    console.log('img testing')
                    getDownloadURL(storageRef).then((URL) => {
                        // console.log(user.uid)
                        update(ref(db, `products/${uid}`), { imgUrl: URL });

                    }).catch((error) => {
                        console.log(error)
                    });
                    settempimg(null)
                }).catch((error) => {
                    console.log(error)
                })
            }
            setData({
                productName: '',
                price: '',
                description: '',
                imgUrl: ''
            })



        }
    }























    // let [img, setimg] = useState(null)
    // let [tempimg, settempimg] = useState(null)

    // 










    // let [img, setimg] = useState(null)

    // const handleImageChange = (e) => {

    //     if (e.target.files[0]) {
    //         setimg(e.target.files[0])

    //     }
    // }


    // console.log(data.description)


    // const addData = async () => {
    //     if (data.productName) {
    //         let pushkey = push(ref(db, `products/`), data).key
    //         update(ref(db, `products/${pushkey}`), { id: pushkey });
    //         if (img) {
    //             let name = new Date().getTime() + img.name;
    //             const storageRef = sRef(storage, name);
    //             uploadBytes(storageRef, img).then(() => {
    //                 console.log('img testing')
    //                 getDownloadURL(storageRef).then((URL) => {
    //                     console.log(URL)
    //                     update(ref(db, `products/${pushkey}`), { imgUrl: URL });

    //                 }).catch((error) => {
    //                     console.log(error)
    //                 });
    //                 setimg(null)
    //             }).catch((error) => {
    //                 console.log(error)
    //             })
    //         }
    //         setData({
    //             productName: '',
    //             price: '',
    //             description: '',
    //             imgUrl: ''
    //         })

    //     }
    // }

    return (
        <div className='flex border'>
            <Sidebar />
            <div className='flex w-[100%] border'>


                <div className='relative'>


                    <div className='h-[120px] w-[120px] border rounded-full absolute left-[50%] top-[2%] '>

                        <label htmlFor="img" className='w-[0px] h-[0px] absolute top-[95px] left-[86px]'>
                            <div className=' border rounded-full w-[20px] h-[20px] flex justify-center items-center text-sm font-[1500] text-white bg-blue-400' >+</div>
                            <input type="file" name="img" id='img' className='opacity-0 w-[0px] h-[0px]' onChange={handleImageChange} />

                        </label>
                        <img src={img ? img : tempimg ? URL.createObjectURL(tempimg) : avatar} alt="profile " className='rounded-full w-[120px] h-[120px]' />
                    </div>
                    <div className='ml-[170px] mt-[100px] '>
                        <div className='flex  '>
                            {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}

                            <div className='flex justify-between flex-wrap ml-[5px] h-[60px] mt-[50px] flex-col'>

                                <div className='flex flex-col'>
                                    <h2 className='text-xl font-[400]' >Product name</h2>
                                    <input type="text" placeholder='Product' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, productName: e.target.value }) }} value={data.productName} />

                                </div>


                            </div>

                            <div className='flex justify-between flex-wrap ml-[50px] h-[60px] mt-[50px]  flex-col'>
                                <div className='flex flex-col '>
                                    <h2 className='text-xl font-[450]'>Price</h2>
                                    <input type="text" placeholder='Price' className='h-[28px] w-[310px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...data, price: e.target.value }) }} value={data.price} />

                                </div>


                            </div>
                        </div>
                        <div className='flex  items-end  h-[60px] text-xl font-[400] mb-4'>Add Description</div>
                        <ReactQuill placeholder='Write description...' onChange={(e) => { setData({ ...data, description: e }) }} value={data.description} />
                        <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] absolute left-[50%] mt-[30px]' onClick={updateData}>Update</button>

                    </div>

                </div>
            </div>
        </div>
    )
}


export default Editproducts