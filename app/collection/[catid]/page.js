"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Slider } from "@nextui-org/react";
import notFoundimg from "../../../src/images/Empty-pana.png";
import { Accordion, AccordionItem } from "@nextui-org/react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  Drawer,
  Button,
  Dialog,
  Textarea,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  getFilterdProducts,
  getFilters,
  getProducts,
} from "@/store/productSlice";
import { debounce } from "lodash";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "./productgrid";
import Box from "@mui/material/Box";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Menu, MenuHandler, MenuList } from "@material-tailwind/react";
import NewCategoriess from "./NewCategoriess";
import Image from "next/image";

function ProductPage({ params }) {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState(1);
  const [price, setPrice] = React.useState([0, 40000]);

  const handleOpen = () => setOpen(!open);

  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const Info = Object.fromEntries(formData.entries());
    alert(JSON.stringify(Info));
    formRef.current.reset();
  };

  const category = params.catid;
  const { FilterdProducts, loading } = useSelector((state) => state.productss);

  const {
    configurations,
    types,
    colors,
    productCategory,
    dimensionLength,
    dimensionHeight,
    dimensionWidth,
  } = useSelector((state) => state.productss?.filters);

  const availableTypes = useMemo(
    () => [...new Set(types?.map((p) => p))],
    [types]
  );
  const availableConfigurations = useMemo(
    () => [...new Set(configurations?.map((p) => p))],
    [configurations]
  );
  const availableColors = useMemo(
    () => [...new Set(colors?.map((p) => p))],
    [colors]
  );
  const availableProductCategories = useMemo(
    () => [...new Set(productCategory?.map((p) => p))],
    [productCategory]
  );
  const availableLengths = useMemo(
    () => [...new Set(dimensionLength?.map((p) => p))],
    [dimensionLength]
  );
  const availableWidths = useMemo(
    () => [...new Set(dimensionWidth?.map((p) => p))],
    [dimensionWidth]
  );
  const availableHeights = useMemo(
    () => [...new Set(dimensionHeight?.map((p) => p))],
    [dimensionHeight]
  );

  const [priceRange, setPriceRange] = useState([0, 40000]);
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    productCategory: [],
    configuration: [],
    color: [],
    width: [],
    height: [],
    length: [],
    priceRange: [0, 40000],
  });

  // const products = useSelector(state => state.productss.FilterdProducts);

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prevFilters) => {
      const newFilterValues = prevFilters[filterName].includes(value)
        ? prevFilters[filterName].filter((item) => item !== value)
        : [...prevFilters[filterName], value];
      return { ...prevFilters, [filterName]: newFilterValues };
    });
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: newValue,
    }));
  };

  const applyFilters = () => {
    let query = new URLSearchParams();

    Object.keys(selectedFilters).forEach((filterKey) => {
      if (selectedFilters[filterKey].length || filterKey === "priceRange") {
        query.append(filterKey, selectedFilters[filterKey].join(","));
      }
    });

    console.log(query);

    dispatch(getFilterdProducts({ query, category, count, price }));
  };

  useEffect(() => {
    dispatch(getFilters());
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [count, category, dispatch, price, selectedFilters]);

  const filterOptions = [
    { name: "type", options: availableTypes, filterKey: "type" },
    {
      name: "type door",
      options: availableProductCategories,
      filterKey: "productCategory",
    },
    {
      name: "doors",
      options: availableConfigurations,
      filterKey: "configuration",
    },
    { name: "color", options: availableColors, filterKey: "color" },
    { name: "width", options: availableWidths, filterKey: "width" },
    { name: "height", options: availableHeights, filterKey: "height" },
    { name: "length", options: availableLengths, filterKey: "length" },
    { name: "price", options: [], filterKey: "priceRange" },
  ];

  const {
    openFilter,
    Reqvalue,
    showNavbar,
    openFilterDrawer,
    closeFilterDrawer,
  } = useAuth();

  return (
    <>
      <div className="mx-auto">
        {/* Banner Section */}
        <div className="h-[100px] md:h-[300px] mt-24 bg-[url('https://mebel-dlya-vseh.ru/d/garderobnaya-eulaliya.jpg')] flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl text-[#ffffff] font-bold">
            Product List
          </h1>
        </div>

        <NewCategoriess />

        {/* Filter Section */}
        <div className="relative">
          <div
            className={`sticky ${
              showNavbar
                ? Reqvalue === "flex"
                  ? "top-[100px] lg:top-[114px]"
                  : "top-[70px]"
                : "top-0"
            } z-10 w-full px-5 border-b py-5 xl:px-20 bg-white transition-transform duration-300 ease-in-out`}
          >
            <div className="hidden md:flex justify-around">
              {filterOptions.map((filter, index) => (
                <Menu
                  key={index}
                  dismiss={{
                    itemPress: false,
                  }}
                  allowHover
                  placement="bottom"
                >
                  <MenuHandler>
                    <button className="bg-gray-300 text-black text-start py-1 md:py-2 px-2 lg:px-6 rounded-full hover:bg-[#ef4665] hover:text-white transition">
                      {filter.name} <ArrowDropDownIcon />
                    </button>
                  </MenuHandler>
                  <MenuList className="shadow-lg border-none">
                    {filter.filterKey !== "priceRange" &&
                    filter.filterKey !== "width" &&
                    filter.filterKey !== "height" &&
                    filter.filterKey !== "length" ? (
                      // For other filters like checkboxes
                      filter.options.map((option) =>
                        option ? (
                          <label
                            key={option}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 accent-[#ef4665]"
                              onChange={() =>
                                handleFilterChange(filter.filterKey, option)
                              }
                              checked={selectedFilters[
                                filter.filterKey
                              ].includes(option)}
                            />
                            <span className="ml-2 text-gray-700">{option}</span>
                          </label>
                        ) : null
                      )
                    ) : filter.filterKey === "priceRange" ? (
                      // For price range
                      <div className="flex flex-col gap-2 py-2 w-full h-full max-w-md items-start justify-center">
                        <Slider
                          label="Select a Price"
                          color="#ef4465"
                          size="sm"
                          formatOptions={{ style: "currency", currency: "INR" }}
                          maxValue={40000}
                          minValue={0}
                          value={price}
                          onChange={setPrice}
                          classNames={{
                            base: "max-w-md",
                            filler: "bg-[#ef4665]",
                            labelWrapper: "mb-2",
                            label: "font-medium text-default-700 text-medium",
                            value: "font-medium text-default-500 text-small",
                            thumb: [
                              "transition-size",
                              "bg-[#ef4665]",
                              "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
                              "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6",
                            ],
                            step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
                          }}
                          tooltipProps={{
                            offset: 10,
                            placement: "top",
                            classNames: {
                              base: [
                                // arrow color
                                "before:bg-gradient-to-r before:from-secondary-400 before:to-primary-500",
                              ],
                              content: [
                                "py-2 shadow-xl",
                                "text-white bg-gradient-to-r from-secondary-400 to-primary-500",
                              ],
                            },
                          }}
                        />
                      </div>
                    ) : filter.filterKey === "width" ? (
                      // For width filter
                      filter.options.map((option) => (
                        <label key={option} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 accent-[#ef4665]"
                            onChange={() =>
                              handleFilterChange(filter.filterKey, option)
                            }
                            checked={selectedFilters[filter.filterKey].includes(
                              option
                            )}
                          />
                          <span className="ml-2 text-gray-700">{`${option}m`}</span>
                        </label>
                      ))
                    ) : filter.filterKey === "height" ? (
                      // For height filter
                      filter.options.map((option) => (
                        <label key={option} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 accent-[#ef4665]"
                            onChange={() =>
                              handleFilterChange(filter.filterKey, option)
                            }
                            checked={selectedFilters[filter.filterKey].includes(
                              option
                            )}
                          />
                          <span className="ml-2 text-gray-700">{`${option}m`}</span>
                        </label>
                      ))
                    ) : filter.filterKey === "length" ? (
                      // For length filter
                      filter.options.map((option) => (
                        <label key={option} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 accent-[#ef4665]"
                            onChange={() =>
                              handleFilterChange(filter.filterKey, option)
                            }
                            checked={selectedFilters[filter.filterKey].includes(
                              option
                            )}
                          />
                          <span className="ml-2 text-gray-700">{`${option}m`}</span>
                        </label>
                      ))
                    ) : null}
                  </MenuList>
                </Menu>
              ))}
            </div>
            <button
              onClick={openFilterDrawer}
              className="bg-gray-300 block md:hidden text-sm text-black py-2 px-6 rounded-full hover:bg-[#ef4665] hover:text-white transition"
            >
              All Filter <ArrowDropDownIcon />
            </button>
          </div>

          {/* Product Cards Section */}

          {FilterdProducts.length == 0 && loading ? (
            <div className="flex justify-center h-96 my-5 items-center">
              <Image className="w-64" src={notFoundimg} />
            </div>
          ) : (
            <div className="grid mb-10 px-5 lg:px-10 xl:px-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {FilterdProducts?.map((product) => (
                <ProductCard
                  key={product._id}
                  params={category}
                  loading={loading}
                  product={product}
                />
              ))}
            </div>
          )}

          <div className="flex mb-24 justify-center text-center">
            {FilterdProducts.length % 8 == 0 && FilterdProducts.length !== 0 ? (
              <div>
                <Button
                  size="md"
                  onClick={() => setCount(count + 1)}
                  variant="outlined"
                  className="flex me-2 items-center "
                >
                  Show More
                </Button>
              </div>
            ) : (
              ""
            )}

            <div className="">
              <Button onClick={handleOpen} className="ms-2" size="md">
                Need Help ?
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer for Filters */}
      <Drawer
        open={openFilter}
        onClose={closeFilterDrawer}
        className="lg:hidden p-4"
        overlay={false}
      >
        <div className="overflow-y-auto">
          <div className="h-screen">
            <Accordion>
              {filterOptions.map((filter, index) => (
                <AccordionItem
                  key={filter.filterKey}
                  aria-label={filter.name}
                  indicator={({ isOpen }) =>
                    isOpen ? <RemoveIcon /> : <AddIcon />
                  }
                  title={filter.name}
                >
                  {filter.filterKey !== "priceRange" &&
                  filter.filterKey !== "width" &&
                  filter.filterKey !== "height" &&
                  filter.filterKey !== "length" ? (
                    // For other filters like checkboxes
                    filter.options.map((option) => (
                      <label key={option} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 accent-[#ef4665]"
                          onChange={() =>
                            handleFilterChange(filter.filterKey, option)
                          }
                          checked={selectedFilters[filter.filterKey].includes(
                            option
                          )}
                        />
                        <span className="ml-2 text-gray-700">{option}</span>
                      </label>
                    ))
                  ) : filter.filterKey === "priceRange" ? (
                    // For price range
                    <div className="flex flex-col gap-2 py-2 w-full h-full max-w-md items-start justify-center">
                      <Slider
                        label="Select a Price"
                        color="#ef4465"
                        size="sm"
                        formatOptions={{ style: "currency", currency: "INR" }}
                        maxValue={40000}
                        minValue={0}
                        value={price}
                        onChange={setPrice}
                        classNames={{
                          base: "max-w-md",
                          filler: "bg-[#ef4665]",
                          labelWrapper: "mb-2",
                          label: "font-medium text-default-700 text-medium",
                          value: "font-medium text-default-500 text-small",
                          thumb: [
                            "transition-size",
                            "bg-[#ef4665]",
                            "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
                            "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6",
                          ],
                          step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
                        }}
                        tooltipProps={{
                          offset: 10,
                          placement: "top",
                          classNames: {
                            base: [
                              // arrow color
                              "before:bg-gradient-to-r before:from-secondary-400 before:to-primary-500",
                            ],
                            content: [
                              "py-2 shadow-xl",
                              "text-white bg-gradient-to-r from-secondary-400 to-primary-500",
                            ],
                          },
                        }}
                      />
                    </div>
                  ) : filter.filterKey === "width" ? (
                    // For width filter
                    filter.options.map((option) => (
                      <label key={option} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 accent-[#ef4665]"
                          onChange={() =>
                            handleFilterChange(filter.filterKey, option)
                          }
                          checked={selectedFilters[filter.filterKey].includes(
                            option
                          )}
                        />
                        <span className="ml-2 text-gray-700">{`${option}m`}</span>
                      </label>
                    ))
                  ) : filter.filterKey === "height" ? (
                    // For height filter
                    filter.options.map((option) => (
                      <label key={option} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 accent-[#ef4665]"
                          onChange={() =>
                            handleFilterChange(filter.filterKey, option)
                          }
                          checked={selectedFilters[filter.filterKey].includes(
                            option
                          )}
                        />
                        <span className="ml-2 text-gray-700">{`${option}m`}</span>
                      </label>
                    ))
                  ) : filter.filterKey === "length" ? (
                    // For length filter
                    filter.options.map((option) => (
                      <label key={option} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 accent-[#ef4665]"
                          onChange={() =>
                            handleFilterChange(filter.filterKey, option)
                          }
                          checked={selectedFilters[filter.filterKey].includes(
                            option
                          )}
                        />
                        <span className="ml-2 text-gray-700">{`${option}m`}</span>
                      </label>
                    ))
                  ) : null}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Drawer>

      <Dialog size="sm" open={open} handler={handleOpen} className=" p-4">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Need Help Finding Something?
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            {`Tell us what you're looking for, and we'll assist you!`}
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-3">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="full_name">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        // value={data?.name}
                        placeholder="Full Name"
                        id="full_name"
                        className=" outline-none	border-gray-700	border h-10 mt-1 rounded px-4 w-full"
                        required
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="text"
                        name="email"
                        // value={data?.email}
                        id="email"
                        className="border outline-none border-gray-700 h-10 mt-1 rounded px-4 w-full"
                        placeholder="email@domain.com"
                        required
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="contact">Mobile Number</label>
                      <input
                        name="contact"
                        id="contact"
                        placeholder="contact"
                        className=" outline-none	border-gray-700	border h-10 mt-1 rounded px-4 w-full"
                        required
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="contact">
                        select the space you wanted the wardrobe / storage
                      </label>
                      <select
                        name="selectedOption"
                        id="options"
                        className="border hover:accent-[#ef4655] outline-none border-gray-700 h-10 mt-1 rounded px-4 w-full"
                        required
                      >
                        <option value="">Choose an option</option>
                        <option
                          className="caret-[#ef4665] accent-[#ef4665]"
                          value="Bedroom"
                        >
                          Bedroom
                        </option>
                        <option value="Living room">Living room</option>
                        <option value="Children's room">{`Children's room`}</option>
                        <option value="Home office">Home office</option>
                        <option value="Dining room">Dining room</option>
                        <option value="Bathroom">Bathroom</option>
                        <option value="Hallway">Hallway</option>
                        <option value="Outdoor">Outdoor</option>
                      </select>
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="Message">Message</label>
                      <textarea
                        name="Message"
                        id="Message"
                        placeholder="Message"
                        className="h-32 pt-2 outline-none	border-gray-700	border mt-1 rounded px-4 w-full"
                        required
                      />
                    </div>

                    <div className="md:col-span-5 mt-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          type="submit"
                          className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}

export default ProductPage;
