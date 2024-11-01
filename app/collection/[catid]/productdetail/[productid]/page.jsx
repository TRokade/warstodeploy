"use client";
import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Accordion, AccordionItem } from "@nextui-org/react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Rating from "@mui/material/Rating";
import { useMediaQuery } from "@mui/material";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, getRelatedProducts } from "@/store/productSlice";
import { addToCart, removeItem } from "@/store/cartSlice";
import { format, parseISO } from "date-fns";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDisclosure } from "@nextui-org/react";

import {
  Addwishlist,
  getwishlist,
  removeWishlist,
} from "@/store/wishlistSlice";
import { Dialog, DialogBody } from "@material-tailwind/react";
import { Button } from "@nextui-org/react";
import RelatedProductsComp from "./RelatedProductsComp";
import Reviews from "./Reviews";
import { useAuth } from "@/context/AuthContext";
import ProductDetailskeleton from "./ProductDetailskeleton";

const ProductDetail = ({ params }) => {
  const dispatch = useDispatch();
  const {
    openCartDrawer,
    currentUser,
    handleOpen,
    ServiceMessage,
    handlePincodeChange,
    handleSavePincode,
  } = useAuth();

  const wishlistData = useSelector(
    (state) => state.wishlist?.products?.products
  );
  const id = params.productid;
  const isProductInWishlist = wishlistData?.some((item) => item?.id === id);
  const [isWishlisted, setIsWishlisted] = useState(isProductInWishlist);
  const [selectedImage, setSelectedImage] = useState(
    "https://ae04.alicdn.com/kf/S12b2c3a2508f4bbf8306c72b49536073Y.jpg"
  );
  const isMobile = useMediaQuery("(max-width: 600px)");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const Info = Object.fromEntries(formData.entries());
    alert(JSON.stringify(Info));
    formRef.current.reset();
  };

  const [zoomStyle, setZoomStyle] = useState({
    display: "none",
    backgroundPositionX: "0%",
    backgroundPositionY: "0%",
    left: "0px",
    top: "0px",
  });

  const { Product, RelatedProducts } = useSelector((state) => state.productss);
  const CartData = useSelector((state) => state.cartss?.cartitems);
  const ID = CartData?.user;

  const handleAddtoCart = () => {
    dispatch(addToCart({ Cartvalue, ID }));
    openCartDrawer();
  };

  const Cartvalue = { productId: id, quantity: 1 };

  const handleWishlistToggle = () => {
    if (currentUser == null) {
      handleOpen();
    } else {
      if (isWishlisted) {
        // Remove from wishlist
        dispatch(removeWishlist(id));
      } else {
        // Add to wishlist
        dispatch(Addwishlist(id));
      }
      // Optimistically update the state
      setIsWishlisted(!isWishlisted);
    }
  };

  useEffect(() => {
    dispatch(getProduct(id));
    dispatch(getRelatedProducts(id));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getwishlist());
    setIsWishlisted(isProductInWishlist);
  }, [dispatch, isProductInWishlist, id]);

  const handleMouseEnter = (src) => {
    setSelectedImage(src);
  };

  const handleMouseMove = (e) => {
    const imgBox = e.target.getBoundingClientRect();
    const x = e.pageX - imgBox.left - window.scrollX;
    const y = e.pageY - imgBox.top - window.scrollY;

    const imgWidth = imgBox.width;
    const imgHeight = imgBox.height;

    let xperc = (x / imgWidth) * 100;
    let yperc = (y / imgHeight) * 100;

    if (x >= 0.01 * imgWidth) {
      xperc *= 1.15;
    }

    if (y >= 0.01 * imgHeight) {
      yperc *= 1.15;
    }

    setZoomStyle({
      display: "block",
      backgroundPositionX: `${xperc - 5}%`,
      backgroundPositionY: `${yperc - 5}%`,
      left: `${x - 0}px`,
      top: `${y - 0}px`,
    });
  };
  const handleMouseLeave = () => {
    setZoomStyle((prevState) => ({ ...prevState, display: "none" }));
  };

  function calculateDeliveryDate() {
    const today = new Date();
    let deliveryDays;

    // Calculate the delivery date
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 27);

    // Format the date as needed (e.g., "DD/MM/YYYY")
    const formattedDate = format(deliveryDate, "dd MMM yyyy");

    return formattedDate;
  }

  return (
    <>
      {Object.keys(Product).length ? (
        <div className="bg-white my-24 text-gray-900">
          <div className="fixed md:hidden  w-full z-40 bottom-0">
            <div className="flex">
              <div className="text-center  text-white bg-[#ef4665] w-full py-3 ">
                <button onClick={handleAddtoCart}>Add To Cart</button>
              </div>
              <div className="text-center border  text-black bg-white w-full py-3">
                <button onClick={handleWishlistToggle}>
                  Wishlist
                  <FavoriteBorderIcon className=" text-black  rounded-full cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <ul className="flex space-x-2">
                <li>Home</li>
                <li>/</li>
                <li>Seating</li>
                <li>/</li>
                <li>Chairs</li>
                <li>/</li>
                <li className="text-gray-900">{Product.name}</li>
              </ul>
            </nav>
            {/* Product Section */}
            <div className="grid grid-cols-1  md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="flex relative flex-col space-y-4">
                <div className="absolute z-20 right-4 top-8">
                  {isWishlisted ? (
                    <FavoriteIcon
                      onClick={handleWishlistToggle}
                      className="text-[#ef4665] text-4xl  rounded-full cursor-pointer"
                    />
                  ) : (
                    <FavoriteBorderIcon
                      onClick={handleWishlistToggle}
                      className="text-white text-4xl rounded-full cursor-pointer"
                    />
                  )}
                </div>
                <div
                  id="img-zoomer-box"
                  className="relative w-full mt-2"
                  onMouseMove={isMobile ? null : handleMouseMove}
                  onMouseLeave={isMobile ? null : handleMouseLeave}
                >
                  <div
                    id="img-2"
                    className="absolute w-[340px] h-[340px] bg-white bg-no-repeat shadow-md rounded-full border-4 border-gray-200 z-10 transition-opacity duration-300"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      backgroundPositionX: zoomStyle?.backgroundPositionX,
                      backgroundPositionY: zoomStyle?.backgroundPositionY,
                      left: zoomStyle?.left,
                      top: zoomStyle?.top,
                      display: zoomStyle?.display,
                    }}
                  ></div>
                  <img
                    src={selectedImage}
                    alt="Foster Single Seater"
                    className="rounded-lg w-full"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <img
                    src="https://ae04.alicdn.com/kf/S12b2c3a2508f4bbf8306c72b49536073Y.jpg"
                    alt="Product Thumbnail"
                    className="rounded-lg cursor-pointer"
                    onMouseEnter={() =>
                      handleMouseEnter(
                        "https://ae04.alicdn.com/kf/S12b2c3a2508f4bbf8306c72b49536073Y.jpg"
                      )
                    }
                  />
                  <img
                    src="https://5.imimg.com/data5/CM/MO/MY-16180212/modular-bedroom-wardrobe.jpg"
                    alt="Product Thumbnail"
                    className="rounded-lg cursor-pointer"
                    onMouseEnter={() =>
                      handleMouseEnter(
                        "https://5.imimg.com/data5/CM/MO/MY-16180212/modular-bedroom-wardrobe.jpg"
                      )
                    }
                  />
                  <img
                    src="https://www.ikea.com/in/en/images/products/vilhatten-wardrobe-with-2-doors-and-2-drawers-oak-effect__1163151_pe890132_s5.jpg"
                    alt="Product Thumbnail"
                    className="rounded-lg cursor-pointer"
                    onMouseEnter={() =>
                      handleMouseEnter(
                        "https://www.ikea.com/in/en/images/products/vilhatten-wardrobe-with-2-doors-and-2-drawers-oak-effect__1163151_pe890132_s5.jpg"
                      )
                    }
                  />
                  <img
                    src="https://www.at-home.co.in/cdn/shop/products/FLWDETERNALWD3DGRY.jpg?v=1654059468"
                    alt="Product Thumbnail"
                    className="rounded-lg cursor-pointer"
                    onMouseEnter={() =>
                      handleMouseEnter(
                        "https://www.at-home.co.in/cdn/shop/products/FLWDETERNALWD3DGRY.jpg?v=1654059468"
                      )
                    }
                  />
                </div>
              </div>

              {/* Product Details */}
              <div>
                <h1 className="text-2xl  font-bold">{Product.name}</h1>

                <div className="flex mt-3 items-center">
                  <Rating
                    className="me-2"
                    name="read-only"
                    value={Product?.reviews?.averageRating}
                    readOnly
                    precision={0.5}
                  />{" "}
                  reviews
                </div>

                <p className="mt-2 text-gray-500">{Product.description}</p>
                <p className="text-2xl font-semibold my-2 text-gray-900">
                  ₹{Product.price?.amount}
                </p>

                {/* <Popover triggerScaleOnOpen={true} placement="top">
              <PopoverTrigger>
                <button className="mt-4 w-3/4 items-center justify-center hidden md:flex border-3 text-black py-3 rounded-lg">
                  <LocalShippingIcon
                    sx={{ color: "#ef4665" }}
                    className="me-2 "
                  />
                  Check availability
                </button>
              </PopoverTrigger>
              <PopoverContent> */}
                <div className="text-left">
                  <div className="flex items-center ">
                    <div className="pincode-input-section">
                      <p className="mb-1 ">
                        Please enter your pincode to check if we deliver to your
                        area.
                      </p>
                      <div className="flex items-center">
                        <input
                          type="text"
                          id="pincode"
                          value={ServiceMessage.area.pincode}
                          onChange={handlePincodeChange}
                          placeholder="Enter pincode"
                          className="w-full border-2 rounded-md p-2"
                        />
                        {/* <Button
                      className="bg-black ms-2 text-white"
                      onClick={() => handleSavePincode(pincodeInput)}
                    >
                      Save
                    </Button> */}
                      </div>

                      <p className="text-green-500 mt-1">
                        {ServiceMessage.message}
                      </p>
                    </div>
                  </div>
                </div>
                {/* </PopoverContent>
            </Popover> */}

                <Button
                  onClick={handleAddtoCart}
                  size="lg"
                  className="mt-4 w-3/4 hidden md:block bg-black text-white rounded-lg"
                >
                  Add To Cart
                </Button>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <p className="ml-2">
                      Expected Dispatch Date:{" "}
                      <span className="text-green-600">
                        {calculateDeliveryDate()}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">
                      <i className="fas fa-home"></i>
                    </div>
                    <p className="ml-2">
                      Free Design Consultation
                      <a
                        onClick={onOpen}
                        className="text-blue-600 cursor-pointer"
                      >
                        Click to Know More
                      </a>
                    </p>
                  </div>
                </div>

                <Accordion
                  className="mt-5"
                  disableIndicatorAnimation={true}
                  defaultExpandedKeys={["Description"]}
                >
                  <AccordionItem
                    key="Description"
                    aria-label="Description"
                    indicator={({ isOpen }) =>
                      isOpen ? <RemoveIcon /> : <AddIcon />
                    }
                    title="Description"
                  >
                    This single-seater chair offers a luxurious and comfortable
                    seating experience with its plush cushioning and sturdy
                    build. Designed with a sleek and modern aesthetic, it fits
                    perfectly into any living room, office, or lounge area.
                  </AccordionItem>
                  <AccordionItem
                    key="Dimensions"
                    aria-label="Dimensions"
                    indicator={({ isOpen }) =>
                      isOpen ? <RemoveIcon /> : <AddIcon />
                    }
                    title="Dimensions"
                  >
                    • Premium quality fabric
                    <br />
                    • Ergonomically designed for comfort
                    <br />
                    • Durable and long-lasting construction
                    <br />• Sleek and modern aesthetic
                  </AccordionItem>
                  <AccordionItem
                    key="Key Features"
                    aria-label="Key Features"
                    indicator={({ isOpen }) =>
                      isOpen ? <RemoveIcon /> : <AddIcon />
                    }
                    title="Key Features"
                  >
                    • Premium quality fabric
                    <br />
                    • Ergonomically designed for comfort
                    <br />
                    • Durable and long-lasting construction
                    <br />• Sleek and modern aesthetic
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="mt-12">
              <h2 className="text-xl font-semibold">Related Products</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3  lg:grid-cols-5 gap-8">
                <RelatedProductsComp data={RelatedProducts} />
              </div>
            </div>
            <Reviews ID={id} />
            <Dialog
              size="sm"
              open={isOpen}
              handler={onOpenChange}
              className=" p-4"
            >
              <DialogBody>
                <div className="">
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
                            <label htmlFor="Message">Message</label>
                            <textarea
                              name="Message"
                              id="Message"
                              placeholder="Message"
                              className="h-32 pt-2 outline-none	border-gray-700	border mt-1 rounded px-4 w-full"
                              required
                            />
                          </div>

                          <div className="md:col-span-5 mt-5 w-full text-center">
                            <div className="inline-flex items-end">
                              <button
                                type="submit"
                                className="inline-block w-full rounded-lg bg-[#ef4665] px-5 py-3 font-medium text-white sm:w-auto"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <button
                    onClick={onOpenChange}
                    className="absolute  top-2 right-2"
                  >
                    <CancelIcon
                      className="rounded-full"
                      sx={{
                        color: "#ef4666",
                        backgroundColor: "white",
                        fontSize: 20,
                      }}
                    />
                  </button>
                </div>
              </DialogBody>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="px-20 py-20">
          <ProductDetailskeleton />
        </div>
      )}
    </>
  );
};

export default ProductDetail;
