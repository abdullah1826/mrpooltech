import React from "react";
import Sidebar from "../../components/Sidebar";
import { onValue, push, ref, set, update, get } from "firebase/database";
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
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Newinput = () => {
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
    ownerEmail: "",
    ownerPassword: "",
    // worker: "",
    area: "",
  });
  let [allWorkers, setAllWorkers] = useState([]);
  let [otherWorkers, setotherWorkers] = useState([]);
  let [workers, setWorkers] = useState([]);
  let [visitingWorkers, setVisitinWorkers] = useState([]);
  let [options, setOptions] = useState([]);
  let [worker, setWorker] = useState(null);
  const [totalVolume, setTotalVolume] = useState("");
  const [quotationTotal, setQuotationTotal] = useState("");
  const [projectId, setProjectId] = useState("");
  const [poolshape, setPoolshape] = useState("");
  const [modalopen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log(selectedOwner)

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

  // useEffect(() => {
  //   let getingdata = async () => {
  //     const starCountRef = ref(db, "/workers");
  //     onValue(starCountRef, async (snapshot) => {
  //       const data = await snapshot.val();
  //       //  console.log(data)
  //       // MediaKeyStatusMap
  //       // setWorkers(Object.values(data));
  //       setWorkers(data ? Object.values(data) : []); // If null, set empty array

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
    const getingdata = () => {
      const starCountRef = ref(db, "/workers");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setWorkers(data ? Object.values(data) : []); // Ensure empty array if null
      });

      const starCountRef2 = ref(db, "/visitingWorkers");
      onValue(starCountRef2, (snapshot2) => {
        const data2 = snapshot2.val();
        setVisitinWorkers(data2 ? Object.values(data2) : []); // Fix missing check
      });

      const starCountRef3 = ref(db, "/otherWorkers");
      onValue(starCountRef3, (snapshot3) => {
        const data3 = snapshot3.val();
        setotherWorkers(data3 ? Object.values(data3) : []); // Fix missing check
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

  useEffect(() => {
    // if (quotationTotal !== undefined) { // Ensure it's not undefined before updating
    // console.log("Updated Quotation Total:", quotationTotal);
    setData((prevData) => ({
      ...prevData,
      quotationAmount: quotationTotal, // Store final total in quotationAmount
    }));
    // }
  }, [quotationTotal]); // Runs when quotationTotal updates
  // console.log(" Quotation Total:", quotationTotal);

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


  // console.log(quotationTotal)

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;

  // const addData = async () => {
  //   if (!data.site || !data.area || !worker) {
  //     toast.warn("Site, area, and worker fields should not be empty.");
  //     return;
  //   }
  //   // if (
  //   //   !data.QuotationAmount ||
  //   //   !data.AcceptedAmount ||
  //   //   !data.AdvanceAmount ||
  //   //   !data.OtherAmount ||
  //   //   !data.BalanceAmount
  //   // ) {
  //   //   toast.warn(" Quotation fields should not be empty.");
  //   //   return;
  //   // }

  //   if (data.site && data.area) {
  //     var projectId = await generateProjectId(data.site);
  //     console.log(projectId);
  //     const pushKeyRef = push(ref(db, "NewProjects/"));
  //     const pushKey = pushKeyRef.key;
  //     const removeProduct = (index) => {
  //       setProducts((prevProducts) =>
  //         prevProducts.filter((_, i) => i !== index)
  //       );
  //     };

  //     // console.log(quotationTotal)

  //     update(ref(db, `NewProjects/${pushKey}`), {
  //       id: pushKey,
  //       projectId: projectId,
  //       products: products.map((product, index) => ({
  //         id: `${pushKey}_${index + 1}`,
  //         productName: product.productName || "N/A",
  //         unit: product.unit || "N/A",
  //         quantity: product.quantity || 0,
  //         price: product.price || 0,
  //         total: product.total || 0,
  //       })),

  //       items: items.map((items, index) => ({
  //         id: `${pushKey}_${index + 1}`,
  //         itemsName: items.itemsName || "N/A",
  //         category: items.category || "N/A",
  //         unit: items.unit || "N/A",
  //         quantity: items.quantity || 0,
  //         price: items.price || 0,
  //         total: items.total || 0,
  //         itemDescription: items.itemDescription || 0,
  //       })),

  //       site: data.site || "Nill",
  //       area: data.area || "Nill",
  //       owner: data.owner || "Nill",
  //       ownerMobile: data.ownerMobile || "Nill",
  //       reference: data.reference || "Nill",
  //       referenceMobile: data.referenceMobile || "Nill",
  //       poolSize: data.poolSize || "Nill",
  //       poolShape: data.poolShape || "Nill",
  //       activeDate: data.activeDate || "Nill",
  //       inactiveDate: data.inactiveDate || "Nill",
  //       status: data.status || "Nill",
  //       worker: worker?.label || "Nill",
  //       workerType: worker?.type || "Nill",
  //       // quotationTotal: data.quotationTotal || "Nill",
  //       ownerEmail: data.ownerEmail || "Nill",
  //       ownerPassword: data.ownerPassword || "Nill",
  //       quotationAmount: quotationTotal || "Nill",
  //       AcceptedAmount: data.AcceptedAmount || "Nill",
  //       AdvanceAmount: data.AdvanceAmount || "Nill",
  //       OtherAmount: data.OtherAmount || "Nill",
  //       BalanceAmount: data.BalanceAmount || "Nill",
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
  //           projectId: projectId,
  //           siteUid: pushKey,
  //         });
  //         // console.log(projectId , "projectid new ");
  //       } else if (isVisiting) {
  //         update(
  //           ref(db, `visitingWorkers/${worker.value}/assignedSites/${pushKey}`),
  //           {
  //             id: pushKey,
  //             siteName: data.site,
  //             projectId: projectId,
  //             siteUid: pushKey,
  //           }
  //         );
  //       } else if (isOther) {
  //         update(
  //           ref(db, `otherWorkers/${worker.value}/assignedSites/${pushKey}`),
  //           {
  //             id: pushKey,
  //             siteName: data.site,
  //             projectId: projectId,
  //             siteUid: pushKey,
  //           }
  //         );
  //       }
  //     });
  //     toast.success("Record added successfully");
  //     setTimeout(() => {
  //       navigate(`/newproject`);
  //     }, 1500);
  //     setData({
  //       site: "",
  //       projectId: "",
  //       status: true,
  //       activeDate: "",
  //       inactiveDate: "",
  //       poolSize: "",
  //       poolShape: "",
  //       owner: "",
  //       ownerMobile: "",
  //       ownerEmail: "",
  //       ownerPassword: "",
  //       reference: "",
  //       referenceMobile: "",
  //       // QuotationAmount: "",
  //       // quotationTotal:"",
  //       quotationAmount: "",
  //       AcceptedAmount: "",
  //       AdvanceAmount: "",
  //       OtherAmount: "",
  //       BalanceAmount: "",
  //       itemsName: "",
  //       unit: "",
  //       quantity: 0,
  //       price: 0,
  //       total: 0,
  //       category: "",
  //       itemDescription: "",
  //       // worker: "",
  //       area: "",
  //     });
  //   }
  // };

  // function generateKeyFromTime(name) {
  //   const currentYear = new Date().getFullYear();
  //   // const initials = name
  //   //   .split(" ")
  //   //   .map((word) => word[0].toUpperCase())
  //   //   .join("");
  //   const randomId = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  //   // Get current timestamp in milliseconds
  //   return `"PT-NP-${randomId}_${currentYear}`;
  // }

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (ownerId) => {
    setSelectedOwner(ownerId);
    setIsOpen(false); // Close dropdown after selection
  };

  const handleOwnerChange = async (e) => {
    const ownerId = e.target.value;
    setSelectedOwner(ownerId); // Update state

    if (ownerId) {
      try {
        await set(ref(db, `selectedOwners/userId`), {
          ownerId: ownerId,
          timestamp: new Date().toISOString(),
        });

        console.log("Owner saved successfully");
      } catch (error) {
        console.error("Error saving owner:", error);
      }
    }
  };

  // const createOwner = async (data) => {
  //   try {
  //     const auth = getAuth();

  //     // Step 1: Authenticate and Create Owner in Firebase Auth
  //     console.log(data);
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       data.ownerEmail,
  //       data.ownerPassword
  //     );
  //     console.log(userCredential);
  //     // Ensure the user is properly created before proceeding
  //     if (!userCredential || !userCredential.user) {
  //       throw new Error("User creation failed, userCredential is undefined.");
  //     }

  //     const user = userCredential.user;
  //     const ownerId = user.uid; // Get the unique Firebase Auth UID
  //     console.log("Owner ID:", ownerId);

  //     // Step 2: Ensure ownerId is valid before updating Firebase
  //     if (!ownerId) {
  //       throw new Error("ownerId is undefined. Firebase update aborted.");
  //     }

  //     // Step 3: Store Owner Details in Firebase Database
  //     await update(ref(db, `Owners/${ownerId}`), {
  //       id: ownerId,
  //       name: data.owner || "N/A",
  //       mobile: data.ownerMobile || "N/A",
  //       email: data.ownerEmail || "N/A",
  //       site: data.site || "N/A",
  //     });

  //     console.log("Owner details updated successfully!");
  //     return ownerId;
  //   } catch (error) {
  //     console.error("Error creating owner:", error);
  //   }
  // };

  const createOwner = async (data, projectId) => {
    try {
      const auth = getAuth();

      // Step 1: Authenticate and Create Owner in Firebase Auth
      console.log("Creating owner with data:", data);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.ownerEmail,
        data.ownerPassword
      );
      console.log("User Credential:", userCredential);

      if (!userCredential || !userCredential.user) {
        throw new Error("User creation failed, userCredential is undefined.");
      }

      const user = userCredential.user;
      const ownerId = user.uid; // Get the unique Firebase Auth UID
      console.log("Owner ID:", ownerId);

      if (!ownerId) {
        throw new Error("ownerId is undefined. Firebase update aborted.");
      }

      // Ensure projectId is available
      // if (!data.projectId) {
      //   throw new Error("projectId is required.");
      // }

      // Define pushKey dynamically for assigned sites
      const pushKey = push(ref(db, `Owners/${ownerId}/assignedSites`)).key;
      if (!pushKey) {
        throw new Error("Failed to generate pushKey.");
      }

      await update(ref(db, `Owners/${ownerId}`), {
        id: ownerId,
        name: data.owner || "N/A",
        mobile: data.ownerMobile || "N/A",
        email: data.ownerEmail || "N/A",
        projectId: projectId, // Ensure projectId is stored
        assignedSites: {
          [pushKey]: {
            id: pushKey,
            siteName: data.site || "N/A",
            projectId: projectId,
            siteUid: pushKey,
          },
        },
      });

      console.log("Owner details updated successfully!");
      return ownerId;
    } catch (error) {
      console.error("Error creating owner:", error.message);
      throw error; // Re-throw for better error handling
    }
  };

  const addData = async () => {
    if (!data.site || !data.area || !worker) {
      toast.warn("Site, area, and worker fields should not be empty.");
      return;
    }

    if (data.site && data.area) {
      var projectId = await generateProjectId(data.site);
      console.log(projectId);

      let ownerId; // Declare it outside so it is accessible

      if (selectedOwner) {
        ownerId = selectedOwner; // Use the selected owner if available

        const pushKey = push(ref(db, `Owners/${ownerId}/assignedSites`)).key;
        if (!pushKey) {
          throw new Error("Failed to generate pushKey.");
        }

        await update(ref(db, `Owners/${ownerId}/assignedSites/${pushKey}`), {
          id: pushKey,
          siteName: data.site || "N/A",
          projectId: projectId,
          siteUid: pushKey,
        });
      } else {
        ownerId = await createOwner(data, projectId); // Create a new owner if none is selected
      }

      if (!ownerId) {
        console.error("No valid owner ID found!");
        return;
      }

      const pushKeyRef = push(ref(db, "NewProjects/"));
      const pushKey = pushKeyRef.key;

      update(ref(db, `NewProjects/${pushKey}`), {
        id: pushKey,
        projectId: projectId,
        ownerId: ownerId, // Store the created owner ID here
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
          itemDescription: items.itemDescription || "N/A",
        })),
        site: data.site || "N/A",
        area: data.area || "N/A",
        // owner: data.owner || "N/A",
        // ownerMobile: data.ownerMobile || "N/A",
        // ownerEmail: data.ownerEmail || "N/A",
        // ownerPassword: data.ownerPassword || "N/A",
        reference: data.reference || "N/A",
        referenceMobile: data.referenceMobile || "N/A",
        quotationAmount: quotationTotal || "N/A",
        AcceptedAmount: data.AcceptedAmount || "N/A",
        AdvanceAmount: data.AdvanceAmount || "N/A",
        OtherAmount: data.OtherAmount || "N/A",
        BalanceAmount: data.BalanceAmount || "N/A",
        worker: worker?.label || "N/A",
        workerType: worker?.type || "N/A",
      }).then(() => {
        let isPermanent = workers?.some((elm) => elm?.id === worker.value);
        let isVisiting = visitingWorkers?.some(
          (elm) => elm?.id === worker.value
        );
        let isOther = otherWorkers?.some((elm) => elm?.id === worker.value);

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
        navigate(`/newproject`);
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
        ownerEmail: "",
        ownerPassword: "",
        reference: "",
        referenceMobile: "",
        quotationAmount: "",
        AcceptedAmount: "",
        AdvanceAmount: "",
        OtherAmount: "",
        BalanceAmount: "",
        itemsName: "",
        unit: "",
        quantity: 0,
        price: 0,
        total: 0,
        category: "",
        itemDescription: "",
        area: "",
      });
    }
  };

  async function generateProjectId() {
    const currentYear = new Date().getFullYear();
    const projectRef = ref(db, "/NewProjects");

    // console.log(projectRef)
    try {
      const snapshot = await get(projectRef);

      if (snapshot.exists()) {
        const projects = Object.values(snapshot.val()); // Get all existing project IDs
        // console.log(projects);
        // Extract numeric parts of existing IDs for the current year
        const numbers = projects
          .map((p) => {
            const match = p?.projectId?.match(/^NP-(\d{4})-(\d{3})$/); // Extract "XXX" part from "NP-YYYY-XXX"
            return match && parseInt(match[1], 10) === currentYear
              ? parseInt(match[2], 10)
              : null;
          })
          .filter((num) => num !== null);

        // Find the highest project number
        const maxNumber = numbers.length ? Math.max(...numbers) : 0;

        // Generate the next project number
        const nextId = String(maxNumber + 1).padStart(3, "0"); // Ensures 3-digit format (001, 002, etc.)
        return `NP-${currentYear}-${nextId}`;
      } else {
        // If no projects exist, start from 001
        return `NP-${currentYear}-001`;
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

  const customStyles = {
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px", // Adjust height as needed
      overflowY: "auto", // Enables scrollbar
    }),
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
          <div className="  flex justify-center items-end mt-10 w-[100%] ">
            {/* --------togglebuttons-------- */}

            <div className="flex justify-center  w-[50%]  bg-gray-200  rounded-[35px] mb-[0px]">
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
                className={`px-2 py-0 w-[34%] text-sm font-semibold rounded-[35px]  h-[45px]  ${
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
              <div className="w-[90%] flex items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 mt-4">
                  Project Details
                </h1>
              </div>

              {/*------ sitedata ----- */}
              <div className="grid grid-cols-1 gap-12 bg-gray-30 w-[90%] p-6 rounded-lg shadow-md">
                {/* Site Details Section */}
                <div className="w-[100%]">
                  <h1 className=" w-max items-start text-start text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6">
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
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">Pool Shape</h2>
                      <select
                        className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                          setData({ ...data, poolShape: e.target.value })
                        }
                        value={data.poolShape}
                      >
                        {optionsss.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
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
                  </div>
                </div>

                {/* Owner Details Section */}
                <div>
                  <h1 className="text-xl w-max font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6">
                    Client Details
                  </h1>

                  {/* Button to Show Owner Details */}

                  <div className="flex w-full items-center justify-between">
                    {/* Select Owner Dropdown */}
                    <div className="relative w-[49%]">
                      {/* Dropdown Button */}
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        disabled={showOwnerDetails}
                        className="border flex justify-between p-2 rounded w-full text-left bg-white shadow-md"
                      >
                        {selectedOwner
                          ? owners.find((owner) => owner.id === selectedOwner)
                              ?.name || "Unknown Owner"
                          : "-- Select recent client --"}
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
                              setSelectedOwner(""); // Clear selection
                              setIsOpen(false); // Close dropdown
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                          >
                            -- Select recent Client --
                          </div>

                          {/* List of Owners */}
                          {owners.length > 0 ? (
                            owners.map((owner) => (
                              <div
                                key={owner.id}
                                onClick={() => {
                                  setSelectedOwner(owner.id); // Set selected owner
                                  setIsOpen(false); // Close dropdown
                                }}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                              >
                                {owner.name}
                              </div>
                            ))
                          ) : (
                            <p className="p-2 text-gray-500">
                              No Clients found
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <p>-- OR --</p>

                    {/* Create New Owner Button */}
                    <button
                      onClick={() => {
                        setShowOwnerDetails(!showOwnerDetails);
                        setSelectedOwner(""); // Reset selected owner when creating a new one
                      }}
                      className="h-[40px] w-[30%] bg-[#0b6e99] text-white rounded-md shadow-lg hover:bg-[#298bb0] transition-all duration-200 ease-in-out font-semibold text-lg"
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

                {/* --------workerdetails-------- */}
                <div className="flex flex-col w-[100%]  ">
                  <h2 className="text-xl  w-max font-bold border-b-2 border-gray-300 text-gray-800 mb-6">
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
                          workerType ? "Select Worker" : "Select  Type First"
                        }
                        isDisabled={!workerType}
                        menuPlacement="top"
                        styles={customStyles} // Apply custom styles
                        className="text-sm rounded-md shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500 scroll-y-auto"
                      />
                    </div>
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

              <div className="flex items-start justify-between  w-[90%] ">
                <div className="flex flex-col w-[45%]  ">
                  <h2 className="text-lg font-semibold mb-2">
                    Quotation Amount
                  </h2>
                  <input
                    type="number"
                    // disabled
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

              <div className="flex flex-col  w-[40.5%] ">
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
