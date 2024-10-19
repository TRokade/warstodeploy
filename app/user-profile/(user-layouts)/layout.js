"use client";
import React, { useState } from "react";
import UserSidebar from "../usersComp/UserSidebar";
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
} from "@material-tailwind/react";
import { CiMenuFries } from "react-icons/ci";
import { BiMenuAltLeft } from "react-icons/bi";

import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const Navigate = useRouter();
  const [Open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const data = [
    {
      label: "Account",
      value: "html",
      mainpath: "/user-profile/user-info",
    },
    {
      label: "Your Orders",
      value: "vue",
      mainpath: "/user-profile/order-history",
    },
    {
      label: "Your Address",
      value: "angular",
      mainpath: "/user-profile/address",
    },
    {
      label: "Others",
      value: "svelte",
      mainpath: "/user-profile/others",
    },
  ];

  const handleTabClick = (mainpath) => {
    const navigatePath = mainpath;
    Navigate.push(navigatePath);
    setOpen(false);
  };

  return (
    <>
      <div className="flex relative md:flex-row flex-col items-start">
        <div className="w-full static md:sticky top-0 md:w-auto">
          <div
            className="flex text-left flex-row ps-5 mt-28 md:hidden "
            onClick={openDrawer}
          >
            Menu
            <BiMenuAltLeft className="text-3xl" />
          </div>

          <UserSidebar />
        </div>
        <div className="w-full mt-0  md:mt-40 px-0 lg:px-10">{children}</div>
      </div>
      <Drawer open={Open} overlay={false} onClose={closeDrawer}>
        <div className="mb-2 flex items-center justify-between p-4">
          <Typography variant="h5" color="blue-gray">
            Settings
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <List>
          {data.map(({ label, mainpath }) => (
            <ListItem key={label} onClick={() => handleTabClick(mainpath)}>
              {label}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
