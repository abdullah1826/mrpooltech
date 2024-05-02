import React, { useContext, useState } from 'react'
import logo from '../imgs/pooltechlogo.png';
import { FaHome } from 'react-icons/fa'
import { ImPriceTags } from 'react-icons/im';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoIosPerson } from 'react-icons/io'
import { BsPeopleFill } from 'react-icons/bs'
import { GiArchiveRegister } from 'react-icons/gi'
import { FaShoppingCart } from 'react-icons/fa';


const Sidebar = () => {


  const params = useParams()
  const page = window.location.pathname
  // console.log(window.location.href)

  let { Nulluser } = useContext(AuthContext)
  const navigate = useNavigate()
  const logout = () => {
    navigate('/login')
    Nulluser()
  }

  let [borderb, setborderb] = useState({
    home: false,
    worker: false,
    Adddata: false

  })

  const homeborder = () => {
    setborderb({
      home: true,
      worker: false,
      Adddata: false

    })
  }

  const workerborder = () => {
    setborderb({
      home: false,
      worker: true,
      Adddata: false

    })
  }

  const adddataborder = () => {
    setborderb({
      home: false,
      worker: false,
      Adddata: true

    })
  }
  console.log(window.location.pathname)
  return (
    <div className='w-[215px] border h-[125vh]'>
      <div className=' flex flex-col items-center h-[130px] w-[210px]  mt-4 '>
        <img src={logo} alt={logo} className='h-[100px] w-[130px] ' />
        {/* <BsBuilding className='h-[50px] w-[50px] text-[#35A1CC]' />*/}
        <h2 className='text-lg font-bold mt-2 text-[#35A1CC]'>Mr. Pool Tech</h2>
      </div>
      <NavLink to='/'>

        <div className='flex w-[85%] ml-[20px] mt-[60px] items-center p-1' style={page === '/' ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null} >
          <FaHome className='text-2xl ml-2  ' style={page === '/' ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-1 text-lg  mt-1' style={page === '/' ? { color: 'white' } : { color: '#35A1CC' }}>Home</h2>
        </div>
        {/* <div className='w-[50px] mt-1 bg-[#35A1CC] h-1'></div> */}

      </NavLink>

      <NavLink to='/workers'>
        <div className='flex w-[85%] ml-[20px] mt-[24px] items-center p-1' style={page === '/workers' ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null}>
          <IoIosPerson className='text-2xl ml-2 ' style={page === '/workers' ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-[2px] text-md  mt-1' style={page === '/workers' ? { color: 'white' } : { color: '#35A1CC' }}>Working Inviduals</h2>
        </div>
      </NavLink>

      <NavLink to='/tags'>
        <div className='flex w-[85%] ml-[20px] mt-[24px] items-center p-1' style={page === '/tags' ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null}>
          <IoMdAddCircleOutline className='text-2xl ml-2 ' style={page === '/tags' ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-1 text-lg  ' style={page === '/tags' ? { color: 'white' } : { color: '#35A1CC' }}>Add data</h2>
        </div>
      </NavLink>

      <NavLink to='/allworkers'>
        <div className='flex w-[85%] ml-[20px] mt-[24px] items-center p-1' style={page === '/allworkers' ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null}>
          <BsPeopleFill className='text-2xl ml-2 ' style={page === '/allworkers' ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-1 text-lg  ' style={page === '/allworkers' ? { color: 'white' } : { color: '#35A1CC' }}>All Workers</h2>
        </div>
      </NavLink>

      <NavLink to='/attendance'>
        <div className='flex w-[85%] ml-[20px] mt-[24px] items-center p-1' style={page === '/attendance' ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null}>
          <GiArchiveRegister className='text-2xl ml-2 ' style={page === '/attendance' ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-2 text-lg  ' style={page === '/attendance' ? { color: 'white' } : { color: '#35A1CC' }}>Attendance</h2>
        </div>
      </NavLink>

      <NavLink to='/allproducts'>
        <div className='flex w-[85%] ml-[20px] mt-[24px] items-center p-1' style={page === '/allproducts' ? { backgroundColor: '#0b6e99', borderRadius: '20px', color: 'white' } : null}>
          <FaShoppingCart className='text-2xl ml-2 ' style={page === '/allproducts' ? { color: 'white' } : { color: '#35A1CC' }} />
          <h2 className=' ml-2 text-lg  ' style={page === '/allproducts' ? { color: 'white' } : { color: '#35A1CC' }}>Products</h2>
        </div>
      </NavLink>





      <div className='w-[190px] border-t h-[250px] mt-[80px]'>
        <div className='ml-[45px] mt-4'>
          <h2>Admin</h2>
          <p className='text-[#B7B7B7]'>admin@admin.com</p>
          <button className='h-[40px] w-[90px] bg-[#f44336] rounded-md text-white mt-5' onClick={() => { return logout() }}>Log Out</button>
          {/* <h2 className='mt-3 cursor-pointer' onClick={logout} >Log Out</h2> */}

        </div>

      </div>

    </div>
  )
}

export default Sidebar
