import React, { useContext } from 'react'
import Logo from '../imgs/pooltechlogo.png';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react'
import { auth, db } from '../Firbase';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';


const Login = () => {
  const [mylist, setmylist] = useState({});
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [ermessage, setermessage] = useState(false);
  const [errormessage, seterrormessage] = useState('');
  const [showpass, setshowpass] = useState(true)

  const [ermessage2, setermessage2] = useState(false);
  const { dispatch } = useContext(AuthContext)

  const navigate = useNavigate();

  useEffect(() => {


    let getingdata = async () => {

      const starCountRef = ref(db, '/admin');
      onValue(starCountRef, async (snapshot) => {
        const data = await snapshot.val();
        //  console.log(data)
        MediaKeyStatusMap
        setmylist(data)

        // updateStarCount(postElement, data);
      });
    }

    getingdata();


  }, [])
  console.log(mylist.email)
  console.log(mylist.password)

  // const handleLogin = (email, password) => {
  //   setermessage(false)
  //   setermessage2(false)
  //   if (email && password) {
  //     if (email == mylist.email && password == mylist.password) {
  //       dispatch({ type: 'LOGIN', payload: true })
  //       navigate('/')
  //     }
  //     else {
  //       setermessage(true)
  //     }
  //   }
  //   else {
  //     setermessage2(true)
  //   }
  // }

  const handleLogin = (email, password) => {
    // e.preventDefault();
    setermessage2(false)
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          dispatch({ type: 'LOGIN', payload: user })
          navigate('/')

          // ...
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          // alert(errorMessage)
          setermessage(true)
          if (error.message === 'Firebase: Error (auth/user-not-found).') {
            seterrormessage('User not Found !')
          }
          else if (error.message === 'Firebase: Error (auth/wrong-password).') {
            seterrormessage('Wrong Password !')
          }


        });
    }
    else {
      setermessage2(true)
    }
  }
  console.log(errormessage)
  return (
    <div>
      <div className='h-[100vh] w-[1365px]  flex justify-center items-center'>
        <div className='h-[500px] w-[500px] flex justify-center items-center flex-col relative'>
          <img src={Logo} alt="Justtag" className='h-[120px] w-[170px] ' />
          <input type="text" placeholder='Email' className='h-[50px] w-[275px] border-b-[1px] border-black mt-5 p-2 outline-none' onChange={(event) => setemail(event.target.value)} />
          <div className='h-[51px] w-[275px] border-b-[1px] border-black mt-5 flex'><input type={showpass ? "password" : "text"} placeholder='Password' className='h-[50px] w-[255px]  p-2 outline-none' onChange={(event) => setpassword(event.target.value)} />{showpass ? <AiFillEye className='mt-5 h-[25px] w-[25px] text-[#35A1CC] cursor-pointer' onClick={() => setshowpass(false)} /> : <AiFillEyeInvisible className='mt-5 h-[25px] w-[25px] text-[#35A1CC] cursor-pointer' onClick={() => setshowpass(true)} />}</div>
          <h2 className='text-red-600 mt-2 absolute left-[185px] top-[420px]'>{ermessage ? errormessage : ermessage2 ? 'Please fill all the feilds' : null}</h2>
          <Link className='absolute top-[338px] left-[213px] text-sm text-[#35a1cc] font-[500]' to='/forgetpassword'>Forget Password? Click Here</Link>
          <button className='h-[50px] w-[250px] border mt-10 rounded-3xl bg-[#35A1CC] font-[400] shadow-md text-white' onClick={() => { return handleLogin(email, password) }}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Login
