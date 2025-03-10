import React from "react";
import Sidebar from "../../components/Sidebar";
import { onValue, push, ref, update, get, set } from "firebase/database";
import { db } from "../../Firbase";
import { useState } from "react";
import Select from "react-select";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import VolumeCalculateModal from "../../components/VolumeCalculateModal";
import img from "../../imgs/noimg.jpg";
import { TbRulerMeasure } from "react-icons/tb";
import NewProducts from "../../components/NewProducts";
import CostItems from "../../components/CostItems";
import BillProducts from "../../components/BillProducts";
import { Eye, EyeOff } from "lucide-react";


const Repareinput = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    site: "",
    projectId: "",
    status: true,
    activeDate: "",
    inactiveDate: "",
    poolSize: "",
    poolShape: "",
    owner: "",
    ownerMobile: "",
    ownerPassword:"",
    ownerEmail:"",
    reference: "",
    referenceMobile: "",
    // QuotationAmount: "",
    // AcceptedAmount: "",
    // AdvanceAmount: "",
    billStatus: "",
    billMonth: "",
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
  let [worker, setWorker] = useState(null);
  const [totalVolume, setTotalVolume] = useState("");
  const [poolshape, setPoolshape] = useState("");
  const [projectId, setProjectId] = useState("");
  const [modalopen, setModalOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [showBalanceAmount, setShowBalanceAmount] = useState(true);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [showPassword, setShowPassword] = useState(false);
  

  const [products, setProducts] = useState([
    {
      productName: "",
      unit: "",
      quantity: 0,
      price: 0,
      total: 0,
    },
  ]);

  // console.log(products);

  const [items, setItems] = useState([
    {
      itemsName: "",
      unit: "",
      quantity: 0,
      price: 0,
      total: 0,
      activeDate: "",
      category: null,
      itemDescription: "",
    },
  ]);

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

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts

    const fetchProjectId = async () => {
      try {
        const id = await generateProjectId();
        if (isMounted && id) {
          setProjectId(id);
        }
      } catch (error) {
        console.error("Error generating project ID:", error);
      }
    };

    fetchProjectId();

    return () => {
      isMounted = false; // Cleanup to avoid memory leaks
    };
  }, []);

  // console.log(options);

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  const addData = async () => {
    if (!data.site || !data.area || !worker) {
      toast.warn("Site, area, and worker fields should not be empty.");
      return;
    }
    // if (
    //   !data.QuotationAmount ||
    //   !data.AcceptedAmount ||
    //   !data.AdvanceAmount ||
    //   !data.OtherAmount ||
    //   !data.BalanceAmount
    // ) {
    //   toast.warn(" Quotation fields should not be empty.");
    //   return;
    // }

    if (data.site && data.area) {
      var projectId = await generateProjectId(data.site);
      console.log(projectId);
      const pushKeyRef = push(ref(db, "Repairing/"));
      const pushKey = pushKeyRef.key;
      const removeProduct = (index) => {
        setProducts((prevProducts) =>
          prevProducts.filter((_, i) => i !== index)
        );
      };

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
          activeDate: items.activeDate || 0,
          itemDescription: items.itemDescription || 0,
        })),

        site: data.site || "Nill",
        area: data.area || "Nill",
        owner: data.owner || "Nill",
        ownerMobile: data.ownerMobile || "Nill",
        ownerPassword: data.ownerPassword || "",
        ownerEmail: data.ownerEmail || "",
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
        billMonth: data.billMonth || "",

        // QuotationAmount: data.QuotationAmount || "Nill",
        // AcceptedAmount: data.AcceptedAmount || "Nill",
        // AdvanceAmount: data.AdvanceAmount || "Nill",
        // OtherAmount: data.OtherAmount || "Nill",
        BalanceAmount: data.BalanceAmount || "Nill",
        Description: data.Description || "Nill",
        TotalAmount: data.TotalAmount || "Nill",
        selectedCheckboxes: data.selectedCheckboxes || "",
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
            projectId: projectId,
            siteUid: pushKey,
          });
        } else if (isVisiting) {
          update(
            ref(db, `visitingWorkers/${worker.value}/assignedSites/${pushKey}`),
            {
              id: pushKey,
              siteName: data.site,
              projectId: projectId,
              siteUid: pushKey,
            }
          );
        } else if (isOther) {
          update(
            ref(db, `otherWorkers/${worker.value}/assignedSites/${pushKey}`),
            {
              id: pushKey,
              siteName: data.site,
              projectId: projectId,
              siteUid: pushKey,
            }
          );
        }
      });
      toast.success("Record added successfully");
      setTimeout(() => {
        navigate(`/repairing`);
      }, 1500);
      setData({
        site: "",
        projectId: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        poolSize: "",
        poolShape: "",
        owner: "",
        ownerMobile: "",
        ownerPassword:"",
        ownerEmail:"",
        reference: "",
        referenceMobile: "",
        // QuotationAmount: "",
        // AcceptedAmount: "",
        // AdvanceAmount: "",
        billStatus: "",
        billMonth: "",
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
        selectedCheckboxes: [],
      });
    }
  };
  async function generateProjectId() {
    const currentYear = new Date().getFullYear();
    const projectRef = ref(db, "/Repairing");

    try {
      const snapshot = await get(projectRef);

      if (snapshot.exists()) {
        const projects = Object.values(snapshot.val());
        console.log("Extracted projects:", projects);

        // Extract numeric parts of existing IDs for the current year
        const numbers = projects
          .map((p) => {
            const match = p?.projectId?.match(/^RP-(\d{4})-(\d{3})$/); // Fixed regex
            return match && parseInt(match[1], 10) === currentYear
              ? parseInt(match[2], 10)
              : null;
          })
          .filter((num) => num !== null);

        console.log("Extracted numbers:", numbers);

        // Find the highest project number
        const maxNumber = numbers.length ? Math.max(...numbers) : 0;

        // Generate the next project number
        const nextId = String(maxNumber + 1).padStart(3, "0"); // Ensures 3-digit format (001, 002, etc.)
        return `RP-${currentYear}-${nextId}`;
      } else {
        // If no projects exist, start from 001
        return `RP-${currentYear}-001`;
      }
    } catch (error) {
      console.error("Error fetching project IDs:", error);
      return null;
    }
  }

  const optionsss = [
    {
      label: "Select shape",
      value: "Select shape",
      imageUrl: img,
    },
    {
      label: "Rectangular",
      value: "Rectangular",
      imageUrl: img,
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



  const dayOptions = Array.from({ length: 31 }, (_, index) => (
    <option key={index + 1} value={index + 1}>
      {index + 1}
    </option>
  ));


  const CustomSelect = () => {
    const [data, setData] = useState({ poolShape: "" });

    const handleSelectChange = (e) => {
      setData({ ...data, poolShape: e.target.value });
    };
  };
  let handleAdd = () => {
    setData({ ...data, poolSize: totalVolume });
    handleClose();
  };

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
    permanent: transformWorkers(workers, "permanent"),
    visitor: transformWorkers(visitingWorkers, "visitor"),
    other: transformWorkers(otherWorkers, "other"),
  };

  // Dynamically set options for the second dropdown
  const workerOptions = workerType ? workersByType[workerType.value] : [];
  // console.log(workerOptions);

  const [billItems, setBillItems] = useState([
    { billName: "", category: "" }, // Initialize with one empty item
  ]);

  // Options for the "Bill" dropdown
  const billOptions = [
    { value: "Paid", label: "Paid" },
    { value: "UnPaid", label: "UnPaid" },
  ];

  // Update billName and billItems when bill status changes
  const handleBillChange = (selectedBill, index) => {
    const updatedBillItems = [...billItems];
    updatedBillItems[index].billName = selectedBill.value; // Update billName for the selected index
    setBillItems(updatedBillItems); // Update billItems state

    // Update mydata with the selected bill status (using the billStatus for all items)
    setData((prev) => ({
      ...prev,
      billStatus: selectedBill.value, // Update billStatus in mydata state
    }));
  };

  // console.log(selectedMonths)

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

  // Add a new dropdown dynamically
  // const addNewItem = () => {
  //   setCash((prevCash) => [...prevCash, { cashMethod: "" }]);
  // };

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

  // State to store the selected checkboxes

  // console.log(selectedCheckboxes);
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
  // console.log(selectedCheckboxes);
  // Logic to disable checkboxes based on conditions

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
                    value={workerType}
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
                    onChange={setWorker}
                    value={worker}
                    options={workerOptions}
                    placeholder={
                      workerType
                        ? "Select Worker"
                        : "Select Employee Type First"
                    }
                    isDisabled={!workerType}
                    className="text-sm rounded-md shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* --------togglebuttons-------- */}

            <div className="flex justify-center  w-[40%]  bg-gray-200  rounded-[35px] mb-[0px]">
              <button
                className={`px-2 py-0 w-[33%] font-semibold text-sm rounded-[35px] h-[45px] ${
                  activeTab === "projectDetails"
                    ? "bg-0b6e99 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setActiveTab("projectDetails")}
              >
                Project Details
              </button>

              <button
                className={`px-2 py-0 w-[33%] text-sm font-semibold rounded-[35px]  h-[45px]  ${
                  activeTab === "Billing"
                    ? "bg-0b6e99 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setActiveTab("Billing")}
              >
                Billing
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
                        checked={selectedCheckboxes[label] || false}
                        onChange={handleCheckboxChange}
                        disabled={isCheckboxDisabled(label)}
                        className="hidden peer  "
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
                        <span
                        //                           className={`w-2 h-2 inline-block  mr-3 border rounded-md transition-all duration-200
                        // ${
                        //   selectedCheckboxes[label]
                        //     ? " bg-[#0b6e99] hover:bg-[#298bb0] border-blue-600"
                        //     : "bg-white border-gray-300"
                        // }`}
                        >
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
                        </span>
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
          
                        <div className="grid grid-cols-1 gap-12 bg-gray-30 w-[90%] p-6 rounded-lg shadow-md">
                          {/* Site Details Section */}
                          <div>
                            <h1 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6">
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
                                    setData({ ...data, site: e.target.value })
                                  }
                                  value={data.site}
                                />
                              </div>
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
          
                              <div className="flex flex-col">
                                <h2 className="text-lg font-semibold mb-2">Reference</h2>
                                <input
                                  type="text"
                                  placeholder="Reference"
                                  className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                  onChange={(e) =>
                                    setData({ ...data, reference: e.target.value })
                                  }
                                  value={data.reference}
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
                                    setData({ ...data, referenceMobile: e.target.value });
                                  }}
                                  value={data.referenceMobile}
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
                                    setData({ ...data, poolSize: e.target.value });
                                  }}
                                  value={data.poolSize}
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
                                    setData({ ...data, poolSize: e.target.value })
                                  }
                                  value={data.poolSize}
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
                                    setData({ ...data, visitNum: e.target.value });
                                  }}
                                  value={data.visitNum}
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
                                    setData({ ...data, activeDate: e.target.value })
                                  }
                                  value={data.activeDate}
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
                                    setData({ ...data, inactiveDate: e.target.value })
                                  }
                                  value={data.inactiveDate}
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
                                    setData({ ...data, TotalAmount: e.target.value });
                                  }}
                                  value={data.TotalAmount}
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
                                    setData({ ...data, inactiveDate: e.target.value });
                                  }}
                                  value={data.inactiveDate}
                                />
                              </div>
                            </div>
          
                          </div>
          
                          {/* Owner Details Section */}
                          <div>
                            <h1 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6">
                               Client Details
                            </h1>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="flex flex-col">
                                <h2 className="text-lg font-semibold mb-2">Client Name</h2>
                                <input
                                  type="text"
                                  placeholder="Client Name"
                                  className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                  onChange={(e) =>
                                    setData({ ...data, owner: e.target.value })
                                  }
                                  value={data.owner}
                                />
                              </div>
                              <div className="flex flex-col">
                                <h2 className="text-lg font-semibold mb-2">
                                Client Mobile
                                </h2>
                                <input
                                  type="number"
                                  placeholder="Client Mobile"
                                  className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                  onChange={(e) =>
                                    setData({ ...data, ownerMobile: e.target.value })
                                  }
                                  value={data.ownerMobile}
                                />
                              </div>
          
                              <div className="flex flex-col">
                                <h2 className="text-lg font-semibold mb-2">
                                Client Email
                                </h2>
                                <input
                                  type="email"
                                  placeholder="Client Email"
                                  className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                  onChange={(e) =>
                                    setData({ ...data, ownerEmail: e.target.value })
                                  }
                                  value={data.ownerEmail}
                                />
                              </div>
          
                              <div className="flex flex-col relative">
                                <h2 className="text-lg font-semibold mb-2">
                                Client Password
                                </h2>
                                <div className="relative">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Client Password"
                                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) =>
                                      setData({ ...data, ownerPassword: e.target.value })
                                    }
                                    value={data.ownerPassword}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  >
                                    {showPassword ? (
                                      <EyeOff size={20} />
                                    ) : (
                                      <Eye size={20} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

            </div>
          )}

          {/* Quotations Section */}

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
                    className="px-4 py-1  bg-[#0b6e99] text-white rounded-md  hover:bg-[#298bb0]"
                    onClick={() => setShowDescription((prev) => !prev)}
                  >
                    {showDescription ? "Hide Description" : "Show Description"}
                  </button>

                  {/* Toggle for Balance Amount */}
                  <button
                    className="px-4 py-1  bg-[#0b6e99] text-white rounded-md  hover:bg-[#298bb0]"
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
                      setData({ ...data, site: e.target.value });
                    }}
                    value={data.site}
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
                      setData({ ...data, TotalAmount: e.target.value });
                    }}
                    value={data.TotalAmount}
                  />
                </div>
                {/* Bill Status */}
                <div className="w-full md:w-[45%]">
                  <h2 className="text-sm font-semibold mb-2">Bill Status</h2>
                  <div>
                    <Select
                      onChange={(selectedBill) =>
                        handleBillChange(selectedBill, 0)
                      } // Update `billName` for the first item
                      value={billOptions.find(
                        (option) => option.value === items[0].billName
                      )} // Match `billName` with `Select` value for the first item
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
                    value={billMonth} // Preselected values for the dropdown (using full option objects)
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
                        padding: "0px 4px",
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
                      setData({ ...data, inactiveDate: e.target.value });
                    }}
                    value={data.activeDate}
                  />
                </div>
                {/* Due Date */}
                <div className="flex flex-col w-[15%]">
                  <h2 className="text-sm font-semibold mb-2">Due Date</h2>
                  <input
                    type="date"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...data, inactiveDate: e.target.value });
                    }}
                    value={data.inactiveDate}
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
                        setData({ ...data, BalanceAmount: e.target.value });
                      }}
                      value={data.BalanceAmount}
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
                        setData({ ...data, Description: e.target.value });
                      }}
                      value={data.Description}
                    />
                  </div>
                )}
                {/* Toggles */}
              </div>

              <BillProducts products={products} setProducts={setProducts} />
            </div>
          )}

          {activeTab === "costing" && (
            <div className=" Quotations flex items-start justify-center flex-col gap-2  w-[95%]  mt-[50px] h-auto">
              <CostItems items={items} setItems={setItems} />

              {/* <h1 className=" mt-[10px] text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
               Costing
              </h1>

              <div className="flex items-start justify-between  w-[90%]   ">
                <div className="flex flex-col w-[45%]  ">
                  <h2 className="text-lg font-semibold mb-2">
                    Plumber
                  </h2>
                  <input
                    type="number"
                    placeholder="Quotation Amount"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...data, QuotationAmount: e.target.value });
                    }}
                    value={data.QuotationAmount}
                  />
                </div>

                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">
                  Electric
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
                  <h2 className="text-lg font-semibold mb-2">Filter</h2>
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
                  <h2 className="text-lg font-semibold mb-2">Pump</h2>
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

              <div className="flex items-start justify-between  w-[90%]   ">
                <div className="flex flex-col  w-[45%] ">
                  <h2 className="text-lg font-semibold mb-2">Labour</h2>
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
                  <h2 className="text-lg font-semibold mb-2">Fuel</h2>
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
                <h2 className="text-lg font-semibold mb-2">Others</h2>
                <input
                  type="number"
                  placeholder="Balance Amount"
                  className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    setData({ ...data, BalanceAmount: e.target.value });
                  }}
                  value={data.BalanceAmount}
                />
              </div> */}
            </div>
          )}

          <div className="w-[50%] flex justify-end">
            <button
              className="h-[40px] w-[150px] mt-10 mb-8 bg-[#0b6e99] text-white rounded-md shadow-lg hover:bg-[#298bb0] transition-all duration-200 ease-in-out font-semibold text-lg"
              onClick={() => addData()}
            >
              Submit
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

export default Repareinput;
