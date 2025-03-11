import React from "react";
import Sidebar from "../../components/Sidebar";
import { set, onValue, push, ref, update, get } from "firebase/database";
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
import BillProducts from "../../components/BillProducts";
import { Eye, EyeOff } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// import NewProducts from "../../components/NewProducts";

const Newinput = () => {
  const navigate = useNavigate();

  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  const [data, setData] = useState({
    worker: "",
    workerType: "",
    site: "",
    projectId: "",
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
  let [worker, setWorker] = useState(null);
  const [totalVolume, setTotalVolume] = useState("");
  const [projectId, setProjectId] = useState("");
  // const [poolshape, setPoolshape] = useState("");
  const [modalopen, setModalOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [showBalanceAmount, setShowBalanceAmount] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
   const [showOwnerDetails, setShowOwnerDetails] = useState(false);
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  // ------------------------geting data from firebase---------------------

  // useEffect(() => {
  //   let getingdata = async () => {
  //     const starCountRef = ref(db, "/workers");
  //     onValue(starCountRef, async (snapshot) => {
  //       const data = await snapshot.val();
  //       //  console.log(data)
  //       // MediaKeyStatusMap
  //       setWorkers(Object.values(data));
  //       // updateStarCount(postElement, data);
  //     });

  //     const starCountRef2 = ref(db, "/visitingWorkers");
  //     onValue(starCountRef2, async (snapshot2) => {
  //       const data2 = await snapshot2.val();
  //       //  console.log(data)
  //       // MediaKeyStatusMap
  //       setVisitinWorkers(Object.values(data2));
  //       // updateStarCount(postElement, data);
  //     });

  //     const starCountRef3 = ref(db, "/otherWorkers");
  //     onValue(starCountRef3, async (snapshot3) => {
  //       const data3 = await snapshot3.val();
  //       //  console.log(data)
  //       // MediaKeyStatusMap
  //       setotherWorkers(Object.values(data3));
  //       // updateStarCount(postElement, data);
  //     });
  //   };

  //   getingdata();
  // }, []);

  useEffect(() => {
    const fetchWorkersData = async () => {
      try {
        // Fetch Workers
        const workersRef = ref(db, "/workers");
        const snapshot = await get(workersRef);
        const workersData = snapshot.exists()
          ? Object.values(snapshot.val())
          : [];
        // console.log(workersData);
        // Fetch Visiting Workers
        const visitingWorkersRef = ref(db, "/visitingWorkers");
        const snapshot2 = await get(visitingWorkersRef);
        const visitingWorkersData = snapshot2.exists()
          ? Object.values(snapshot2.val())
          : [];

        // Fetch Other Workers
        const otherWorkersRef = ref(db, "/otherWorkers");
        const snapshot3 = await get(otherWorkersRef);
        const otherWorkersData = snapshot3.exists()
          ? Object.values(snapshot3.val())
          : [];

        // Update States
        setWorkers(workersData);
        setVisitinWorkers(visitingWorkersData);
        setotherWorkers(otherWorkersData);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkersData();
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




 const createOwner = async (data) => {
    try {
      const auth = getAuth();

      // Step 1: Authenticate and Create Owner in Firebase Auth
      console.log(data);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.ownerEmail,
        data.ownerPassword
      );
      console.log(userCredential);
      // Ensure the user is properly created before proceeding
      if (!userCredential || !userCredential.user) {
        throw new Error("User creation failed, userCredential is undefined.");
      }

      const user = userCredential.user;
      const ownerId = user.uid; // Get the unique Firebase Auth UID
      console.log("Owner ID:", ownerId);

      // Step 2: Ensure ownerId is valid before updating Firebase
      if (!ownerId) {
        throw new Error("ownerId is undefined. Firebase update aborted.");
      }

      // Step 3: Store Owner Details in Firebase Database
      await update(ref(db, `Owners/${ownerId}`), {
        id: ownerId,
        name: data.owner || "N/A",
        mobile: data.ownerMobile || "N/A",
        email: data.ownerEmail || "N/A",
      });

      console.log("Owner details updated successfully!");
      return ownerId;
    } catch (error) {
      console.error("Error creating owner:", error);
    }
  };
  // console.log(options);

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  const addData = async () => {
    // console.log(worker);
    if (!data.site || !data.area || !worker) {
      toast.warn("Site, area, and worker fields should not be empty.");
      return;
    }
  
    if (data.site && data.area) {
      // console.log(data);
      var projectId = await generateProjectId(data.site);
      // const resolvedProjectId = await projectId;
      // console.log(resolvedProjectId);
      console.log(projectId);

      
      let ownerId; // Declare it outside so it is accessible

      // Step 1: Authenticate and Create Owner in Firebase Auth
      ownerId = await createOwner(data);
      console.log(ownerId);



      const pushKeyRef = push(ref(db, "Maintenance/"));
      const pushKey = pushKeyRef.key;
      const removeProduct = (index) => {
        setProducts((prevProducts) =>
          prevProducts.filter((_, i) => i !== index)
        );
      };

      update(ref(db, `Maintenance/${pushKey}`), {
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

        worker: worker?.label || "Nill",
        workerType: worker?.type || "Nill",
        site: data.site || "",
        area: data.area || "",
        // owner: data.owner || "",
        // ownerMobile: data.ownerMobile || "",
        reference: data.reference || "Nill",
        referenceMobile: data.referenceMobile || "Nill",
        status: data.status !== undefined ? data.status : true,
        activeDate: data.activeDate || "",
        inactiveDate: data.inactiveDate || "",
        poolSize: data.poolSize || "",
        visitNum: data.visitNum || "",
        billStatus: data.billStatus || "",
        billMonth: data.billMonth || [],
        ReceivedAmount: data.ReceivedAmount || "",
        BalanceAmount: data.BalanceAmount || "",
        TotalAmount: data.TotalAmount || "",
        cashMethod: data.cashMethod || "",
        ReceiverName: data.ReceiverName || "",
        Description: data.Description || "",
        selectedCheckboxes: data.selectedCheckboxes || "",
        visit: data.visit,
        otherText: data.otherText,
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
        navigate(`/maintenance`);
      }, 1500);
      setData({
        worker: "",
        workerType: "",
        site: "",
        projectId: "",
        area: "",
        owner: "",
        ownerMobile: "",
        TotalAmount: "",
        reference: "",
        referenceMobile: "",
        // owner: "",
        // ownerMobile: "",
        status: true,
        activeDate: "",
        inactiveDate: "",
        poolSize: "",
        visitNum: "",
        billStatus: "",
        billMonth: "",
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
        selectedCheckboxes: [],
        visit: "",
        otherText: "",

        // QuotationAmount: "",
        // AcceptedAmount: "",
        // AdvanceAmount: "",
        // OtherAmount: "",
      });
    }
  };

  // Handle dropdown change
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

  async function generateProjectId() {
    const currentYear = new Date().getFullYear();
    const projectRef = ref(db, "/Maintenance");

    try {
      const snapshot = await get(projectRef);

      if (snapshot.exists()) {
        // console.log("Snapshot Data:", snapshot.val()); // Debugging

        const projects = Object.values(snapshot.val());
        // console.log("Extracted projects:", projects); // Debugging

        // Extract numeric parts of existing IDs for the current year
        const numbers = projects
          .map((p) => {
            const match = p?.projectId?.match(/^MN-(\d{4})-(\d{3})$/); // Updated regex
            return match && parseInt(match[1], 10) === currentYear
              ? parseInt(match[2], 10)
              : null;
          })
          .filter((num) => num !== null);

        // console.log("Extracted numbers:", numbers); // Debugging

        // Find the highest project number
        const maxNumber = numbers.length ? Math.max(...numbers) : 0;

        // Generate the next project number
        const nextId = String(maxNumber + 1).padStart(3, "0"); // Ensures 3-digit format (001, 002, etc.)
        return `MN-${currentYear}-${nextId}`;
      } else {
        // If no projects exist, start from 001
        return `MN-${currentYear}-001`;
      }
    } catch (error) {
      console.error("Error fetching project IDs:", error);
      return null;
    }
  }

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

  const [otherText, setOtherText] = useState("");

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

  // const isCheckboxDisabled = [
  //   {
  //     labels: ["Pool Cover", "Pool Non-Cover", "Pool Semi Cover"],
  //     condition: (label, selected) =>
  //       (label === "Pool Cover" && (selected["Pool Non-Cover"] || selected["Pool Semi Cover"])) ||
  //       (label === "Pool Non-Cover" && (selected["Pool Cover"] || selected["Pool Semi Cover"])) ||
  //       (label === "Pool Semi Cover" && (selected["Pool Cover"] || selected["Pool Non-Cover"])),
  //   },
  //   {
  //     labels: ["Pool Heated", "Pool Non-Heated"],
  //     condition: (label, selected) =>
  //       (label === "Pool Heated" && selected["Pool Non-Heated"]) ||
  //       (label === "Pool Non-Heated" && selected["Pool Heated"]),
  //   },
  //   {
  //     labels: ["Directly", "Vendor"],
  //     condition: (label, selected) =>
  //       (label === "Directly" && selected["Vendor"]) ||
  //       (label === "Vendor" && selected["Directly"]),
  //   },
  // ];

  // State for items and selected bill

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
          <div className="  flex flex-col justify-between items-start mt-10 w-[95%] ">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Employee Selection
            </h2>
            {/* --------workerdetails-------- */}
            <div className="flex  w-[100%] flex-start  ">
              {/* Merged Selector */}
              <div className="flex flex-row gap-6 w-[100%] items-start justify-between ">
                {/* Worker Type Selector */}

                <div className="w-[50%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit
                  </label>
                  <select
                    onChange={handleVisitChange}
                    value={data.visit || ""}
                    className="w-full py-[9px] text-sm focus:outline-none shadow-md rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 p-2 transition duration-200 ease-in-out"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="seasonally">Seasonally</option>
                    <option value="other">Other</option>
                  </select>
                  {data.visit === "other" && (
                    <input
                      type="text"
                      placeholder="Please Specify"
                      value={data.otherText || ""}
                      onChange={handleOtherTextChange}
                      className="mt-2 w-full py-[14px] text-sm border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                  )}
                </div>

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
                      workerType ? "Select Worker" : "Select Type First"
                    }
                    isDisabled={!workerType}
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
                        activeTab === "quotations"
                          ? "bg-0b6e99 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setActiveTab("quotations")}
                    >
                      Recovery
                    </button>

                    <button
                      className={`px-2 py-2 w-[140px] text-sm font-semibold rounded-[35px]  h-[45px]  ${
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

                  {/* Button to Show Owner Details */}

                  <div className="flex w-[100%] items-center justify-between">
                    {/* Select Owner Dropdown */}
                    <div className="w-[30%]">
                      <label htmlFor="ownerDropdown">Select Owner:</label>
                      {loading ? (
                        <p>Loading owners...</p>
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : (
                        <select
                          id="ownerDropdown"
                          value={selectedOwner}
                          onChange={(e) => setSelectedOwner(e.target.value)}
                          className="border p-2 rounded w-[100%]"
                          disabled={showOwnerDetails} // Disable dropdown when "Create New Owner" is active
                        >
                          <option value="">-- Select an Owner --</option>
                          {owners.map((owner) => (
                            <option key={owner.id} value={owner.id}>
                              {owner.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <p>OR</p>
                    {/* Create New Owner Button */}
                    <button
                      onClick={() => {
                        setShowOwnerDetails(!showOwnerDetails);
                        setSelectedOwner(""); // Reset selected owner when creating a new one
                      }}
                      className="h-[40px] w-[30%] mt-10 mb-8 bg-[#0b6e99] text-white rounded-md shadow-lg hover:bg-[#298bb0] transition-all duration-200 ease-in-out font-semibold text-lg"
                      disabled={selectedOwner} // Disable button when an owner is selected
                    >
                      {showOwnerDetails
                        ? "Hide Owner Details"
                        : "Create New Owner"}
                    </button>
                  </div>

                  {/* Owner Details Section - Only Shows When Button is Clicked */}
                  {showOwnerDetails && (
                    <div className="grid grid-cols-2 gap-6">
                      {/* Owner Name */}
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-2">
                          Owner Name
                        </h2>
                        <input
                          type="text"
                          placeholder="Owner Name"
                          className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) =>
                            setData({ ...data, owner: e.target.value })
                          }
                          value={data.owner}
                        />
                      </div>

                      {/* Owner Mobile */}
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-2">
                          Client Mobile
                        </h2>
                        <input
                          type="number"
                          placeholder="Owner Mobile"
                          className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) =>
                            setData({ ...data, ownerMobile: e.target.value })
                          }
                          value={data.ownerMobile}
                        />
                      </div>

                      {/* Owner Email */}
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-2">
                          Client Email
                        </h2>
                        <input
                          type="email"
                          placeholder="Owner Email"
                          className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) =>
                            setData({ ...data, ownerEmail: e.target.value })
                          }
                          value={data.ownerEmail}
                        />
                      </div>

                      {/* Owner Password with Eye Icon */}
                      <div className="flex flex-col relative">
                        <h2 className="text-lg font-semibold mb-2">
                          Client Password
                        </h2>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Owner Password"
                            className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              setData({
                                ...data,
                                ownerPassword: e.target.value,
                              })
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
                  )}
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

              <div className="flex items-start justify-between  w-[90%]   ">
                <div className="flex flex-col  w-[45%]  ">
                  <h2 className="text-lg font-semibold mb-2">Payment Date</h2>
                  <input
                    type="date"
                    className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      setData({ ...data, activeDate: e.target.value });
                    }}
                    value={data.activeDate}
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
                      setData({ ...data, TotalAmount: e.target.value });
                    }}
                    value={data.TotalAmount}
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
                      setData({ ...data, ReceivedAmount: e.target.value });
                    }}
                    value={data.ReceivedAmount}
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
                      setData({ ...data, BalanceAmount: e.target.value });
                    }}
                    value={data.BalanceAmount}
                  />
                </div>

                <div className="w-full md:w-[45%]">
                  <h2 className="text-lg font-semibold mb-2">Cash Method</h2>
                  <Select
                    onChange={(selectedCash) => handleCashChange(selectedCash)}
                    options={cashOptions}
                    placeholder="Select"
                    className="text-sm rounded-md shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500 mb-2"
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
                      setData({ ...data, ReceiverName: e.target.value });
                    }}
                    value={data.ReceiverName}
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

          <div className="w-[65%] flex justify-end">
            <button
              className="h-[40px] w-[350px] mt-10 mb-8 bg-[#0b6e99] text-white rounded-md shadow-lg hover:bg-[#298bb0] transition-all duration-200 ease-in-out font-semibold text-lg"
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

export default Newinput;
