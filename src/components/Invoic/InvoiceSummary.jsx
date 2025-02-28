import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { GoMail } from "react-icons/go";
import { FaWhatsapp } from "react-icons/fa";
import { TbWorldWww } from "react-icons/tb";
import "./InvoiceSummary.css";
import Invoice from "./Invoice";
import poolImg from "./images/pool.png";
import web from "./images/globe.png";
import mail from "./images/gmail.png";
import whatstapp from "./images/whatsapp.png";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function InvoiceSummary({
  totalBill,
  discount,
  discountedTotal,
}) {
  const [currentDate, setCurrentDate] = useState("");
  const [productPages, setProductPages] = useState([]);
  const location = useLocation();
  const formData = location.state?.formData;
  const invoiceRef = useRef([]);

  const invoiceNumber = Math.floor(Math.random() * 10000000);

  useEffect(() => {
    const getCurrentDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setCurrentDate(getCurrentDate());
  }, []);
  useEffect(() => {
    if (formData) {
      const products = formData.products;
      const pages = [];

      pages.push(products);

      // Only process second page if there are more than 6 products

      setProductPages(pages);
    }
  }, [formData]);
  // console.log(formData)

  const handleDownloadPDF = async () => {
    try {
      const pdf = new jsPDF();
      const scale = 2; // Adjust scale as needed
      const totalPages = productPages.length;
      let pageCount = 1; // Track page count

      for (let index = 0; index < productPages.length; index++) {
        const canvas = await html2canvas(invoiceRef.current[index], {
          scale: scale,
        });
        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Use canvas dimensions for height
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        // Add page number at the top
        if (totalPages > 1) {
          pdf.setFontSize(10);
          pdf.text(`Page ${pageCount}`, pdfWidth / 2, 10, { align: "center" });
        }

        if (index !== productPages.length - 1) {
          pdf.addPage();
          pageCount++;
        }
      }

      pdf.save("invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  const TotalBill = () => {
    let totalBill = 0;
    formData.products.forEach((product) => {
      if (!isNaN(parseFloat(product.total))) {
        totalBill += parseFloat(product.total);
      }
    });
    return Math.max(totalBill, 0).toFixed(2);
  };

  const calculateTotalBill = () => {
    let totalBill = 0;

    // Calculate total bill from products
    formData.products.forEach((product) => {
      if (!isNaN(parseFloat(product.total))) {
        totalBill += parseFloat(product.total);
      }
    });

    // Subtract advance payments
    totalBill -= parseFloat(formData.clientInfo.payment1) || 0;
    totalBill -= parseFloat(formData.clientInfo.payment2) || 0;
    totalBill -= parseFloat(formData.clientInfo.payment3) || 0;

    // Ensure totalBill is not negative

    // Return remaining bill amount
    return totalBill.toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const totaladvance = (one, two, three) => {
    // Convert strings to numbers using parseInt or parseFloat
    const num1 = one === "" ? 0 : parseInt(one);
    const num2 = two === "" ? 0 : parseInt(two);
    const num3 = three === "" ? 0 : parseInt(three);

    // Perform addition
    return num1 + num2 + num3;
  };

  return (
    <>
      <div className="w-[100%] flex  flex-row items-center justify-center bg-gray-300">
        <div className="max-w-max">
          <div className="download-container">
            <button id="dwn" onClick={handlePrint}>
              Download PDF
            </button>
          </div>

          {productPages.map((products, pageIndex) => (
            <div
              key={pageIndex}
              className="invoice-container"
              ref={(el) => (invoiceRef.current[pageIndex] = el)}
            >
              {pageIndex === 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "-30px",
                  }}
                >
                  <div style={{ width: "17%" }}></div>

                  {/* <img height={170} width={"50%"} src='./images/pool.png' /> */}

                  <img height={170} width={"45%"} src={poolImg} alt="Pool" />

                  <span
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      flexDirection: "column",
                    }}
                  >
                    {" "}
                    {formData && (
                      <h1 className="font-bold" style={{ color: "#2a68b2" }}>
                        {formData.checked.vehicle1 ? "Quotation" : "Invoice"}
                      </h1>
                    )}
                    <p style={{ margin: "0px" }}>
                      {formData.checked.vehicle1 ? "Quotation" : "Invoice"} #{" "}
                      {formData.clientInfo.projectId}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Date:
                      <input
                        type="text"
                        id="currentdate"
                        name="date"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                      />
                    </div>
                  </span>
                </div>
              )}

              {formData && (
                <>
                  {pageIndex === 0 && (
                    <div className="main">
                      <div className="main1 max-h-max ">
                        <h2 style={{ color: "#2a68b2" }}>Mr POOL TECH</h2>
                        {formData.ourInfo1.salePerson1 && (
                          <p>
                            <span id="hed">Sales Person:</span>{" "}
                            {formData.ourInfo1.salePerson1}
                          </p>
                        )}
                        {formData.ourInfo1.ourMobile && (
                          <p>
                            <span id="hed">Mobile No:</span>{" "}
                            {formData.ourInfo1.ourMobile}
                          </p>
                        )}
                        {formData.ourInfo1.website && (
                          <p>
                            <span id="hed">Website:</span>{" "}
                            {formData.ourInfo1.website}
                          </p>
                        )}
                      </div>
                      <div className="main2 max-h-max">
                        <h2 style={{ color: "#2a68b2" }}>CLIENT INFORMATION</h2>
                        <p>
                          <span id="hed">Client Name: </span>
                          {formData.clientInfo.clientName}
                        </p>
                        {formData.clientInfo.clientMobile && (
                          <p>
                            <span id="hed">Mobile No:</span>{" "}
                            {formData.clientInfo.clientMobile}
                          </p>
                        )}
                        {formData.clientInfo.clientEmail && (
                          <p>
                            <span id="hed">Email: </span>
                            {formData.clientInfo.clientEmail}
                          </p>
                        )}
                        {formData.clientInfo.clientWeb && (
                          <p>
                            <span id="hed">Website:</span>{" "}
                            {formData.clientInfo.clientWeb}
                          </p>
                        )}
                        {formData.clientInfo.clientAddress && (
                          <p>
                            <span id="hed">Address: </span>
                            {formData.clientInfo.clientAddress}
                          </p>
                        )}
                      </div>

                      {/* <div className="invoice-summary w-[100%]">
                    <h2 className="text-sm font-semibold">Project Details</h2>
                    <table className="w-[100%] mt-2 border-collapse border">
                      <thead className="w-[100%]" >
              
                      </thead>
                      <tbody className="w-[100%]" >
                   
                        <tr>
                          <td className="px-4 py-2 text-sm font-medium text-gray-600 border">
                            Site Name
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 border">
                            {formData.clientInfo.site}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-600 border">
                            Reference
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 border">
                            {formData.clientInfo.reference}
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-2 text-sm font-medium text-gray-600 border">
                            Address
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 border">
                            {formData.clientInfo.area}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-600 border">
                            Reference Mobile
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 border">
                            {formData.clientInfo.referenceMobile}
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-2 text-sm font-medium text-gray-600 border">
                            Pool Shape
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 border">
                            {formData.clientInfo.poolShape}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-600 border">
                            Pool Size (Gallons)
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 border">
                            {formData.clientInfo.poolSize}
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-2 text-sm font-medium text-gray-600 border">
                            Start Project
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 border">
                            {formData.clientInfo.activeDate}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-600 border">
                            Complete Project
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 border">
                            {formData.clientInfo.inactiveDate}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div> */}
                    </div>
                  )}
                  {pageIndex === 0 && (
                    <div id="seller-data">
                      <table className=" text-gray-600 mt-4 ">
                        <tbody className="font-medium">
                          <tr>
                            <th id="ee">Seller</th>
                            <th id="ee">Buyer</th>
                            <th id="ee">Payment Method</th>
                            <th id="ee">Date</th>
                          </tr>
                          {formData && (
                            <tr>
                              <td id="ee">{formData.ourInfo1.salePerson1}</td>
                              <td id="ee">{formData.clientInfo.clientName}</td>
                              <td id="ee">
                                {formData.ourInfo1.paymentMethod0}
                              </td>
                              <td id="ee">
                                {formData.ourInfo.date
                                  ? formData.ourInfo.date
                                  : currentDate}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <h2 id="hed">Products</h2>
                  <table>
                    <thead className=" text-gray-600 ">
                      <tr>
                        <th id="ee">Product Name</th>
                        <th id="ee">Unit</th>
                        <th id="ee">Quantity</th>
                        <th id="ee">Price</th>

                        <th id="ee">Total</th>
                      </tr>
                    </thead>
                    <tbody className=" text-gray-600 ">
                      {products.map((product, index) => (
                        <tr key={index}>
                          <td id="ee">{product.productName}</td>
                          <td id="ee">{product.unit}</td>
                          <td id="ee">{product.quantity}</td>
                          <td id="ee">{product.price}</td>

                          <td id="ee">{product.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pageIndex === 0 && formData && (
                    <>
                      {(!formData.clientInfo.payment1 ||
                        formData.clientInfo.payment1 === "") &&
                      (!formData.clientInfo.payment2 ||
                        formData.clientInfo.payment2 === "") &&
                      (!formData.clientInfo.payment3 ||
                        formData.clientInfo.payment3 === "") ? null : (
                        <div id="seller-data" className="py-3">
                          <h2
                            id="hed"
                            className="text-1xl font-semibold text-gray-800 mb-4"
                          >
                            Advance Payment
                          </h2>

                          <div className="overflow-x-auto w-[100%]">
                            <table className="w-[100%] bg-white border border-gray-200 table-auto">
                              <thead className="w-[100%] bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                                    #
                                  </th>
                                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                                    Date
                                  </th>
                                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                                    Payment
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="w-[100%]">
                                {(formData.clientInfo.payment1 ||
                                  formData.clientInfo.date1) && (
                                  <tr>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      01
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      {formData.clientInfo.date1}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      {formData.clientInfo.payment1}
                                    </td>
                                  </tr>
                                )}

                                {(formData.clientInfo.payment2 ||
                                  formData.clientInfo.date2) && (
                                  <tr>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      02
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      {formData.clientInfo.date2}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      {formData.clientInfo.payment2}
                                    </td>
                                  </tr>
                                )}

                                {(formData.clientInfo.payment3 ||
                                  formData.clientInfo.date3) && (
                                  <tr>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      03
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      {formData.clientInfo.date3}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      {formData.clientInfo.payment3}
                                    </td>
                                  </tr>
                                )}

                                {(parseFloat(
                                  formData.clientInfo.payment1 || 0
                                ) !== 0 ||
                                  parseFloat(
                                    formData.clientInfo.payment2 || 0
                                  ) !== 0 ||
                                  parseFloat(
                                    formData.clientInfo.payment3 || 0
                                  ) !== 0) && (
                                  <tr className="bg-blue-50">
                                    <td
                                      colSpan={2}
                                      className="px-4 py-2 text-sm text-gray-600"
                                    >
                                      Total Advance:
                                    </td>
                                    <td className="px-4 py-2 text-lg font-semibold text-blue-600">
                                      {parseFloat(
                                        formData.clientInfo.payment1 || 0
                                      ) +
                                        parseFloat(
                                          formData.clientInfo.payment2 || 0
                                        ) +
                                        parseFloat(
                                          formData.clientInfo.payment3 || 0
                                        )}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {pageIndex === productPages.length - 1 && (
                    <div className="w-full flex flex-col items-end space-y-3">
                      {/* Total Bill */}
                      <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                        <div>Total Bill:</div> {TotalBill()}
                      </p>

                      {
                        <>
                          {formData.taxPercentage &&
                          parseFloat(formData.taxPercentage) !== 0 ? (
                            <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                              <div>Tax:</div> {formData.taxPercentage}%
                            </p>
                          ) : null}

                          {formData.taxValues.withholding_tax &&
                          parseFloat(formData.taxValues.withholding_tax) !==
                            0 ? (
                            <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                              <div> Withholding Tax:</div>{" "}
                              {formData.taxValues.withholding_tax}%
                            </p>
                          ) : null}

                          {formData.taxValues.sales_tax &&
                          parseFloat(formData.taxValues.sales_tax) !== 0 ? (
                            <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                              <div> Sales Tax:</div>{" "}
                              {formData.taxValues.sales_tax}%
                            </p>
                          ) : null}

                          {formData.taxValues.pra_tax &&
                          parseFloat(formData.taxValues.sales_tax) !== 0 ? (
                            <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                              <div> PRA Tax:</div> {formData.taxValues.pra_tax}%
                            </p>
                          ) : null}

                          {formData.taxValues.other_tax &&
                          parseFloat(formData.taxValues.other_tax) !== 0 ? (
                            <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                              <div>
                                {" "}
                                {formData.otherTaxName || "Other Tax:"}{" "}
                              </div>{" "}
                              {formData.taxValues.other_tax}%
                            </p>
                          ) : null}

                          {formData.discountPercentage &&
                          parseFloat(formData.discountPercentage) !== 0 ? (
                            <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                              <div>Discount:</div> {formData.discountPercentage}
                              %
                            </p>
                          ) : null}

                          <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                            <div>Grand Total:</div> {formData.finalTotal}
                          </p>

                          {formData?.clientInfo?.payment1 !== "" &&
                            formData?.clientInfo?.payment2 !== "" &&
                            formData?.clientInfo?.payment3 !== "" &&
                            totaladvance(
                              formData?.clientInfo?.payment1,
                              formData?.clientInfo?.payment2,
                              formData?.clientInfo?.payment3
                            ) > 0 && (
                              <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                                <div>Total Advance:</div>
                                {parseFloat(
                                  formData?.clientInfo?.payment1 || 0
                                ) +
                                  parseFloat(
                                    formData?.clientInfo?.payment2 || 0
                                  ) +
                                  parseFloat(
                                    formData?.clientInfo?.payment3 || 0
                                  )}
                              </p>
                            )}

                          {/* {formData.clientInfo.payment1 ||
                          formData.clientInfo.payment2 ||
                          formData.clientInfo.payment3 ? ( */}

                          {totaladvance(
                            formData?.clientInfo?.payment1,
                            formData?.clientInfo?.payment2,
                            formData?.clientInfo?.payment3
                          ) > 0 && (
                            <p className="text-lg font-medium border-b border-gray-300 pb-1 w-full flex justify-between">
                              <span>Remaining Bill:</span>
                              {parseFloat(formData.finalTotal || 0) -
                                totaladvance(
                                  formData?.clientInfo?.payment1,
                                  formData?.clientInfo?.payment2,
                                  formData?.clientInfo?.payment3
                                )}
                            </p>
                          )}

                          {/* ) : null} */}
                        </>
                      }
                    </div>
                  )}

                  {pageIndex === productPages.length - 1 && (
                    <>
                      {formData.showNote ? (
                        <p id="pp" style={{ textAlign: "center" }}>
                          <span
                            id="hed1"
                            style={{ textAlign: "center", fontSize: "18px" }}
                          >
                            Note:
                          </span>
                          <span
                            style={{ width: "100%" }}
                            dangerouslySetInnerHTML={{
                              __html: formData.ourInfo1.note,
                            }}
                          />
                        </p>
                      ) : null}
                    </>
                  )}

                  {pageIndex === productPages.length - 1 && (
                    <div className="footer">
                      <div
                        className="flex items-center flex-col "
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          marginBottom: "-10px",
                          marginTop: "20px",
                        }}
                      >
                        <div className=" w-[100%] bg-[#2967b2] px-4 py-0 rounded-md text-white flex items-center justify-between">
                          {formData && (
                            <p
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                fontSize: "15px",
                                marginTop: "0px",
                                alignItems: "center",
                                fontWeight: "600",
                              }}
                            >
                              <span
                                id="hed"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "50%",
                                  height: "30px",
                                  width: "30px",
                                }}
                              >
                                <img height={20} width={20} src={whatstapp} />
                              </span>{" "}
                              {formData.ourInfo1.ourMobile}
                              {"\u00A0"}
                            </p>
                          )}
                          {formData && (
                            <p
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                fontSize: "15px",
                                marginTop: "0px",
                                alignItems: "center",
                                fontWeight: "600",
                              }}
                            >
                              <span
                                id="hed"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "50%",
                                  height: "30px",
                                  width: "30px",
                                }}
                              >
                                <img height={20} width={20} src={mail} />
                              </span>
                              {formData.ourInfo1.ourEmail}
                              {"\u00A0"}
                            </p>
                          )}

                          {formData && (
                            <p
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                fontSize: "15px",
                                marginTop: "0px",
                                alignItems: "center",
                                fontWeight: "600",
                              }}
                            >
                              <span
                                id="hed"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "50%",
                                  height: "30px",
                                  width: "30px",
                                }}
                              >
                                <img height={20} width={20} src={web} />
                              </span>{" "}
                              {formData.ourInfo1.ourWeb}
                            </p>
                          )}
                        </div>
                        {/* <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            height: "60px",
                            width: "100%",
                          }}
                        ></div> */}

                        {formData && (
                          <p
                            style={{
                              width: "100%",
                              marginTop: "25px",
                              display: "flex",
                              justifyContent: "center",
                              fontSize: "18px",
                              alignItems: "center",
                              textAlign: "center",
                              fontWeight: "600",
                            }}
                          >
                            {" "}
                            {formData.ourInfo1.address}
                          </p>
                        )}
                        {formData && (
                          <p
                            style={{
                              width: "100%",
                              margin: "0px",
                              display: "flex",
                              justifyContent: "center",
                              fontSize: "18px",
                              alignItems: "center",
                              textAlign: "center",
                              fontWeight: "600",
                            }}
                          >
                            {" "}
                            {formData.ourInfo1.address1}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
