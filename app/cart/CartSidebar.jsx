import Link from "next/link";
import React from "react";
import CartItems from "./CartItems";
import emptyCart from "../../src/images/shopping.png";
import { Button } from "@material-tailwind/react";
import Image from "next/image";

const CartSidebar = ({ data }) => {
  // console.log(data)
  return (
    <>
      <div className="drawer-scrollable overflow-y-auto max-h-[650px] ">
        {" "}
        {/* Adjusted height to avoid overlap */}
        {data?.length == 0 || data == undefined ? (
          <div className="flex justify-center h-3/4 flex-col items-center">
            <Image src={emptyCart} className="w-32 mb-2" alt="" />
            <h3 className="mb-4 text-xl font-medium">Your cart is empty</h3>
            <Link href="/collection/products">
              <button
                className="select-none  rounded-lg border border-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          data?.map((item) => (
            <div className="px-4" key={item._id}>
              <CartItems cartNum={2} items={item} />
            </div>
          ))
        )}
      </div>
      {data?.length == 0 ? (
        ""
      ) : (
        <div className="text-center ms-4 mb-2 text-white bg-[#ef4665] rounded-sm w-11/12 py-3 absolute bottom-0">
          <Link href={"/cart"}>
            <div>
              <button>View Cart</button>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default CartSidebar;
