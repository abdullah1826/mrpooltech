import { onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firbase";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import { TbRulerMeasure } from "react-icons/tb";
import BillProducts from "../components/BillProducts";

import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import CostItems from "../components/CostItems";

const Repairingupdate = () => {
  const navigate = useNavigate();
  let [worker, setWorker] = useState(null);
  const [totalVolume, setTotalVolume] = useState("");

  const [products, setProducts] = useState([
    {
      productName: "",
      unit: "",
      quantity: 0,
      price: 0,
      total: 0,
    },
  ]);

  const [data, setData1] = useState({
    site: "",
    status: true,
    activeDate: "",
    inactiveDate: "",
    poolSize: "",
    poolShape: "",
    owner: "",
    ownerMobile: "",
    reference: "",
    referenceMobile: "",
    // QuotationAmount: "",
    // AcceptedAmount: "",
    // AdvanceAmount: "",
    billStatus: "",
    OtherAmount: "",
    BalanceAmount: "",
    TotalAmount: "",
    itemsName: "",
    unit: "",
    quantity: 0,
    price: 0,
    total: 0,
    category: "",
    itemDescription: "",
    Description: "",
    area: "",
    selectedCheckboxes: "",
  });
  let [allWorkers, setAllWorkers] = useState([]);
  let [otherWorkers, setotherWorkers] = useState([]);
  let [workers, setWorkers] = useState([]);
  let [visitingWorkers, setVisitinWorkers] = useState([]);
  let [options, setOptions] = useState([]);
  const [showDescription, setShowDescription] = useState(true);
  const [showBalanceAmount, setShowBalanceAmount] = useState(true);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [modalopen, setModalOpen] = useState(false);
  // const [items, setItems] = useState([]);

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
  const addData = () => {
    if (!data.site || !data.area || !worker) {
      toast.warn("Site, area, and worker fields should not be empty.");
      return;
    }
    if (data.site) {
      const pushKeyRef = push(ref(db, "Repairing/"));
      const pushKey = pushKeyRef.key;

      update(ref(db, `Repairing/${pushKey}`), {
        id: pushKey,
        projectId: projectId,
        products: products.map((product, index) => ({
          id: `${pushKey}_${index + 1}`,
          productName: product.productName || "N/A",
          unit: product.unit || "N/A",
          quantity: product.quantity || 0,
          price: product.price || 0,
          total: product.total || 0,
        })),

        items: items.map((items, index) => ({
          id: `${pushKey}_${index + 1}`,
          itemsName: items.itemsName || "N/A",
          category: items.category || "N/A",
          unit: items.unit || "N/A",
          quantity: items.quantity || 0,
          price: items.price || 0,
          total: items.total || 0,
          itemDescription: items.itemDescription || 0,
        })),

        site: data.site || "Nill",
        area: data.area || "Nill",
        owner: data.owner || "Nill",
        ownerMobile: data.ownerMobile || "Nill",
        reference: data.reference || "Nill",
        referenceMobile: data.referenceMobile || "Nill",
        poolSize: data.poolSize || "Nill",
        poolShape: data.poolShape || "Nill",
        activeDate: data.activeDate || "Nill",
        inactiveDate: data.inactiveDate || "Nill",
        status: data.status || "Nill",
        worker: worker?.label || "Nill",
        workerType: worker?.type || "Nill",
        billStatus: data.billStatus || "",
        selectedCheckboxes: data.selectedCheckboxes || "",

        // QuotationAmount: data.QuotationAmount || "Nill",
        // AcceptedAmount: data.AcceptedAmount || "Nill",
        // AdvanceAmount: data.AdvanceAmount || "Nill",
        // OtherAmount: data.OtherAmount || "Nill",
        BalanceAmount: data.BalanceAmount || "Nill",
        Description: data.Description || "Nill",
        TotalAmount: data.TotalAmount || "Nill",
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
      toast.success("Record added successfully");
      setTimeout(() => {
        navigate(`/repairing`);
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
        reference: "",
        referenceMobile: "",
        // QuotationAmount: "",
        // AcceptedAmount: "",
        // AdvanceAmount: "",
        billStatus: "",
        OtherAmount: "",
        BalanceAmount: "",
        TotalAmount: "",
        itemsName: "",
        unit: "",
        quantity: 0,
        price: 0,
        total: 0,
        category: "",
        itemDescription: "",
        Description: "",
        area: "",
        selectedCheckboxes: "",
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
  let handleAdd = () => {
    setData({ ...data, poolSize: totalVolume });
    handleClose();
  };

  const [mydata, setData] = useState({
    site: "",
    status: true,
    activeDate: "",
    inactiveDate: "",
    poolSize: "",
    poolShape: "",
    owner: "",
    ownerMobile: "",
    reference: "",
    referenceMobile: "",
    // QuotationAmount: "",
    // AcceptedAmount: "",
    // AdvanceAmount: "",
    billStatus: "",
    OtherAmount: "",
    BalanceAmount: "",
    TotalAmount: "",
    itemsName: "",
    unit: "",
    quantity: 0,
    price: 0,
    total: 0,
    category: "",
    itemDescription: "",
    Description: "",
    area: "",
    selectedCheckboxes: "",
  });

  // getting data from db

  const params = useParams();
  const uid = params.userid;
  useEffect(() => {
    let getingdata = async () => {
      const starCountRef = ref(db, `/Repairing/${uid}`);
      onValue(starCountRef, async (snapshot) => {
        const data = await snapshot.val();
        console.log(mydata.worker);

        //  console.log(data)
        MediaKeyStatusMap;
        console.log(data);
        setData(data);
        setProducts(data?.products || []);
        setWorkerType(data.workerType || "");
        setWorker(data.worker || "");

        setData(data);
        setProducts(data?.products || []);
        // setfiltered(Object.values(data))

        // updateStarCount(postElement, data);
      });
    };

    getingdata();
  }, []);

  const updateData = () => {
    if (!mydata.site || !mydata.area) {
      toast.warn("Site and area fields should not be empty.");
      return;
    }
    if (mydata.site && mydata.area) {
      update(ref(db, `Repairing/${uid}`), mydata);
      setData({
        site: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        poolSize: "",
        poolShape: "",
        owner: "",
        ownerMobile: "",
        reference: "",
        referenceMobile: "",
        // QuotationAmount: "",
        // AcceptedAmount: "",
        // AdvanceAmount: "",
        billStatus: "",
        OtherAmount: "",
        BalanceAmount: "",
        TotalAmount: "",
        itemsName: "",
        unit: "",
        quantity: 0,
        price: 0,
        total: 0,
        category: "",
        itemDescription: "",
        Description: "",
        area: "",
        selectedCheckboxes: "",
      });
    }
    toast.success("Update record successfully");
    setTimeout(() => {
      navigate(`/repairing`);
    }, 1500);
  };
  // const handleWorkerChange = selectedOption => {

  //     setData({
  //       ...mydata,
  //       worker: selectedOption?.label,
  //     });
  //   };

  const handleVisitChange = (e) => {
    const value = e.target.value;
    const updatedData = {
      ...data,
      visit: value,
      otherText: value === "other" ? data.otherText : "", // Clear otherText if not "other"
    };

    setData(updatedData);
    saveToFirebase(updatedData);
  };

  // Handle "other" input change
  const handleOtherTextChange = (e) => {
    const value = e.target.value;
    const updatedData = {
      ...data,
      otherText: value,
    };

    setData(updatedData);
    saveToFirebase(updatedData);
  };

  // Save data to Firebase
  const saveToFirebase = (updatedData) => {
    const dbRef = ref(db, "VisitData");
    set(dbRef, updatedData)
      .then(() => {
        console.log("Visit data saved to Firebase successfully!");
      })
      .catch((error) => {
        console.error("Error saving visit data to Firebase:", error);
      });
  };

  const handleWorkerChange = (selectedOption) => {
    setWorker(selectedOption.label); // Store only label (worker name)

    setData((prevData) => ({
      ...prevData,
      worker: selectedOption.label, // Store only label in DB
      workerType: workerType, // ✅ Ensure type is also stored
    }));

    // ✅ Store selected worker label per type correctly
    setSelectedWorkers((prev) => ({
      ...prev,
      [workerType]: selectedOption.label, // Store worker name, NOT type
    }));
  };


  const [otherText, setOtherText] = useState("");

  const [activeTab, setActiveTab] = useState("projectDetails");

  const [workerType, setWorkerType] = useState(null);

  // const [worker, setWorker] = useState(null);
  // Options for worker types

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
    permanent: transformWorkers(allWorkers, "Permanent"),
    visitor: transformWorkers(visitingWorkers, "Visitor"),
    other: transformWorkers(otherWorkers, "Other"),
  };

  // Dynamically set options for the second dropdown
  const workerOptions = workerType ? workersByType[workerType] : [];

  // console.log(workerOptions);
  // console.log(workerType);


  const dayOptions = Array.from({ length: 31 }, (_, index) => (
    <option key={index + 1} value={index + 1}>
      {index + 1}
    </option>
  ));

  const [items, setItems] = useState([
    { billName: "", category: "" }, // Initialize with one empty item
  ]);

  // Options for the "Bill" dropdown
  const billOptions = [
    { value: "Paid", label: "Paid" },
    { value: "UnPaid", label: "UnPaid" },
  ];

  // Update billName and mydata when bill status changes
  const handleBillChange = (selectedBill, index) => {
    const updatedItems = [...items];
    updatedItems[index].billName = selectedBill.value; // Update billName for the selected index
    setItems(updatedItems); // Update items state

    // Update mydata with the selected bill status
    setData((prev) => ({
      ...prev,
      billStatus: selectedBill.value, // Update billStatus in mydata state
    }));
  };
  // console.log(selectedMonths)

  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      products, // Update the products field
    }));
  }, [products]);

  const [billMonth, setBillMonth] = useState([]);

  const billMonthOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const handleMonthChange = (selectedMonths) => {
    const selectedMonthValues = selectedMonths.map((month) => month.value);
    setBillMonth(selectedMonths);
    setData((prev) => ({
      ...prev,
      billMonth: selectedMonthValues, // Store only the values in data
    }));
  };

  const [cash, setCash] = useState([]);

  // Options for the Select dropdown
  const cashOptions = [
    { value: "Online", label: "Online" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
  ];

  // Handle the change of bill selection for a specific item
  const handleCashChange = (selectedCash) => {
    setData((prev) => ({
      ...prev,
      cashMethod: selectedCash.value, // Store only the value in data
    }));
  };

  // Define the checkbox labels
  const checkboxLabels = [
    "Pool Heated",
    "Pool Non-Heated",
    "Pool Cover",
    "Pool Non-Cover",
    "Pool Semi Cover",
    "Directly",
    "Vendor",
    "With Chemical",
    "Without Chemical",
  ];

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedCheckboxes((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      selectedCheckboxes: selectedCheckboxes,
    }));
  }, [selectedCheckboxes]);

  const isCheckboxDisabled = (label) => {
    // Handle mutually exclusive logic for Pool Cover options
    if (
      (label === "Pool Cover" &&
        (selectedCheckboxes["Pool Non-Cover"] ||
          selectedCheckboxes["Pool Semi Cover"])) ||
      (label === "Pool Non-Cover" &&
        (selectedCheckboxes["Pool Cover"] ||
          selectedCheckboxes["Pool Semi Cover"])) ||
      (label === "Pool Semi Cover" &&
        (selectedCheckboxes["Pool Cover"] ||
          selectedCheckboxes["Pool Non-Cover"]))
    ) {
      return true;
    }

    // Additional mutually exclusive conditions
    if (label === "Pool Heated" && selectedCheckboxes["Pool Non-Heated"])
      return true;
    if (label === "Pool Non-Heated" && selectedCheckboxes["Pool Heated"])
      return true;

    if (label === "Directly" && selectedCheckboxes["Vendor"]) return true;
    if (label === "Vendor" && selectedCheckboxes["Directly"]) return true;

    if (label === "With Chemical" && selectedCheckboxes["Without Chemical"])
      return true;
    if (label === "Without Chemical" && selectedCheckboxes["With Chemical"])
      return true;

    return false;
  };

  useEffect(() => {
    if (mydata?.selectedCheckboxes) {
      setSelectedCheckboxes(mydata.selectedCheckboxes);
    }
  }, [mydata]);

  return (
    <>
      <div className="flex w-[100%] ">
        <Sidebar />
        <div className="relative flex flex-col  w-[100%]  pl-9">
          <div className="  flex flex-col justify-between items-start mt-10 w-[95%] ">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Employee Selection
            </h2>
            {/* --------workerdetails-------- */}
            <div className="flex  w-[100%] flex-start  ">
              {/* Merged Selector */}
              <div className="flex flex-row gap-6 w-[100%] items-start justify-between ">
                {/* Worker Type Selector */}

                {/* <div className="w-[50%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit
                  </label>
                  <select
                    onChange={handleVisitChange}
                    value={mydata.visit || ""}
                    className="w-full py-[9px] text-sm focus:outline-none shadow-md rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 p-2 transition duration-200 ease-in-out"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="seasonally">Seasonally</option>
                    <option value="other">Other</option>
                  </select>
                  {mydata.visit === "other" && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={mydata.otherText || ""}
                      onChange={handleOtherTextChange}
                      className="mt-2 w-full py-[9px] text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                  )}
                </div> */}

                <div className="w-[90%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Type
                  </label>
                  <Select
                    onChange={(selectedOption) => {
                      console.log("New Worker Type Selected:", selectedOption);

                      // ✅ Update workerType correctly
                      setWorkerType(selectedOption.value);

                      // ✅ Restore previously selected worker for this type (if available)
                      setWorker(selectedWorkers[selectedOption.value] || null);

                      // ✅ Store the workerType in form data (if needed)
                      setData((prevData) => ({
                        ...prevData,
                        workerType: selectedOption.value, // Save new type
                      }));
                    }}
                    value={workerTypeOptions.find(
                      (item) => item.value === workerType
                    )}
                    options={workerTypeOptions}
                    placeholder="Select Type First"
                    className="text-sm rounded-md shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Worker Selector */}
                <div className="w-[90%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name
                  </label>
                  <Select
                    onChange={handleWorkerChange}
                    value={workerOptions?.find(
                      (option) => option?.label === worker
                    )} // Match by label
                    options={workerOptions}
                    placeholder={
                      workerType
                        ? "Select Worker"
                        : "Select Employee Type First"
                    }
                    className="text-sm rounded-md shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* --------togglebuttons-------- */}

                <div className="flex justify-center mt-[20px] w-[auto] items-end  rounded-[35px] mb-[0px]">
                  <div className="flex justify-center  w-[auto] h-[45px] bg-gray-200  rounded-[33px] mb-[0px]">
                    <button
                      className={`px-2 py-2 w-[140px] font-semibold text-sm rounded-[35px] h-[45px] ${
                        activeTab === "projectDetails"
                          ? "bg-0b6e99 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setActiveTab("projectDetails")}
                    >
                      Project Details
                    </button>

                    <button
                      className={`px-2 py-2 w-[140px] text-sm font-semibold rounded-[35px]  h-[45px]  ${
                        activeTab === "Billing"
                          ? "bg-0b6e99 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setActiveTab("Billing")}
                    >
                      Billing{" "}
                    </button>

                    <button
                      className={`px-2 py-2 w-[140px] text-sm font-semibold rounded-[35px]  h-[45px]  ${
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
              </div>
            </div>
          </div>

          {/* Project Details Section */}

          {activeTab === "projectDetails" && (
            <div className=" ProjectDetails flex items-start justify-center flex-col gap-2  mt-[20px] ">
              <div className="p-6 bg-white shadow-lg items-center justify-center rounded-lg w-[90%] mt-5">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Select Pool Features
                </h2>

                <div className="flex flex-wrap  items-center justify-center w-[90%] gap-2">
                  {checkboxLabels.map((label) => (
                    <div key={label} className="flex items-center">
                      <input
                        type="checkbox"
                        id={label}
                        name={label}
                        // value={mydata.selectedCheckboxes}
                        checked={selectedCheckboxes[label] || false}
                        onChange={handleCheckboxChange}
                        disabled={isCheckboxDisabled(label)}
                        className="hidden peer"
                      />
                      <label
                        htmlFor={label}
                        className={`flex items-center cursor-pointer px-2 py-2 border rounded-lg transition-all duration-200 
${
  selectedCheckboxes[label]
    ? " bg-[#0b6e99] hover:bg-[#298bb0]  text-white border-blue-600"
    : "bg-white text-gray-700 border-gray-300"
}
${isCheckboxDisabled(label) ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {/* <span
                          className={`w-2 h-2 inline-block  mr-3 border rounded-md transition-all duration-200 
${
  selectedCheckboxes[label]
    ? " bg-[#0b6e99] hover:bg-[#298bb0] border-blue-600"
    : "bg-white border-gray-300"
}`}
                        > */}
                          {/* {selectedCheckboxes[label] && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )} */}
                        {/* </span> */}
                          <span className="text-[9px]">{label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

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
                        setData({ ...mydata, site: e.target.value });
                      }}
                      value={mydata.site}
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
                        setData({ ...mydata, owner: e.target.value });
                      }}
                      value={mydata.owner}
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
                        setData({ ...mydata, reference: e.target.value });
                      }}
                      value={mydata.reference}
                    />
                  </div>

                  {/* Pool Shape Select */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">
                      Number of Visit
                    </h2>
                    <select
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...mydata, visitNum: e.target.value });
                      }}
                      value={mydata.visitNum}
                    >
                      <option value="" disabled>
                        Select Day
                      </option>
                      {dayOptions}
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
                        setData({ ...mydata, activeDate: e.target.value });
                      }}
                      value={mydata.activeDate}
                    />
                  </div>

                  <div className="flex flex-col ">
                    <h2 className="text-lg font-semibold mb-2">Total Amount</h2>
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...mydata, TotalAmount: e.target.value });
                      }}
                      value={mydata.TotalAmount}
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
                        setData({ ...mydata, area: e.target.value });
                      }}
                      value={mydata.area}
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
                        setData({ ...mydata, ownerMobile: e.target.value });
                      }}
                      value={mydata.ownerMobile}
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
                        setData({ ...mydata, referenceMobile: e.target.value });
                      }}
                      value={mydata.referenceMobile}
                    />
                  </div>

                  {/* Pool Size Input */}
                  <div className="flex flex-col relative">
                    <h2 className="text-lg font-semibold mb-2">
                      Total Volume Of Water (Gallons)
                    </h2>
                    <input
                      type="text"
                      placeholder="Pool size"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...mydata, poolSize: e.target.value });
                      }}
                      value={mydata.poolSize}
                    />
                    <TbRulerMeasure
                      onClick={() => handleOpen()}
                      className="absolute text-xl cursor-pointer right-3 top-2 text-gray-500 hover:text-blue-500"
                    />
                  </div>

                  {/* Payment Due Date Date */}
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">
                      Payment Due Date
                    </h2>
                    <input
                      type="date"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...mydata, inactiveDate: e.target.value });
                      }}
                      value={mydata.inactiveDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*   Billing */}
          {activeTab === "Billing" && (
            <div className=" Quotations flex items-start justify-center flex-col gap-2  w-[100%]  mt-[50px] h-auto">
              {/* <NewProducts products={products} setProducts={setProducts} /> */}

              <div className=" w-[90%] items-baseline justify-between flex gap-4 mt-4">
                <h1 className=" mt-[40px] text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
                  Billings
                </h1>
                <div className="w-[auto] items-baseline justify-between flex gap-4 mt-4">
                  {/* Toggle for Description */}
                  <button
                    className="px-4 py-2 text-sm bg-[#0b6e99] text-white rounded-md  hover:bg-[#298bb0]"
                    onClick={() => setShowDescription((prev) => !prev)}
                  >
                    {showDescription ? "Hide Description" : "Show Description"}
                  </button>

                  {/* Toggle for Balance Amount */}

                  <button
                    className="px-4 py-2 text-sm bg-[#0b6e99] text-white rounded-md  hover:bg-[#298bb0]"
                    onClick={() => setShowBalanceAmount((prev) => !prev)}
                  >
                    {showBalanceAmount
                      ? "Hide Balance Amount"
                      : "Show Balance Amount"}
                  </button>
                </div>
              </div>

              <div className="flex flex-start justify-start flex-wrap gap-4 w-[90%]">
                {/* Site Name */}
                <div className="flex flex-col w-[15%]">
                  <h2 className="text-sm font-semibold mb-2">Site Name</h2>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...mydata, site: e.target.value });
                    }}
                    value={mydata.site}
                  />
                </div>
                {/* Total Amount */}
                <div className="flex flex-col w-[15%]">
                  <h2 className="text-sm font-semibold mb-2">Total Amount</h2>
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...mydata, TotalAmount: e.target.value });
                    }}
                    value={mydata.TotalAmount}
                  />
                </div>
                {/* Bill Status */}
                <div className="w-full md:w-[45%]">
                  <h2 className="text-sm font-semibold mb-2">Bill Status</h2>
                  <div>
                    <Select
                      onChange={handleBillChange} // Update `billStatus` in mydata state
                      value={billOptions.find(
                        (option) => option.value === mydata.billStatus // Match value with `billStatus` from mydata
                      )}
                      options={billOptions}
                      placeholder="Select"
                      className="text-sm rounded-md shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                  </div>
                </div>
                {/* Bill Month */}
                <div className="flex flex-col w-[30%]">
                  <h2 className="text-sm font-semibold mb-2">Bill Month</h2>
                  <Select
                    isMulti
                    onChange={handleMonthChange} // Pass selected months to the handler
                    value={billMonthOptions.filter((option) =>
                      mydata?.billMonth?.includes(option.value)
                    )} // Match selected values with options
                    // value={billMonth} // Preselected values for the dropdown (using full option objects)
                    options={billMonthOptions} // Options for months
                    placeholder="Select"
                    menuPlacement="top"
                    className="text-sm rounded-md shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500 mb-2"
                    styles={{
                      valueContainer: (provided) => ({
                        ...provided,
                        display: "flex",
                        overflowX: "auto", // Enable horizontal scrolling
                        flexWrap: "nowrap", // Prevent wrapping of selected items
                        gap: "4px", // Add spacing between items
                        maxWidth: "100%", // Restrict width
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: "#e5e7eb",
                        borderRadius: "4px",
                        padding: "2px 4px",
                      }),
                      multiValueLabel: (provided) => ({
                        ...provided,
                        color: "#1f2937",
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        color: "#ef4444",
                        ":hover": {
                          backgroundColor: "#fecaca",
                          color: "#b91c1c",
                        },
                      }),
                    }}
                  />
                </div>
                {/* Date */}
                <div className="flex flex-col w-[15%]">
                  <h2 className="text-sm font-semibold mb-2">Date</h2>
                  <input
                    type="date"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...mydata, activeDate: e.target.value });
                    }}
                    value={mydata.activeDate}
                  />
                </div>

                {/* Due Date */}
                <div className="flex flex-col w-[15%]">
                  <h2 className="text-sm font-semibold mb-2">Due Date</h2>
                  <input
                    type="date"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...mydata, inactiveDate: e.target.value });
                    }}
                    value={mydata.inactiveDate}
                  />
                </div>
                {/* Balance Amount */}
                {showBalanceAmount && (
                  <div className="flex flex-col w-[15%]">
                    <h2 className="text-sm font-semibold mb-2">
                      Balance Amount
                    </h2>
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...mydata, BalanceAmount: e.target.value });
                      }}
                      value={mydata.BalanceAmount}
                    />
                  </div>
                )}
                {/* Description */}
                {showDescription && (
                  <div className="flex flex-col w-[25%]">
                    <h2 className="text-sm font-semibold mb-2">Description</h2>
                    <input
                      type="text"
                      placeholder="Enter Description"
                      className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setData({ ...mydata, Description: e.target.value });
                      }}
                      value={mydata.Description}
                    />
                  </div>
                )}
                {/* Toggles */}
              </div>

              <BillProducts
                products={mydata?.products}
                setProducts={setProducts}
              />
            </div>
          )}

          {activeTab === "costing" && (
            <div className=" Quotations flex items-start justify-center flex-col gap-2  w-[95%]  mt-[50px] h-auto">
              <CostItems items={mydata?.items} setItems={setItems} />
            </div>
          )}
          <div className="w-[45%] flex justify-end">
            <button
              className="h-[40px] w-[132px] mt-10 mb-8 bg-[#0b6e99] text-white rounded-md shadow-lg hover:bg-[#298bb0] transition-all duration-200 ease-in-out font-semibold text-lg"
              onClick={() => updateData()}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* <div className="w-[95%] mt-[-100px] flex justify-end">
        <button
          className="h-[45px] w-[210px] bg-[#35A1CC]  text-white rounded-[4px]"
          onClick={updateData}
        >
          Update
        </button>
      </div> */}
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

export default Repairingupdate;
