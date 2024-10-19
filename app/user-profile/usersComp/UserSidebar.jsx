"use client";
import React, { useEffect } from "react";
import { Card, List, ListItem } from "@material-tailwind/react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "@/store/authSlice";

const UserSidebar = () => {
  const navigate = useRouter();
  const currentPath = usePathname();

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(loadUser())
  },[dispatch])

  const user = useSelector((state)=>state.auth.user)

  const data = [
    {
      label: "Account",
      value: "Account",
      mainpath: "/user-profile/user-info",
    },
    {
      label: "Your Orders",
      value: "Your Orders",
      mainpath: "/user-profile/order-history",
    },
    {
      label: "Your Address",
      value: "Your Address",
      mainpath: "/user-profile/address",
    },
    {
      label: "Others",
      value: "Others",
      mainpath: "/user-profile/others",
    },
  ];

  const handleTabClick = (mainpath) => {
    navigate.push(mainpath);
  };

  return (
    <>
      <Card className="h-screen hidden md:block w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
        <div className="h-screen pt-28 text-center pb-24 lg:pb-[417px] w-full">
          <h2 className="my-5">
            Hello, <br />
            <span className="font-bold text-black text-lg">{user?.name}</span>
          </h2>

          <List>
            {data.map(({ label, value, mainpath }) => (
              <ListItem
                value={value}
                key={value}
                selected={currentPath === mainpath}
                className="my-1"
                onClick={() => handleTabClick(mainpath)}
              >
                {label}
              </ListItem>
            ))}
          </List>
        </div>
      </Card>
    </>
  );
};

export default UserSidebar;
