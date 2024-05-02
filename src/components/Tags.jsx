import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { ImPriceTags } from 'react-icons/im';
import { FaUserTag } from 'react-icons/fa'
import { NavLink } from 'react-router-dom';
import Loading from './Loading';
import { Input } from './Input';

const Tags = () => {

  const [loading, setloading] = useState(false)
  useEffect(() => {
    setloading(true)
    setTimeout(() => {
      setloading(false)
    }, 3000)
  }, [])

  return (
    <>
      <div className='flex'>
        <Sidebar />
        <Input />
      </div>


    </>

  )
}

export default Tags
