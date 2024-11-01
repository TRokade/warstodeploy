"use client";
import React, { useEffect } from "react";
import EmptyCart from "./EmptyCart";
import CartProducts from "./CartProducts";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "@/store/cartSlice";
import { loadUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PlaceIcon from "@mui/icons-material/Place";
import AddIcon from "@mui/icons-material/Add";

const Cart = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cartss.cartitems);

  const {
    currentUser,
    handleOpen,
    pincodeInput,
    isPincodeValid,
    ServiceMessage,
    handlePincodeChange,
    handleSavePincode,
  } = useAuth();

  const totalPrice = data?.items?.reduce((accumulator, item) => {
    return accumulator + item.price * item.quantity;
  }, 0);

  console.log(currentUser);

  const handleCheckout = () => {
    if (currentUser == null) {
      handleOpen();
    } else {
      route.push("/checkout");
    }
  };

  const ID = data?.user;

  useEffect(() => {
    dispatch(getCart(ID));
  }, [dispatch]);

  console.log(data?.items?.length);
  return (
    <>
      {/* <div className='h-screen flex justify-center items-center'>
         <EmptyCart/>
     </div> */}

      {data?.items?.length == 0 || data?.items?.length == undefined ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 px-5 lg:px-20 my-24 lg:my-40">
          <div className="col-span-2 px-0 lg:px-10">
            <h3 className="text-xl my-5">
              Your Cart ({data?.items?.length} item)
            </h3>
            <div className="my-2">
              <div className="flex items-center ">
                <div className="pincode-input-section">
                  <p className="mb-1 text-sm md:text-base">
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
                    <Button
                      className="bg-black ms-2 text-white"
                      onClick={() => handleSavePincode(pincodeInput)}
                    >
                      Save
                    </Button>
                  </div>

                  {isPincodeValid ? (
                    <p className="text-green-500 text-sm md:text-base mt-1">
                      {ServiceMessage.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/*               
              <Popover triggerScaleOnOpen={true} placement="top">
                <PopoverTrigger>
                  <button className="mt-4  px-5 my-3  hidden md:block border-3 text-black py-3 rounded-lg">
                    {ServiceMessage.area.pincode ? (
                      <>
                        <div className="flex items-center">
                          <LocalShippingIcon className="me-2 " />
                          Delivery to {ServiceMessage.area.pincode}
                        </div> 
                        
                        <p className="me-5">All products are available</p>
                      </>
                    ) : (
                      <>
                        <PlaceIcon className="me-2 " />
                        Check delivery and other services availability
                      </>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="text-left">
                    <div className="flex items-center ">
                      {isPincodeValid ? (
                        <div className="text-green-500 items-center flex">
                          {ServiceMessage.message}
                          <Button
                            className="bg-white items-center flex"
                            onClick={() => handleSavePincode(pincodeInput)}
                          >
                            <AddIcon /> change pincode
                          </Button>
                        </div>
                      ) : (
                        <div className="pincode-input-section">
                          <h6 className="mb-2 font-bold">
                            Check Service Availability
                          </h6>
                          <p className="mb-1 ">
                            Please enter your pincode to check if we deliver to
                            your area.
                          </p>
                          <div className="flex items-center">
                            <input
                              type="text"
                              id="pincode"
                              value={pincodeInput}
                              onChange={handlePincodeChange}
                              placeholder="Enter pincode"
                              className="w-full border-2 rounded-md p-2"
                            />
                            <Button
                              className="bg-black ms-2 text-white"
                              onClick={() => handleSavePincode(pincodeInput)}
                            >
                              Save
                            </Button>
                          </div>

                          <p className="text-green-500 mt-1">
                            {ServiceMessage.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover> */}
            </div>
            <CartProducts ID={ID} data={data} />
          </div>
          <div className="border col-span-2 lg:col-span-1  w-full leading-loose mt-16 border-gray-400 p-5">
            <h4 className="text-xl">Cart Summary</h4>
            <div className="text-sm flex justify-between my-2">
              <p className="text-gray-600	">SubTotal :</p>

              <p>{totalPrice}</p>
            </div>
            <div className="text-sm flex justify-between my-2">
              <p className="text-gray-600	">Packing Charges :</p>

              <p className="">
                ₹0<span className="ms-2 line-through	text-gray-600">₹8,646</span>
                FREE
              </p>
            </div>
            <div className="text-sm flex justify-between my-2">
              <p className="text-gray-600	">Shipping & Handling :</p>

              <p className="">
                ₹0
                <span className="ms-2 line-through	text-gray-600">
                  ₹17,292
                </span>{" "}
                FREE
              </p>
            </div>
            <div className="text-sm flex justify-between my-2">
              <p className="text-gray-600	">Negotiated Discount :</p>

              <p>₹0</p>
            </div>
            <div className="text-sm flex justify-between my-2">
              <p className="text-gray-600	">Tax :</p>

              <p>₹31,126.27</p>
            </div>
            <hr className="my-1" />
            <div className="flex justify-between">
              <h4 className="text-medium">Total Amount </h4>
              <p className="font-bold">{totalPrice}</p>
            </div>

            <div className="text2-sm flex justify-between	text-green-600	">
              <h4>Total savings</h4>
              <h4>₹113,388</h4>
            </div>

            <button
              onClick={handleCheckout}
              className="select-none mt-5 rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
