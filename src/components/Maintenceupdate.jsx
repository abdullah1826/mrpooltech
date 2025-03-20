import { set, onValue, ref, get, update, push } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firbase";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VolumeCalculateModal from "./VolumeCalculateModal";
import Select from "react-select";
import { TbRulerMeasure } from "react-icons/tb";
import BillProducts from "../components/BillProducts";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";

const Maintenceupdate = () => {
  let [worker, setWorker] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  const [data, setData1] = useState({
    workerType: "",
    worker: "",
    site: "",
    area: "",
    owner: "",
    ownerMobile: "",
    TotalAmount: "",
    reference: "",
    referenceMobile: "",
    status: true,
    activeDate: "",
    inactiveDate: "",
    poolSize: "",
    visitNum: "",
    billStatus: "",
    billMonth: [],
    ReceivedAmount: "",
    BalanceAmount: "",
    cashMethod: "",
    ReceiverName: "",
    Description: "",
    productName: "",
    unit: "",
    quantity: 0,
    price: 0,
    total: 0,
    selectedCheckboxes: "",
    visit: "",
    otherText: "",
  });
  let [allWorkers, setAllWorkers] = useState([]);
  let [otherWorkers, setotherWorkers] = useState([]);
  let [workers, setWorkers] = useState([]);
  let [visitingWorkers, setVisitinWorkers] = useState([]);
  let [options, setOptions] = useState([]);
  const [modalopen, setModalOpen] = useState(false);
  const [totalVolume, setTotalVolume] = useState("");
  const [showDescription, setShowDescription] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showBalanceAmount, setShowBalanceAmount] = useState(true);

  const [products, setProducts] = useState([
    {
      productName: "",
      unit: "",
      quantity: 0,
      price: 0,
      total: 0,
    },
  ]);

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        // const db = getDatabase();
        const ownersRef = ref(db, "Owners");
        const snapshot = await get(ownersRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const ownerList = Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name || "Unknown",
          }));
          setOwners(ownerList);
        } else {
          setOwners([]);
        }
      } catch (err) {
        setError("Failed to fetch owners.");
        console.error("Error fetching owners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  
    const params = useParams();
    const uid = params.userid;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProjectOwner = async () => {
      try {
        const projectRef = ref(db, `/NewProjects/${uid}`);
        const snapshot = await get(projectRef);

        if (snapshot.exists()) {
          const projectData = snapshot.val();
          const ownerId = projectData?.ownerId;

          // Match ownerId with owners list
          const matchedOwner = owners.find((owner) => owner.id === ownerId);
          if (matchedOwner) {
            setSelectedOwner(matchedOwner);
          }
        }
      } catch (err) {
        console.error("Error fetching project owner:", err);
      }
    };

    if (owners.length > 0 && uid) {
      fetchProjectOwner();
    }
  }, [db, uid, owners]);

  // Function to Update Selected Owner in Firebase

  const handleOwnerSelect = async (owner) => {
    try {
      const projectRef = ref(db, `/NewProjects/${uid}`);
      await update(projectRef, { ownerId: owner.id }); // Use update instead of set

      setSelectedOwner(owner); // Update UI
      setIsOpen(false); // Close dropdown
    } catch (error) {
      console.error("Error updating owner:", error);
    }
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

  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      products, // Update the products field
    }));
  }, [products]);

  // console.log(options);

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  const addData = () => {
    // console.log(mydata);
    if (!data.site || !data.area || !data.worker) {
      toast.warn("Site, area, and worker fields should not be empty.");
      return;
    }
    if (data.site) {
      const pushKeyRef = push(ref(db, "NewProjects/"));
      const pushKey = pushKeyRef.key;

      update(ref(db, `NewProjects/${pushKey}`), {
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
        // Dynamically update missing keys with fallback values
        site: data.site || "",
        area: data.area || "",
        owner: data.owner || "",
        workerType: data.worker?.type || data.workerType || "",
        worker: data?.worker || "",
        // ownerMobile: data.ownerMobile || "",
        selectedOwner: data.selectedOwner.id || "N/A",
        status: data.status || "",
        activeDate: data.activeDate || "",
        inactiveDate: data.inactiveDate || "",
        poolSize: data.poolSize || "",
        visitNum: data.visitNum || "",
        billStatus: data.billStatus || "",
        billMonth: data.billMonth || [],
        ReceivedAmount: data.ReceivedAmount || "",
        BalanceAmount: data.BalanceAmount || "",
        cashMethod: data.cashMethod || "",
        ReceiverName: data.ReceiverName || "",
        Description: data.Description || "",
        selectedCheckboxes: data.selectedCheckboxes || "",
        visit: data.visit || "",
        otherText: data.otherText || "",
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
        navigate(`/maintenance`);
      }, 1500);
      setData1({
        workerType: "",
        worker: "",
        site: "",
        area: "",
        owner: "",
        ownerMobile: "",
        TotalAmount: "",
        reference: "",
        referenceMobile: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        poolSize: "",
        visitNum: "",
        billStatus: "",
        billMonth: [],
        ReceivedAmount: "",
        BalanceAmount: "",
        cashMethod: "",
        ReceiverName: "",
        Description: "",
        productName: "",
        unit: "",
        quantity: 0,
        price: 0,
        total: 0,
        selectedCheckboxes: "",
        visit: "",
        otherText: "",
      });
    }
  };

  let handleAdd = () => {
    setData({ ...mydata, poolSize: totalVolume });
    handleClose();
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

  const [mydata, setData] = useState({
    workerType: "",
    worker: "",
    site: "",
    area: "",
    owner: "",
    ownerMobile: "",
    TotalAmount: "",
    reference: "",
    referenceMobile: "",
    status: true,
    activeDate: "",
    inactiveDate: "",
    poolSize: "",
    visitNum: "",
    billStatus: "",
    billMonth: [],
    ReceivedAmount: "",
    BalanceAmount: "",
    cashMethod: "",
    ReceiverName: "",
    Description: "",
    productName: "",
    unit: "",
    quantity: 0,
    price: 0,
    total: 0,
    selectedCheckboxes: "",
    visit: "",
    otherText: "",
  });


  useEffect(() => {
    let getingdata = async () => {
      const starCountRef = ref(db, `/NewProjects/${uid}`);
      onValue(starCountRef, async (snapshot) => {
        const data = await snapshot.val();
        //  console.log(data)
        MediaKeyStatusMap;
        // console.log(selectedOwner.id);

        // console.log(data);
        setData(data);
        setProducts(data?.products || []);
        setWorkerType(data?.workerType || "");
        setWorker(data?.worker || "");

        // setfiltered(Object.values(data))

        // updateStarCount(postElement, data);
      });
    };

    getingdata();
  }, []);

  const navigate = useNavigate();
  // console.log(mydata.sideName);

  const updateData = () => {
    // console.log(mydata);
    // console.log(selectedOwner);

    if (!mydata.site || !mydata.area) {
      toast.warn("Site and area fields should not be empty.");
      return;
    }
    if (mydata.site && mydata.area) {
      update(ref(db, `NewProjects/${uid}`), mydata);
      setData({
        workerType: "",
        worker: "",
        site: "",
        area: "",
        owner: "",
        ownerMobile: "",
        TotalAmount: "",
        reference: "",
        referenceMobile: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        poolSize: "",
        visitNum: "",
        billStatus: "",
        billMonth: [],
        ReceivedAmount: "",
        BalanceAmount: "",
        cashMethod: "",
        ReceiverName: "",
        Description: "",
        productName: "",
        unit: "",
        quantity: 0,
        price: 0,
        total: 0,
        selectedCheckboxes: "",
        visit: "",
        otherText: "",
      });
    }
    toast.success("Update record successfully");
    setTimeout(() => {
      navigate(`/maintenance`);
    }, 1500);
  };

  useEffect(() => {
    // If visit is changed and not 'other', clear otherText
    if (data.visit !== "other") {
      setData((prevData) => ({
        ...prevData,
        otherText: "", // Clear otherText if visit is not "other"
      }));
    }
  }, [data.visit]); // Only run this effect when 'visit' changes

  // Handle "Visit" dropdown change
  const handleVisitChange = (e) => {
    const value = e.target.value;
    setData((prevData) => ({
      ...prevData,
      visit: value, // Update the visit value
      // We don't modify otherText here, it will be handled by the useEffect
    }));
  };

  // Handle "Other" text input change
  const handleOtherTextChange = (e) => {
    const value = e.target.value;
    setData((prevData) => ({
      ...prevData,
      otherText: value, // Update the otherText field
    }));
  };

  // Save data to Firebase

  // const saveToFirebase = (updatedData) => {
  //   const dbRef = ref(db, "VisitData");
  //   set(dbRef, updatedData)
  //     .then(() => {
  //       console.log("Visit data saved to Firebase successfully!");
  //     })
  //     .catch((error) => {
  //       console.error("Error saving visit data to Firebase:", error);
  //     });
  // };

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

  const [activeTab, setActiveTab] = useState("projectDetails");

  const [workerType, setWorkerType] = useState(null);

  // console.log(workerType)

  const [otherText, setOtherText] = useState("");

  // const [worker, setWorker] = useState(null);
  // Options for worker types

  const workerTypeOptions = [
    { value: "permanent", label: "Permanent" },
    { value: "visitor", label: "Visitor" },
    { value: "other", label: "Other" },
  ];

  const transformWorkers = (workers, type) => {
    // console.log(workers);
    return workers.map((worker) => ({
      value: worker.id, // Use a unique identifier (e.g., `id`)
      type: type,
      label: worker.workerName, // Use the worker name as the label
    }));
  };

  // Options for workers based on type
  const workersByType = {
    permanent: transformWorkers(workers, "permanent"),
    visitor: transformWorkers(visitingWorkers, "visitor"),
    other: transformWorkers(otherWorkers, "other"),
  };

  // Dynamically set options for the second dropdown
  const workerOptions = workerType ? workersByType[workerType] : [];
  // console.log(workerOptions);
  // console.log(worker);

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

  const dayOptions = Array.from({ length: 31 }, (_, index) => (
    <option key={index + 1} value={index + 1}>
      {index + 1}
    </option>
  ));

  const [items, setItems] = useState([
    { billName: "", category: "" }, // Initialize with one empty item
  ]);

  const billOptions = [
    { value: "Paid", label: "Paid" },
    { value: "UnPaid", label: "UnPaid" },
  ];

  // Update billName and mydata when bill status changes
  // const handleBillChange = (selectedBill ,index) => {
  //   // Update billName for the first item in the items array (since you only have one item)
  //   const updatedItems = [...items];
  //   updatedItems[index].billName = selectedBill.value; // Update billName for the first item
  //   setItems(updatedItems); // Update items state
  //    console.log(selectedBill , "selected bill")
  //   // Update mydata with the selected bill status
  //   setData((prev) => ({
  //     ...prev,
  //     billStatus: selectedBill.value, // Update billStatus in mydata state
  //   }));
  // };

  const handleBillChange = (selectedBill, index) => {
    setItems((prevItems) => {
      if (!prevItems || !prevItems[index]) {
        console.error(
          "Error: items is undefined or index out of range",
          prevItems,
          index
        );
        return prevItems; // Prevents breaking the app
      }

      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index], // Ensure the item exists before modifying it
        billName: selectedBill.value,
      };
      return updatedItems;
    });

    setData((prevData) => ({
      ...prevData,
      billStatus: selectedBill.value,
    }));
  };

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

  return (
    <>
      <VolumeCalculateModal
        handleAdd={handleAdd}
        modalopen={modalopen}
        totalVolume={totalVolume}
        setTotalVolume={setTotalVolume}
        handleclose={handleClose}
      />

      <div className="flex w-[100%] ">
        <Sidebar />
        <div className="relative flex flex-col  w-[100%]  pl-9">
          <div className="  flex flex-col justify-center items-center mt-5 w-[100%] ">
            {/* --------togglebuttons-------- */}

            <div className="flex justify-center mt-[20px] w-[50%] items-end  rounded-[35px] mb-[0px]">
              <div className="flex justify-center  w-[100%] h-[45px] bg-gray-200  rounded-[33px] mb-[0px]">
                <button
                  className={`px-2 py-2 w-[33%] font-semibold text-sm rounded-[35px] h-[45px] ${
                    activeTab === "projectDetails"
                      ? "bg-0b6e99 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setActiveTab("projectDetails")}
                >
                  Project Details
                </button>

                <button
                  className={`px-2 py-2  w-[34%]  text-sm font-semibold rounded-[35px]  h-[45px]  ${
                    activeTab === "quotations"
                      ? "bg-0b6e99 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setActiveTab("quotations")}
                >
                  Recovery
                </button>

                <button
                  className={`px-2 py-2  w-[33%]  text-sm font-semibold rounded-[35px]  h-[45px]  ${
                    activeTab === "Billing"
                      ? "bg-0b6e99 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setActiveTab("Billing")}
                >
                  Billing
                </button>
              </div>
            </div>
          </div>

          {/* Project Details Section */}

          {activeTab === "projectDetails" && (
            <div className=" ProjectDetails flex items-start justify-center flex-col gap-2  mt-[20px] ">
              {/*-------- workerlist -------- */}
              <div className="w-[90%] flex items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 mt-4">
                  Project Details
                </h1>
              </div>

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

              {/*------ sitedata ----- */}

              <div className="grid grid-cols-1 gap-12 bg-gray-30 w-[90%] p-6 rounded-lg shadow-md">
                {/* Site Details Section */}
                <div>
                  <h1 className="text-xl w-max font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6">
                    Site Details
                  </h1>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">Site</h2>
                      <input
                        type="text"
                        placeholder="Site"
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                          setData({ ...mydata, site: e.target.value })
                        }
                        value={mydata?.site}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">Address</h2>
                      <input
                        type="text"
                        placeholder="Address"
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          setData({ ...mydata, area: e.target.value });
                        }}
                        value={mydata?.area}
                      />
                    </div>

                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">Reference</h2>
                      <input
                        type="text"
                        placeholder="Reference"
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                          setData({ ...mydata, reference: e.target.value })
                        }
                        value={mydata?.reference}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">
                        Reference Mobile
                      </h2>
                      <input
                        type="number"
                        placeholder="Phone number"
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          setData({
                            ...mydata,
                            referenceMobile: e.target.value,
                          });
                        }}
                        value={mydata?.referenceMobile}
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
                        value={mydata?.poolSize}
                      />
                      <TbRulerMeasure
                        onClick={() => handleOpen()}
                        className="absolute text-xl cursor-pointer right-3 top-2 text-gray-500 hover:text-blue-500"
                      />
                    </div>

                    <div className="flex flex-col relative">
                      <h2 className="text-lg font-semibold mb-2">Pool Size</h2>
                      <input
                        type="text"
                        placeholder="Pool size"
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                          setData({ ...mydata, poolSize: e.target.value })
                        }
                        value={mydata?.poolSize}
                      />
                      <TbRulerMeasure
                        onClick={handleOpen}
                        className="absolute text-xl cursor-pointer right-3 top-2 text-gray-500 hover:text-blue-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">
                        Number of Visit
                      </h2>
                      <select
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          setData({ ...mydata, visitNum: e.target.value });
                        }}
                        value={mydata?.visitNum}
                      >
                        <option value="" disabled>
                          0
                        </option>
                        {dayOptions}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">
                        Start Project
                      </h2>
                      <input
                        type="date"
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                          setData({ ...mydata, activeDate: e.target.value })
                        }
                        value={mydata?.activeDate}
                      />
                    </div>

                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">
                        Complete Project
                      </h2>
                      <input
                        type="date"
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                          setData({ ...mydata, inactiveDate: e.target.value })
                        }
                        value={mydata?.inactiveDate}
                      />
                    </div>

                    <div className="flex flex-col ">
                      <h2 className="text-lg font-semibold mb-2">
                        Total Amount
                      </h2>
                      <input
                        type="number"
                        placeholder="Enter Amount"
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          setData({ ...mydata, TotalAmount: e.target.value });
                        }}
                        value={mydata?.TotalAmount}
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
                        value={mydata?.inactiveDate}
                      />
                    </div>
                  </div>
                </div>

                {/* Owner Details Section */}
                <div>
                  <h1 className="text-xl w-max font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6">
                    Client Details
                  </h1>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative w-[100%]">
                      {/* Dropdown Button */}
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        disabled={showOwnerDetails}
                        className="border flex justify-between p-2 rounded w-full text-left bg-white shadow-md"
                      >
                        {selectedOwner
                          ? selectedOwner.name || "Unknown Owner"
                          : "-- Select Owner --"}
                        {isOpen ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>

                      {/* Dropdown List */}
                      {isOpen && (
                        <div className="absolute left-0 mt-1 w-full border rounded bg-white shadow-lg max-h-40 overflow-y-auto z-10">
                          {/* Deselect Option */}
                          <div
                            onClick={() => {
                              setSelectedOwner(null); // Clear selection
                              setIsOpen(false); // Close dropdown
                            }}
                            className="p-2 cursor-pointer text-gray-600 hover:bg-gray-200"
                          >
                            -- Select Owner --
                          </div>

                          {/* List of Owners */}
                          {owners.length > 0 ? (
                            owners.map((owner) => (
                              <div
                                key={owner.id}
                                onClick={() => handleOwnerSelect(owner)} // Update owner on click
                                className="px-3 py-1 cursor-pointer hover:bg-gray-200"
                              >
                                {owner.name}
                              </div>
                            ))
                          ) : (
                            <p className="p-2 text-gray-500">No Owners Found</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-[100%] mt-4  ">
                  <h1 className="text-xl w-max font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6">
                    Employee Selection
                  </h1>

                  <div className="flex flex-row gap-6 w-[100%] items-start justify-between ">
                    <div className="w-[30%]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visit
                      </label>
                      <select
                        onChange={handleVisitChange}
                        value={mydata?.visit || ""}
                        className="w-full py-[9px] text-sm focus:outline-none shadow-md rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 p-2 transition duration-200 ease-in-out"
                      >
                        <option value="Yearly">Yearly</option>
                        <option value="Seasonally">Seasonally</option>
                        <option value="Other">Other</option>
                      </select>
                      {mydata?.visit === "Other" && (
                        <input
                          type="text"
                          placeholder="Please specify"
                          value={mydata?.otherText || ""}
                          onChange={handleOtherTextChange}
                          className="mt-2 w-full py-[14px] text-sm border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out"
                        />
                      )}
                    </div>

                    <div className="w-[30%]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee Type
                      </label>
                      <Select
                        onChange={(selectedOption) => {
                          console.log(
                            "New Worker Type Selected:",
                            selectedOption
                          );

                          // ✅ Update workerType correctly
                          setWorkerType(selectedOption.value);

                          // ✅ Restore previously selected worker for this type (if available)
                          setWorker(
                            selectedWorkers[selectedOption.value] || null
                          );

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
                    <div className="w-[30%]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee Name
                      </label>
                      <Select
                        onChange={handleWorkerChange}
                        value={workerOptions.find(
                          (option) => option.label === worker
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*   Recovery Payments */}

          {activeTab === "quotations" && (
            <div className=" Quotations flex items-start justify-center flex-col gap-2  w-[80%]  mt-[50px] h-auto">
              {/* <NewProducts products={products} setProducts={setProducts} /> */}

              <h1 className=" mt-[40px] text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
                Recovery Payments
              </h1>

              <div className="flex items-start justify-between  w-[90%]">
                <div className="flex flex-col  w-[45%]  ">
                  <h2 className="text-lg font-semibold mb-2">Payment Date</h2>
                  <input
                    type="date"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...mydata, activeDate: e.target.value });
                    }}
                    value={mydata.activeDate}
                  />
                </div>
                {/* <div className="flex flex-col  w-[45%]  ">
                  <h2 className="text-lg font-semibold mb-2">
                    Payment Due Date
                  </h2>
                  <input
                    type="date"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...data, inactiveDate: e.target.value });
                    }}
                    value={data.inactiveDate}
                  />
                </div> */}

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
              </div>

              {/* <div className="flex items-start justify-between  w-[90%]   ">

                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">Bill Status</h2>
                  <input
                    type="text"
                    placeholder="Enter Status"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...data, AdvanceAmount: e.target.value });
                    }}
                    value={data.AdvanceAmount}
                  />
                </div>

                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">Bill Month</h2>
                  <input
                    type="number"
                    placeholder="Enter Month"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...data, OtherAmount: e.target.value });
                    }}
                    value={data.OtherAmount}
                  />
                </div>

              </div> */}

              <div className="flex items-start justify-between  w-[90%]   ">
                <div className="flex flex-col  w-[45%] ">
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

                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">
                    Received Amount{" "}
                  </h2>
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...mydata, ReceivedAmount: e.target.value });
                    }}
                    value={mydata.ReceivedAmount}
                  />
                </div>
              </div>

              <div className="flex items-start justify-between  w-[90%]   ">
                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">Balance Amount</h2>
                  <input
                    type="number"
                    placeholder="Balance Amount"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...mydata, BalanceAmount: e.target.value });
                    }}
                    value={mydata.BalanceAmount}
                  />
                </div>

                <div className="w-full md:w-[45%]">
                  <h2 className="text-lg font-semibold mb-2">Cash Method</h2>
                  <Select
                    onChange={(selectedCash) => handleCashChange(selectedCash)}
                    options={cashOptions}
                    placeholder="Select"
                    className="text-sm rounded-md shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500 mb-2"
                    value={
                      cashOptions.find(
                        (option) => option.value === mydata.cashMethod
                      ) || null
                    } // Match the selected value
                  />
                </div>
              </div>

              <div className="flex items-start justify-between  w-[90%]   ">
                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">Receiver Name </h2>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...mydata, ReceiverName: e.target.value });
                    }}
                    value={mydata.ReceiverName}
                  />
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

              <div className="flex flex-start justify-start flex-wrap gap-4 w-[100%]">
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
                      setData({ ...mydata, inactiveDate: e.target.value });
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

          <div className="w-[65%] flex justify-end">
            <button
              className="h-[40px] w-[350px] mt-10 mb-8 bg-[#0b6e99] text-white rounded-md shadow-lg hover:bg-[#298bb0] transition-all duration-200 ease-in-out font-semibold text-lg"
              onClick={() => updateData()}
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

export default Maintenceupdate;
