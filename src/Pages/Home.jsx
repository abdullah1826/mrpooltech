import React from "react";
import Sidebar from "../components/Sidebar";
import upper from '../imgs/pooltecuper.jpeg'
import {TbPlaylistAdd} from 'react-icons/tb'
import { Link } from "react-router-dom";
import { GiAutoRepair } from "react-icons/gi";
import { FaSwimmingPool, FaWrench } from "react-icons/fa";

const Home = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <div>
        <div>
          <img src={upper} />
          <div class=" w-[100%] h-max ">
            <h2 class="text-2xl font-[500] ml-[50px] mt-12">All Projects</h2>
            <div class="flex justify-around items-center flex-wrap mt-2 w-[100%] h-[180px]">
              
                <Link to="/newproject">
                <div class="h-[120px] w-[200px]   rounded-lg bg-[#0b6e99]  shadow-md border flex justify-center items-center cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                    <TbPlaylistAdd className="h-[32px] w-[32px] text-white mr-1"/>
                 
                  <h2 class="text-white font-medium ml-1">New Pool Projects</h2>
                </div>
                </Link>
              
              <Link to="/maintenance">
                <div class="h-[120px] w-[210px]   rounded-lg bg-[#0b6e99]  shadow-md border flex justify-center items-center cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                    <GiAutoRepair className="h-[32px] w-[32px] text-white mr-1"/>
                  
                  <h2 class="text-white font-medium ">Maintenance Projects</h2>
                </div>

              </Link>
              
              <Link to="/repairing">
                <div class="h-[120px] w-[200px]   rounded-lg bg-[#0b6e99]  shadow-md border flex justify-center items-center cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                    <FaWrench className="h-[32px] w-[32px] text-white mr-1"/>
                  
                  <h2 class="text-white font-medium ml-1">
                    Repairing Projects
                  </h2>
                </div>
                </Link>
             
              <Link to="/other">
                <div class="h-[120px] w-[200px]   rounded-lg bg-[#0b6e99]  shadow-md border flex justify-center items-center cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                    <FaSwimmingPool className="h-[32px] w-[32px] text-white mr-1"/>
                  
                  <h2 class="text-white font-medium ml-1">Other Projects</h2>
                </div>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
