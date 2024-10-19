"use client";
import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMediaQuery } from "@mui/material";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, getRelatedProducts } from "@/store/productSlice";
import { addToCart, removeItem } from "@/store/cartSlice";
import {
  Addwishlist,
  getwishlist,
  removeWishlist,
} from "@/store/wishlistSlice";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import RelatedProductsComp from "./RelatedProductsComp";
import Reviews from "./Reviews";
import { useAuth } from "@/context/AuthContext";

const ProductDetail = ({ params }) => {
  const dispatch = useDispatch();

  const { openCartDrawer, currentUser, handleOpen } = useAuth();

  const isTablet = useMediaQuery("(max-width: 600px)");

  const ProductData = useSelector((state) => state.productss);
  const CartData = useSelector((state) => state.cartss?.cartitems);
  const ID = CartData?.user;
  const detailpage = ProductData?.Product;
  console.log(detailpage);
  const averageRatings = detailpage?.reviews?.averageRating;

  const totalReviews = detailpage?.reviews?.totalReviews || 0;

  // Function to display stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // full stars
    const halfStar = rating % 1 !== 0; // check if there's a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // remaining empty stars

    const stars = [];

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-300 ms-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      );
    }

    // Render half star
    if (halfStar) {
      stars.push(
        <svg
          key="half"
          className="w-4 h-4 text-yellow-300 ms-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0-1.575-1.044H14.93l-3.195-6.5-3.195 6.5H2.462a1.523 1.523 0 0 0-.387 1.575l3.656 3.563-.863 5.031a1.534 1.534 0 0 0 2.226 1.616L11 17.033v-1.615Z" />
        </svg>
      );
    }

    // Render empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300 ms-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0-1.575-1.044H14.93l-3.195-6.5-3.195 6.5H2.462a1.523 1.523 0 0 0-.387 1.575l3.656 3.563-.863 5.031a1.534 1.534 0 0 0 2.226 1.616L11 17.033v-1.615Z" />
        </svg>
      );
    }

    return stars;
  };

  const RelatedProducts = ProductData?.RelatedProducts;
  console.log(RelatedProducts);
  const id = params.productid;

  const Cartvalue = { productId: id, quantity: 1 };
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setDescriptionOpen] = useState(true);
  const [isKeyFeaturesOpen, setKeyFeaturesOpen] = useState(false);
  const [isDimensionOpen, setDimensionOpen] = useState(false);

  useEffect(() => {
    dispatch(getProduct(id));
    dispatch(getRelatedProducts(id));
  }, [dispatch]);

  const wishlistData = useSelector(
    (state) => state.wishlist?.products?.products
  );

  // Determine if the current product is in the wishlist
  const isProductInWishlist = wishlistData?.some((item) => item?.id === id);

  const [isWishlisted, setIsWishlisted] = useState(isProductInWishlist);

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
    dispatch(getwishlist());
    setIsWishlisted(isProductInWishlist);
  }, [dispatch, id]);

  const handleAddtocart = () => {
    dispatch(addToCart({ Cartvalue, ID }));
    openCartDrawer();
  };

  const pincodeRef = useRef(null);
  const [isServiceAvailable, setIsServiceAvailable] = useState(null);
  const [ServiceMessage, setServiceMessage] = useState({
    area: {},
    message: "",
  });
  const validPincode = [
    { pincode: 400001, area: "Fort" },
    { pincode: 400002, area: "Kalbadevi" },
    { pincode: 400003, area: "Mandvi" },
    { pincode: 400004, area: "Girgaon, Opera House" },
    { pincode: 400005, area: "Colaba" },
    { pincode: 400006, area: "Malabar Hill" },
    { pincode: 400007, area: "Grant Road" },
    { pincode: 400008, area: "Mumbai Central" },
    { pincode: 400009, area: "Chinchbunder" },
    { pincode: 400010, area: "Mazgaon" },
    { pincode: 400011, area: "Jacob Circle" },
    { pincode: 400012, area: "Parel" },
    { pincode: 400013, area: "Dadar (East)" },
    { pincode: 400014, area: "Matunga (East)" },
    { pincode: 400015, area: "Sion" },
    { pincode: 400016, area: "Mahim" },
    { pincode: 400017, area: "Dharavi" },
    { pincode: 400018, area: "Worli" },
    { pincode: 400019, area: "Wadala" },
    { pincode: 400020, area: "Churchgate" },
    { pincode: 400021, area: "Nariman Point" },
    { pincode: 400022, area: "Sion East" },
    { pincode: 400024, area: "Kurla" },
    { pincode: 400025, area: "Sewri" },
    { pincode: 400026, area: "Cuffe Parade" },
    { pincode: 400028, area: "Dadar (West)" },
    { pincode: 400029, area: "Santa Cruz" },
    { pincode: 400030, area: "King Circle" },
    { pincode: 400034, area: "Tardeo" },
    { pincode: 400036, area: "Cumballa Hill" },
    { pincode: 400049, area: "Juhu" },
    { pincode: 400050, area: "Bandra" },
    { pincode: 400051, area: "Bandra East" },
    { pincode: 400052, area: "Khar" },
    { pincode: 400053, area: "Andheri West" },
    { pincode: 400054, area: "Vile Parle West" },
    { pincode: 400056, area: "Vile Parle East" },
    { pincode: 400057, area: "Santacruz East" },
    { pincode: 400058, area: "Santacruz West" },
    { pincode: 400059, area: "Marol" },
    { pincode: 400060, area: "Jogeshwari East" },
    { pincode: 400061, area: "Malad West" },
    { pincode: 400064, area: "Malad East" },
    { pincode: 400065, area: "Goregaon East" },
    { pincode: 400066, area: "Borivali East" },
    { pincode: 400067, area: "Kandivali West" },
    { pincode: 400068, area: "Kandivali East" },
    { pincode: 400069, area: "Andheri East" },
    { pincode: 400070, area: "Chembur" },
    { pincode: 400071, area: "Deonar" },
    { pincode: 400072, area: "Powai" },
    { pincode: 400076, area: "IIT Bombay" },
    { pincode: 400078, area: "Bhandup" },
    { pincode: 401201, area: "Vasai East" },
    { pincode: 401202, area: "Vasai West" },
    { pincode: 401203, area: "Nalasopara East" },
    { pincode: 401209, area: "Nalasopara West" },
    { pincode: 401303, area: "Virar East" },
    { pincode: 401305, area: "Virar West" },
  ];

  let openPop = false;
  let openPopMobile = false;
  if (isTablet) {
    openPop = isServiceAvailable;
  } else {
    openPopMobile = isServiceAvailable;
  }

  const handleCheckAvailability = () => {
    const enteredPincode = pincodeRef.current.value;

    const pincodeMatch = validPincode.find(
      (area) => area.pincode === parseInt(enteredPincode, 10)
    );
    console.log(pincodeMatch);
    if (pincodeMatch) {
      setServiceMessage({
        area: pincodeMatch,
        message: `Great! We deliver to your area ${pincodeMatch.area}. we are adding this item to your cart.`,
      });
      setTimeout(() => {
        handleAddtocart();
        setServiceMessage({
          area: pincodeMatch,
          message: ``,
        });
      }, 1000);
    } else {
      setServiceMessage({
        area: {},
        message: `Invalid pincode. Please try again.`,
      });
    }
  };

  const [selectedImage, setSelectedImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqCYk6owYMyzFR0Q5qBLVr4_6TslbbajRfOw&s"
  );

  const handleMouseEnter = (src) => {
    setSelectedImage(src);
  };

  const reviewsSectionRef = useRef(null);
  const scrollToReviews = () => {
    if (reviewsSectionRef.current) {
      reviewsSectionRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white my-24 text-gray-900">
      <div className="fixed md:hidden  w-full z-40 bottom-0">
        <div className="flex">
          <div className="text-center  text-white bg-[#ef4665] w-full py-3 ">
            <Popover placement="bottom" open={openPop} dismiss={true}>
              <PopoverHandler>
                <button>Add To Cart</button>
              </PopoverHandler>
              <PopoverContent>
                <h6 className="mb-2 font-bold">Check Service Availability</h6>
                <p className="mb-1 ">
                  Please enter your pincode to check if we deliver to your area.
                </p>
                <div className="flex flex-col  gap-2">
                  <input
                    size="lg"
                    ref={pincodeRef}
                    placeholder="Enter your pincode"
                    className=" !border-t-blue-gray-200 h-10 border px-2 focus:!border-t-gray-900"
                  />
                  <Button
                    variant="gradient"
                    onClick={handleCheckAvailability}
                    className="flex-shrink-0"
                  >
                    Check Availability
                  </Button>
                </div>
                {ServiceMessage.message.length !== 0 ? (
                  <div className="text-center">
                    <p className="mt-2">{ServiceMessage.message}</p>
                  </div>
                ) : (
                  <p className="mt-2">{ServiceMessage.message}</p>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <div className="text-center border  text-black bg-white w-full py-3">
            <button onClick={handleWishlistToggle}>
              Wishlist{" "}
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
            <li className="text-gray-900">{detailpage.name}</li>
          </ul>
        </nav>
        {/* Product Section */}
        <div className="mt-6 grid grid-cols-1  md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="flex relative flex-col space-y-4">
            <div className="absolute right-4 top-8">
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
            <img
              src={selectedImage}
              alt="Foster Single Seater"
              className="rounded-lg"
            />
            <div className="grid grid-cols-4 gap-2">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqCYk6owYMyzFR0Q5qBLVr4_6TslbbajRfOw&s"
                alt="Product Thumbnail"
                className="rounded-lg cursor-pointer"
                onMouseEnter={() =>
                  handleMouseEnter(
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqCYk6owYMyzFR0Q5qBLVr4_6TslbbajRfOw&s"
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
            <h1 className="text-2xl  font-bold">{detailpage.name}</h1>

            <div className="flex items-center">
              {renderStars(averageRatings)}
              <a
                href="#"
                className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white m-3"
                onClick={scrollToReviews}
              >
                {totalReviews} reviews
              </a>
            </div>

            <p className="mt-2 text-gray-500">{detailpage.description}</p>
            <p className="text-2xl font-semibold my-2 text-gray-900">
              ₹{detailpage.price?.amount}
            </p>

            {/* Quantity Selector */}
            {/* <div className="flex items-center mt-6 space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={decrementQuantity}
                  className="px-4 py-2 text-lg font-bold border-r"
                >
                  −
                </button>
                <span className="px-4 py-2 text-lg font-medium">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-4 py-2 text-lg font-bold border-l"
                >
                  +
                </button>
              </div>
              <IoMdHeartEmpty className="text-xl me-2" />
            </div> */}

            <Popover placement="bottom" open={openPopMobile} dismiss={true}>
              <PopoverHandler>
                <button className="mt-4 w-3/4 hidden md:block bg-black text-white py-3 rounded-lg">
                  Add To Cart
                </button>
              </PopoverHandler>
              <PopoverContent>
                <h6 className="mb-2 font-bold">Check Service Availability</h6>
                <p className="mb-1 ">
                  Please enter your pincode to check if we deliver to your area.
                </p>
                <div className="flex gap-2">
                  <input
                    size="lg"
                    ref={pincodeRef}
                    placeholder="Enter your pincode"
                    className=" !border-t-blue-gray-200 border px-2 focus:!border-t-gray-900"
                  />
                  <Button
                    variant="gradient"
                    onClick={handleCheckAvailability}
                    className="flex-shrink-0"
                  >
                    Check Availability
                  </Button>
                </div>
                {ServiceMessage.message.length !== 0 ? (
                  <div className="text-center">
                    <p className="mt-2">{ServiceMessage.message}</p>
                  </div>
                ) : (
                  <p className="mt-2">{ServiceMessage.message}</p>
                )}
              </PopoverContent>
            </Popover>

            {/* Additional Information */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <p className="ml-2">
                  Expected Dispatch Date:{" "}
                  <span className="text-green-600">Oct 11, 2024</span>
                </p>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">
                  <i className="fas fa-home"></i>
                </div>
                <p className="ml-2">
                  Free Design Consultation{" "}
                  <a href="#" className="text-blue-600">
                    Click to Know More
                  </a>
                </p>
              </div>

              {/* <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">
                  <i className="fas fa-truck"></i>
                </div>
                <p className="ml-2">
                  Pan India Free Shipping{" "}
                  <a href="#" className="text-blue-600">
                    Click to Know More
                  </a>
                </p>
              </div> */}
            </div>

            {/* Social Share Icons */}
            {/* <div className="flex items-center mt-4 space-x-4">
              <span>Share:</span>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div> */}
            <div>
              <div className="mt-6">
                <div
                  className="cursor-pointer flex justify-between items-center border-b py-2"
                  onClick={() => setDescriptionOpen(!isDescriptionOpen)}
                >
                  <h2 className="text-xl font-semibold">Description</h2>
                  <span>{isDescriptionOpen ? "−" : "+"}</span>
                </div>
                {isDescriptionOpen && (
                  <p className="mt-4 text-gray-500">
                    This single-seater chair offers a luxurious and comfortable
                    seating experience with its plush cushioning and sturdy
                    build. Designed with a sleek and modern aesthetic, it fits
                    perfectly into any living room, office, or lounge area.
                  </p>
                )}
              </div>
              <div className="mt-6">
                <div
                  className="cursor-pointer flex justify-between items-center border-b py-2"
                  onClick={() => setDimensionOpen(!isDimensionOpen)}
                >
                  <h2 className="text-xl font-semibold">Dimensions</h2>
                  <span>{isDimensionOpen ? "−" : "+"}</span>
                </div>
                {isDimensionOpen && (
                  <p className="mt-4 text-gray-500">
                    • Premium quality fabric
                    <br />
                    • Ergonomically designed for comfort
                    <br />
                    • Durable and long-lasting construction
                    <br />• Sleek and modern aesthetic
                  </p>
                )}
              </div>
              <div className="mt-6">
                <div
                  className="cursor-pointer flex justify-between items-center border-b py-2"
                  onClick={() => setKeyFeaturesOpen(!isKeyFeaturesOpen)}
                >
                  <h2 className="text-xl font-semibold">Key Features</h2>
                  <span>{isKeyFeaturesOpen ? "−" : "+"}</span>
                </div>
                {isKeyFeaturesOpen && (
                  <p className="mt-4 text-gray-500">
                    • Premium quality fabric
                    <br />
                    • Ergonomically designed for comfort
                    <br />
                    • Durable and long-lasting construction
                    <br />• Sleek and modern aesthetic
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-semibold">Related Products</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3  lg:grid-cols-5 gap-8">
            <RelatedProductsComp data={RelatedProducts} />
          </div>
        </div>
        <Reviews ID={id} reviewsSectionRef={reviewsSectionRef} />
      </div>
    </div>
  );
};

export default ProductDetail;
