import React, { useContext } from "react";
import Logo from "../imgs/pooltechlogo.png";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { auth, db } from "../Firbase";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";


const Login = () => {
  const [mylist, setmylist] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ermessage, setermessage] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const [showpass, setshowpass] = useState(true);

  const [ermessage2, setermessage2] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let getingdata = async () => {
      const starCountRef = ref(db, "/admin");
      onValue(starCountRef, async (snapshot) => {
        const data = await snapshot.val();
        //  console.log(data)
        MediaKeyStatusMap;
        setmylist(data);

        // updateStarCount(postElement, data);
      });
    };

    getingdata();
  }, []);

  // console.log(mylist.email);
  // console.log(mylist.password);

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

  // const handleLogin = (email, password) => {
  //   // e.preventDefault();
  //   setermessage2(false);
  //   if (email && password) {
  //     signInWithEmailAndPassword(auth, email, password)
  //       .then((userCredential) => {
  //         // Signed in
  //         const user = userCredential.user;
  //         dispatch({ type: "LOGIN", payload: user });
  //         navigate("/");

  //         // ...
  //       })
  //       .catch((error) => {
  //         const errorMessage = error.message;
  //         console.log(error.message);
  //         if (error.code === "auth/invalid-email") {
  //           toast.error("Invalid  Email!");
  //         } else if (error.code === "auth/invalid-credential") {
  //           toast.error("Invalid password!");
  //         } else if (error.code === "auth/wrong-password") {
  //           toast.error("Wrong password!");
  //         } else {
  //           toast.error(errorMessage);
  //         }
  //       });
  //   } else {
  //     setermessage2(true);
  //   }
  // };

  const handleLogin = () => {
    setermessage2(false);
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          dispatch({ type: "LOGIN", payload: user });
          navigate("/");
        })
        .catch((error) => {
          console.log(error.message);
          if (error.code === "auth/invalid-email") {
            toast.error("Invalid Email!");
          } else if (error.code === "auth/invalid-credential") {
            toast.error("Invalid password!");
          } else if (error.code === "auth/wrong-password") {
            toast.error("Wrong password!");
          } else {
            toast.error(error.message);
          }
        });
    } else {
      setermessage2(true);
    }
  };

  // console.log(errormessage);
  return (
    <>
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 flex flex-col items-center">
          {/* Logo */}
          <img src={Logo} alt="Justtag" className="h-24 w-44 mb-6" />

          {/* Email Input */}
          <input
            type="text"
            placeholder="Email"
            className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <div className="w-full h-12 mt-4 flex items-center border border-gray-300 rounded-md px-4 focus-within:ring-2 focus-within:ring-blue-400">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPass ? (
              <AiFillEye
                className="text-blue-500 cursor-pointer"
                size={24}
                onClick={() => setShowPass(false)}
              />
            ) : (
              <AiFillEyeInvisible
                className="text-blue-500 cursor-pointer"
                size={24}
                onClick={() => setShowPass(true)}
              />
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}

          {/* Forgot Password */}
          <Link
            to="/forgetpassword"
            className="text-blue-500 text-sm font-medium mt-3 hover:underline"
          >
            Forgot Password? Click Here
          </Link>

          {/* Login Button */}
          <button
            className="w-full h-12 mt-6 bg-blue-500 text-white rounded-full font-semibold shadow-md transition-all hover:bg-blue-600 active:scale-95"
            onClick={() => handleLogin()} // <-- Call without parameters
            >
            Login
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={1000} />
    </>
  );
};

export default Login;
