"use client";
import { addToCart } from "@/store/cartSlice";
import { removeWishlist } from "@/store/wishlistSlice";
import { useRouter } from "next/navigation";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch } from "react-redux";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";

const WishlistItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { openCartDrawer } = useAuth();
  const id = item?.id;
  const product = { productId: id, quantity: 1 };

  const isTablet = useMediaQuery("(min-width: 600px) and (max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 600px)");

  let checkMobile = true;
  if (isTablet) {
    checkMobile = true;
  } else if (isMobile) {
    checkMobile = false;
  }

  const handleRemove = () => {
    dispatch(removeWishlist(id));
  };

  const handleAddtocart = () => {
    dispatch(addToCart(product));
    dispatch(removeWishlist(id));
    openCartDrawer();
    // navigate.push('/cart')
  };
  return (
    <>
      {checkMobile ? (
        <tr className="">
          <td className="p-2 whitespace-nowrap">
            <div className="flex items-center">
              <div className="w-16 h-16 flex-shrink-0 mr-2 sm:mr-3">
                <Link href={`/collection/products/productdetail/${id}`}>
                  <img
                    src="https://image.made-in-china.com/2f0j00hgUfkJtqgBol/Supersize-Bedroom-Furniture-Classic-Oak-Plank-Wooden-Wardrobe-for-Sale.jpg"
                    className="w-28"
                    alt="Alex Shatov"
                  />
                </Link>
              </div>
              <div className="font-medium text-gray-800">{item?.name}</div>
            </div>
          </td>

          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item?.description}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-black">
              ₹{item?.price.amount}
            </div>
          </td>

          <td className="p-2 whitespace-nowrap">
            <div className="text-sm flex items-center justify-center text-center">
              <button
                type="submit"
                onClick={handleAddtocart}
                className="inline-block w-full rounded-lg bg-black px-3 py-2 font-medium text-white sm:w-auto"
              >
                Add to Cart
              </button>
              <div onClick={handleRemove} className="flex ms-3 text-2xl ">
                <DeleteIcon sx={{ color: "#ef4666" }} />
              </div>
            </div>
          </td>
        </tr>
      ) : (
        <div>
          <div className="relative p-1 border  border-gray-300	 lg:hidden">
            <img
              src="https://www.dtalemodern.com/media/cachei/0x0/catalog/product/w/a/wardrobe_shutter-new_1_1681370921.jpg"
              alt=""
            />
            <div className="text-black my-2 text-center">
              <h3 className=" text-sm">{item?.name}</h3>
              <h3 className=" font-semibold ">₹{item?.price.amount}</h3>
            </div>
            <div className="text-center bg-[#ef4665] py-2">
              <button
                className=" text-white font-semibold"
                onClick={handleAddtocart}
              >
                Add to cart
              </button>
            </div>
            <button onClick={handleRemove} className="absolute  top-2 right-2">
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
        </div>
      )}
    </>
  );
};

export default WishlistItem;
