"use client"
import { getReviews } from "@/store/reviewsSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactImageCarouselViewer } from "react-image-carousel-viewer";
const Reviews = ({ ID, reviewsSectionRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReviews(ID));
  }, [dispatch]);

  const baseUrl = "https://warsto.onrender.com/";

  const Data = useSelector((state) => state.reviewss.Reviews);
  console.log(Data);

  const newArray = Data?.reviews?.map((item) => ({
    images: item?.images?.map((image) => ({
      src: `${baseUrl}${image?.url}`,
      description: "image-1",
    })),
  }));

  const twarr = newArray?.flatMap((item) => item.images) || [];

  return (
    <>
      <div className="reviews-section" ref={reviewsSectionRef}>
        <hr className="m-5"></hr>
      </div>
      <h3 className="font-bold">Reviews</h3>
      <div>
        {Data?.reviews?.map((item) => {
          return (
            <div key={item?._id} className="mt-5">
              <div className="flex items-center mb-4">
                <img
                  className="w-10 h-10 me-4 rounded-full"
                  src="/docs/images/people/profile-picture-5.jpg"
                  alt=""
                />
                <div className="font-medium dark:text-white">
                  <p>
                    {item?.user?.name}
                    <time
                      dateTime="2014-08-16 19:00"
                      className="block text-sm text-gray-500 dark:text-gray-400"
                    >
                      {item?.user?.name}
                    </time>
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                <svg
                  className="w-4 h-4 text-yellow-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  className="w-4 h-4 text-yellow-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  className="w-4 h-4 text-yellow-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  className="w-4 h-4 text-yellow-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  className="w-4 h-4 text-gray-300 dark:text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
              </div>
              <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Reviewed on{" "}
                  <time dateTime="2017-03-03 19:00">{item.createdAt}</time>
                </p>
              </footer>
              <h3 className="ms-2 mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                {item?.comment}
              </h3>

              <div className="flex gap-1">
                {twarr?.map((image, index) => (
                  <img
                    key={index}
                    src={image?.src}
                    alt={image?.description || `Review image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded p-2"
                    onClick={() => {
                      setIndex(index);
                      setIsOpen(true);
                    }}
                  />
                ))}
              </div>
              {/* <ImageViewer
                images={item?.images}
                selectedImageIndex={selectedImageIndex}
                onClose={() => setSelectedImageIndex(null)}
              /> */}

              <ReactImageCarouselViewer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                images={twarr}
                startIndex={index}
              />

              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  19 people found this helpful
                </p>
                <div className="flex items-center mt-3">
                  <a
                    href="#"
                    className="px-2 py-1.5 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Helpful
                  </a>
                </div>
              </aside>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Reviews;
