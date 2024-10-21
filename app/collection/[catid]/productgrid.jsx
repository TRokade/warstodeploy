import React, { useEffect, useState } from "react";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite"

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

import { Card as EmptyCard, Skeleton } from "@nextui-org/react";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import {
  Addwishlist,
  getwishlist,
  removeWishlist,
} from "@/store/wishlistSlice";
import { useAuth } from "@/context/AuthContext";

function ProductCard({ product, loading, params }) {
  const dispatch = useDispatch();
  const { openCartDrawer } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const CartData = useSelector((state) => state.cartss?.cartitems);
  const ID = CartData?.user
  console.log(CartData, "cartobject")

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

  useEffect(() => {
    dispatch(getwishlist());
    setIsWishlisted(isProductInWishlist);
  }, [product._id]);

  const handleAddToCart = () => {
    dispatch(addToCart({Cartvalue,ID  }));
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
              <img src="https://m.media-amazon.com/images/I/81nAtR%20GpmL.jpg" alt={product.name} />
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
            <div className="mb-3 flex items-center justify-between">
              <Typography
                variant="h5"
                color="blue-gray"
                className="text-lg font-medium"
              >
                {isExpanded
                  ? product.name
                  : product.name.slice(0, 17) +
                    (product.name.length > 17 ? "" : "")}
                {product.name.length > 17 && (
                  <span onClick={toggleTitle} className="text-sm ms-2 mt-2">
                    {isExpanded ? "less" : "...read"}
                  </span>
                )}
              </Typography>
              <Typography
                color="blue-gray"
                className="flex items-center gap-1.5 font-normal"
              >
                <svg
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
                </svg>
                {product?.reviews?.averageRating}
              </Typography>
            </div>
            <Typography color="gray">
              {product.type} - {product.attributes?.configuration}
            </Typography>
            <div className="flex md:flex-col justify-between md:items-start items-center">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mt-2 font-medium"
              >
                ₹{product.price?.amount.toLocaleString()}
              </Typography>
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="bg-[#ef4666] mt-2 md:w-full"
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
