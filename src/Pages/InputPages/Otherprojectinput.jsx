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
const Otherprojectinput = () => {
  const navigate = useNavigate();
    let [worker, setWorker] = useState(null);
    const [data, setData] = useState({
        site: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        owner: "",
        ownerMobile: "",
        worker: worker,
        area: "",
        ourCost:"",
        id:"",
        projectType:"",
        qoutation:"",
        workerAmount:"",


      });
      let [allWorkers, setAllWorkers] = useState([]);
      let [otherWorkers, setotherWorkers] = useState([]);
      let [workers, setWorkers] = useState([]);
      let [visitingWorkers, setVisitinWorkers] = useState([]);
      let [options, setOptions] = useState([]);
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
    if (data.site) {
        const pushKeyRef = push(ref(db, 'OtherProjects/'));
        const pushKey = pushKeyRef.key;
    
        update(ref(db, `OtherProjects/${pushKey}`), {
          id: pushKey,
          site: data?.site,
          status: true,
          activeDate: data?.activeDate,
          inactiveDate: data?.inactiveDate,
          owner: data?.owner,
          ownerMobile: data?.ownerMobile,
          worker:worker?.label,
          area: data?.area,
          ourCost:data?.ourCost,
          projectType:data?.projectType,
          qoutation:data?.qoutation,
          workerAmount:data?.workerAmount,
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
        navigate(`/otherproject`);
      }, 1500);
      setData({
        site: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        poolSize: "",
        poolShape: "",
        owner: "",
        ownerMobile: "",
        worker: worker?.label,
        area: "",
        ourCost:"",
        id:"",
        projectType:"",
        qoutation:"",
        workerAmount:"",
      });
    }
  };

  return (
    <>
    <VolumeCalculateModal modalopen={modalopen} handleclose={handleClose}/>
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
              <div className="flex flex-col mt-[25px]">
                <h2 className="text-[17px]">Project Type</h2>
                <input
                  type="text"
                  placeholder="Project type"
                  className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                  onChange={(e) => {
                    setData({ ...data, projectType: e.target.value });
                  }}
                  value={data.projectType}
                />
              </div>
              <div className="flex flex-col mt-[25px]">
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
              <div className="flex flex-col mt-[25px]">
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
              <div className="flex flex-col mt-[25px]">
              <h2 className="text-[17px]">Worker Amount</h2>
              <input
                type="text"
                placeholder="Worker Amount"
                className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                onChange={(e) => {
                  setData({ ...data, workerAmount: e.target.value });
                }}
                value={data.workerAmount}
              />
            </div>
              <div className="flex flex-col mt-[25px]">
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
            <div className="flex  flex-wrap ml-[20px] h-[380px] mt-[50px]  flex-col">
            <div className="flex flex-col ">
              <h2 className="text-[17px]">Our cost</h2>
              <input
                type="text"
                placeholder="Our cost"
                className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
                onChange={(e) => {
                  setData({ ...data, ourCost: e.target.value });
                }}
                value={data.ourCost}
              />
            </div>
            <div className="flex flex-col mt-[32px]">
            <h2 className="text-[17px]">Qoutation amount</h2>
            <input
              type="text"
              placeholder="Repairing qoutation"
              className="h-[28px] w-[310px] text-[13px] border-b-[1px] border-[#464141]  p-1 outline-none placeholder:text-sm"
              onChange={(e) => {
                setData({ ...data, qoutation: e.target.value });
              }}
              value={data.qoutation}
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

export default Otherprojectinput;
