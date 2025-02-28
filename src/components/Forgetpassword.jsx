import React, { useState } from 'react';
import logo from '../imgs/pooltechlogo.png';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';


const Forgetpassword = () => {
    let [email, setemail] = useState('')

    const auth = getAuth();


    // -----------------------------Forget Password-----------------------------

    const handleResetPasswordFunc = () => {
        try {
            const emailRegEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
            if (emailRegEx.test(email)) {
                sendPasswordResetEmail(auth, email)
                    .then(() => {
                        toast.success("Check your email to reset the password")
                        setemail("")
                    })
                    .catch((error) => {
                        toast.error('Email not found')
                        console.log(error.conde, "erorr code", error.message, "error.message");
                    });
            } else {
                toast.error("Please enter valid email")
            }
        } catch (error) {
            // console.log(error, "this is the console of error inside try catch error");
        }
    };

    return (
        <>
            <div className='h-[100vh] w-[100%]  flex justify-center items-center flex-col'>
                <img src={logo} alt="logo" className='h-[120px] w-[170px] ' />
                <p className='font-[500] text-[#0098d4]'>Enter your email to reset password</p>
                <input type="email" placeholder='Email' className='h-[50px] w-[275px] border-b-[1px] border-black mt-5 p-2 outline-none' onChange={(event) => setemail(event.target.value)} value={email} />
                <button className='h-[50px] w-[250px] border mt-10 rounded-3xl bg-[#35A1CC] font-[400] shadow-md text-white' onClick={() => { return handleResetPasswordFunc(email) }}>Reset Password</button>


            </div>
            <ToastContainer position="top-center" autoClose={1000} />
        </>
    )
}

export default Forgetpassword