import React, { useState, useEffect } from 'react'
import Datatable from './components/Datatable'
import Sidebar from './components/Sidebar'
import Widgets from './components/Widgets'
import Loading from './components/Loading'
import { Input } from './components/Input'

const Dashboard = () => {
  const [loading, setloading] = useState(false)
  useEffect(() => {
    setloading(true)
    setTimeout(() => {
      setloading(false)
    }, 2000)
  }, [])
  return (
    <div>
      {loading ?
        <Loading /> :
        <div className='flex'>
          <Sidebar page='home' />
          <div>
            <Datatable />
          </div>

        </div>

      }

    </div>
  )
}

export default Dashboard
