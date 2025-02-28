import { ref, remove } from 'firebase/database'
import React, { useContext } from 'react'
import { ModalContext } from '../context/Modalcontext'
import { db } from '../Firbase'

export const Model = ({ delfunc, msg }) => {

    let { hidemodal } = useContext(ModalContext)


    const handleDelete = () => {
        //  try {
        delfunc()
        hidemodal();
    }
    return (
        <div className='fixed top-0 bottom-0 right-0 left-0' style={{ backgroundColor: 'rgba(189,189,189,0.9) ', zIndex: '10' }}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '25rem', backgroundColor: '#fff', display: 'flex', justifyContent: "center", alignItems: 'center', flexDirection: 'column', height: '100px' }}>
                <h1>{msg}</h1>

                <div className=' flex w-[185px] justify-between mt-3'>
                    <button className='border flex justify-center items-center w-[75px] h-[30px]  text-white bg-[#35A1CC] rounded-md' onClick={() => hidemodal()}>Cancel</button>
                    <button className='border flex justify-center items-center w-[75px] h-[30px]  text-white bg-red-600 rounded-md' onClick={() => handleDelete()}>Yes</button>
                </div>
            </div>
        </div>
    )
}
