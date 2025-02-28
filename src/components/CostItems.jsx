import React, { useState } from "react";
import Select from "react-select";

const CostItems = ({ items, setItems }) => {
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value,
      };

      // Dynamically calculate total if quantity or price changes
      if (name === "quantity" || name === "price") {
        updatedItems[index].total =
          (updatedItems[index].quantity || 0) *
          (updatedItems[index].price || 0);
      }

      return updatedItems;
    });
  };

  const addNewItems = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        itemsName: "",
        unit: "",
        quantity: 0,
        price: 0,
        total: 0,
        activeDate: "",
        itemDescription: "",
        category: "",
      },
    ]);
  };

  const removeItems = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // let [items, setItem] = useState(null);

  const [category, setCategory] = useState(null);
  // const [worker, setWorker] = useState(null);

  // Options for worker types
  // console.log(items);
  const itemTypeOptions = [
    { value: "PlumberMaterial", label: "Plumber Material" },
    { value: "ElectricMaterial", label: "Electric Material" },
    { value: "Filter", label: "Filter" },
    { value: "Pump", label: "Pump" },
    { value: "Labour", label: "Labour" },
    { value: "Fuel", label: "Fuel" },
    { value: "Others", label: "Others" },
  ];

  // Dynamically set options for the second dropdown
  // const workerOptions = workerType ? workersByType[workerType.value] : [];
  // console.log(workerOptions);

  return (
    <div className="font-sans">
      <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 max-w-max">
        Costing
      </h1>
      {items.map((items, index) => (
        <form
          key={index}
          className="flex gap-4 flex-wrap w-[90%] mb-4 items-end border-b pb-4"
        >
          {/* Product Number */}
          <div className="w-full">
            <h2 className="text-lg font-medium text-gray-700">
              Item {index + 1}
            </h2>
          </div>

          {/* Product Name */}
          <div className="w-full md:w-[16%]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              onChange={(selectedOption) => {
                setCategory(selectedOption);
                setItems((prevItems) =>
                  prevItems.map((item, i) =>
                    i === index
                      ? { ...item, category: selectedOption.value }
                      : item
                  )
                );
              }}
              value={itemTypeOptions.find(
                (option) => option.value === items?.category
              )}
              options={itemTypeOptions}
              placeholder="Select"
              className="text-sm rounded-md shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full md:w-[12%]">
            <label className="block mb-1 text-sm font-medium">Item Name</label>
            <input
              type="text"
              name="itemsName"
              value={items.itemsName}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Enter Name"
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Unit */}
          <div className="w-full md:w-[12%]">
            <label className="block mb-1 text-sm font-medium">Unit</label>
            <input
              type="text"
              name="unit"
              value={items.unit}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Enter Unit"
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quantity */}
          <div className="w-full md:w-[12%]">
            <label className="block mb-1 text-sm font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={items?.quantity}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Enter Quantity"
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div className="w-full md:w-[12%]">
            <label className="block mb-1 text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={items.price}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Enter Price"
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total */}
          <div className="w-full md:w-[12%]">
            <label className="block mb-1 text-sm font-medium">Total</label>
            <input
              type="text"
              name="total"
              value={items?.total?.toFixed(2) || 0}
              readOnly
              placeholder="00"
              className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeItems(index)}
            className="mt-4 px-4 py-2 bg-[#fff]  border border-gray-300  text-white font-small rounded-md hover:bg-[#e2e2e2]"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-rounded/24/f7440e/filled-trash.png"
              alt="filled-trash"
            />{" "}
          </button>

          <div className="flex  items-baseline gap-4 flex-row w-[100%] ">
            <div className="w-full md:w-[47%]">
              <label className="block mb-1 text-sm font-medium">
                Description
              </label>
              <textarea
                name="itemDescription"
                value={items.itemDescription}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Enter Description"
                className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col  w-[45%]  ">
              <label className="block mb-1 text-sm font-medium">Date</label>
              <input
                type="date"
                name="activeDate"
                className="h-10 w-full text-sm border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleInputChange(e, index)} // Use the existing function
                value={items.activeDate}
            
              />
            </div>
          </div>
        </form>
      ))}

      {/* Add Product Button */}

      <div className="flex justify-end  w-[85%]">
        <button
          type="button"
          onClick={addNewItems}
          className="mt-4 px-4 py-2   bg-[#0b6e99]  text-white font-medium rounded-md hover:bg-[#298bb0]"
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default CostItems;
