import React from "react";
import Sidebar from "../../components/Sidebar";
import { onValue, ref, get, remove, update } from "firebase/database";
import { db } from "../../Firbase";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Widgets from "../../components/Widgets";
import { ModalContext } from "../../context/Modalcontext";
import DataTable from "react-data-table-component";
import { Button, Modal, Typography, Box, IconButton } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import StatusModal from "../../components/StatusModal";
import GenerateReport from "../../components/GenerateReport";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { FaChevronDown } from "react-icons/fa";

const Newproject = () => {
  const [mylist, setmylist] = useState([]);
  const [search, setsearch] = useState("");
  // const [filtered, setfiltered] = useState([]);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [delid, setdelid] = useState("");
  // console.log(delid);
  let { showmodal, deletemodal } = useContext(ModalContext);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filtered, setFiltered] = useState(mylist);
  const [status, setStatus] = useState("all"); // 'all', 'active', 'inactive'
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [projects, setProjects] = useState([]);
  const [owners, setOwners] = useState({});
  const [selectedOwnerId, setSelectedOwnerId] = useState(""); // Selected owner ID
  // const [selectedOwner, setSelectedOwner] = useState(null); // Stores selected owner details

  useEffect(() => {
    const fetchProjectsWithOwners = async () => {
      try {
        // Fetch all owners
        const ownersSnapshot = await get(ref(db, "Owners"));
        const ownersData = ownersSnapshot.exists() ? ownersSnapshot.val() : {};
        setOwners(ownersData); // Store owners data for reference
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    //     // Fetch all projects
    //     const projectsSnapshot = await get(ref(db, "NewProjects"));
    //     const projectsData = projectsSnapshot.exists()
    //       ? projectsSnapshot.val()
    //       : {};

    //     // Convert projectsData to an array and match ownerId with owner details
    //     const projectsArray = Object.keys(projectsData).map((key) => {
    //       const project = projectsData[key];
    //       const owner = ownersData[project.ownerId] || {}; // Get owner details

    //       return {
    //         id: key, // Project ID
    //         ...project, // Spread project details
    //         ownerName: owner.name || "Unknown Owner",
    //         ownerMobile: owner.mobile || "N/A",
    //         ownerEmail: owner.email || "N/A",
    //       };
    //     });

    //     console.log("Projects with Owner Details:", projectsArray);

    //     // Save the updated projects with owner details back to Firebase
    //     for (const project of projectsArray) {
    //       await update(ref(db, `NewProjects/${project.id}`), {
    //         ownerName: project.ownerName,
    //         ownerMobile: project.ownerMobile,
    //         ownerEmail: project.ownerEmail,
    //       });
    //     }

    //     setProjects(projectsArray); // Set projects state as an array
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    fetchProjectsWithOwners();
  }, []);

  const viewUserData = (row) => {
    console.log(owners);

    let selectedOwner = Object.values(owners).find(
      (owner) => owner?.id == row?.ownerId
    );

    console.log(selectedOwner);

    // Ensure the state is updated properly
    const updatedRow = { ...row, owner: selectedOwner };

    console.log(updatedRow);

    setSelectedUser(updatedRow); // Update state correctly
    setModal1(true);
  };

  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const handleModalOpen = (id) => {
    setSelectedProjectId(id); // Set the project ID
    setStatusModalOpen(true);
  };

  // console.log(selectedProjectId);

  const handleModalClose = () => {
    setStatusModalOpen(false);
    setSelectedProjectId(null);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModal1(false);
  };
  // console.log(mylist);

  let updateLinks = () => {
    if (mylist?.length === 1) {
      setmylist([]);
      setFiltered([]);
    }
  };

  // const handleDelete = () => {
  //   remove(ref(db, `/NewProjects/${delid}`));
  //   setdelid("");
  //   updateLinks();
  //   setModal(false);
  //   toast.success("Record delete successfully!");
  // };

  const handleDelete = async () => {
    try {
      // console.log("Deleting record with ID:", delid);

      // ✅ Get the projectId from the Maintenance record
      const maintenanceSnapshot = await get(ref(db, `NewProjects/${delid}`));
      if (!maintenanceSnapshot.exists()) {
        toast.error("Record not found!");
        return;
      }

      const maintenanceData = maintenanceSnapshot.val();
      // console.log("Maintenance Record:", maintenanceData);

      let projectId = maintenanceData.projectId; // Default projectId from Maintenance
      let deletePromises = []; // Array to hold delete operations

      let workerType = maintenanceData.workerType;
      // console.log("Worker Type:", workerType);

      let workertable = "";

      if (workerType === "permanent") {
        workertable = "workers";
      } else if (workerType === "other") {
        workertable = "otherWorkers";
      } else if (workerType === "visitor") {
        workertable = "visitingWorkers";
      } else {
        console.error("Invalid workerType:", workerType);
        toast.error("Invalid worker type!");
        return; // Stop execution if workerType is invalid
      }

      // console.log("Worker Table:", workertable);

      // ✅ Fetch all workers based on workerType
      let workersSnapshot;
      try {
        workersSnapshot = await get(ref(db, workertable));
        // console.log("Workers Data:", workersSnapshot.val());
      } catch (error) {
        console.error("Error fetching workers:", error);
        toast.error("Failed to fetch workers.");
        return;
      }

      if (workersSnapshot.exists()) {
        const workersData = workersSnapshot.val();
        // console.log("Workers Data:", workersData);

        // 🔄 Loop through each worker
        for (const workerId in workersData) {
          const worker = workersData[workerId];

          if (worker.assignedSites) {
            // console.log(`Worker ${workerId} Assigned Sites:`, worker.assignedSites);

            for (const siteId in worker.assignedSites) {
              const site = worker.assignedSites[siteId];

              // console.log(`Checking site:`, site);

              // 🔎 Check if this site matches the deleted maintenance record
              if (site?.siteUid === delid) {
                // console.log(`Deleting assigned site: ${siteId} from worker: ${workerId}`);

                // ✅ Correct database path usage
                deletePromises?.push(
                  remove(
                    ref(
                      db,
                      `${workertable}/${workerId}/assignedSites/${siteId}`
                    )
                  )
                );

                projectId = site?.projectId;
                // console.log("Found and Deleted Assigned Site. Project ID:", projectId);
              }
            }
          }
        }
      } else {
        console.log("No workers data found!");
      }

      // ✅ Execute all delete operations before proceeding
      await Promise.all(deletePromises);

      // ✅ Ensure projectId is valid before proceeding
      if (!projectId) {
        toast.error("Project ID not found!");
        return;
      }

      // ✅ Delete the Maintenance Record
      await remove(ref(db, `NewProjects/${delid}`));
      // console.log(`Deleted Maintenance record with ID: ${delid}`);

      // ✅ Reset state and show success message
      setdelid("");
      updateLinks();
      setModal(false);
      toast.success("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record.");
    }
  };

  const handleclose = () => {
    setModal(false);
  };

  let modalseter = (id) => {
    setModal(true);
    setdelid(id);
  };

  // let hidemodal = () => {
  //   setshowmodal(false)
  //   setdelid('')
  // }

  // ------------------------geting data from firebase---------------------

  useEffect(() => {
    let getingdata = async () => {
      const starCountRef = ref(db, "/NewProjects");
      onValue(starCountRef, async (snapshot) => {
        const data = await snapshot.val();
        //  console.log(data)
        MediaKeyStatusMap;
        setmylist(Object.values(data));
        setFiltered(Object.values(data));
        // console.log(selectedUser.reason)
        // updateStarCount(postElement, data);
      });
    };

    getingdata();
  }, []);

  // useEffect(() => {
  //   const getingdata = () => {
  //     const starCountRef = ref(db, "/NewProjects");

  //     onValue(starCountRef, (snapshot) => {
  //       const data = snapshot.val();

  //       if (data) {
  //         // Convert object to array and include project ID
  //         const projectArray = Object.entries(data).map(([key, value]) => ({
  //           id: key, // Include project ID
  //           ...value,
  //         }));

  //         setmylist(projectArray);
  //         setfiltered(projectArray);
  //       } else {
  //         setmylist([]);
  //         setfiltered([]);
  //       }
  //     });
  //   };

  //   getingdata();
  // }, []);

  //----------------------Filtering the userdata (search functionality)--------------------

  // useEffect(() => {
  //   const result = mylist.filter((user) => {
  //     return (
  //       user?.owner.toLowerCase().match(search.toLowerCase()) ||
  //       user?.area.toLowerCase().match(search.toLowerCase()) ||
  //       user?.site.toLowerCase().match(search.toLowerCase()) ||
  //       user?.projectId.toLowerCase().match(search.toLowerCase())
  //     );
  //   });

  //   setfiltered(result);
  // }, [search]);

  // console.log("list", mylist);

  useEffect(() => {
    let result = mylist.filter((user) =>
      ["owner", "area", "site", "projectId"].some((key) =>
        user[key]?.toLowerCase().includes(search.toLowerCase())
      )
    );

    if (status === "active") {
      result = result.filter((user) => user.status === true);
    } else if (status === "inactive") {
      result = result.filter((user) => user.status === false);
    }

    setFiltered(result);
  }, [search, status, mylist]);

  let [toggle, settoggle] = useState([]);

  let toglesetter = (status, id) => {
    setSelectedProjectId(id);
    if (status === true) {
      update(ref(db, `/NewProjects/${id}`), { status: false });

      setStatusModalOpen(true);
    } else {
      update(ref(db, `/NewProjects/${id}`), { status: true });
    }
  };

  const Editdata = (id) => {
    navigate(`/update/${id}`);
  };

  // console.log(mylist);

  // const exportToCSV = () => {
  //   if (!mylist || mylist.length === 0) {
  //     alert("No data to export");
  //     return;
  //   }

  //   // Define CSV header columns
  //   const csvHeaders = [
  //     "Project Id",
  //     "Employee Name",
  //     "Employee Type",
  //     "Site",
  //     "Address",
  //     "Owner",
  //     "Owner Mobile",
  //     "Reference",
  //     "Reference Mobile",
  //     "Pool Shape",
  //     "Pool Size",
  //     "Start Project",
  //     "Complete Project",
  //     "Status",
  //     "Products",
  //     "Quotation Amount",
  //     "Accepted Amount",
  //     "Advance Amount",
  //     "Other Amount",
  //     "Balance Amount",
  //     "Costing Items",
  //   ];

  // // Create worksheet and workbook
  // const worksheet = XLSX.utils.aoa_to_sheet([csvHeaders, ...data]);
  // const workbook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

  // // Apply bold styling to headers
  // const range = XLSX.utils.decode_range(worksheet["!ref"]);
  // for (let C = range.s.c; C <= range.e.c; C++) {
  //   const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
  //   if (!worksheet[cellAddress]) continue;
  //   worksheet[cellAddress].s = { font: { bold: true } };
  // }

  //   // Build CSV rows for each record in mylist
  //   const csvRows = mylist.map((record) => {
  //     // Concatenate the products array into a single string (if any)
  //     const productsString =
  //       record.products && record.products.length > 0
  //         ? record.products
  //             .map(
  //               (p) =>
  //                 `Product: ${p.productName || "N/A"}, Unit: ${
  //                   p.unit || "N/A"
  //                 }, Qty: ${p.quantity || 0}, Price: ${p.price || 0}, Total: ${
  //                   p.total || 0
  //                 }`
  //             )
  //             .join(" | ")
  //         : "No Products";

  //     // Concatenate the costing items array into a single string (if any)
  //     const costingItemsString =
  //       record.items && record.items.length > 0
  //         ? record.items
  //             .map(
  //               (item) =>
  //                 `Category: ${item.category || "N/A"}, Item: ${
  //                   item.itemsName || "N/A"
  //                 }, Unit: ${item.unit || "N/A"}, Qty: ${
  //                   item.quantity || 0
  //                 }, Price: ${item.price || 0}, Total: ${
  //                   item.total || 0
  //                 }, Desc: ${item.itemDescription || "N/A"}`
  //             )
  //             .join(" | ")
  //         : "No Items";

  //     return [
  //       record.projectId || "N/A",
  //       record.worker || "N/A",
  //       record.workerType || "N/A",
  //       record.site || "N/A",
  //       record.area || "N/A",
  //       record.owner || "N/A",
  //       record.ownerMobile || "N/A",
  //       record.reference || "N/A",
  //       record.referenceMobile || "N/A",
  //       record.poolShape || "N/A",
  //       record.poolSize || "N/A",
  //       record.activeDate || "N/A",
  //       record.inactiveDate || "N/A",
  //       record.reason || "N/A",
  //       productsString,
  //       record.quotationAmount || "N/A",
  //       record.AcceptedAmount || "N/A",
  //       record.AdvanceAmount || "N/A",
  //       record.OtherAmount || "N/A",
  //       record.BalanceAmount || "N/A",
  //       costingItemsString,
  //     ];
  //   });

  //   // Create CSV content with headers and rows
  // //   const csvContent = [
  // //     csvHeaders.join(","),
  // //     ...csvRows.map((row) => row.map((field) => `"${field}"`).join(",")),
  // //   ].join("\n");

  // //   // Create a Blob and download the CSV file
  // //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  // //   const url = URL.createObjectURL(blob);
  // //   const a = document.createElement("a");
  // //   a.href = url;
  // //   a.download = "project_report.csv";
  // //   a.click();
  // //   URL.revokeObjectURL(url);
  // // };

  // // const saveCSV = (projectName, csvHeaders, csvRows) => {
  //   const currentDate = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format
  //   const fileName = `${"NewPool"}_${currentDate}.csv`; // Format filename

  //   const csvContent = [
  //     csvHeaders.join(","),
  //     ...csvRows.map((row) => row.map((field) => `"${field}"`).join(",")),
  //   ].join("\n");

  //   // Create a Blob and download the CSV file
  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedOptions, setSelectedOptions] = useState([]);

  // console.log(selectedOptions);

  const toggleOption = (option) => {
    setSelectedOptions((prev) => {
      const updatedOptions = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];

      // console.log("Updated Selected Options:", updatedOptions); // Debug log
      return updatedOptions;
    });
  };

  const options = ["Project Details", "Products", "Quotation", "Costing"];
  // // Generate last 10 years dynamically
  // const years = Array.from(
  //   { length: 20 },
  //   (_, i) => new Date().getFullYear() - i
  // );
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i
  );

  const [selectedStatus, setSelectedStatus] = useState("active"); // Default to active

  const [selectedStatuses, setSelectedStatuses] = useState(["active"]); // Default to Active

  const handleStatusChange = (status) => {
    setSelectedStatuses(
      (prev) =>
        prev.includes(status)
          ? prev.filter((s) => s !== status) // Remove if already selected
          : [...prev, status] // Add if not selected
    );
  };

  const exportToCSV = (selectedYear, selectedOptions, status) => {
    // console.log("Selected Options:", selectedOptions); // Debug log

    if (!mylist || mylist.length === 0) {
      alert("No data to export");
      return;
    }

    let csvHeaders = [];
    let csvData = [];

    // ✅ Filter mylist based on the selected status (true = active, false = inactive)
    let filteredList = mylist.filter((user) =>
      status === "active" ? user.status === true : user.status === false
    );

    // console.log(`Filtered ${status} List:`, filteredList);

    if (filteredList.length === 0) {
      alert(`No ${status} sites found to export.`);
      return;
    }

    // ✅ Ensure correct evaluation of selectedOptions
    let includeProject = selectedOptions.includes("Project Details");
    let includeQuotation = selectedOptions.includes("Quotation");
    let includeProducts = selectedOptions.includes("Products");
    let includeCosting = selectedOptions.includes("Costing");

    // console.log("Include Project:", includeProject);
    // console.log("Include Quotation:", includeQuotation);
    // console.log("Include Costing:", includeCosting);
    // console.log("Include Products:", includeProducts);

    // ✅ Add headers dynamically
    if (includeProject) {
      csvHeaders.push(
        "Project Id",
        "Employee Name",
        "Employee Type",
        "Site",
        "Address",
        "Owner",
        "Owner Mobile",
        "Reference",
        "Reference Mobile",
        "Pool Shape",
        "Pool Size",
        "Start Project",
        "Complete Project",
        "Status"
      );
    }
    if (includeQuotation) {
      csvHeaders.push(
        "Quotation Amount",
        "Accepted Amount",
        "Advance Amount",
        "Other Amount",
        "Balance Amount"
      );
    }
    if (includeProducts) {
      csvHeaders.push("Products");
    }
    if (includeCosting) {
      csvHeaders.push("Costing Items");
    }

    // ✅ Prepare data rows for the filtered list
    filteredList.forEach((record) => {
      let row = [];

      if (includeProject) {
        row.push(
          record.projectId || "N/A",
          record.worker || "N/A",
          record.workerType || "N/A",
          record.site || "N/A",
          record.area || "N/A",
          record.owner || "N/A",
          record.ownerMobile || "N/A",
          record.reference || "N/A",
          record.referenceMobile || "N/A",
          record.poolShape || "N/A",
          record.poolSize || "N/A",
          record.activeDate || "N/A",
          record.inactiveDate || "N/A",
          status.charAt(0).toUpperCase() + status.slice(1) // Converts "active" → "Active"
        );
      }

      if (includeQuotation) {
        row.push(
          record.quotationAmount || "N/A",
          record.AcceptedAmount || "N/A",
          record.AdvanceAmount || "N/A",
          record.OtherAmount || "N/A",
          record.BalanceAmount || "N/A"
        );
      }

      if (includeProducts) {
        row.push(
          record.products?.length
            ? record.products
                .map(
                  (p) =>
                    `Product: ${p.productName || "N/A"}, Unit: ${
                      p.unit || "N/A"
                    }, Qty: ${p.quantity || 0}, Price: ${
                      p.price || 0
                    }, Total: ${p.total || 0}`
                )
                .join(" | ")
            : "No Products"
        );
      }

      if (includeCosting) {
        row.push(
          record.items?.length
            ? record.items
                .map(
                  (item) =>
                    `Category: ${item.category || "N/A"}, Item: ${
                      item.itemsName || "N/A"
                    }, Unit: ${item.unit || "N/A"}, Qty: ${
                      item.quantity || 0
                    }, Price: ${item.price || 0}, Total: ${
                      item.total || 0
                    }, Desc: ${item.itemDescription || "N/A"}`
                )
                .join(" | ")
            : "No Items"
        );
      }

      csvData.push(row);
    });

    // ✅ Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet([csvHeaders, ...csvData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

    // ✅ Save file with status included
    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `NewPool_${selectedYear}_${status}_${currentDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };



  let sr = 0;

  const columns = [
    {
      name: "Sr",
      selector: (_, index) => index + 1,
      sortable: false,
      width: "45px",
    },
    {
      name: "Project Id",
      width: "11%",
      selector: (row) => {
        return row.projectId;
      },
      sortable: true,
    },

    {
      name: "Site",
      selector: (row) => {
        return row.site;
      },
      sortable: true,
      width: "12%",
    },

    {
      name: "Client",
      selector: (row) => {
        return row?.owner?.name;
      },
      sortable: true,
      width: "14%",
    },

    {
      name: "Area",
      selector: (row) => {
        return row.area;
      },
      sortable: true,
      width: "14%",
    },

    // { name: 'Owner Mobile', selector: (row) => { return row.ownerMobile }, sortable: true, width: '150px' },

    {
      name: "Reference",
      selector: (row) => {
        return row.reference;
      },
      sortable: true,
      width: "14%",
    },

    // { name: 'Reference Mobile', selector: (row) => { return row.referenceMobile }, sortable: true, width: '150px' },

    // { name: 'Worker', selector: (row) => { return row.worker }, sortable: true, width: '130px' },
    // { name: 'Worker', selector: (row) => { return row.workerType }, sortable: true, width: '130px' },

    //   { name: 'Amount', selector: (row) => { return row.amount }, sortable: true, },
    // { name: 'Status', selector: (row) => { return row.email }, sortable: true, width: '80px' },

    //   { name: 'Creation Date', selector: (row) => { return row.creationDate }, sortable: true, width: '130px' },
    // { name: 'Age', selector: 'age', sortable: true ,},
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex flex-col items-center justify-center">
            {/* <button
              className="h-[40px] w-[70px] border bg-[#36f465] rounded-md text-white"
              onClick={handleModalOpen}
            >
              Open Modal
            </button> */}

            <StatusModal
              open={statusModalOpen}
              onClose={handleModalClose}
              id={selectedProjectId}
              path="NewProjects"
              // projectId={id}
            />
          </div>
          <button
            className="h-[40px] cursor-pointer w-[70px] border bg-[#35A1CC] rounded-md text-white mr-2"
            onClick={() => viewUserData(row)}
          >
            View
          </button>

          <button
            className="h-[40px] w-[70px] cursor-pointer border bg-[#35A1CC] rounded-md text-white mr-2"
            onClick={() => Editdata(row.id)}
          >
            Edit
          </button>

          <button
            className="h-[40px] w-[70px] cursor-pointer border bg-[#f44336] rounded-md text-white"
            onClick={() => {
              return modalseter(row.id);
            }}
          >
            Delete
          </button>
        </div>
      ),
      width: "240px",
    },

    {
      name: "Status",
      cell: (row) =>
        row.status === true ? (
          <div className="h-[24px] w-[45px] flex items-center justify-center cursor-pointer bg-[#35A1CC] rounded-xl relative">
            <div
              className="h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border right-[-1px]"
              onClick={() => {
                return toglesetter(row.status, row.id);
              }}
            ></div>
          </div>
        ) : (
          <div className="h-[24px] w-[45px] items-center justify-center bg-[#707070] rounded-xl relative">
            <div
              className="h-[22px] w-[22px] bg-white rounded-full absolute top-[1px] border left-[-1px]"
              onClick={() => {
                return toglesetter(row.status, row.id);
              }}
            ></div>
          </div>
        ),
      minWidth: "max-content",
    },
  ];

  let delmsg = "Are you sure to delete this field ??";

  // console.log(selectedUser);

  return (
    <>
      <div className="flex w-[95%]">
        <Sidebar />

        <div className="w-[95%] h-[120vh] overflow-x-auto  ml-[20px] mt-[30px] ">
          <div class="w-[100%] flex justify-center mb-5">
            <h2 class="text-4xl font-[500]  text-[#0b6e99]">New Projects</h2>
          </div>

          <div className="w-[100%] h-max">
            <h2 class="text-2xl font-[500] ml-[50px] text-[#0b6e99]">
              Overview
            </h2>
            <Widgets mylist={mylist} />
          </div>

          <div class="flex w-[100%] justify-end mb-3 mt-3 gap-1">
            <div className="flex items-center space-x-2 bg-[#35A1CC] px-2 py-0 rounded-xl shadow-md border">
              <label
                htmlFor="status-filter"
                className="text-[16px] font-medium text-white"
              >
                Filter:
              </label>
              <select
                id="status-filter"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-1 border rounded-lg bg-gray-50 text-gray-700 shadow-sm  outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-400 transition-all duration-200"
              >
                <option value="all">All</option>
                <option value="active" className=" text-green-500">
                  Active
                </option>
                <option value="inactive" className="text-red-500">
                  Inactive
                </option>
              </select>
            </div>

            {/* CSV */}
            <div className="relative inline-block">
              {/* Export Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-[45px] w-[180px] text-md font-semibold rounded-xl flex justify-between items-center px-4 bg-[#35A1CC] hover:bg-[#0b6e99] focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out text-white shadow-md hover:shadow-lg"
              >
                <span>Export CSV</span>
                <FaChevronDown className="text-lg" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute w-[250px] bg-white shadow-lg rounded-xl p-4 mt-2 z-20">
                  {/* Year Selection */}
                  <label className="block text-gray-700 font-semibold mb-1">
                    Select Year
                  </label>
                  <select
                    className="w-full p-2 border rounded-md outline-none cursor-pointer"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {Array.from(
                      { length: new Date().getFullYear() - 2020 + 1 },
                      (_, i) => 2020 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {/* Status Selection (Active/Inactive) */}
                  <div className="mt-3">
                    <span className="block text-gray-700 font-semibold mb-1">
                      Select Status:
                    </span>

                    <label className="flex items-center space-x-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        name="status"
                        value="active"
                        checked={selectedStatuses.includes("active")}
                        onChange={() => handleStatusChange("active")}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                      />
                      <span className="text-gray-700">Active Sites</span>
                    </label>

                    <label className="flex items-center space-x-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        name="status"
                        value="inactive"
                        checked={selectedStatuses.includes("inactive")}
                        onChange={() => handleStatusChange("inactive")}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                      />
                      <span className="text-gray-700">Inactive Sites</span>
                    </label>
                  </div>
                  {/* Checkboxes for Details */}
                  <div className="mt-3">
                    <span className="block text-gray-700 font-semibold mb-1">
                      Include Details:
                    </span>
                    {options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2 py-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                          checked={selectedOptions.includes(option)}
                          onChange={() => toggleOption(option)}
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>

                  {/* Export Button */}
                  <button
                    onClick={() => {
                      if (!selectedStatus) {
                        alert(
                          "Please select Active or Inactive status before exporting."
                        );
                        return;
                      }
                      // console.log(
                      //   `Exporting for ${selectedStatus} sites with options:`,
                      //   selectedOptions
                      // );
                      exportToCSV(
                        selectedYear,
                        selectedOptions,
                        selectedStatus
                      );
                    }}
                    className="w-full mt-3 py-2 text-white bg-[#35A1CC] hover:bg-[#0b6e99] font-semibold rounded-xl transition duration-150 ease-in-out"
                  >
                    <FaDownload className="inline mr-2" />
                    Download for {selectedYear}
                  </button>
                </div>
              )}
            </div>

            <Link to="/newinput">
              <div className="h-[45px] border w-[150px] text-md rounded-xl  flex justify-center items-center bg-[#35A1CC]  hover:bg-[#0b6e99]  text-white cursor-pointer shadow-md hover:shadow-xl ">
                Add New Site +
              </div>
            </Link>
          </div>

          <div className="border w-[100%] ">
            <DataTable
              columns={columns}
              data={filtered}
              style={{ width: "1200px" }}
              wrapperStyle={{ backgroundColor: "#DAECF3" }}
              pagination
              fixedHeader
              subHeader
              subHeaderComponent={
                <div className=" h-[70px]">
                  <h2 className="text-[17px]">Search</h2>{" "}
                  <input
                    type="search"
                    placeholder="Search here"
                    className=" h-[25px] w-[310px] border-b-[1px]   p-1 outline-none placeholder:text-sm"
                    value={search}
                    onChange={(e) => {
                      setsearch(e.target.value);
                    }}
                  />{" "}
                </div>
              }
              subHeaderAlign="left"
            />
          </div>
        </div>
      </div>
      <Modal open={modal} onClose={handleclose}>
        <Box
          sx={{
            position: "absolute",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="fixed top-0 bottom-0 right-0 left-0"
            style={{ backgroundColor: "rgba(189,189,189,0.9) ", zIndex: "10" }}
          >
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "25rem",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100px",
              }}
            >
              <h1>Are you sure you want to delete this member?</h1>

              <div className=" flex w-[185px] justify-between mt-3">
                <button
                  className="border flex justify-center items-center w-[75px] h-[30px]  text-white bg-[#35A1CC] rounded-md"
                  onClick={() => handleclose()}
                >
                  Cancel
                </button>
                <button
                  className="border flex justify-center items-center w-[75px] h-[30px]  text-white bg-red-600 rounded-md"
                  onClick={() => handleDelete()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      {/* <StatusModal open={statusModalOpen}  onClose={handleModalClose} /> */}

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
      <Modal open={modal1} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 850,
            bgcolor: "white",
            borderRadius: "5px",
            background: "#FFF",
            outline: "none",
            boxShadow: 24,
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "10px 15px",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {/* 
<button
      onClick={() => navigate("/Invoice2")}
      className=" ml-[40px] w-[100px] h-[40px] text-sm px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
    >
      Invoice
    </button>  */}

          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 22,
              right: 18,
              width: "24px",
              height: "24px",
              background: "#ECECEC",
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedUser && (
            <>
              <div className="flex justify-start items-center flex-col w-[100%]">
                <div className=" flex justify-between items-center w-[100%] ">
                  <Typography variant="h5" className="mt-5 mb-5" gutterBottom>
                    <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4  ">
                      Project Details
                    </h1>
                  </Typography>

                  <button
                    onClick={() =>
                      navigate(`/Invoice2/${selectedUser?.id}/newpool`)
                    }
                    className=" mb-[40px] mr-[40px] w-[100px] h-[40px] text-sm px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                  >
                    Invoice
                  </button>
                </div>

                <div className=" flex justify-start items-center gap-4 flex-wrap w-[100%] ">
                  {/* <div className="border w-[100%] " >
                    {projects.map((project) => (
                      <div key={project.id} className="border w-[100%] flex  p-3 mb-3">
                      <div className="flex flex-col w-[50%] " >
                        <div className="flex items-center w-[49%]">
                          <p className="font-[450] text-[14px] mr-2 flex items-center">
                            Client:
                          </p>
                          <span className="text-[13px]">
                            {project.ownerName}
                          </span>
                        </div>

                        <div className="flex items-center w-[49%]">
                          <p className="font-[450] text-[14px] mr-2 flex items-center">
                            Client Mobile:
                          </p>
                          <span className="text-[13px]">
                            {project.ownerMobile}
                          </span>
                        </div>

                        </div>

                        <div className="flex items-center w-[50%]">
                          <p className="font-[450] text-[14px] mr-2 flex items-center">
                            Client Email:
                          </p>
                          <span className="text-[13px]">
                            {project.ownerEmail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div> */}
                  <div className="w-[100%] flex items-center justify-center">
                    {selectedUser?.owner !== "Unknown Owner" && (
                      <div className=" flex justify-evenly flex-wrap w-[100%] mt-2 p-2 border rounded ">
                        <p className=" w-[100%] text-start font-bold">
                          Client Details
                        </p>
                        <div className=" flex justify-between flex-wrap w-[100%] mt-2 p-2 border rounded bg-gray-100">
                          <p>
                            <strong>Name:</strong> {selectedUser?.owner.name}
                          </p>
                          <p>
                            <strong>Mobile:</strong>{" "}
                            {selectedUser?.owner.mobile}
                          </p>
                          <p>
                            <strong>Email:</strong> {selectedUser?.owner.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <h2 className="text-md w-[95%] text-start font-bold  border-b border-gray-300 pb-2 text-gray-800">
                    Site Details
                  </h2>
                  <div className="flex  items-center w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center ">
                      Employee Name:
                    </p>
                    <span className="text-[13px]">{selectedUser.worker}</span>
                  </div>
                  <div className="flex  items-center w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center ">
                      Employee Type:
                    </p>
                    <span className="text-[13px]">
                      {selectedUser.workerType}
                    </span>
                  </div>
                  <div className="flex  items-center w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center ">
                      Project Id:
                    </p>
                    <span className="text-[13px]">
                      {selectedUser.projectId}
                    </span>
                  </div>
                  <div className="flex  items-center  w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                      Site:
                    </p>
                    <span className="text-[13px]">{selectedUser.site}</span>
                  </div>
                  <div className="flex  items-center  w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center ">
                      Address:
                    </p>
                    <span className="text-[13px]">{selectedUser.area}</span>
                  </div>

                  {/* <div className="flex  items-center  w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                      Client Password:
                    </p>
                    <span className="text-[13px]">
                      {selectedUser.ownerPassword}
                    </span>
                  </div> */}

                  <div className="flex  items-center  w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center ">
                      {" "}
                      Reference :
                    </p>
                    <span className="text-[13px]">
                      {selectedUser.reference}
                    </span>
                  </div>
                  <div className="flex  items-center  w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                      Reference Mobile:
                    </p>
                    <span className="text-[13px]">
                      {selectedUser.referenceMobile}
                    </span>
                  </div>

                  <div className="flex  items-center  w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                      Pool Shape:
                    </p>
                    <span className="text-[13px]">
                      {selectedUser.poolShape}
                    </span>
                  </div>
                  <div className="flex  items-center  w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                      Pool Size:
                    </p>
                    <span className="text-[13px]">{selectedUser.poolSize}</span>
                  </div>
                  <div className="flex  items-center  w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                      Start Project:
                    </p>
                    <span className="text-[13px]">
                      {selectedUser.activeDate}
                    </span>
                  </div>

                  <div className="flex  items-center  w-[46%]">
                    {" "}
                    <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                      Complete Project:
                    </p>
                    <span className="text-[13px]">
                      {selectedUser.inactiveDate}
                    </span>
                  </div>

                  <div className="flex  items-center  w-[46%]">
                    <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                      Status :
                    </p>
                    <span className="text-[13px]">
                      {selectedUser.reason ? selectedUser.reason : "N/A"}
                    </span>
                  </div>

                  <div className="flex  justify-start items-center gap-4 flex-wrap  w-[95%]  ">
                    <div className=" flex justify-start items-center w-[90%] ">
                      <Typography
                        variant="h5"
                        className="mt-5 mb-1"
                        gutterBottom
                      >
                        <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4  ">
                          Products
                        </h1>
                      </Typography>
                    </div>
                    <div className="flex items-center w-[100%]">
                      {selectedUser?.products?.length > 0 ? (
                        <table className="w-[100%] table-auto text-[13px] border-collapse border border-gray-300">
                          <thead>
                            <tr>
                              <th className="border  text-center border-gray-300 px-2 py-1">
                                Product #
                              </th>
                              <th className="border  text-center border-gray-300 px-2 py-1">
                                Product Name
                              </th>
                              <th className="border  text-center border-gray-300 px-2 py-1">
                                Unit
                              </th>
                              <th className="border  text-center border-gray-300 px-2 py-1">
                                Quantity
                              </th>
                              <th className="border  text-center border-gray-300 px-2 py-1">
                                Price
                              </th>
                              <th className="border  text-center border-gray-300 px-2 py-1">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedUser?.products?.map((product, index) => (
                              <tr key={index}>
                                <td className="border text-center border-gray-300 px-2 py-1">
                                  {index + 1}
                                </td>
                                <td className="border  text-center border-gray-300 px-2 py-1">
                                  {product.productName || "N/A"}
                                </td>
                                <td className="border  text-center border-gray-300 px-2 py-1">
                                  {product.unit || "N/A"}
                                </td>
                                <td className="border  text-center border-gray-300 px-2 py-1">
                                  {product.quantity || 0}
                                </td>
                                <td className="border  text-center border-gray-300 px-2 py-1">
                                  {product.price || 0}
                                </td>
                                <td className="border  text-center border-gray-300 px-2 py-1">
                                  {product.total || 0}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        "No Products added"
                      )}
                    </div>

                    {/* <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Product Name:</p><span className='text-[13px]'>{selectedUser.productName}</span></div>
            <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Unit:</p><span className='text-[13px]'>{selectedUser.unit}</span></div>
            <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Quantity:</p><span className='text-[13px]'>{selectedUser.quantity}</span></div>
            <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Price:</p><span className='text-[13px]'>{selectedUser.price}</span></div>
            <div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Total:</p><span className='text-[13px]'>{selectedUser.total}</span></div>*/}

                    <div className=" flex justify-start items-center w-[90%] ">
                      <Typography
                        variant="h5"
                        className="mt-5 mb-1"
                        gutterBottom
                      >
                        <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4  ">
                          Quotation
                        </h1>
                      </Typography>
                    </div>

                    <div className="flex  items-center  w-[46%]">
                      {" "}
                      <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                        QuotationAmount:
                      </p>
                      <span className="text-[13px]">
                        {selectedUser.quotationAmount}
                      </span>
                    </div>
                    <div className="flex  items-center  w-[46%]">
                      {" "}
                      <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                        AcceptedAmount:
                      </p>
                      <span className="text-[13px]">
                        {selectedUser.AcceptedAmount}
                      </span>
                    </div>
                    <div className="flex  items-center  w-[46%]">
                      {" "}
                      <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                        AdvanceAmount:
                      </p>
                      <span className="text-[13px]">
                        {selectedUser.AdvanceAmount}
                      </span>
                    </div>
                    <div className="flex  items-center  w-[46%]">
                      {" "}
                      <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                        OtherAmount:
                      </p>
                      <span className="text-[13px]">
                        {selectedUser.OtherAmount}
                      </span>
                    </div>
                    <div className="flex  items-center  w-[46%]">
                      {" "}
                      <p className="font-[450] text-[14px] mr-2 flex  items-center  ">
                        BalanceAmount:
                      </p>
                      <span className="text-[13px]">
                        {selectedUser.BalanceAmount}
                      </span>
                    </div>

                    <div className=" flex justify-start items-center w-[90%] ">
                      <Typography
                        variant="h5"
                        className="mt-5 mb-1"
                        gutterBottom
                      >
                        <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4  ">
                          Costing
                        </h1>
                      </Typography>
                    </div>

                    {/* 
            {selectedUser?.items?.map((items, index) => (

<>

<div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Category:</p><span className='text-[13px]'>{items.itemType}</span></div>
<div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Item Name:</p><span className='text-[13px]'>{items.itemsName}</span></div>
<div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Unit:</p><span className='text-[13px]'>{items.unit}</span></div>
<div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Quantity:</p><span className='text-[13px]'>{items.quantity}</span></div>
<div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Price:</p><span className='text-[13px]'>{items.price}</span></div>
<div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>Total:</p><span className='text-[13px]'>{items.total}</span></div>
<div className='flex  items-center  w-[46%]'> <p className='font-[450] text-[14px] mr-2 flex  items-center  '>ItemDescription:</p><span className='text-[13px]'>{items.itemDescription}</span></div>
</>
))} */}

                    <table className="table-auto border-collapse border border-gray-300 w-[100%] text-sm">
                      <thead>
                        <tr className="bg-gray-200 ">
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Category
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Item Name
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Unit
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Quantity
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Price
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Total
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser?.items?.map((item, index) => (
                          <tr
                            key={index}
                            className="odd:bg-white even:bg-gray-50"
                          >
                            <td className="border border-gray-300 px-4 py-2">
                              {item.category}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.itemsName}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.unit}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.quantity}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.price}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.total}
                            </td>
                            <td className="border border-gray-300 px-4 w-[50px] py-2">
                              {item.itemDescription}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <br></br>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Newproject;
