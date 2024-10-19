"use client";
import React, { useState } from "react";
import { Slider } from "@material-ui/core";
import Box from "@mui/material/Box";
import { useAuth } from "@/context/AuthContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Menu, MenuHandler, MenuList } from "@material-tailwind/react";

function Filters({
  priceRange,
  availableTypes,
  availableColors,
  availableConfigurations,
  availableProductCategories,
  availableLengths,
  availableWidths,
  availableHeights,
}) {
  const { openFilterDrawer } = useAuth();

 
  const arr = [
    {
      name: "width",
      content: (
        <div className="w-48">
          <h3 className="font-medium mb-2">Widths</h3>
          {availableWidths.map((Width) => (
            <label key={Width} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 accent-[#ef4665]"
                
              />
              <span className="ml-2 text-gray-700">{Width}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      name: "height",
      content: (
        <div className="w-48">
          <h3 className="font-medium mb-2">Heights</h3>
          {availableHeights.map((Height) => (
            <label key={Height} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 accent-[#ef4665]"
                
              />
              <span className="ml-2 text-gray-700">{Height}</span>
            </label>
          ))}
        </div>
      ),
    },

    {
      name: "length",
      content: (
        <div className="w-48">
          <h3 className="font-medium mb-2">Lengths</h3>
          {availableLengths.map((Length) => (
            <label key={Length} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 accent-[#ef4665]"
                
              />
              <span className="ml-2 text-gray-700">{Length}</span>
            </label>
          ))}
        </div>
      ),
    },

    {
      name: "productCategory",
      content: (
        <div className="w-48">
          <h3 className="font-medium mb-2">Type Door</h3>
          {availableProductCategories.map((Categories) => (
            <label key={Categories} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 accent-[#ef4665]"
               
              />
              <span className="ml-2 text-gray-700">{Categories}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      name: "color",
      content: (
        <div className="w-48">
          <h3 className="font-medium mb-2">Colors</h3>
          {availableColors.map((color) => (
            <label key={color} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 accent-[#ef4665]"
                
              />
              <span className="ml-2 text-gray-700">{color}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      name: "price",
      content: (
        <div className="px-5">
          <h3 className="font-medium mb-2">Price Range</h3>

          <Box sx={{ width: 300 }}>
            <Slider
              defaultValue={priceRange}
              size="medium"
              sx={{ color: "#ef4665", padding: "5px" }}
              className="!accent-[#ef4665]"
              aria-label="Default"
              valueLabelDisplay="auto"
              min={0}
              max={40000}
            />
          </Box>
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      ),
    },
    {
      name: "doors",
      content: (
        <div className="w-48">
          <h3 className="font-medium mb-2">Configuration</h3>
          {availableConfigurations.map((config) => (
            <label key={config} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 accent-[#ef4665]"
                
              />
              <span className="ml-2 text-gray-700">{config}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      name: "type",
      content: (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Type</h3>
          {availableTypes.map((type) => (
            <label key={type} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 accent-[#ef4665]"
                
              />
              <span className="ml-2 text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-around">
        {arr.map((p, index) => (
          <Menu
            dismiss={{
              itemPress: false,
            }}
            key={index}
            allowHover
            placement="bottom"
          >
            <MenuHandler>
              <button className="bg-gray-300 hidden md:block text-black text-start py-2 px-2 lg:px-6 rounded-full hover:bg-[#ef4665] hover:text-white transition">
                {p.name} <ArrowDropDownIcon />
              </button>
            </MenuHandler>
            <MenuList className="border-none">{p.content}</MenuList>
          </Menu>
        ))}

        <button
          onClick={openFilterDrawer}
          className="bg-gray-300 block md:hidden text-sm  text-black text-start py-2 px-6 rounded-full hover:bg-[#ef4665] hover:text-white transition"
        >
          All Filter <ArrowDropDownIcon />
        </button>
      </div>
    </>
  );
}

export default Filters;