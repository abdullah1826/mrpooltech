import React from "react";
import Sidebar from "../components/Sidebar";
import upper from "../imgs/pooltecuper.jpeg";
import { TbPlaylistAdd } from "react-icons/tb";
import { Link } from "react-router-dom";
import { GiAutoRepair } from "react-icons/gi";
import { FaSwimmingPool, FaWrench } from "react-icons/fa";

const Home = () => {
  return (
    <div className="flex w-[100%] h-[auto]  items-start justify-between">
      
      <Sidebar/>
      <div className="w-[100%]   flex items-start justify-center ">
        <div className=" w-[100%] ">
          <img src={upper} className="w-[100%]" />
          <div class=" w-[100%]  ">
            <h2 className="text-2xl sm:text-3xl font-extrabold self-center flex justify-center sm:justify-start text-[#000] tracking-wide  sm:ml-7 mt-12">
              All Projects
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-around gap-5 items-center mt-2 w-full min-h-[180px]">
              <Link to="/newproject">
                <div className="h-[120px] w-[200px] rounded-lg bg-[#0b6e99] shadow-md border flex flex-col gap-3 justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                  <TbPlaylistAdd className="h-[32px] w-[32px] text-white" />
                  <h2 className="text-white text-md font-medium text-center">
                    New Pool Projects
                  </h2>
                </div>
              </Link>

              <Link to="/maintenance">
                <div className="h-[120px] w-[200px] rounded-lg bg-[#0b6e99] shadow-md border flex flex-col gap-3 justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                  <GiAutoRepair className="h-[32px] w-[32px] text-white" />
                  <h2 className="text-white text-md font-medium text-center">
                    Maintenance Projects
                  </h2>
                </div>
              </Link>

              <Link to="/repairing">
                <div className="h-[120px] w-[200px] rounded-lg bg-[#0b6e99] shadow-md border flex flex-col gap-3 justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                  <FaWrench className="h-[32px] w-[32px] text-white" />
                  <h2 className="text-white text-md font-medium text-center">
                    Repairing Projects
                  </h2>
                </div>
              </Link>

              <Link to="/otherproject">
                <div className="h-[120px] w-[200px] rounded-lg bg-[#0b6e99] shadow-md border flex flex-col gap-3 justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                  <FaSwimmingPool className="h-[32px] w-[32px] text-white" />
                  <h2 className="text-white text-md font-medium text-center">
                    Other Projects
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

export default Home;
