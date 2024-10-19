import React, { useRef } from "react";
import Link from "next/link";
import { Button } from "@/store/features/materialTailwind/tailwindComp";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

const SliderBtn = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const Info = Object.fromEntries(formData.entries());
    alert(JSON.stringify(Info));
    formRef.current.reset();
  };

  return (
    <div className="flex justify-center gap-2">
      <Link href={"/collection/products"}>
        <Button className="text-xs md:text-sm" color="white">
          Explore
        </Button>
      </Link>
      {/* <Link href={'/contact-us'}> */}
      <Button
        onClick={onOpen}
        className="text-xs md:text-sm"
        color="white"
        variant="text"
      >
        Get In Touch
      </Button>
      {/* </Link> */}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="p-4">
                  <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                      <div className="lg:col-span-3">
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                          <div className="md:col-span-5">
                            <label htmlFor="full_name">Full Name</label>
                            <input
                              type="text"
                              name="full_name"
                              // value={data?.name}
                              placeholder="Full Name"
                              id="full_name"
                              className=" outline-none	border-gray-700	border h-10 mt-1 rounded px-4 w-full"
                              required
                            />
                          </div>

                          <div className="md:col-span-5">
                            <label htmlFor="email">Email Address</label>
                            <input
                              type="text"
                              name="email"
                              // value={data?.email}
                              id="email"
                              className="border outline-none border-gray-700 h-10 mt-1 rounded px-4 w-full"
                              placeholder="email@domain.com"
                              required
                            />
                          </div>

                          <div className="md:col-span-5">
                            <label htmlFor="contact">Mobile Number</label>
                            <input
                              name="contact"
                              id="contact"
                              placeholder="contact"
                              className=" outline-none	border-gray-700	border h-10 mt-1 rounded px-4 w-full"
                              required
                            />
                          </div>

                          

                          <div className="md:col-span-5">
                            <label htmlFor="Message">Message</label>
                            <textarea
                              name="Message"
                              id="Message"
                              placeholder="Message"
                              className="h-32 pt-2 outline-none	border-gray-700	border mt-1 rounded px-4 w-full"
                              required
                            />
                          </div>

                          <div className="md:col-span-5 mt-5 w-full text-center">
                            <div className="inline-flex items-end">
                              <button
                                type="submit"
                                className="inline-block w-full rounded-lg bg-[#ef4665] px-5 py-3 font-medium text-white sm:w-auto"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <button onClick={onClose} className="absolute  top-2 right-2">
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SliderBtn;
