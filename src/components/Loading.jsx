import React from 'react'
import logo from '../imgs/pooltechlogo.png'
import PropagateLoader from "react-spinners/PropagateLoader";

const Loading = () => {
  return (
    <div className='h-[100vh] w-[1365px]  flex justify-center items-center flex-col'>
      <img src={logo} className='h-[220px] w-[300px]  ' />
      <PropagateLoader
        color='#35A1CC'


        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
        className='mt-5'
      />
    </div>
  )
}

export default Loading
