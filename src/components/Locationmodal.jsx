import React, { useContext } from 'react'
import { ModalContext } from '../context/Modalcontext'

export const Locationmodel = ({ checkinloc, checkoutloc, hidemod }) => {

    return (
        <div className='fixed top-0 bottom-0 right-0 left-0' style={{ backgroundColor: 'rgba(189,189,189,0.9) ', zIndex: '20' }}>
            <div className='p-3 text-center' style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '25rem', backgroundColor: '#fff', display: 'flex', justifyContent: "space-between", alignItems: 'center', flexDirection: 'column', height: '250px' }}>
                <h2 className='text-lg font-[500]'>Check in Location</h2>
                <p>{checkinloc}</p>
                <h2 className='text-lg font-[500]'>Check out Location</h2>
                <p>{checkoutloc}</p>

                <div className=' flex w-[185px] justify-center mt-3'>
                    <button className='border flex justify-center items-center w-[100px] h-[30px]  text-white bg-[#35A1CC] rounded-md' onClick={hidemod}>Close</button>
                    {/* <button className='border flex justify-center items-center w-[75px] h-[30px]  text-white bg-red-600 rounded-md' >Yes</button> */}
                    {/* onClick={() => handleDelete()}
                    onClick={() => hidemodal()} */}
                </div>
            </div>
        </div>
    )
}