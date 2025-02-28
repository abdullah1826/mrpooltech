import { onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firbase";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import VolumeCalculateModal from "./VolumeCalculateModal";
import { TbRulerMeasure } from "react-icons/tb";
import NewProducts from "../components/NewProducts";
import CostItems from "../components/CostItems";

const Updateinput = () => {
  const navigate = useNavigate();
  // const [data, setData1] = useState({
  //     site: "",
  //     status: true,
  //     activeDate: "",
  //     inactiveDate: "",
  //     poolSize: "",
  //     poolShape: "",
  //     owner: "",
  //     ownerMobile: "",
  //     // worker: "",
  //     area: "",
  //   });
  let [allWorkers, setAllWorkers] = useState([]);
  let [otherWorkers, setotherWorkers] = useState([]);
  let [workers, setWorkers] = useState([]);
  let [visitingWorkers, setVisitinWorkers] = useState([]);
  let [options, setOptions] = useState([]);
  let [worker, setWorker] = useState(null);
  const [totalVolume, setTotalVolume] = useState("");
  const [quotationTotal, setQuotationTotal] = useState("");

  const [poolshape, setPoolshape] = useState("");
  const [modalopen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);

  // console.log(products);

  // const [items, setItems] = useState([
  //   {
  //     itemsName: "",
  //     unit: "",
  //     quantity: 0,
  //     price: 0,
  //     total: 0,
  //     category: null,
  //     itemDescription: "",
  //   },
  // ]);

  const [items, setItems] = useState([]);

  // console.log(items);

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

  // console.log(options);

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;

  // const addData = () => {
  //   if (!data.site || !data.area || !worker) {
  //     toast.warn("Site, area, and worker fields should not be empty.");
  //     return;
  //   }
  //   if (data.site && data.area) {
  //     const pushKeyRef = push(ref(db, 'NewProjects/'));
  //       const pushKey = pushKeyRef.key;

  //       update(ref(db, `NewProjects/${pushKey}`), {
  //         id: pushKey,
  //         projectId: projectId,
  //         products: products.map((product, index) => ({
  //           id: `${pushKey}_${index + 1}`,
  //           productName: product.productName || "N/A",
  //           unit: product.unit || "N/A",
  //           quantity: product.quantity || 0,
  //           price: product.price || 0,
  //           total: product.total || 0,
  //         })),
  //          site: data.site,
  //                   area: data.area,
  //                   owner: data.owner,
  //                   ownerMobile: data.ownerMobile,
  //                   poolSize: data.poolSize,
  //                   poolShape: data.poolShape,
  //                   activeDate: data.activeDate,
  //                   inactiveDate: data.inactiveDate,
  //                   status: data.status,
  //                   worker:worker?.label,
  //                   workerType: worker?.type || "Nill" ,
  //                   QuotationAmount: data.QuotationAmount || "Nill" ,
  //                   AcceptedAmount: data.AcceptedAmount || "Nill" ,
  //                   AdvanceAmount: data.AdvanceAmount || "Nill" ,
  //                   OtherAmount: data.OtherAmount || "Nill" ,
  //                   BalanceAmount: data.BalanceAmount || "Nill" ,
  //     }).then(() => {
  //       let isPermanent = workers?.some((elm) => {
  //         return elm?.id === worker.value;
  //       });

  //       let isVisiting = visitingWorkers?.some((elm) => {
  //         return elm?.id === worker.value;
  //       });

  //       let isOther = otherWorkers?.some((elm) => {
  //         return elm?.id === worker.value;
  //       });

  //       if (isPermanent) {
  //         update(ref(db, `workers/${worker.value}/assignedSites/${pushKey}`), {
  //           id: pushKey,
  //           siteName: data.site,
  //           siteUid: pushKey,
  //         });
  //       } else if (isVisiting) {
  //         update(
  //           ref(db, `visitingWorkers/${worker.value}/assignedSites/${pushKey}`),
  //           {
  //             id: pushKey,
  //             siteName: data.site,
  //             siteUid: pushKey,
  //           }
  //         );
  //       } else if (isOther) {
  //         update(
  //           ref(db, `otherWorkers/${worker.value}/assignedSites/${pushKey}`),
  //           {
  //             id: pushKey,
  //             siteName: data.site,
  //             siteUid: pushKey,
  //           }
  //         );
  //       }
  //     });
  //     toast.success("Record added successfully")
  //     setTimeout(() => {
  //       navigate(`/newproject`);
  //     }, 1500);
  //     setData1({
  //       site: "",
  //       status: true,
  //       activeDate: "",
  //       inactiveDate: "",
  //       poolSize: "",
  //       poolShape: "",
  //       owner: "",
  //       ownerMobile: "",
  //       reference: "",
  //       referenceMobile: "",
  //       QuotationAmount: "",
  //       AcceptedAmount: "",
  //       AdvanceAmount: "",
  //       OtherAmount: "",
  //       BalanceAmount: "",
  //       area: "",
  //     });
  //   }
  // };

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
    },
    {
      label: "Roman",
      value: "Roman",
      imageUrl: "https://via.placeholder.com/20x20.png?text=AR",
    },
    {
      label: "Grecian",
      value: "Grecian",
      imageUrl: "https://via.placeholder.com/20x20.png?text=AR",
    },
    {
      label: "Free form",
      value: "Free form",
      imageUrl: "https://via.placeholder.com/20x20.png?text=AR",
    },
  ];

  // const CustomSelect = () => {
  //   const [data, setData1] = useState({ poolShape: '' });

  //   const handleSelectChange = (e) => {
  //     setData1({ ...data, poolShape: e.target.value });
  //   };
  // }
  let handleAdd = () => {
    setData({ ...prevdata, poolSize: totalVolume });
    handleClose();
  };

  const [data, setData] = useState({
    site: " ",
    area: " ",
    owner: " ",
    ownerMobile: " ",
    poolSize: " ",
    poolShape: " ",
    activeDate: " ",
    inactiveDate: " ",
    status: " ",
    worker: " ",
    reference: "",
    referenceMobile: "",
    quotationAmount: "",
    AcceptedAmount: "",
    AdvanceAmount: "",
    OtherAmount: "",
    BalanceAmount: "",
    area: "",
    workerType: "workerType",
    products: products,
    items: items,
  });

  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      products, // Update the products field
    }));
  }, [products]);

  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      items, // Update the products field
    }));
  }, [items]);

  const params = useParams();
  const uid = params.userid;
  useEffect(() => {
    let getingdata = async () => {
      const starCountRef = ref(db, `/NewProjects/${uid}`);
      onValue(starCountRef, async (snapshot) => {
        const data = await snapshot.val();

        MediaKeyStatusMap;
        console.log(data);
        setData({
          projectId: data.projectId || "",
          items: data.items || [],
          products: data.products || [],
          site: data.site,
          area: data.area || "",
          owner: data.owner || "",
          ownerMobile: data.ownerMobile || "",
          reference :data.reference || "",
          referenceMobile: data.referenceMobile || "",
          poolSize: data.poolSize || "",
          poolShape: data.poolShape || "",
          activeDate: data.activeDate || "",
          inactiveDate: data.inactiveDate || "",
          status: data.status || "",
          worker: data?.worker || "",
          workerType: data.workerType || "", // Proper fallback
          quotationAmount: data.quotationAmount || "",
          AcceptedAmount: data.AcceptedAmount || "",
          AdvanceAmount: data.AdvanceAmount || "",
          OtherAmount: data.OtherAmount || "",
          BalanceAmount: data.BalanceAmount || "",
        });
        setQuotationTotal(data.quotationAmount || "");
        setWorkerType(data.workerType || "");
        setWorker(data.worker || "");
        
        setProducts(data.products || []);
        setItems(data.items || []);
        // setfiltered(Object.values(data))

        // updateStarCount(postElement, data);
      });
    };

    getingdata();
  }, []);

  const updateData = () => {
    if (!data.site || !data.area) {
      toast.warn("Site and area fields should not be empty.");
      return;
    }
  
    if (data.site && data.area) {
      console.log(products);
  
      update(ref(db, `NewProjects/${uid}`), data)
        .then(() => {
          // Check worker category
          let isPermanent = workers?.some((elm) => elm?.id === worker.value);
          let isVisiting = visitingWorkers?.some((elm) => elm?.id === worker.value);
          let isOther = otherWorkers?.some((elm) => elm?.id === worker.value);
  
          const workerPath = isPermanent
            ? `workers/${worker.value}/assignedSites/${pushKey}`
            : isVisiting
            ? `visitingWorkers/${worker.value}/assignedSites/${pushKey}`
            : isOther
            ? `otherWorkers/${worker.value}/assignedSites/${pushKey}`
            : null;
  
          if (workerPath) {
            return update(ref(db, workerPath), {
              id: pushKey,
              siteName: data.site,
              siteUid: pushKey,
            });
          }
        })
        .then(() => {
          toast.success("Update record successfully");
          setTimeout(() => {
            navigate(`/newproject`);
          }, 1500);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          toast.error("Failed to update record");
        });
    }
  };
  


  const handleWorkerChange = (selectedOption) => {
    setData({
      ...prevdata,
      worker: selectedOption?.label,
    });
  };

  const [activeTab, setActiveTab] = useState("projectDetails");

  const [workerType, setWorkerType] = useState(null);

  // const [worker, setWorker] = useState(null);
  // Options for worker types
// console.log(workerType)  // value here is "visitor"
  const workerTypeOptions = [
    { value: "permanent", label: "Permanent" },
    { value: "visitor", label: "Visitor" },
    { value: "other", label: "Other" },
  ];

  const transformWorkers = (workers, type) => {
    return workers.map((worker) => ({
      value: worker.id, // Use a unique identifier (e.g., `id`)
      type: type,
      label: worker.workerName, // Use the worker name as the label
    }));
  };
 
  // Options for workers based on type
  const workersByType = {
    permanent: transformWorkers(workers, "Permanent"),
    visitor: transformWorkers(visitingWorkers, "Visitor"),
    other: transformWorkers(otherWorkers, "Other"),
  };

  // Dynamically set options for the second dropdown
  const workerOptions = workerType ? workersByType[workerType] : [];
  console.log(workerOptions);
  // console.log(items);

useEffect(() => {
    // console.log(quotationTotal);
    setData((prevData) => ({
      ...prevData,
      quotationAmount: quotationTotal, // Store final total in quotationTotal
    }));
  }, [quotationTotal]); 

  return (
    <>
      <VolumeCalculateModal
        handleAdd={handleAdd}
        modalopen={modalopen}
        totalVolume={totalVolume}
        setTotalVolume={setTotalVolume}
        handleclose={handleClose}
      />
      <div className="flex w-[100%]  h-auto  ">
        <Sidebar />

        <div className="relative flex flex-col  w-[100%] h-auto pl-9">
          <div className="  flex justify-between items-end mt-10 w-[95%] ">
            {/* --------workerdetails-------- */}
            <div className="flex flex-col w-[55%]  ">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Employee Selection
              </h2>

              {/* Merged Selector */}
              <div className="flex flex-row gap-6 w-[100%] items-center justify-between ">
                {/* Worker Type Selector */}
                <div className="w-[90%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Type
                  </label>
                  <Select
                    onChange={(selectedOption) => {
                      setWorkerType(selectedOption);
                      setWorker(null); // Reset worker selection
                    }}
                    value={workerTypeOptions.find(option => option.value === workerType) || null} 
                    options={workerTypeOptions}
                    placeholder="Select Type First"
                    className="text-sm rounded-md shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                    isDisabled={true}
                  />
                </div>

                {/* Worker Selector */}
                <div className="w-[90%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name
                  </label>
                  <Select
                    onChange={setWorker}
                    value={workerOptions?.find(option => option.label === worker) || null}
                    options={workerOptions}
                    placeholder={
                      workerType
                        ? "Select Worker"
                        : "Select Employee Type First"
                    }
                    isDisabled={true}
                    className="text-sm rounded-md shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* --------togglebuttons-------- */}

            <div className="flex justify-center w-[40%] bg-gray-200  rounded-[35px] mb-[0px]">
              <button
                className={`px-2 py-0 w-[33%] font-semibold  text-sm rounded-[35px] h-[45px] ${
                  activeTab === "projectDetails"
                    ? "bg-0b6e99 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setActiveTab("projectDetails")}
              >
                Project Details
              </button>

              <button
                className={`px-2 py-0 w-[34%] font-semibold text-sm rounded-[35px]  h-[45px]  ${
                  activeTab === "quotations"
                    ? "bg-0b6e99 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setActiveTab("quotations")}
              >
                Quotations
              </button>

              <button
                className={`px-2 py-0 w-[33%] text-sm font-semibold rounded-[35px]  h-[45px]  ${
                  activeTab === "costing"
                    ? "bg-0b6e99 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setActiveTab("costing")}
              >
                Costing
              </button>
            </div>
          </div>

          {/* Project Details Section */}
          {activeTab === "projectDetails" && (
            <div className=" ProjectDetails flex items-start justify-center flex-col gap-2  mt-[20px] ">
              {/*-------- workerlist -------- */}

              <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 mt-4">
                Project Details
              </h1>

              {/*------ sitedata ----- */}

              <div className="flex items-start space-x-12  bg-gray-30 w-[80%] ">
                <div className="flex flex-col space-y-6 w-1/2">
                  {/* Site Input */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Site</h2>
                    <input
                      type="text"
                      placeholder="Site"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...data, site: e.target.value });
                      }}
                      value={data.site}
                    />
                  </div>

                  {/* Owner Input */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Owner</h2>
                    <input
                      type="text"
                      placeholder="Owner name"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...data, owner: e.target.value });
                      }}
                      value={data.owner}
                    />
                  </div>

                  {/* Reference Input */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Reference</h2>
                    <input
                      type="text"
                      placeholder="Reference"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...data, reference: e.target.value });
                      }}
                      value={data.reference}
                    />
                  </div>

                  {/* Pool Shape Select */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Pool shape</h2>
                    <select
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
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

                  {/* Start Project Date */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">
                      Start project
                    </h2>
                    <input
                      type="date"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...data, activeDate: e.target.value });
                      }}
                      value={data.activeDate}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-6 w-1/2">
                  {/* Address Input */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Address</h2>
                    <input
                      type="text"
                      placeholder="Address"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...data, area: e.target.value });
                      }}
                      value={data.area}
                    />
                  </div>

                  {/* Owner Mobile Input */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Owner Mobile</h2>
                    <input
                      type="number"
                      placeholder="Phone number"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...data, ownerMobile: e.target.value });
                      }}
                      value={data.ownerMobile}
                    />
                  </div>

                  {/* Reference Mobile Input */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">
                      Reference Mobile
                    </h2>
                    <input
                      type="number"
                      placeholder="Phone number"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...data, referenceMobile: e.target.value });
                      }}
                      value={data.referenceMobile}
                    />
                  </div>

                  {/* Pool Size Input */}
                  <div className="flex flex-col relative">
                    <h2 className="text-lg font-semibold mb-2">Pool Size</h2>
                    <input
                      type="text"
                      placeholder="Pool size"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...data, poolSize: e.target.value });
                      }}
                      value={data.poolSize}
                    />
                    <TbRulerMeasure
                      onClick={() => handleOpen()}
                      className="absolute text-xl cursor-pointer right-3 top-2 text-gray-500 hover:text-blue-500"
                    />
                  </div>

                  {/* Complete Project Date */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">
                      Complete project
                    </h2>
                    <input
                      type="date"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...data, inactiveDate: e.target.value });
                      }}
                      value={data.inactiveDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quotations Section */}
          {activeTab === "quotations" && (
            <div className=" Quotations flex items-start justify-center flex-col gap-2  w-[100%]  mt-[50px] h-auto">
              {/* <NewProducts products={products} setProducts={setProducts} /> */}
              <NewProducts
                products={products}
                setProducts={setProducts}
                quotationTotal={quotationTotal}
                setQuotationTotal={setQuotationTotal}
              />

              <h1 className=" mt-[40px] text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
                Quotation
              </h1>

              <div className="flex items-start justify-between  w-[90%]   ">
                <div className="flex flex-col w-[45%]  ">
                  <h2 className="text-lg font-semibold mb-2">
                    Quotation Amount
                  </h2>
                  <input
                    type="number"
                    disabled
                    placeholder="Quotation Amount"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    // onChange={(e) => {
                    //   setData({ ...data, QuotationAmount: e.target.value });
                    // }}
                    value={quotationTotal}
                  />
                </div>

                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">
                    {" "}
                    Accepted Amount{" "}
                  </h2>
                  <input
                    type="number"
                    placeholder="Accepted Amount"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...data, AcceptedAmount: e.target.value });
                    }}
                    value={data.AcceptedAmount}
                  />
                </div>
              </div>

              <div className="flex items-start justify-between  w-[90%]   ">
                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">Advance Amount</h2>
                  <input
                    type="number"
                    placeholder="Advance Amount"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...data, AdvanceAmount: e.target.value });
                    }}
                    value={data.AdvanceAmount}
                  />
                </div>

                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">Other Amount</h2>
                  <input
                    type="number"
                    placeholder="Other Amount"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...data, OtherAmount: e.target.value });
                    }}
                    value={data.OtherAmount}
                  />
                </div>
              </div>

              <div className="flex flex-col  w-[36%] ">
                <h2 className="text-lg font-semibold mb-2">Balance Amount</h2>
                <input
                  type="number"
                  placeholder="Balance Amount"
                  className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    setData({ ...data, BalanceAmount: e.target.value });
                  }}
                  value={data.BalanceAmount}
                />
              </div>
            </div>
          )}

          {activeTab === "costing" && (
            <div className=" Quotations flex items-start justify-center flex-col gap-2  w-[95%]  mt-[50px] h-auto">
              <CostItems items={items} setItems={setItems} />
            </div>
          )}

          <div className="w-[50%]  flex justify-end">
            <button
              className="h-[40px] w-[132px] mt-10 mb-8 bg-[#0b6e99] text-white rounded-md shadow-lg hover:bg-[#298bb0] transition-all duration-200 ease-in-out font-semibold text-lg"
              onClick={updateData}
            >
              Update
            </button>
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

export default Updateinput;
