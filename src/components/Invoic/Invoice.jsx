import React, { useState, useEffect, useRef } from "react";
import "./Invoice.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import {  ref, push, onValue } from "../../Firbase";
// import { app } from './firebase';
import { db } from "../../Firbase";
import Select from "react-select";

import {
  getDatabase,
  set,
  ref,
  update,
  push,
  onValue,
} from "firebase/database";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import { set } from 'firebase/database';
import { TbEdit } from "react-icons/tb";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// const database = getDatabase(app);

export default function Invoice() {
  const navigate = useNavigate();
  const { id, type } = useParams();

  const [ourInfo, setOurInfo] = useState({
    salePerson: "",
    ourMobile: "",
    ourEmail: "",
    paymentMethod: "",
    ourWeb: "",
    address: "",
    date: "",
    dueDate: "",
    payment1: "",
    payment2: "",
    payment3: "",
    date1: "",
    date2: "",
    date3: "",
  });
  const [clientInfo, setClientInfo] = useState({
    clientName: "",
    clientMobile: "",
    clientEmail: "",
    clientWeb: "",
    clientAddress: "",
    site: "",
    projectId: "",
    area: "",
    reference: "",
    referenceMobile: "",
    poolShape: "",
    poolSize: "",
    activeDate: "",
    inactiveDate: "",
    payment1: "",
    payment2: "",
    payment3: "",
    date1: "",
    date2: "",
    date3: "",
  });
  const [products, setProducts] = useState([
    {
      productName: "",
      price: "",
      unit: "",
      quantity: "",
      taxPercentage: "",
      discountPercentage: "",
      totalBill: "",
      taxAmount: "",
      discountAmount: "",
      finalTotal: "",
      total: "",
      taxValues: "",
      otherTaxName: "",
      // selectedTaxes: "",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [editedOurInfo, setEditedOurInfo] = useState({});
  const [note, setNote] = useState([{ note: "" }]);
  const [myData, setMyData] = useState([]);
  const [taxType, setTaxType] = useState(""); // Selected tax type

  // const [taxPercentage, setTaxPercentage] = useState(0); // Tax percentage (manual or auto)
  // const [taxBill, setTaxBill] = useState(1000); // Example total bill
  // const [taxAmount, setTaxAmount] = useState(0); // Calculated tax amount
  // const [finalTotal, setFinalTotal] = useState(taxBill);
  // const [filtered, setfiltered] = useState([]);

  // State for controlling whether to show the note
  // Other states and useEffects remain the same

  const [ourInfo1, setOurInfo1] = useState({
    address: "",
    ourEmail: "",
    ourMobile: "",
    paymentMethod0: "",
    salePerson1: "",
    ourWeb: "",
    note: "",
    address1: "",
    ourDate: "",
  });

  // console.log(ourInfo1)
  const handleCheckboxChange = (event) => {
    setShowNote(event.target.checked); // Update showNote state based on checkbox status
  };

  const handleOpenModal = () => {
    setShowModal(true);
    // Set edited ourInfo to the current ourInfo data
    setEditedOurInfo(ourInfo1);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    // Clear edited ourInfo when modal is closed
    setEditedOurInfo({});
  };

  // Function to handle saving the edited ourInfo
  const handleSaveOurInfo = () => {
    // Save edited ourInfo to Firebase
    const ourInfoRef = ref(db, "ourInfo");
    set(ourInfoRef, editedOurInfo)
      .then(() => {
        console.log("Edited Our Info successfully saved to Firebase");
        // Close the modal after saving
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error saving edited Our Info to Firebase: ", error);
      });
  };

  // Function to handle changes in the editable fields inside the modal
  const handleModalInputChange = (event) => {
    const { name, value } = event.target;
    setEditedOurInfo((prev) => ({ ...prev, [name]: value }));
  };

  const [showNote, setShowNote] = useState(() => {
    const storedShowNote = localStorage.getItem("showNote");
    return storedShowNote ? JSON.parse(storedShowNote) : false;
  });

  const [checked, setChecked] = useState(() => {
    const storedChecked = localStorage.getItem("checked");
    return storedChecked
      ? JSON.parse(storedChecked)
      : { vehicle1: false, vehicle2: true };
  });

  useEffect(() => {
    // Update local storage whenever showNote state changes
    localStorage.setItem("showNote", JSON.stringify(showNote));
  }, [showNote]);
  localStorage.setItem("payement", JSON.stringify(clientInfo));

  useEffect(() => {
    const ourInfoRef = ref(db, "ourInfo");
    onValue(ourInfoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOurInfo1(data);
      }
    });
  }, []);

  // Update local storage whenever checked state changes
  useEffect(() => {
    const valueToSave = checked.vehicle1 ? "Quotation" : "Invoice";
    localStorage.setItem("invoiceType", valueToSave);
  }, [checked]);

  const handleChange = (event) => {
    const { name } = event.target;
    const updatedChecked = {};

    // Uncheck all checkboxes
    Object.keys(checked).forEach((key) => {
      updatedChecked[key] = false;
    });

    // Check the clicked checkbox
    updatedChecked[name] = true;

    setChecked(updatedChecked);
  };
  const screen = window.innerWidth;
  // console.log(screen)

  //let [eSignature,setEsignature]=useState("")
  // let eSignature=localStorage.getItem("signature")

  // const signatureCanvasRef = useRef();

  {
    /*const handleResetSignature = () => {
    setEsignature(null);
  signatureCanvasRef.current.clear();
  };*/
  }

  useEffect(() => {
    // Save ourInfo1 to local storage
    localStorage.setItem("ourInfo", JSON.stringify(ourInfo1));
  }, [ourInfo1]);

  useEffect(() => {
    const savedFormData = JSON.parse(sessionStorage.getItem("invoiceFormData"));
    if (savedFormData) {
      setOurInfo(savedFormData.ourInfo);
      setClientInfo(savedFormData.clientInfo);
      // setProducts(savedFormData.products);
      setNote(savedFormData.note);
      setChecked(savedFormData.checked);
      setOurInfo1(savedFormData.ourInfo1);
      setShowNote(savedFormData.showNote);
      // setDiscount(savedFormData.discount);
      // setDiscountedTotal(savedFormData.discountedTotal);
      // setDiscountPercentage(savedFormData.discountPercentage);
    }
  }, []);

  const handleResetForm = () => {
    sessionStorage.removeItem("invoiceFormData");
    setOurInfo({
      salePerson: "",
      ourMobile: "",
      ourEmail: "",
      paymentMethod: "",
      ourWeb: "",
      address: "",
      date: "",
      dueDate: "",
      payment1: "",
      payment2: "",
      payment3: "",
      // date1: "",
      // date2: "",
      // date3: "",
    });
    setClientInfo({
      clientName: "",
      clientMobile: "",
      clientEmail: "",
      clientWeb: "",
      clientAddress: "",
      site: "",
      projectId: "",
      area: "",
      reference: "",
      referenceMobile: "",
      poolShape: "",
      poolSize: "",
      activeDate: "",
      inactiveDate: "",
      payment1: "",
      payment2: "",
      payment3: "",
      date1: "",
      date2: "",
      date3: "",
    });
    setProducts([
      {
        // productName: "",
        // price: "",
        // unit: "",
        // quantity: "",
        // discount: "",
        // total: "",
        // productName: data.productName,
        // price: data.price,
        // unit: data.unit,
        // quantity: data.quantity,
        // // discount: data.discount,
        // total: data.total,
      },
    ]);
    setNote("");
    setChecked({ vehicle1: false, vehicle2: false });

    {
      /* localStorage.removeItem('signature');
    handleResetSignature();*/
    }
  };

  // const [totalBill, setTotalBill] = useState(0);
  // const [discountPercentage, setDiscountPercentage] = useState(0);
  // const [discountAmount, setDiscountAmount] = useState(0);
  // const [discountedTotal, setDiscountedTotal] = useState(0);

  // // Assuming products state is set elsewhere

  // // Calculate total bill whenever products or discount percentage changes
  // useEffect(() => {
  //   const calculateTotalBill = () => {
  //     return products.reduce((total, product) => {
  //       return total + (parseFloat(product.total) || 0);
  //     }, 0);
  //   };

  //   const calculateDiscount = (finalTotal, discountPercentage) => {
  //     return (finalTotal * (parseFloat(discountPercentage) || 0)) / 100;
  //   };

  //   const newTotalBill = calculateTotalBill();
  //   const newDiscount = calculateDiscount(newTotalBill, discountPercentage);
  //   let newDiscountedTotal = newTotalBill - newDiscount;

  //   // Ensure advance payments are correctly subtracted
  //   const payment1 = parseFloat(clientInfo.payment1) || 0;
  //   const payment2 = parseFloat(clientInfo.payment2) || 0;
  //   const payment3 = parseFloat(clientInfo.payment3) || 0;

  //   newDiscountedTotal -= (payment1 + payment2 + payment3);

  //   setTotalBill(newTotalBill.toFixed(2));
  //   setDiscountAmount(newDiscount.toFixed(2));
  //   setDiscountedTotal(Math.max(newDiscountedTotal, 0).toFixed(2)); // Prevent negative values
  // }, [products, discountPercentage, clientInfo]);

  // const handleDiscountChange = (event) => {
  //   const value = event.target.value;
  //   setDiscountPercentage(value ? parseFloat(value) : 0);
  // };

  // const handleAddProduct = () => {
  //   setProducts([
  //     ...products,

  //     {
  //       productName: "",
  //       price: "",
  //       unit: "",
  //       quantity: "",
  //       taxPercentage: "",
  //       discountPercentage: "",
  //       totalBill: "",
  //       taxAmount: "",
  //       discountAmount: "",
  //       finalTotal: "",
  //       taxValues: "",
  //       otherTaxName: "",
  //       // selectedTaxes: "",
  //     },
  //   ]);
  // };

  const handleAddProduct = () => {
    setProducts((prevProducts) => [
      ...(Array.isArray(prevProducts) ? prevProducts : []), // Ensure it's an array
      {
        productName: "",
        price: "",
        unit: "",
        quantity: "",
        taxPercentage: "",
        discountPercentage: "",
        totalBill: "",
        taxAmount: "",
        discountAmount: "",
        finalTotal: "",
        taxValues: "",
        otherTaxName: "",
      },
    ]);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleProductInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;

    // Calculate total based on price, quantity, and discount
    const price = parseFloat(updatedProducts[index].price) || 0;
    const quantity = parseFloat(updatedProducts[index].quantity) || 0;
    const discount = parseFloat(updatedProducts[index].discount) || 0;

    const totalPrice = price * quantity * (1 - discount / 100);
    updatedProducts[index].total = totalPrice.toFixed(2);

    setProducts(updatedProducts);
  };

  const handleClientInfoChange = (event) => {
    const { name, value } = event.target;
    setClientInfo({ ...clientInfo, [name]: value });
  };
  const handleOurInfoChange1 = (event) => {
    const { name, value } = event.target;
    setOurInfo1({ ...ourInfo1, [name]: value });
  };

  const handleOurInfoChange = (e) => {
    const { name, value } = e.target;
    setOurInfo1({
      ...ourInfo1,
      [name]: value, // Dynamically update the property that matches the input's name
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (
      products.length === 0 ||
      products.every((product) => product.productName === "")
    ) {
      // If no products added, show alert message and return
      alert("Please add at least one product before submitting the form.");
      return;
    }
    const formData = {
      ourInfo: ourInfo,
      clientInfo: clientInfo,
      products: products,
      note: note,
      checked: checked,
      ourInfo1: ourInfo1,
      showNote: showNote,
      taxPercentage: taxPercentage,
      discountPercentage: discountPercentage,
      totalBill: totalBill,
      taxAmount: taxAmount,
      discountAmount: discountAmount,
      finalTotal: finalTotal,
      taxValues: taxValues,
      otherTaxName: otherTaxName,
      // selectedTaxes: selectedTaxes,
      //signature: signatureCanvasRef.current?.toDataURL() ? signatureCanvasRef.current.toDataURL() : eSignature
    };

    console.log(formData);
    // Pushing form data to Firebase
    push(ref(db, "invoices"), formData)
      .then(() => {
        navigate("/invoiceSummary", { state: { formData } });
      })
      .catch((error) => {
        alert("Error saving form data to Firebase: " + error.message);
      });
    //localStorage.setItem('signature', formData.signature);
    // Clearing form data and note
    sessionStorage.setItem("invoiceFormData", JSON.stringify(formData));
    console.log(formData);
    setOurInfo({
      salePerson: "",
      ourMobile: "",
      ourEmail: "",
      paymentMethod: "",
      ourWeb: "",
      address: "",
      date: "",
      dueDate: "",
      payment1: "",
      payment2: "",
      payment3: "",
      // date1: "",
      // date2: "",
      // date3: "",
    });
    setClientInfo({
      clientName: "",
      clientMobile: "",
      clientEmail: "",
      clientWeb: "",
      clientAddress: "",
      site: "",
      projectId: "",
      area: "",
      reference: "",
      referenceMobile: "",
      poolShape: "",
      poolSize: "",
      activeDate: "",
      inactiveDate: "",
      payment1: "",
      payment2: "",
      payment3: "",
      date1: "",
      date2: "",
      date3: "",
    });
    setProducts([
      {
        productName: "",
        price: "",
        unit: "",
        quantity: "",
        taxPercentage: "",
        discountPercentage: "",
        totalBill: "",
        taxAmount: "",
        discountAmount: "",
        finalTotal: "",
        total: "",
        taxValues: "",
        otherTaxName: "",
        // selectedTaxes: "",
      },
    ]);
    setNote([{ note: "" }]);
    setChecked([{ checked: "" }]);
    setOurInfo1([
      {
        address: "",
        ourEmail: "",
        ourMobile: "",
        paymentMethod0: "",
        salePerson1: "",
        ourWeb: "",
        note: "",
        address1: "",
        ourDate: "",
      },
    ]);
    setShowNote([{ showNote: "" }]);
  };

  useEffect(() => {
    // console.log(products)
    // let starCountRef = null;

    const starCountRef =
      type === "maintenance"
        ? ref(db, "/Maintenance/" + id)
        : type === "newpool"
        ? ref(db, "/NewProjects/" + id)
        : type === "repairing"
        ? ref(db, `/Repairing/${id}`)
        : ref(db, "/NewProjects/" + id); // Default case

    // console.log(starCountRef);
    const unsubscribe = onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      updateStates(data);
      // console.log(data)
      if (data) {
        // console.log(data)

        setMyData(Object.values(data));
      } else {
        setMyData([]);
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  const updateStates = (data) => {
    console.log(data);

    setClientInfo({
      clientName: data?.owner || "",
      clientMobile: data?.ownerMobile || "",
      projectId: data?.projectId || "",
      // clientEmail: data.clientEmail || "N/A",
      // clientWeb: data.clientWeb,
      clientAddress: data?.area || "",
    });

    setProducts(data?.products);
  };
  // console.log(products);

  // const [totalBill, setTotalBill] = useState(0);
  // const [taxPercentage, setTaxPercentage] = useState(0);
  // const [discountPercentage, setDiscountPercentage] = useState(0);
  // const [taxAmount, setTaxAmount] = useState(0);
  // const [discountAmount, setDiscountAmount] = useState(0);
  // const [finalTotal, setFinalTotal] = useState(0);

  // useEffect(() => {
  //   // Calculate Total Bill from Products
  //   const calculateTotalBill = () => {
  //     return products.reduce((total, product) => {
  //       return total + (parseFloat(product.total) || 0);
  //     }, 0);
  //   };

  //   // Calculate Tax Amount
  //   const calculateTax = (amount, percentage) => {
  //     return (amount * (parseFloat(percentage) || 0)) / 100;
  //   };

  //   // Calculate Discount Amount
  //   const calculateDiscount = (amount, percentage) => {
  //     return (amount * (parseFloat(percentage) || 0)) / 100;
  //   };

  //   const newTotalBill = calculateTotalBill();
  //   const newTaxAmount = calculateTax(newTotalBill, taxPercentage);
  //   const totalWithTax = newTotalBill + newTaxAmount; // Total after tax

  //   const newDiscount = calculateDiscount(totalWithTax, discountPercentage);
  //   let discountedTotal = totalWithTax - newDiscount; // Total after discount

  //   // Subtract Advance Payments
  //   const payment1 = parseFloat(clientInfo.payment1) || 0;
  //   const payment2 = parseFloat(clientInfo.payment2) || 0;
  //   const payment3 = parseFloat(clientInfo.payment3) || 0;

  //   let finalAmount = discountedTotal - (payment1 + payment2 + payment3);

  //   // Update States
  //   setTotalBill(newTotalBill.toFixed(2));
  //   setTaxAmount(newTaxAmount.toFixed(2));
  //   setDiscountAmount(newDiscount.toFixed(2));
  //   setFinalTotal(Math.max(finalAmount, 0).toFixed(2)); // Prevent negative value
  // }, [products, taxPercentage, discountPercentage, clientInfo]);

  // // Handle Tax Change
  // const handleTaxChange = (event) => {
  //   const value = event.target.value;
  //   setTaxPercentage(value ? parseFloat(value) : 0);
  // };

  // // Handle Discount Change
  // const handleDiscountChange = (event) => {
  //   const value = event.target.value;
  //   setDiscountPercentage(value ? parseFloat(value) : 0);
  // };

  const [taxPercentage, setTaxPercentage] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const [taxValues, setTaxValues] = useState({
    withholding_tax: null,
    sales_tax: null,
    pra_tax: null,
    other_tax: null,
  });

  useEffect(() => {
    // Calculate Total Bill from Products
    const calculateTotalBill = () => {
      return products?.reduce((total, product) => {
        return total + (parseFloat(product.total) || 0);
      }, 0);
    };
    // Calculate Tax Amount
    const calculateTax = (amount, percentage) => {
      let praTax = 0;
      let otherTaxes = 0;

      if (!taxValues || Object.keys(taxValues).length === 0) {
        return 0; // No taxes exist, return 0
      }

      for (const [key, val] of Object.entries(taxValues)) {
        const taxValue = Number(val) || 0;
        if (key === "pra_tax") {
          // Replace 'praTax' with the actual key for pra tax
          praTax += taxValue;
        } else {
          otherTaxes += taxValue;
        }
      }

      let praTaxCalculated = praTax / (100 + parseInt(praTax));
      let otherTaxCalculated = otherTaxes / 100;
      let totalTax =
        praTaxCalculated +
        otherTaxCalculated +
        (parseFloat(percentage) || 0) / 100;

      // let totalTax = (praTax / (100+parseInt(praTax))) + (otherTaxes / 100) + (parseFloat(percentage) || 0);
      return amount * totalTax;
    };
    // Calculate Discount Amount
    const calculateDiscount = (amount, percentage) => {
      return (amount * (parseFloat(percentage) || 0)) / 100;
    };

    const newTotalBill = calculateTotalBill();
    const newTaxAmount = calculateTax(newTotalBill, taxPercentage);
    const totalWithTax = newTotalBill + newTaxAmount; // Total after tax

    const newDiscount = calculateDiscount(totalWithTax, discountPercentage);
    const finalTotal = totalWithTax - newDiscount; // Final total after discount

    // Update States
    setTotalBill(newTotalBill?.toFixed(2));
    setTaxAmount(newTaxAmount?.toFixed(2));
    setDiscountAmount(newDiscount?.toFixed(2));
    setFinalTotal(Math.max(finalTotal, 0).toFixed(2)); // Prevent negative value
  }, [products, taxPercentage, discountPercentage, taxValues]);

  // Handle Tax Change
  const handleTaxChange = (event) => {
    const value = event.target.value;
    setTaxPercentage(value ? parseFloat(value) : null);
  };

  // Handle Discount Change
  const handleDiscountChange = (event) => {
    const value = event.target.value;
    setDiscountPercentage(value ? parseFloat(value) : null);
  };

  const [selectedTaxes, setSelectedTaxes] = useState([]);

  // ✅ Define tax options
  const taxOptions = [
    { value: "withholding_tax", label: "Withholding Tax" },
    { value: "sales_tax", label: "Sales Tax" },
    { value: "pra_tax", label: "PRA Tax" },
    { value: "other_tax", label: "Other Tax" },
  ];

  // console.log(taxValues)

  // ✅ Handle tax selection
  const handleTax2Change = (selectedOptions) => {
    console.log("Selected Options:", selectedOptions);
    // Extract selected values
    const selectedValues = selectedOptions.map((tax) => tax.value);

    // console.log("Selected Values:", selectedValues);

    // Update state with selected tax values
    setSelectedTaxes(selectedValues);
    // console.log(selectedValues)
  };

  const handleTax3Change = (e, taxType) => {
    setTaxValues((prev) => ({
      ...prev,
      [taxType]: e.target.value, // Update only the relevant tax type
    }));
  };

  const [otherTaxName, setOtherTaxName] = useState(""); // Stores Other Tax Name
  // console.log(otherTaxName)
  const handleTax4Change = (e) => {
    setOtherTaxName(e.target.value); // Update Other Tax Name state
  };

  // useEffect(() => {
  //   const calculateTotalBill = () => {
  //     let total = 0;
  //     products.forEach((product) => {
  //       if (!isNaN(parseFloat(product.total))) {
  //         total += parseFloat(product.total);
  //       }
  //     });
  //     return Math.max(total, 0);
  //   };

  //   const calculateTax = (totalBill, taxPercentage) => {
  //     return (totalBill * taxPercentage) / 100;
  //   };

  //   const newTotalBill = calculateTotalBill();
  //   const newTaxAmount = calculateTax(newTotalBill, taxPercentage);
  //   let newFinalTotal = newTotalBill + newTaxAmount;

  //   // Subtract advance payments
  //   newFinalTotal -= parseFloat(clientInfo.payment1) || 0;
  //   newFinalTotal -= parseFloat(clientInfo.payment2) || 0;
  //   newFinalTotal -= parseFloat(clientInfo.payment3) || 0;

  //   setTotalBill(newTotalBill.toFixed(2));
  //   setTaxAmount(newTaxAmount.toFixed(2));
  //   setFinalTotal(newFinalTotal.toFixed(2));
  // }, [products, taxPercentage, clientInfo]);

  // const handleTaxChange = (event) => {
  //   const { value } = event.target;
  //   setTaxPercentage(value);
  // };

  // {
  //   /* useEffect(() => {
  //   // Load signature data from local storage on component mount
  //   const savedSignature = localStorage.getItem('signature');
  //   if (savedSignature) {
  //     setEsignature(savedSignature);
  //   }
  // }, [])*/
  // }
  //  console.log(clientInfo)

  return (
    <>
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: screen < 430 ? "70%" : "70%",
            minHeight: "430px",
          }}
        >
          <h2 className="mb-[15px]">Edit Our Information</h2>
          <form>
            {/* Render editable fields */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <div
                className="inn1"
                style={{ marginBottom: "15px", width: "48%" }}
              >
                <TextField
                  id="salePerson1"
                  label="Sales Person"
                  type="text"
                  variant="outlined"
                  name="salePerson1"
                  value={editedOurInfo.salePerson1 || ""}
                  onChange={handleModalInputChange}
                  fullWidth
                />
              </div>
              {"\u00A0"} {"\u00A0"}{" "}
              <div
                className="inn1"
                style={{ marginBottom: "10px", width: "48%" }}
              >
                <TextField
                  id="ourMobile"
                  type="number"
                  label="Mobile No"
                  variant="outlined"
                  name="ourMobile"
                  value={editedOurInfo.ourMobile || ""}
                  onChange={handleModalInputChange}
                  fullWidth
                  className="w-[100%]"
                />
              </div>
              <div
                className="inn1"
                style={{ marginBottom: "15px", width: "48%" }}
              >
                <TextField
                  id="ourEmail"
                  type="email"
                  label="Email"
                  variant="outlined"
                  name="ourEmail"
                  value={editedOurInfo.ourEmail || ""}
                  onChange={handleModalInputChange}
                  fullWidth
                />
              </div>
              {"\u00A0"} {"\u00A0"}
              <div
                className="inn1"
                style={{ marginBottom: "10px", width: "48%" }}
              >
                <TextField
                  id="paymentMethod0"
                  label="Payment Method"
                  type="text"
                  variant="outlined"
                  name="paymentMethod0"
                  value={editedOurInfo.paymentMethod0 || ""}
                  onChange={handleModalInputChange}
                  fullWidth
                />
              </div>
              <div
                className="inn1"
                style={{ marginBottom: "15px", width: "48%" }}
              >
                <TextField
                  id="ourWeb"
                  type="text"
                  label="Website"
                  variant="outlined"
                  name="ourWeb"
                  value={editedOurInfo.ourWeb || ""}
                  onChange={handleModalInputChange}
                  fullWidth
                />
              </div>
              {"\u00A0"} {"\u00A0"}{" "}
              <div
                className="inn1"
                style={{ marginBottom: "10px", width: "48%" }}
              >
                <TextField
                  id="address"
                  type="text"
                  label="Address1"
                  variant="outlined"
                  name="address"
                  value={editedOurInfo.address || ""}
                  onChange={handleModalInputChange}
                  fullWidth
                />
              </div>
              <div
                className="inn1"
                style={{ marginBottom: "10px", width: "48%" }}
              >
                <TextField
                  id="address1"
                  type="text"
                  label="Address2"
                  variant="outlined"
                  name="address1"
                  value={editedOurInfo.address1 || ""}
                  onChange={handleModalInputChange}
                  fullWidth
                />
              </div>
              <div className="w-full flex justify-center">
                <TextField
                  label="Note"
                  id="note"
                  type="text"
                  variant="outlined"
                  name="note"
                  value={editedOurInfo.note || ""}
                  onChange={handleModalInputChange}
                  className="w-[70%]"
                  multiline
                  fullWidth
                  inputProps={{
                    style: {
                      width: "95%",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    },
                  }}
                />
              </div>
            </div>
            {/* Save and Cancel buttons */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleCloseModal}
                sx={{ mr: 2, mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveOurInfo}
                sx={{ mt: 2, width: "90px" }}
              >
                Save
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <div className="w-[100%]   flex items-center justify-center bg-[#fff] ">
        <div className="container mt-[15px]  w-[65%] ">
          <div className="btnq1 w-[88%] flex items-center justify-end ">
            <div className="checked flex flex-col  w-[90px] items-start justify-end ">
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <input
                  type="checkbox"
                  id="vehicle2"
                  name="vehicle2"
                  value="Car"
                  checked={checked.vehicle2}
                  onChange={handleChange}
                  style={{ transform: "scale(0.5)" }}
                />
                <label
                  id="checklbl"
                  htmlFor="vehicle2"
                  className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition duration-300 ease-in-out"
                >
                  Invoice
                </label>
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="checkbox"
                  id="vehicle1"
                  name="vehicle1"
                  value="Bike"
                  checked={checked.vehicle1}
                  onChange={handleChange}
                  style={{ transform: "scale(0.5)" }}
                />
                <label
                  id="checklbl"
                  htmlFor="vehicle1"
                  className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition duration-300 ease-in-out"
                >
                  Quotation
                </label>
                <br />
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-black mb-4 ">
            {checked.vehicle1 ? "Quotation" : "Invoice"}
          </h1>
          <form
            id="invoice-form"
            style={{ marginBottom: "20px" }}
            onSubmit={handleFormSubmit}
          >
            <fieldset className="w-[100%] flex flex-col flex-wrap p-4 space-y-4">
              <legend className="text-lg font-semibold">Our Information</legend>

              <div className="flex justify-end items-center">
                <Button id="btn6" onClick={handleOpenModal}>
                  Edit Form {"\u00A0"} <TbEdit />
                </Button>
              </div>

              <div className="w-[100%] gap-3 flex flex-row items-start  justify-between flex-wrap ">
                <div className="form-group  w-[30%] ">
                  <label
                    htmlFor="seller"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sales Person:
                  </label>
                  <input
                    type="text"
                    // id="salePerson1"
                    name="salePerson1"
                    value={ourInfo1.salePerson1}
                    onChange={handleOurInfoChange}
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />
                </div>

                <div className="form-group  w-[30%] ">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile No:
                  </label>
                  <input
                    type="number"
                    // id="ourMobile"
                    name="ourMobile"
                    value={ourInfo1.ourMobile}
                    onChange={handleOurInfoChange}
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="form-group  w-[30%]">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="ourEmail"
                    value={ourInfo1.ourEmail}
                    onChange={handleOurInfoChange}
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="form-group  w-[30%]">
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Method:
                  </label>
                  <input
                    type="text"
                    id="paymentMethod0"
                    name="paymentMethod0"
                    value={ourInfo1.paymentMethod0}
                    onChange={handleOurInfoChange}
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="form-group  w-[30%]">
                  <label
                    htmlFor="web"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website:
                  </label>
                  <input
                    type="text"
                    id="web"
                    name="ourWeb"
                    value={ourInfo1.ourWeb}
                    onChange={handleOurInfoChange}
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="form-group  w-[30%]">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date:
                  </label>
                  <input
                    type="date"
                    name="ourDate"
                    value={ourInfo1.ourDate}
                    onChange={handleOurInfoChange}
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex w-[100%] justify-between  ">
                  <div className="form-group  w-[48%] ">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address 1:
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={ourInfo1.address}
                      onChange={handleOurInfoChange}
                      className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="form-group  w-[48%] ">
                    <label
                      htmlFor="address1"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address 2:
                    </label>
                    <input
                      type="text"
                      id="address1"
                      name="address1"
                      value={ourInfo1.address1}
                      onChange={handleOurInfoChange}
                      className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="w-[100%]  flex flex-row items-start  justify-between  ">
              <legend>Client Information</legend>

              <div className="w-[100%] gap-5 flex ">
                <div className="form-group w-[34%] ">
                  <label htmlFor="client">Client Name:</label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={clientInfo.clientName}
                    onChange={handleClientInfoChange}
                  />
                </div>
                <div className="form-group w-[34%] ">
                  <label htmlFor="clientMobile">Mobile No:</label>
                  <input
                    type="text"
                    id="clientMobile"
                    name="clientMobile"
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={clientInfo.clientMobile}
                    onChange={handleClientInfoChange}
                  />
                </div>
                <div className="form-group w-[34%] ">
                  <label htmlFor="clientEmail">Email:</label>
                  <input
                    type="email"
                    id="clientEmail"
                    name="clientEmail"
                    className=" email mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={clientInfo.clientEmail}
                    onChange={handleClientInfoChange}
                  />
                </div>
              </div>

              <div className="flex w-[65%] justify-between  ">
                <div className="form-group w-[49%]">
                  <label htmlFor="clientWeb">Website:</label>
                  <input
                    type="text"
                    id="clientWeb"
                    name="clientWeb"
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={clientInfo.clientWeb}
                    onChange={handleClientInfoChange}
                  />
                </div>

                <div className="form-group w-[48%] " id="adr">
                  <label htmlFor="clientAddress">Address:</label>
                  <input
                    type="text"
                    id="clientAddress"
                    name="clientAddress"
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={clientInfo.clientAddress}
                    onChange={handleClientInfoChange}
                  />
                </div>
              </div>
            </fieldset>
            {/* 
             <fieldset className="w-full  flex flex-row items-start  justify-between  ">
              <legend className="text-lg font-semibold text-gray-700">
                Project Details
              </legend>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Site Name:
                </label>
                <input
                  type="text"
                  id="site"
                  name="site"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.site}
                  onChange={handleClientInfoChange}
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="area"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.area}
                  onChange={handleClientInfoChange}
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="reference"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reference:
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.reference}
                  onChange={handleClientInfoChange}
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="clientMobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reference Mobile:
                </label>
                <input
                  type="text"
                  id="referenceMobile"
                  name="referenceMobile"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.referenceMobile}
                  onChange={handleClientInfoChange}
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="clientEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pool Shape:
                </label>
                <input
                  type="number"
                  id="poolShape"
                  name="poolShape"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.poolShape}
                  onChange={handleClientInfoChange}
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="clientWeb"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pool Size (Gallons):
                </label>
                <input
                  type="text"
                  id="poolSize"
                  name="poolSize"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.poolSize}
                  onChange={handleClientInfoChange}
                />
              </div>

              <div className="flex w-[65%] items-start justify-between ">
                <div className="form-group w-[46%]  mb-4">
                  <label
                    htmlFor="startProject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Project:
                  </label>
                  <input
                    type="date"
                    id="activeDate"
                    name="activeDate"
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={clientInfo.activeDate}
                    onChange={(e) =>
                      setClientInfo({
                        ...clientInfo,
                        activeDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group w-[46%]  mb-4">
                  <label
                    htmlFor="completeProject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Complete Project:
                  </label>
                  <input
                    type="date"
                    id="inactiveDate"
                    name="inactiveDate"
                    className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={clientInfo.inactiveDate}
                    onChange={(e) =>
                      setClientInfo({
                        ...clientInfo,
                        inactiveDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </fieldset>  */}

            <fieldset className=" w-[100%]">
              <legend>Advance Payment</legend>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="clientMobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Advance amount 1:
                </label>
                <input
                  type="number"
                  id="clientMobile"
                  name="clientMobile"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.payment1}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, payment1: e.target.value })
                  }
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="startProject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Advance Amount 1:
                </label>
                <input
                  type="date"
                  id="startProject"
                  name="startProject"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.date1}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, date1: e.target.value })
                  }
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="clientMobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Advance amount 2:
                </label>
                <input
                  type="number"
                  id="clientMobile"
                  name="clientMobile"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.payment2}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, payment2: e.target.value })
                  }
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="startProject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Advance Amount 2:
                </label>
                <input
                  type="date"
                  id="startProject"
                  name="startProject"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.date2}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, date2: e.target.value })
                  }
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="clientMobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Advance amount 3:
                </label>
                <input
                  type="number"
                  id="clientMobile"
                  name="clientMobile"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.payment3}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, payment3: e.target.value })
                  }
                />
              </div>

              <div className="form-group w-[30%]  mb-4">
                <label
                  htmlFor="startProject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Advance Amount 3:
                </label>
                <input
                  type="date"
                  id="startProject"
                  name="startProject"
                  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clientInfo.date3}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, date3: e.target.value })
                  }
                />
              </div>
            </fieldset>

            <fieldset className=" w-[100%]">
              <legend>Products</legend>

              <table
                id="products-table"
                className="min-w-full table-auto border-collapse"
              >
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Product Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Unit
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="productName"
                          placeholder="Product Name"
                          value={product.productName}
                          onChange={(e) => handleProductInputChange(index, e)}
                          className="w-full px-[5px] py-[17px] border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="unit"
                          placeholder="kg"
                          value={product.unit}
                          onChange={(e) => handleProductInputChange(index, e)}
                          className="w-full px-[5px] py-[17px] border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="quantity"
                          placeholder="0"
                          value={product.quantity}
                          onChange={(e) => handleProductInputChange(index, e)}
                          className="w-full px-[5px] py-[17px] border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="price"
                          placeholder="0"
                          value={product.price}
                          onChange={(e) => handleProductInputChange(index, e)}
                          className="w-full px-[5px] py-[17px] border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="total"
                          placeholder="0"
                          value={product.total}
                          onChange={(e) => handleProductInputChange(index, e)}
                          className="w-full px-[5px] py-[17px] border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out"
                          onClick={() => handleDeleteProduct(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* <div>
      <label htmlFor="tax">Tax Percentage:</label>
      <input
        type="number"
        id="tax"
        value={taxPercentage}
        onChange={handleTaxChange}
        className="w-full px-[5px] py-[14px] border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
      />

      <div className="mt-2">
        <p className="mt-1">Total Bill: {totalBill}</p>
        <p className="mt-1">Tax: %{taxPercentage}</p>
        <p className="mt-1">Tax Amount: {taxAmount}</p>
        <p className="mt-1">Final Total (After Tax & Deductions): {finalTotal}</p>
      </div>
              </div> */}

              {/* <div>
                <label htmlFor="discount">Discount Percentage:</label>
                <input
                  type="number"
                  id="discount"
                  value={discountPercentage}
                  onChange={handleDiscountChange}
                  className="w-full px-[5px] py-[14px] border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                />

                <div className="mt-2 ">
                  <p className="mt-1">Total Bill: {finalTotal}</p>
                  <p className="mt-1">Discount: %{discountPercentage}</p>
                  <p className="mt-1">Discounted Total: {discountedTotal}</p>
                </div>
              </div>  */}

              <div className=" w-[100%] mt-3">
                {/* <div className=" w-[50%] "> */}
                <div className=" w-[100%] flex flex-col justify-evenly">
                  <div className="w-[99%] flex gap-4 items-center justify-between">
                    {/* Tax Input */}
                    <div className=" w-[30%]">
                      <label
                        htmlFor="tax"
                        className="block text-sm  font-bold text-gray-800 mb-1"
                      >
                        Tax Percentage
                      </label>

                      <div className="relative w-[100%]">
                        <input
                          type="number"
                          id="tax"
                          value={taxPercentage}
                          onChange={handleTaxChange}
                          className="w-full px-[10px] py-[17px]  border border-gray-300 rounded-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm"
                          placeholder="Enter tax"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Discount Input */}
                    <div className=" w-[30%] ">
                      <label
                        htmlFor="discount"
                        className="block text-sm font-bold text-gray-800 mb-1"
                      >
                        Discount Percentage
                      </label>
                      <div className="relative w-[100%]">
                        <input
                          type="number"
                          id="discount"
                          value={discountPercentage}
                          onChange={handleDiscountChange}
                          className="w-full px-[10px] py-[17px] border border-gray-300 rounded-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm"
                          placeholder="Enter discount"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          %
                        </span>
                      </div>
                    </div>

                    {/* <div className="w-[50%]  flex flex-col "> */}
                    <div className=" w-[40%] flex flex-col">
                      <h2 className="text-sm font-semibold mb-1">
                        Select Tax Types
                      </h2>
                      <Select
                        isMulti
                        isSearchable={false} // 🔹 Users cannot type custom text
                        backspaceRemovesValue={false}
                        onChange={handleTax2Change}
                        value={taxOptions.filter((option) =>
                          selectedTaxes.includes(option.value)
                        )} // ✅ Matches selected values
                        options={taxOptions}
                        placeholder="Select Taxes"
                        menuPlacement="top"
                        className=" w-[100%]  text-sm rounded-md shadow-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                        styles={{
                          valueContainer: (provided) => ({
                            ...provided,
                            display: "flex",
                            overflowX: "auto",
                            flexWrap: "nowrap",
                            gap: "4px",
                            maxWidth: "100%",
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
                  </div>

                  <div className="w-[99%] flex items-center justify-between flex-wrap ">
                    <div className="w-[100%] flex items-center justify-between flex-wrap ">
                      <div className="w-[100%] flex items-center gap-4 flex-wrap ">
                        {selectedTaxes.includes("withholding_tax") && (
                          <div className="mt-4 w-[30%]">
                            <label className="block text-sm text-gray-700 font-semibold mb-2">
                              Withholding Tax
                            </label>
                            <input
                              type="number"
                              value={taxValues[selectedTaxes]}
                              onChange={(e) =>
                                handleTax3Change(e, "withholding_tax")
                              }
                              className="w-full  px-3 py-4 border-[1px] border-blue-500 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                              placeholder="Enter amount"
                            />
                          </div>
                        )}
                        {selectedTaxes.includes("sales_tax") && (
                          <div className="mt-4 w-[30%]">
                            <label className="block text-sm text-gray-700 font-semibold mb-2">
                              Sales Tax
                            </label>
                            <input
                              type="number"
                              value={taxValues[selectedTaxes]}
                              onChange={(e) => handleTax3Change(e, "sales_tax")}
                              className="w-full  px-3 py-4 border-[1px] border-blue-500 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                              placeholder="Enter amount"
                            />
                          </div>
                        )}

                        {selectedTaxes.includes("pra_tax") && (
                          <div className="mt-3 w-[30%]">
                            <label className="block  text-sm text-gray-700 font-semibold mb-2">
                              PRA Tax
                            </label>
                            <input
                              type="number"
                              value={taxValues[selectedTaxes]}
                              onChange={(e) => handleTax3Change(e, "pra_tax")}
                              className="w-full  px-3 py-4 border-[1px] border-blue-500 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                              placeholder="Enter amount"
                            />
                          </div>
                        )}
                      </div>

                      <div className="w-[60%] flex items-center justify-between flex-wrap ">
                        {selectedTaxes.includes("other_tax") && (
                          <div className="mt-3 w-[45%]">
                            <label className="block  text-sm text-gray-700 font-semibold mb-2">
                              Other Tax
                            </label>
                            <input
                              type="number"
                              value={taxValues[selectedTaxes]}
                              onChange={(e) => handleTax3Change(e, "other_tax")}
                              className="w-full  px-3 py-4 border-[1px] border-blue-500 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                              placeholder="Other Tax %"
                            />
                          </div>
                        )}

                        {selectedTaxes.includes("other_tax") && (
                          <div className="mt-3 w-[45%]">
                            <label className="block text-sm text-gray-700 font-semibold mb-2">
                              Other Tax Name
                            </label>
                            <input
                              type="text"
                              value={otherTaxName} // ✅ Use otherTaxName state
                              onChange={handleTax4Change} // ✅ Proper handle change function
                              className="w-full px-3 py-4 border-[1px] border-blue-500 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                              placeholder="Other Tax Name"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* </div> */}

                {/* </div> */}

                {/* Display Calculated Summary */}
                <div className="mt-3">
                  <p className="text-sm text-gray-700">
                    Total Bill: {totalBill}
                  </p>
                  <p className="text-sm text-gray-700">
                    Tax: %{taxPercentage} (+{taxAmount})
                  </p>
                  <p className="text-sm text-gray-700">
                    Discount: %{discountPercentage} (-{discountAmount})
                  </p>
                  <p className="text-sm  text-gray-700">
                    Final Total (After Tax & Discount): {finalTotal}
                  </p>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  id="add-product"
                  onClick={handleAddProduct}
                  className="bg-black text-white px-4 py-2 rounded-md text-[14px] mt-2"
                >
                  Add Product
                </button>

                <span></span>
              </div>
            </fieldset>

            {/*  <fieldset>
          <legend>Signature</legend>
          {eSignature !== null ? (
            <img className='sigCanvas' src={eSignature} alt="E-Signature"/>
          ) : (
            <SignatureCanvas
              ref={signatureCanvasRef}
              penColor='green'
              canvasProps={{ width: 300, height: 130, className: 'sigCanvas' }}
            />
          )}
        <button type="button" id='btnreset' onClick={handleResetSignature}>Reset Signature</button>
          </fieldset>*/}

            <fieldset className="min-w-[100%]">
              <legend>Note</legend>

              {/* Note section */}
              <div className="form-group33 w-[100%] h-auto">
                <div
                  className="not"
                  style={{
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: "-15px",
                  }}
                >
                  <label
                    style={{ marginBottom: "0px", marginRight: "-10px" }}
                    htmlFor="showNoteCheckbox"
                  >
                    Show Note
                  </label>
                  <input
                    type="checkbox"
                    id="showNoteCheckbox"
                    checked={showNote}
                    onChange={handleCheckboxChange}
                    style={{ transform: "scale(0.6)" }}
                  />
                </div>

                {/* React Quill Editor */}
                <ReactQuill
                  value={ourInfo1.note}
                  onChange={(content) =>
                    handleOurInfoChange({
                      target: { name: "note", value: content },
                    })
                  }
                  className="w-[100%] h-[25vh]    border border-blue-500 rounded-md"
                  theme="snow"
                  style={{
                    // maxHeight: "20vh",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#1e3a8a #f0f0f0",
                  }}
                />
              </div>
            </fieldset>

            <div
              style={{
                marginTop: "15px",
                width: "99%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div></div>
              <span>
                <button type="submit" id="reset" onClick={handleResetForm}>
                  Reset Form
                </button>
                {"\u00A0"}
                <button type="submit">Submit</button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
