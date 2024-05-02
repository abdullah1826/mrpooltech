import Dashboard from './Dashboard'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Tags from './components/Tags'
// import Addtag from './components/Addtag'
import Login from './components/Login'
import { AuthContext } from './context/Authcontext'
import { useContext } from 'react'
import Updateinput from './components/Updateinput'
import Forgetpassword from './components/Forgetpassword'
import WorkerTable from './components/WorkersInfotable'
import { Workerinput } from './components/Workersinput'
import { Addnewworker } from './components/Addnewworker'
import Allworkers from './components/Allworkers'
import Singleworker from './components/Singleworker'
import Updateworkers from './components/Updateworkers'
import Attandence from './components/Attandence'
import Addproducts from './components/Addproducts'
import Productstable from './components/Productstable'
import Invoice from './components/Invoice'
import Editproducts from './components/Editproducts'
import Home from './Pages/Home'
import Newproject from './Pages/ProjectPages/Newproject'
import Newinput from './Pages/InputPages/Newinput'
import Maintence from './Pages/ProjectPages/Maintence'
import MaintenceInput from './Pages/InputPages/MaintenceInput'
import Maintenceupdate from './components/Maintenceupdate'
import Repare from './Pages/ProjectPages/Repare'
import Repareinput from './Pages/InputPages/Repareinput'
import Repairingupdate from './components/Repairingupdate'

function App() {

  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to='/login' />
  }

  const RequireAuthlogin = ({ children }) => {
    return currentUser == null ? children : <Navigate to='/' />

  }


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
        

      
          <Route path='/' element={<RequireAuth><Home /></RequireAuth>} />
        

      
          <Route path='/tags' element={<RequireAuth><Tags /></RequireAuth>} />
        
          <Route path='/repairing' element={<RequireAuth><Repare /></RequireAuth>} />
          <Route path='/update/:userid' element={<RequireAuth><Updateinput /></RequireAuth>} />
        
          <Route path='/maintenceupdate/:userid' element={<RequireAuth><Maintenceupdate /></RequireAuth>} />

      
          <Route path='/login' element={<RequireAuthlogin><Login /></RequireAuthlogin>} />


{/*---------------------------------------------All projects routes--------------------------------------*/}
          <Route path='/newproject' element={<RequireAuth><Newproject /></RequireAuth>} />


 {/* --------------------------------------------All Input routes----------------------------------------*/}
 <Route path='/newinput' element={<RequireAuth><Newinput /></RequireAuth>} />


        

      
          <Route path='/forgetpassword' element={<RequireAuthlogin><Forgetpassword /></RequireAuthlogin>} />
        

      
          <Route path='/workers' element={<RequireAuth><WorkerTable /></RequireAuth>} />
        

      
          <Route path='/workerinput' element={<RequireAuth><Workerinput /></RequireAuth>} />
        

      
          <Route path='/addnewWorker' element={<RequireAuth><Addnewworker /></RequireAuth>} />
        

      
          <Route path='/allworkers' element={<RequireAuth><Allworkers /></RequireAuth>} />
        

      
          <Route path='/singleWorker/:userid' element={<RequireAuth><Singleworker /></RequireAuth>} />
        

      
          <Route path='/updateworker/:userid' element={<RequireAuth><Updateworkers /></RequireAuth>} />
        
          <Route path='/repareupdate/:userid' element={<RequireAuth><Repairingupdate /></RequireAuth>} />
      
          <Route path='/attendance' element={<RequireAuth><Attandence /></RequireAuth>} />
        

      
          <Route path='/addproducts' element={<RequireAuth><Addproducts /></RequireAuth>} />
        

      
          <Route path='/allproducts' element={<RequireAuth><Productstable /></RequireAuth>} />
        
          <Route path='/maintenance' element={<RequireAuth><Maintence /></RequireAuth>} />
          <Route path='/maintenceInput' element={<RequireAuth><MaintenceInput /></RequireAuth>} />
          <Route path='/repareInput' element={<RequireAuth><Repareinput /></RequireAuth>} />
          <Route path='/invoice' element={<RequireAuth><Invoice /></RequireAuth>} />
        

      
          <Route path='/editproduct/:productid' element={<RequireAuth><Editproducts /></RequireAuth>} />
        </Routes>
      </BrowserRouter>




    </div>
  )
}

export default App
