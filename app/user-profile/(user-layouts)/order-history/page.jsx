"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "@/store/orderSlice";
import dateFormat from "dateformat";
import { Button } from "@nextui-org/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { Progress } from "@nextui-org/react";
import OrderProductImg from "./OrderProductImg";
import wardrobe from "@/src/images/order-wardrobe.png"
import Image from "next/image";

const OrderHistory = () => {
  const location = usePathname();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orderr.orders);
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  console.log(orders);

  return (
    <section
      className={`bg-white shadow-lg py-8 ${
        location == "/your-orders" ? "my-24 shadow-none px-5" : "0"
      } antialiased dark:bg-gray-900 `}
    >
      <div className=" max-w-screen-xl px-5 2xl:px-0">
        <div className="px-0 md:px-5 lg:px-10">
          {orders.length !== 0 ? (
            <div className="h-[400px] flex items-center justify-center">
               
               <Image className="w-28" src={wardrobe} />
               <h2 className="text-xl">no orders found</h2>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                Orders
              </h2>
              <p>
                Check the status of recent orders, manage returns, and download
                invoices.
              </p>
              {orders.map((item) => {
                return (
                  <div key={item?._id}>
                    <div className="bg-gray-100 mt-5 flex flex-col lg:flex-row  text-sm px-5 py-5 rounded-md justify-between">
                      <div className="flex justify-between lg:flex-col py-1 border-b-2 lg:border-none">
                        <p className="font-bold">Date placed</p>
                        <dd>{dateFormat(item?.createdAt, "dd mmm yyyy")}</dd>
                      </div>
                      <div className="flex justify-between lg:flex-col py-1 border-b-2 lg:border-none">
                        <p className="font-bold">Order number</p>
                        <p>#{item?._id.slice(-5)}</p>
                      </div>
                      <div className="flex justify-between lg:flex-col py-1">
                        <p className="font-bold">Total amount</p>
                        <p>₹{item?.total}</p>
                      </div>

                      <div>
                        <Button
                          className="bg-white ms-2 w-full md:w-auto my-2 rounded-md text-black"
                          variant="bordered"
                        >
                          View Invoice
                        </Button>
                      </div>
                    </div>

                    {item.items.map((product) => {
                      return (
                        <div key={product._id} className="border-b-4 my-5">
                          <div className="flex items-start justify-between">
                            <OrderProductImg productID={product.product} />
                            {/* <img
                            product
                            src="http://cdn.globalso.com/homefeelfurniture/HF-TW103-3.jpg"
                            className="w-32 rounded-lg"
                            alt=""
                          /> */}
                            <div className="px-3">
                              <div className="flex flex-col lg:flex-row justify-between">
                                <h3 className="font-bold">
                                  {product?.productName}
                                </h3>
                                <h3 className="font-bold">₹{product?.price}</h3>
                              </div>
                              <h3 className="hidden lg:block w-3/4">
                                Are you a minimalist looking for a compact carry
                                option? The Micro Backpack is the perfect size
                                for your essential everyday carry items. Wear it
                                like a backpack or carry it like a satchel for
                                all-day use.
                              </h3>
                              <div className="flex flex-col lg:flex-row justify-between">
                                <h4 className="font-bold my-2">
                                  Quantity {product?.quantity}
                                </h4>
                                <h4>
                                  {/* Payment Status
                                  <span className="font-bold text-green-500">
                                    {item?.paymentStatus}
                                  </span> */}
                                  <Progress
                                    aria-label="Downloading..."
                                    size="sm"
                                    className="w-48 font-bold text-green-500"
                                    value={100}
                                    label={`Payment Status`}
                                    showValueLabel={true}
                                    color="success"
                                  />
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center my-1 justify-between">
                            <p className="flex items-center">
                              {item.status == "Delivered" ? (
                                <>
                                  <CheckCircleIcon
                                    color="success"
                                    className="me-2"
                                  />
                                  {item?.status}
                                </>
                              ) : (
                                ""
                              )}
                              {item.status == "Processing" ? (
                                <>
                                  <LocalShippingIcon
                                    sx={{ color: "[#ef4665]" }}
                                    className="me-2"
                                  />
                                  {item?.status}
                                </>
                              ) : (
                                ""
                              )}
                              {item.status == "Pending" ? (
                                <>
                                  <PendingActionsIcon
                                    color="success"
                                    className="me-2"
                                  />
                                  {item?.status}
                                </>
                              ) : (
                                ""
                              )}
                            </p>

                            <div>
                              <Button
                                className="bg-white me-2 md:w-auto my-2 rounded-md text-black"
                                variant="bordered"
                              >
                                Pay Now
                              </Button>
                              <Button
                                className="bg-white ms-2 md:w-auto my-2 rounded-md text-black"
                                variant="bordered"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderHistory;
