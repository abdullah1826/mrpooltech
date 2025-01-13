import { onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../Firbase';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";
import VolumeCalculateModal from './VolumeCalculateModal';
import { TbRulerMeasure } from 'react-icons/tb';

const Updateinput = () => {



    const navigate = useNavigate();
    const [data, setData1] = useState({
        site: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        poolSize: "",
        poolShape: "",
        owner: "",
        ownerMobile: "",
        // worker: "",
        area: "",
      });
      let [allWorkers, setAllWorkers] = useState([]);
      let [otherWorkers, setotherWorkers] = useState([]);
      let [workers, setWorkers] = useState([]);
      let [visitingWorkers, setVisitinWorkers] = useState([]);
      let [options, setOptions] = useState([]);
      let [worker, setWorker] = useState(null);
      const [totalVolume, setTotalVolume] = useState('');
      const [poolshape, setPoolshape] = useState('');
      const [modalopen, setModalOpen] = useState(false);
    
      const handleOpen = () => {
        setModalOpen(true);
      };
    
      const handleClose = () => {
        setModalOpen(false);
      };
    
      // ------------------------geting data from firebase---------------------
    
      useEffect(() => {
        let getingdata = async () => {
          const starCountRef = ref(db, "/workers");
          onValue(starCountRef, async (snapshot) => {
            const data = await snapshot.val();
            //  console.log(data)
            // MediaKeyStatusMap
            setWorkers(Object.values(data));
            // updateStarCount(postElement, data);
          });
    
          const starCountRef2 = ref(db, "/visitingWorkers");
          onValue(starCountRef2, async (snapshot2) => {
            const data2 = await snapshot2.val();
            //  console.log(data)
            // MediaKeyStatusMap
            setVisitinWorkers(Object.values(data2));
            // updateStarCount(postElement, data);
          });
    
          const starCountRef3 = ref(db, "/otherWorkers");
          onValue(starCountRef3, async (snapshot3) => {
            const data3 = await snapshot3.val();
            //  console.log(data)
            // MediaKeyStatusMap
            setotherWorkers(Object.values(data3));
            // updateStarCount(postElement, data);
          });
        };
    
        getingdata();
      }, []);
    
      useEffect(() => {
        var newArray = workers?.concat(otherWorkers, visitingWorkers);
        setAllWorkers(newArray);
      }, [workers, otherWorkers, visitingWorkers]);
    
      useEffect(() => {
        setOptions([]);
        allWorkers?.map((elm) => {
          // return setOptions([...options, { value: elm.id, label: elm.workerName }]);
          return setOptions((prev) => [
            ...prev,
            { value: elm.id, label: elm.workerName },
          ]);
        });
      }, [allWorkers]);
    
      console.log(options);
    
      const date = new Date();
    
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${year}-${month}-${day}`;
      const addData = () => {
        if (!data.site || !data.area || !worker) {
          toast.warn("Site, area, and worker fields should not be empty.");
          return;
        }
        if (data.site && data.area) {
          const pushKeyRef = push(ref(db, 'NewProjects/'));
            const pushKey = pushKeyRef.key;
        
            update(ref(db, `NewProjects/${pushKey}`), {
              id: pushKey,
               site: data.site,
                        area: data.area,
                        owner: data.owner,
                        ownerMobile: data.ownerMobile,
                        poolSize: data.poolSize,
                        poolShape: data.poolShape,
                        activeDate: data.activeDate,
                        inactiveDate: data.inactiveDate,
                        status: data.status,
                        worker:worker?.label,
          }).then(() => {
            let isPermanent = workers?.some((elm) => {
              return elm?.id === worker.value;
            });
    
            let isVisiting = visitingWorkers?.some((elm) => {
              return elm?.id === worker.value;
            });
    
            let isOther = otherWorkers?.some((elm) => {
              return elm?.id === worker.value;
            });
    
            if (isPermanent) {
              update(ref(db, `workers/${worker.value}/assignedSites/${pushKey}`), {
                id: pushKey,
                siteName: data.site,
                siteUid: pushKey,
              });
            } else if (isVisiting) {
              update(
                ref(db, `visitingWorkers/${worker.value}/assignedSites/${pushKey}`),
                {
                  id: pushKey,
                  siteName: data.site,
                  siteUid: pushKey,
                }
              );
            } else if (isOther) {
              update(
                ref(db, `otherWorkers/${worker.value}/assignedSites/${pushKey}`),
                {
                  id: pushKey,
                  siteName: data.site,
                  siteUid: pushKey,
                }
              );
            }
          });
          toast.success("Record added successfully")
          setTimeout(() => {
            navigate(`/newproject`);
          }, 1500);
          setData1({
            site: "",
            status: true,
            activeDate: "",
            inactiveDate: "",
            poolSize: "",
            poolShape: "",
            owner: "",
            ownerMobile: "",
            // worker: "",
            area: "",
          });
        }
      };
      const optionsss = [
        {
          label: "Select shape",
          value: "Select shape",
          imageUrl: "",
        },
        {
          label: "Rectangular",
          value: "Rectangular",
          imageUrl: "",
        },
        {
          label: "Circle",
          value: "Circle",
          imageUrl: "https://via.placeholder.com/20x20.png?text=C",
        },
        {
          label: "Kidney",
          value: "Kidney",
          imageUrl: "https://via.placeholder.com/20x20.png?text=AR",
        }, {
          label: "Roman",
          value: "Roman",
          imageUrl: "https://via.placeholder.com/20x20.png?text=AR",
        }, {
          label: "Grecian",
          value: "Grecian",
          imageUrl: "https://via.placeholder.com/20x20.png?text=AR",
        }, {
          label: "Free form",
          value: "Free form",
          imageUrl: "https://via.placeholder.com/20x20.png?text=AR",
        }
      ];
      
      const CustomSelect = () => {
        const [data, setData1] = useState({ poolShape: '' });
      
        const handleSelectChange = (e) => {
          setData1({ ...data, poolShape: e.target.value });
        };
      }
      let handleAdd=()=>{
        setData({ ...mydata, poolSize:totalVolume })
        handleClose()
      }
    const [mydata, setData] = useState({
        site:" ",
        area: " ",
        owner: " ",
        ownerMobile:" ",
        poolSize: " ",
        poolShape: " ",
        activeDate: " ",
        inactiveDate: " ",
        status: " ",
        worker:" ",
    })

    const params = useParams()
    const uid = params.userid
    useEffect(() => {
        let getingdata = async () => {

            const starCountRef = ref(db, `/NewProjects/${uid}`);
            onValue(starCountRef, async (snapshot) => {
                const data = await snapshot.val();
                //  console.log(data)
                MediaKeyStatusMap

                setData({
                    site: data.site,
                    area: data.area,
                    owner: data.owner,
                    ownerMobile: data.ownerMobile,
                    poolSize: data.poolSize,
                    poolShape: data.poolShape,
                    activeDate: data.activeDate,
                    inactiveDate: data.inactiveDate,
                    status: data.status,
                    worker:data?.worker,

                })
                // setfiltered(Object.values(data))

                // updateStarCount(postElement, data);
            });
        }

        getingdata();


    }, [])





    const updateData = () => {
        if (!mydata.site || !mydata.area ) {
            toast.warn("Site and area fields should not be empty.");
            return;
          }
          
        if (mydata.site && mydata.area) {
            update(ref(db, `NewProjects/${uid}`), mydata)
            setData({
                site:" ",
                area: " ",
                owner: " ",
                ownerMobile:" ",
                poolSize: " ",
                poolShape: " ",
                activeDate: " ",
                inactiveDate: " ",
                status: " ",
                worker:" ",
            })
            toast.success("Update record successfully")
            setTimeout(() => {
                navigate(`/newproject`);
              }, 1500);
        }
       
    }
    const handleWorkerChange = selectedOption => {
    
        setData({
          ...mydata,
          worker: selectedOption?.label,
        });
      };
      
    return (
        <>
        <VolumeCalculateModal handleAdd={handleAdd} modalopen={modalopen} totalVolume={totalVolume} setTotalVolume={setTotalVolume} handleclose={handleClose}/>
            <div className='flex  w-[70%] '>
                <Sidebar />
                
                {/* <h1 className='text-xl font-[500] ml-[80px]  mt-[20px]'>Enter the data</h1> */}
                <div className='flex  flex-col  mt-10 w-[100%]'>
                <div className='flex flex-col mt-10 w-[100%]'>
                <div className="flex flex-col w-[44%] ml-[50px] mt-[5px]">
                  <h2 className="text-[17px] mb-2">Worker</h2>
                  <Select 
                    onChange={handleWorkerChange} 
                    value={options.find(option => option.label === mydata.worker)} 
                    options={options} 
                  />
                </div>
              </div>
                <div className='flex justify-between w-[100%]'>
                <div className='w-[100%] flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px] flex-col'>
               
                    <div className='flex flex-col'>
                        <h2 className='text-[17px]' > Site Name</h2>
                        <input type="text" placeholder='Site Name' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, site: e.target.value }) }} value={mydata?.site} />
                    </div>
                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-[17px]'>Area</h2>
                        <input type="text" placeholder='Area' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, area: e.target.value }) }} value={mydata?.area} />
                    </div>
                    <div className="flex flex-col mt-5 items-center w-[100%]">
                    <h2 className="text-[17px] w-[100%] mb-2">Pool shape</h2>
                    <select
                      className="p-2 border w-[100%] border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      onChange={(e) => { setData({ ...mydata, poolShape: e.target.value }) }} value={mydata?.poolShape}
                    >
                      {optionsss.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                          <img src={option.imageUrl}/>
                        </option>
                      ))}
                    </select>
                  </div>
                     
 <div className='flex flex-col mt-[25px]'>
<h2 className='text-[17px]'>Start project</h2>
<input type="date" placeholder='Active Date' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, activeDate: e.target.value }) }} value={mydata?.activeDate} />
</div>
                </div>

                <div className='  flex justify-between flex-wrap ml-[50px] h-[320px] mt-[50px]  flex-col'>
                    <div className='flex flex-col '>
                        <h2 className='text-[17px]'>Owner Name</h2>
                        <input type="text" placeholder='Owner Name' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, owner: e.target.value }) }} value={mydata?.owner} />
                    </div>


                    <div className='flex flex-col mt-[25px]'>
                        <h2 className='text-[17px]'>Owner Mobile</h2>
                        <input type="text" placeholder='Owner Mobile' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, ownerMobile: e.target.value }) }} value={mydata?.ownerMobile} />
                    </div>
                        <div className="flex flex-col mt-[25px] relative">
                    <h2 className="text-[17px]">Pool Size</h2>
                    <input
                      type="text"
                      placeholder="Pool size"
                      className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                      onChange={(e) => { setData({ ...mydata, poolSize: e.target.value }) }} value={mydata?.poolSize}
                     
                    />
                    <TbRulerMeasure onClick={()=>handleOpen()} className="absolute text-[30px] cursor-pointer right-0 top-5" />
                  </div>
               
                        <div className='flex flex-col mt-[25px]'>
                            <h2 className='text-[17px]'>Complete project</h2>
                            <input type="date" placeholder='InActive Date' className='h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm' onChange={(e) => { setData({ ...mydata, inactiveDate: e.target.value }) }} value={mydata?.inactiveDate} />
                        </div>
                 

                </div>
                </div>
                </div>


            </div>
            <div className="w-[73%] mt-[-100px] flex justify-end">
            <button className='h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px] ' onClick={updateData}>Update</button>
            </div>
            <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            />
        </>




    )
}

export default Updateinput