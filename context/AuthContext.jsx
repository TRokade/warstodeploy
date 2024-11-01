"use client";
import { usePathname } from "next/navigation";
import { uuid } from "uuidv4";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useMediaQuery } from "@mui/material";

import { Dialog } from "@material-tailwind/react";
import SignIn from "@/app/(auth)/signin/page";
import SignUp from "@/app/(auth)/signup/page";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const location = usePathname();

  const [openCart, setCartOpen] = useState(false);
  const [openFilter, setFilterOpen] = useState(false);

  const [reviewopen, setreviewopen] = useState(false);
  const handlereviewOpen = () => setreviewopen(true);
  const handlereviewClose = () => setreviewopen(false);

  const [loginopen, setLoginopen] = useState(false);
  const handleOpen = () => setLoginopen((cur) => !cur);

  const [currentUser, setCurrentUser] = useState(null);
  const [guestUser, setguestUser] = useState(null);

  const [ServiceMessage, setServiceMessage] = useState({
    area: {},
    message: "",
  });
  const [pincodeInput, setPincodeInput] = useState("");
  const [isPincodeValid, setIsPincodeValid] = useState(false);

  const isTablet = useMediaQuery("(min-width: 600px) and (max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 600px)");

  let buttonSize = "sm";
  if (isTablet) {
    buttonSize = "sm";
  } else if (isMobile) {
    buttonSize = "xs";
  }

  const validPincode = [
    { pincode: 400001, area: "Fort" },
    { pincode: 400002, area: "Kalbadevi" },
    { pincode: 400003, area: "Mandvi" },
    { pincode: 400004, area: "Girgaon, Opera House" },
    { pincode: 400005, area: "Colaba" },
    { pincode: 400006, area: "Malabar Hill" },
    { pincode: 400007, area: "Grant Road" },
    { pincode: 400008, area: "Mumbai Central" },
    { pincode: 400009, area: "Chinchbunder" },
    { pincode: 400010, area: "Mazgaon" },
    { pincode: 400011, area: "Jacob Circle" },
    { pincode: 400012, area: "Parel" },
    { pincode: 400013, area: "Dadar (East)" },
    { pincode: 400014, area: "Matunga (East)" },
    { pincode: 400015, area: "Sion" },
    { pincode: 400016, area: "Mahim" },
    { pincode: 400017, area: "Dharavi" },
    { pincode: 400018, area: "Worli" },
    { pincode: 400019, area: "Wadala" },
    { pincode: 400020, area: "Churchgate" },
    { pincode: 400021, area: "Nariman Point" },
    { pincode: 400022, area: "Sion East" },
    { pincode: 400024, area: "Kurla" },
    { pincode: 400025, area: "Sewri" },
    { pincode: 400026, area: "Cuffe Parade" },
    { pincode: 400028, area: "Dadar (West)" },
    { pincode: 400029, area: "Santa Cruz" },
    { pincode: 400030, area: "King Circle" },
    { pincode: 400034, area: "Tardeo" },
    { pincode: 400036, area: "Cumballa Hill" },
    { pincode: 400049, area: "Juhu" },
    { pincode: 400050, area: "Bandra" },
    { pincode: 400051, area: "Bandra East" },
    { pincode: 400052, area: "Khar" },
    { pincode: 400053, area: "Andheri West" },
    { pincode: 400054, area: "Vile Parle West" },
    { pincode: 400056, area: "Vile Parle East" },
    { pincode: 400057, area: "Santacruz East" },
    { pincode: 400058, area: "Santacruz West" },
    { pincode: 400059, area: "Marol" },
    { pincode: 400060, area: "Jogeshwari East" },
    { pincode: 400061, area: "Malad West" },
    { pincode: 400064, area: "Malad East" },
    { pincode: 400065, area: "Goregaon East" },
    { pincode: 400066, area: "Borivali East" },
    { pincode: 400067, area: "Kandivali West" },
    { pincode: 400068, area: "Kandivali East" },
    { pincode: 400069, area: "Andheri East" },
    { pincode: 400070, area: "Chembur" },
    { pincode: 400071, area: "Deonar" },
    { pincode: 400072, area: "Powai" },
    { pincode: 400076, area: "IIT Bombay" },
    { pincode: 400078, area: "Bhandup" },
    { pincode: 401201, area: "Vasai East" },
    { pincode: 401202, area: "Vasai West" },
    { pincode: 401203, area: "Nalasopara East" },
    { pincode: 401209, area: "Nalasopara West" },
    { pincode: 401303, area: "Virar East" },
    { pincode: 401305, area: "Virar West" },
  ];

  useEffect(() => {
    const storedPincode = localStorage.getItem("vaildPincode");
    if (storedPincode) {
      const matchedArea = validPincode.find(
        (area) => area.pincode === parseInt(storedPincode, 10)
      );
      if (matchedArea) {
        setIsPincodeValid(!isPincodeValid);
        setServiceMessage({
          area: matchedArea,
          message: `Pincode ${storedPincode} is valid and available for delivery to ${matchedArea.area}.`,
        });
      }
    }
  }, []);

  const handlePincodeChange = (e) => {
    const enteredPincode = e.target.value;
    setPincodeInput(enteredPincode);

    const pincodeMatch = validPincode.find(
      (area) => area.pincode === parseInt(enteredPincode, 10)
    );

    if (pincodeMatch) {
      localStorage.setItem("vaildPincode", pincodeMatch.pincode);
      setIsPincodeValid(!isPincodeValid);
      setServiceMessage({
        area: pincodeMatch,
        message: `Pincode ${pincodeMatch.pincode} is valid and available for delivery to ${pincodeMatch.area}.`,
      });
    } else {
      setIsPincodeValid(!isPincodeValid);
      setServiceMessage({
        area: {},
        message: `Invalid pincode. Please try again.`,
      });
    }
  };

  const handleSavePincode = (pincodeInput) => {
    setIsPincodeValid(!isPincodeValid);
    setPincodeInput(pincodeInput);
  };

  useEffect(() => {
    const user = localStorage.getItem("token");
    const guestID = localStorage.getItem("guestID");
    if (user) {
      setCurrentUser(user);
    } else if (guestID) {
      setguestUser(guestID);
    }
  }, []);

  const data = [
    {
      label: "Sign In",
      value: "Login",
      desc: <SignIn />,
    },
    {
      label: "Sign Up",
      value: "Sign Up",
      desc: <SignUp />,
    },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "White",
    Height: 300,
  };


  const LoginDial = () => {
    return (
      <Dialog
        size={buttonSize}
        overlay={false}
        open={loginopen}
        handler={handleOpen}
        className="border-none !bg-transparent max-h-[200px]  rounded-md"
      >
        <div className="bg-white rounded-md">
          <Tabs value="Login">
            <TabsHeader>
              {data.map(({ label, value }) => (
                <Tab key={value} className="py-2" value={value}>
                  <div className="flex items-center gap-2">{label}</div>
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody
              animate={{
                initial: { y: 250 },
                mount: { y: 0 },
                unmount: { y: 250 },
              }}
              className="p-0"
            >
              {data.map(({ value, desc }) => (
                <TabPanel className="p-0 lg:px-2" key={value} value={value}>
                  {desc}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </div>
      </Dialog>
    );
  };

  const openCartDrawer = () => {
    if (location !== "/cart") {
      setCartOpen(true);
    }
  };
  const closeCartDrawer = () => setCartOpen(false);

  const openFilterDrawer = () => setFilterOpen(true);
  const closeFilterDrawer = () => setFilterOpen(false);

  // navbar scroll

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [Reqvalue, setvalue] = useState("flex");

  const scrollThreshold = 40;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        if (currentScrollY > lastScrollY) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const value = {
    openCart,
    openFilter,
    openCartDrawer,
    currentUser,
    setCurrentUser,
    guestUser,
    showNavbar,
    Reqvalue,
    handleOpen,
    loginopen,
    LoginDial,
    setvalue,
    openFilterDrawer,
    closeFilterDrawer,
    closeCartDrawer,
    reviewopen,
    handlereviewOpen,
    handlereviewClose,
    handleOpen,
    pincodeInput,
    isPincodeValid,
    ServiceMessage,
    handlePincodeChange,
    handleSavePincode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
