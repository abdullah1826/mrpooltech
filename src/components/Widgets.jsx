import React, { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../Firbase";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const Widgets = ({ mylist }) => {
  // ------------------------geting the user data from firebase---------------------
  // const [mylist, setmylist] = useState([]);
  // useEffect(() => {
  //   let getingdata = async () => {

  //     const starCountRef = ref(db, '/userdata');
  //     onValue(starCountRef, async (snapshot) => {
  //       const data = await snapshot.val();

  //       MediaKeyStatusMap
  //       setmylist(Object.values(data))

  //     });
  //   }

  //   getingdata();

  // }, [])

  const allusers = mylist.length;

  // console.log(allusers);

  const activeusersarray = mylist.filter((elm) => {
    return elm.status === true;
  });

  const activeUsers = activeusersarray.length;

  const notActiveUsersArray = mylist.filter((elm) => {
    return elm.status === false;
  });

  const notActiveUsers = notActiveUsersArray.length;

  // ---------------------------Chart Js--------------------------------------------

  ChartJs.register(ArcElement, Tooltip);

  const data1 = {
    datasets: [
      {
        label: "All Sites",
        data: [allusers],
        backgroundColor: ["#35A1CC"],
      },
    ],
  };

  const data2 = {
    labels: ["All sites", "Active sites"],
    datasets: [
      {
      
        data: [allusers, activeUsers],
        backgroundColor: ["#0098d4", "#51c7e1"],
      },
    ],
  };

  const data3 = {
    labels: ["All sites", "Inactive Sites"],
    datasets: [
      {
        data: [allusers, notActiveUsers],
        backgroundColor: ["#0098d4", "red"],
      },
    ],
  };

  return (
    <div className=" w-[100%] h-auto mb-10">
      {/* <h2 className='text-2xl font-[500] ml-[50px] mt-6'>Overview</h2> */}
      <div className="flex justify-around flex-wrap mt-6 w-[100%] gap-5 h-[180px] ">
        <div className="h-[180px] w-[280px] rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 shadow-lg border border-blue-200 transition-transform hover:scale-105 hover:shadow-2xl pt-4 pb-9 px-6 flex flex-col justify-between">
          <p className="font-[450] mt-2 ml-[10px] text-xl">All Sites</p>
          <div className="flex justify-around w-[190px] h-[70px] ">
            <div className="h-[90px] w-[90px] bg-white p-2 rounded-full shadow-md">
              <Doughnut  data={data1} />
            </div>
            <div>
              <h2 className="text-4xl mt-5">{allusers}</h2>
              <p>sites</p>
            </div>
          </div>
        </div>
        {/* <div className='h-[120px] w-[210px]  border rounded-lg bg-[#DAECF3] flex justify-center items-center flex-col'>
          <h2 className='text-5xl'>0</h2>
          <p>Blocked users</p>
        </div> */}

        <div className="h-[180px] w-[280px] rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 shadow-lg border border-blue-200 transition-transform hover:scale-105 hover:shadow-2xl  pt-4 pb-9 px-6 flex flex-col justify-between">
          <p className="font-[450] mt-2 ml-[10px] text-xl">Active Sites</p>
          <div className="flex justify-around w-[190px] h-[70px] ">
            <div className="h-[90px] w-[90px] bg-white p-2 rounded-full shadow-md">
              <Doughnut data={data2}></Doughnut>
            </div>
            <div>
              <h2 className="text-4xl mt-5">{activeUsers}</h2>
              <p>sites</p>
            </div>
          </div>
        </div>

        <div className="h-[180px] w-[280px] rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 shadow-lg border border-blue-200 transition-transform hover:scale-105 hover:shadow-2xl pt-4 pb-9 px-6 flex flex-col justify-between">
          <p className="font-[450] mt-2 ml-[10px] text-xl">Inactive Sites</p>
          <div className="flex justify-around w-[190px] h-[70px] ">
            <div className="h-[90px] w-[90px] bg-white p-2 rounded-full shadow-md">
              <Doughnut data={data3}></Doughnut>
            </div>
            <div>
              <h2 className="text-4xl mt-5">{notActiveUsers}</h2>
              <p>sites</p>
            </div>
          </div>
        </div>

        {/* <div className='h-[120px] w-[210px]  border rounded-lg bg-[#DAECF3] flex justify-center items-center flex-col'>
          <h2 className='text-5xl'>{activeUsers}</h2>
          <p>Active users</p>
        </div>
        <div className='h-[120px] w-[210px]  border rounded-lg bg-[#DAECF3] flex justify-center items-center flex-col'>
          <h2 className='text-5xl'>{notActiveUsers}</h2>
          <p>Inactive users</p>
        </div> */}
      </div>
    </div>
  );
};

export default Widgets;
