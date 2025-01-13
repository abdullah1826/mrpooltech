import React from "react";
import Sidebar from "../../components/Sidebar";
import { onValue, push, ref, update } from "firebase/database";
import { db } from "../../Firbase";
import { useState } from "react";
import Select from "react-select";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import VolumeCalculateModal from "../../components/VolumeCalculateModal";
import { TbRulerMeasure } from "react-icons/tb";
const MaintenceInput = () => {
    let [worker, setWorker] = useState(null);
    const navigate = useNavigate();
    const [data, setData] = useState({
        site: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        poolSize: "",
        poolShape: "",
        owner: "",
        ownerMobile: "",
        worker: worker,
        area: "",
        operater:"",
        referance:"",
        attendant:"",
        attendantPhone:"",
        amount:"",
        id:"",

      });
      let [allWorkers, setAllWorkers] = useState([]);
      let [otherWorkers, setotherWorkers] = useState([]);
      let [workers, setWorkers] = useState([]);
      let [visitingWorkers, setVisitinWorkers] = useState([]);
      let [options, setOptions] = useState([]);
      const [modalopen, setModalOpen] = useState(false);
      const [totalVolume, setTotalVolume] = useState('');
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
    if (data.site) {
        const pushKeyRef = push(ref(db, 'Maintenance/'));
        const pushKey = pushKeyRef.key;
    
        update(ref(db, `Maintenance/${pushKey}`), {
          id: pushKey,
          site: data.site,
          status: true,
          activeDate: data.activeDate,
          inactiveDate: data.inactiveDate,
          poolSize: data.poolSize,
          poolShape: data.poolShape,
          owner: data.owner,
          ownerMobile: data.ownerMobile,
          worker:worker?.label,
          area: data.area,
          operater: data.operater,
          referance: data.referance,
          attendant: data.attendant,
          attendantPhone: data.attendantPhone,
          amount: data.amount,
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
        navigate(`/maintenance`);
      }, 1500);
      setData({
        id:"",
        site: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        poolSize: "",
        poolShape: "",
        owner: "",
        ownerMobile: "",
         worker: worker,
        area: "",
        operater:"",
        referance:"",
        attendant:"",
        attendantPhone:"",
        amount:"",
      });
    }
  };
  let handleAdd=()=>{
    setData({ ...data, poolSize: totalVolume });
    handleClose()
  }
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
  return (
    <>
    <VolumeCalculateModal handleAdd={handleAdd}  totalVolume={totalVolume} setTotalVolume={setTotalVolume} modalopen={modalopen} handleclose={handleClose}/>
    <div className="flex w-[100%] ">
      <Sidebar />
      
      <div className="relative w-[100%] ">
        <div className=" mt-[50px] ">
        <div className="flex flex-col w-[30%] ml-[20px] mt-[5px]">
        <h2 className="text-[17px] mb-2">Worker</h2>
        <Select onChange={setWorker} value={worker} options={options} />
      </div>
          <div className="flex  ">
            <div className="  flex justify-between flex-wrap ml-[20px] h-[320px] mt-[50px] flex-col">
              <div className="flex flex-col">
                <h2 className="text-[17px]">Site</h2>
                <input
                  type="text"
                  placeholder="Site"
                  className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                  onChange={(e) => {
                    setData({ ...data, site: e.target.value });
                  }}
                  value={data.site}
                />
              </div>
              <div className="flex flex-col mt-[25px]">
                <h2 className="text-[17px]">Area</h2>
                <input
                  type="email"
                  placeholder="area"
                  className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                  onChange={(e) => {
                    setData({ ...data, area: e.target.value });
                  }}
                  value={data.area}
                />
              </div>
              <div className="flex flex-col mt-5  items-center w-[100%]">
              <h2 className="text-[17px] w-[100%] mb-2">Pool shape</h2>
              <select
                className="p-2 border w-[100%] border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                onChange={(e) => {
                  setData({ ...data, poolShape: e.target.value });
                }}
                value={data.poolShape}
              >
                {optionsss.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  
                  </option>
                ))}
              </select>
            </div>
          
            <div className="flex flex-col mt-[31px]">
            <h2 className="text-[17px]">Start project</h2>
            <input
              type="date"
              placeholder="Joining Date"
              className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
              onChange={(e) => {
                setData({ ...data, activeDate: e.target.value });
              }}
              value={data.activeDate}
            />
          </div>
              {/* <div className=" css-b62m3t-container">
                  <span
                    id="react-select-2-live-region"
                    className="css-7pg0cj-a11yText"
                  ></span>
                  <span
                    aria-live="polite"
                    aria-atomic="false"
                    aria-relevant="additions text"
                    className="css-7pg0cj-a11yText"
                  ></span>
                  <div className=" css-13cymwt-control">
                    <div className=" css-hlgwow">
                      <div
                        className=" css-1jqq78o-placeholder"
                        id="react-select-2-placeholder"
                      >
                        Select Worker
                      </div>
                      <div className=" css-19bb58m" data-value="">
                        <input
                          className=""
                          autocapitalize="none"
                          autocomplete="off"
                          autocorrect="off"
                          id="react-select-2-input"
                          spellcheck="false"
                          tabindex="0"
                          type="text"
                          aria-autocomplete="list"
                          aria-expanded="false"
                          aria-haspopup="true"
                          role="combobox"
                          aria-describedby="react-select-2-placeholder"
                          value=""
                          style="color: inherit; background: 0px center; opacity: 1; width: 100%; grid-area: 1 / 2 / auto / auto; font: inherit; min-width: 2px; border: 0px; margin: 0px; outline: 0px; padding: 0px;"
                        />
                      </div>
                    </div>
                    <div className=" css-1wy0on6">
                      <span className=" css-1u9des2-indicatorSeparator"></span>
                      <div
                        className=" css-1xc3v61-indicatorContainer"
                        aria-hidden="true"
                      >
                        <svg
                          height="20"
                          width="20"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          focusable="false"
                          className="css-8mmkcg"
                        >
                          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="flex justify-between flex-wrap ml-[20px] h-[320px] mt-[50px]  flex-col">
              <div className="flex flex-col ">
                <h2 className="text-[17px]">Owner</h2>
                <input
                  type="text"
                  placeholder="Owner name"
                  className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                  onChange={(e) => {
                    setData({ ...data, owner: e.target.value });
                  }}
                  value={data.owner}
                />
              </div>
              <div className="flex flex-col mt-[30px]">
                <h2 className="text-[17px]">Owner Mobile</h2>
                <input
                  type="number"
                  placeholder="Phone number"
                  className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                  //   style="appearance: none;"
                  onChange={(e) => {
                    setData({ ...data, ownerMobile: e.target.value });
                  }}
                  value={data.ownerMobile}
                />
              </div>
              <div className="flex flex-col mt-[25px] relative">
              <h2 className="text-[17px]">Pool Size</h2>
              <input
                type="text"
                placeholder="Pool size"
                className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                onChange={(e) => {
                  setData({ ...data, poolSize: e.target.value });
                }}
                value={data.poolSize}
               
              />
              <TbRulerMeasure onClick={()=>handleOpen()} className="absolute text-[30px] cursor-pointer right-0 top-5" />
            </div>
              <div className="flex flex-col mt-[28px]">
                <h2 className="text-[17px]">Complete project</h2>
                <input
                  type="date"
                  placeholder="Joining Date"
                  className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                  onChange={(e) => {
                    setData({ ...data, inactiveDate: e.target.value });
                  }}
                  value={data.inactiveDate}
                />
              </div>
            </div>
            <div className="flex justify-between flex-wrap ml-[20px] h-[414px] mt-[50px]  flex-col">
            <div className="flex flex-col ">
              <h2 className="text-[17px]">Operater</h2>
              <input
                type="text"
                placeholder="Operater"
                className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                onChange={(e) => {
                  setData({ ...data, operater: e.target.value });
                }}
                value={data.operater}
              />
            </div>
            <div className="flex flex-col mt-[25px]">
              <h2 className="text-[17px]">Referance</h2>
              <input
                type="number"
                placeholder="Referance"
                className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                //   style="appearance: none;"
                onChange={(e) => {
                  setData({ ...data, referance: e.target.value });
                }}
                value={data.referance}
              />
            </div>
            <div className="flex flex-col mt-[25px]">
              <h2 className="text-[17px]">Attendant</h2>
              <input
                type="text"
                placeholder="Attendant"
                className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                onChange={(e) => {
                  setData({ ...data, attendant: e.target.value });
                }}
                value={data.attendant}
              />
            </div>
            <div className="flex flex-col mt-[25px]">
              <h2 className="text-[17px]">Attendant Phone</h2>
              <input
                type="text"
                placeholder="Attendant Phone"
                className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                onChange={(e) => {
                  setData({ ...data, attendantPhone: e.target.value });
                }}
                value={data.attendantPhone}
              />
            </div>
            <div className="flex flex-col mt-[25px]">
            <h2 className="text-[17px]">Amount</h2>
            <input
              type="text"
              placeholder="Amount"
              className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
              onChange={(e) => {
                setData({ ...data, amount: e.target.value });
              }}
              value={data.amount}
            />
          </div>
          
          </div>
          </div>
          <div className="w-[95%] flex justify-end">
          <button
            className="h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px]  mt-[30px]"
            onClick={() => addData()}
          >
            Submit
          </button>
          </div>
        </div>
      </div>
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
  );
};

export default MaintenceInput;
