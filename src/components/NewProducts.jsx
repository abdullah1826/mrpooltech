import React, { useState } from "react";
import Select from "react-select";

const NewProducts = ({
  products,
  setProducts,
  quotationTotal,
  setQuotationTotal,
}) => {

  // const handleInputChange = (e, index) => {
  //   const { name, value } = e.target;

  //   setProducts((prevProducts) => {
  //     const updatedProducts = [...prevProducts];
  //     updatedProducts[index] = {
  //       ...updatedProducts[index],
  //       [name]: value,
  //     };

  //     // Dynamically calculate total if quantity or price changes
  //     if (name === "quantity" || name === "price") {
  //       updatedProducts[index].total =
  //         (updatedProducts[index].quantity || 0) *
  //         (updatedProducts[index].price || 0);
  //     }

  //     return updatedProducts;
  //   });
  // };



  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
  
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: value,
      };
  
      // Calculate total for each product
      if (name === "quantity" || name === "price") {
        updatedProducts[index].total =
          (updatedProducts[index].quantity || 0) *
          (updatedProducts[index].price || 0);
      }
  
      // Calculate total sum of all product totals
      const newQuotationTotal = updatedProducts.reduce(
        (sum, product) => sum + (Number(product.total) || 0),
        0
      );
  
      // Update the quotationTotal state
      setQuotationTotal(newQuotationTotal);
  
      return updatedProducts;
    });
  };
  


  const addNewProduct = () => {
    setProducts((prevProducts) => [
      ...prevProducts,
      {
        productName: "",
        unit: "",
        quantity: 0,
        price: 0,
        total: 0,
      },
    ]);
  };

  const removeProduct = (index) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
  };

  return (
    <div className="font-sans">
      <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 max-w-max">
        Products
      </h1>
      {products.map((product, index) => (
        <form
          key={index}
          className="flex gap-4 flex-wrap w-[90%] mb-4 items-end border-b pb-4"
        >
          {/* Product Number */}
          <div className="w-full">
            <h2 className="text-lg font-medium text-gray-700">
              Product {index + 1}
            </h2>
          </div>

          <div className="w-full md:w-1/6">
            <label className="block mb-1 text-sm font-medium">Item Name</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Enter Name"
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Unit */}
          <div className="w-full md:w-1/6">
            <label className="block mb-1 text-sm font-medium">Unit</label>
            <input
              type="text"
              name="unit"
              value={product.unit}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Enter Unit"
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quantity */}
          <div className="w-full md:w-1/6">
            <label className="block mb-1 text-sm font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Enter Quantity"
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div className="w-full md:w-1/6">
            <label className="block mb-1 text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Enter Price"
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total */}
          <div className="w-full md:w-1/6">
            <label className="block mb-1 text-sm font-medium">Total</label>
            <input
              type="text"
              name="total"
              value={product.total.toFixed(2)}
              readOnly
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none  focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeProduct(index)}
            className="mt-4 px-4 py-2 bg-[#fff] border border-gray-300   font-small rounded-md hover:bg-[#e2e2e2]"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-rounded/24/f7440e/filled-trash.png"
              alt="filled-trash"
            />{" "}
          </button>
        </form>
      ))}

      {/* Add Product Button */}

      <div className="flex justify-end  w-[90%]">
        <button
          type="button"
          onClick={addNewProduct}
          className="mt-4 px-4 py-2 bg-[#0b6e99] text-white font-medium rounded-md hover:bg-[#298bb0]"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default NewProducts;
