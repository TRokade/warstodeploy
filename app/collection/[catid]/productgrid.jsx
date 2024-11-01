import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import shutterClose from "@/src/images/111.jpg"
import shutterOpen from "@/src/images/222.jpg"


import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import {
  Button,
} from "@nextui-org/react";

import { Card as EmptyCard, Skeleton } from "@nextui-org/react";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import {
  Addwishlist,
  getwishlist,
  removeWishlist,
} from "@/store/wishlistSlice";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

function ProductCard({ product, loading, params }) {
  const dispatch = useDispatch();
  const { openCartDrawer } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const CartData = useSelector((state) => state.cartss?.cartitems);
  const ID = CartData?.user;

  const { currentUser, handleOpen } = useAuth();

  const Cartvalue = { productId: product._id, quantity: 1 };

  // Fetch the wishlist data from the store
  const wishlistData = useSelector(
    (state) => state.wishlist?.products?.products
  );

  // Determine if the current product is in the wishlist
  const isProductInWishlist = wishlistData?.some(
    (item) => item?.id === product._id
  );

  const [isWishlisted, setIsWishlisted] = useState(isProductInWishlist);
  const [isOpen, setIsOpen] = React.useState(false);
  const baseUrl = "http://localhost:5000";
  const imageDUmmydata = [
    {
      url: "https://zeelproject.com/uploads/posts/2020-11-16/1605529897_render-1.jpg",
      altText: "",
      isPrimary: true,
      _id: "6710e9c819716ba95032f589",
    },
    {
      url: "https://assets.thefurnish.ru/system/uploads/product_image/image/234047/7c667fdb1b8e2dccf3c30276981fc191.jpeg",
      altText: "",
      isPrimary: false,
      _id: "6710e9c819716ba95032f58a",
    },
  ];

  useEffect(() => {
    dispatch(getwishlist());
    setIsWishlisted(isProductInWishlist);
  }, [product._id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ Cartvalue, ID }));
    openCartDrawer();
  };

  const handleWishlistToggle = () => {
    if (currentUser == null) {
      handleOpen();
    } else {
      if (isWishlisted) {
        // Remove from wishlist
        dispatch(removeWishlist(product?._id));
      } else {
        // Add to wishlist
        dispatch(Addwishlist(product?._id));
      }
      // Optimistically update the state
      setIsWishlisted(!isWishlisted);
    }
  };


  const toggleTitle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {loading ? (
        <EmptyCard className="h-80 space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </EmptyCard>
      ) : (
        <Card className="w-full shadow-lg relative">
        <Link href={`/collection/${params}/productdetail/${product._id}`}>
          <CardHeader floated={false} color="blue-gray">
            <div className="relative w-full h-full overflow-hidden group">
              {product.images.length >= 1 && (
                <>
                  {/* First image shown by default */}
                  <Image
                    // src={`${baseUrl}${product.images[0].url}`}
                    src={shutterClose}

                    alt={product.name}
                    className=" transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                  />
                  {/* Second image shown on hover */}
                  <Image
                    // src={`${baseUrl}${product.images[1].url}`}
                    src={shutterOpen}

                    alt={product.name}
                    className="absolute top-0 left-0  transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                  />
                </>
              )}
            </div>
          </CardHeader>
        </Link>
      
        {/* Wishlist Icon */}
        {isWishlisted ? (
          <FavoriteIcon
            onClick={handleWishlistToggle}
            className="text-[#ef4665] absolute top-7 right-7 rounded-full cursor-pointer"
          />
        ) : (
          <FavoriteBorderIcon
            onClick={handleWishlistToggle}
            className="!absolute text-white top-7 right-7 rounded-full cursor-pointer"
          />
        )}
      
        <CardBody>
          {/* Product Details */}
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h5" color="blue-gray" className="text-lg font-medium">
              {isExpanded ? product.name : product.name.slice(0, 17)}
              {product.name.length > 17 && (
                <span onClick={toggleTitle} className="text-sm ms-2 mt-2">
                  {isExpanded ? "less" : "...read"}
                </span>
              )}
            </Typography>
            <Typography color="blue-gray" className="flex items-center gap-1.5 font-normal">
              
              
              {product?.reviews?.averageRating == 0 ? (<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-0.5 h-5 w-5 text-gray-300"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>):(<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-0.5 h-5 w-5 text-yellow-700"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>) }
              {product?.reviews?.averageRating}
            </Typography>
          </div>
          <Typography color="gray">
            {product.type} - {product.attributes?.configuration}
          </Typography>
          <div className="flex md:flex-col justify-between md:items-start items-center">
            <Typography variant="h5" color="blue-gray" className="mt-2 font-medium">
              ₹{product.price?.amount.toLocaleString()}
            </Typography>
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="bg-[#ef4666] rounded-md text-white mt-2 md:w-full"
            >
              Add To Cart
            </Button>
          </div>
        </CardBody>
      </Card>
      )}
    </>
  );
}

export default ProductCard;
