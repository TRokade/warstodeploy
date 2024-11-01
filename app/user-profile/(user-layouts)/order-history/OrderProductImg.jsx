import { getProduct } from "@/store/productSlice";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const OrderProductImg = ({ productID }) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.productss.Product);

  useEffect(() => {
    dispatch(getProduct(productID));
  }, [dispatch]);

  console.log(product, "orderImge");
  return (
    <Link href={`/collection/products/productdetail/${productID}`}>
      <div>
        <img
          product
          //   src={`${process.env.BASE_URL}${product?.images[0]}`}
          src="http://cdn.globalso.com/homefeelfurniture/HF-TW103-3.jpg"
          className="w-32 rounded-lg"
          alt=""
        />
     </div>
  </Link>
  );
};

export default OrderProductImg;
