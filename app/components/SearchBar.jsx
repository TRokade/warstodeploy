import { getSearchProducts } from "@/store/productSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from "@mui/icons-material/Cancel";

const SearchBar = () => {
  const [inp, setInp] = useState(""); // Input value
  const [isFocused, setIsFocused] = useState(false); // Track if the input is focused
  const [debouncedInp, setDebouncedInp] = useState(""); // Debounced input value
  const router = useRouter();
  const dispatch = useDispatch();
  const SearchProducts = useSelector((state) => state.productss.SearchProducts);
  const ProductLink = SearchProducts[0];

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInp(inp); // Set the debounced input after a delay
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler); // Clear the timeout if the input changes before the delay
    };
  }, [inp]);

  useEffect(() => {
    if (debouncedInp !== "") {
      dispatch(getSearchProducts(debouncedInp));
    }
  }, [debouncedInp, dispatch]);

  const handleChange = (e) => {
    setInp(e.target.value); // Update the input value
  };
  


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && ProductLink !== undefined) {
      router.push(`/collection/products/productdetail/${ProductLink._id}`);
      e.target.value = "";
    }
  };

  // Handle focus and blur events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      className={`p-4  me-0 md:mx-5 md:w-[500px] xxs:px-0 transition-all duration-300 ${
        isFocused
          ? "absolute md:static  top-10 left-0 w-full lg:w-[550px] xs:z-30 bg-white "
          : ""
      }`}
    >
      <div className="relative group">
        <input
          type="text"
          onChange={handleChange}
          value={inp}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search..."
          className={`pl-10 text-sm border-gray-500	 pr-4 py-1 lg:py-2.5 w-full rounded-full border shadow-sm focus:outline-none transition-all duration-300 `}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IoSearch className="text-[#ef4665ac]" />
        </div>
        {inp !== "" ? (
          <div onClick={()=>setInp("")} className="cursor-pointer z-50 absolute inset-y-0 right-0 flex items-center pe-3 pointer-events-none">
            <CancelIcon className="w-5 text-[#ef4665ac]" />
          </div>
        ) : (
          ""
        )}

        <div className="absolute lg:w-full w-[300px] h-fit overflow-y-auto right-0 left-1 z-50 bg-white border border-gray-300 rounded-md shadow-lg mt-1 opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-opacity duration-300 ease-in-out">
          <ul>
            {SearchProducts.length !== 0 ? (
              SearchProducts?.map((item) => (
                <Link
                  href={`/collection/opulence/productdetail/${item._id}`}
                  key={item.name}
                >
                  <li className="p-2 hover:bg-gray-100 cursor-pointer">
                    {item.name} <br />
                    <small>{item.description}</small>
                  </li>
                </Link>
              ))
            ) : (
              <li className="p-4">No results found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
