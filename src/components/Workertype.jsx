import React from "react";
import Sidebar from "../components/Sidebar";
import upper from '../imgs/pooltecuper.jpeg'
import {TbPlaylistAdd} from 'react-icons/tb'
import { Link } from "react-router-dom";
import { GiAutoRepair } from "react-icons/gi";
import { FaSwimmingPool, FaWrench } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { FaUsersCog } from "react-icons/fa";

const Workertype = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <div>
        <div>
          <img src={upper} />
          <div class=" w-[100%] h-max ">
            <h2 class="text-2xl font-[500] ml-[50px] mt-12">All Workers</h2>
            <div class="flex justify-around items-center flex-wrap mt-2 w-[100%] h-[180px]">
              
                <Link to="/Permanentworkers">
                <div class="h-[140px] w-[240px]   rounded-lg bg-[#0b6e99]  shadow-md border flex justify-center items-center cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                    <FaUserCheck className="h-[32px] w-[32px] text-white mr-1"/>
                 
                  <h2 class="text-white font-medium ml-1">Permanent workers</h2>
                </div>
                </Link>
              
              <Link to="/Visitingworkers">
                <div class="h-[140px] w-[240px]   rounded-lg bg-[#0b6e99]  shadow-md border flex justify-center items-center cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                    <FaUserCog className="h-[32px] w-[32px] text-white mr-1"/>
                  
                  <h2 class="text-white font-medium ">Visiting workers</h2>
                </div>

              </Link>
              
              <Link to="/otherworker">
                <div class="h-[140px] w-[240px]   rounded-lg bg-[#0b6e99]  shadow-md border flex justify-center items-center cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                    <FaUsersCog className="h-[32px] w-[32px] text-white mr-1"/>
                  
                  <h2 class="text-white font-medium ml-1">
                    Other workers
                  </h2>
                </div>
                </Link>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workertype;
