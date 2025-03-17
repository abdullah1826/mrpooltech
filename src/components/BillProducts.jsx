import React, { useState } from "react";
import Select from "react-select";

const NewProducts = ({ products, setProducts }) => {
  // const handleInputChange = (e, index) => {
  //   const { name, value } = e.target;

  //   setProducts((prevProducts) => {
  //     const updatedProducts = [...prevProducts];
  //     updatedProducts[index] = {
  //       ...updatedProducts[index],
  //       [name]: name === "quantity" || name === "price" ? parseFloat(value) || 0 : value, // Ensure numeric fields are numbers
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
      // Create a copy of the products array
      const updatedProducts = [...prevProducts];

      // Update the specific product at the given index
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]:
          name === "quantity" || name === "price"
            ? parseFloat(value) || 0
            : value, // Parse numbers correctly
      };

      // Dynamically calculate total if quantity or price changes
      if (name === "quantity" || name === "price") {
        updatedProducts[index].total =
          (updatedProducts[index].quantity || 0) *
          (updatedProducts[index].price || 0);
      }

      // Return the updated products array
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

  // let [Item, setItem] = useState(null);

  //   const [ItemType, setItemType] = useState(null);
  //   // const [worker, setWorker] = useState(null);

  //   // Options for worker types

  //   const ItemTypeOptions = [
  //     { value: "permanent", label: "Permanent" },
  //     { value: "visitor", label: "Visitor" },
  //     { value: "other", label: "Other" },

  //   ];

  // Dynamically set options for the second dropdown
  // const workerOptions = workerType ? workersByType[workerType.value] : [];
  // console.log(workerOptions);

  return (
    <div className="font-sans mt-[40px]">
      <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 max-w-max">
        Bill Products
      </h1>

      {products?.map((product, index) => (
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

          {/* Item Name */}
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
              value={product.total}
              readOnly
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeProduct(index)}
            className="mt-4 px-4 py-2 bg-[#fff] border border-gray-300 font-small rounded-md hover:bg-[#e2e2e2]"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-rounded/24/f7440e/filled-trash.png"
              alt="Delete Product"
            />
          </button>
        </form>
      ))}

      {/* Add Product Button */}

      <div className="flex justify-end  w-[87%]">
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
