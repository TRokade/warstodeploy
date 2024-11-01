"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loadUser } from "@/store/authSlice";
import api from "@/utils/api";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Accordion, AccordionItem, useDisclosure } from "@nextui-org/react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { format, parseISO } from "date-fns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button as NexBtn } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import MeasurementSlotSelector from "@/app/components/MeasurementSlotSelector";
import { useAuth } from "@/context/AuthContext";
import { clearItem } from "@/store/cartSlice";
import { Height } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 700,
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const Checkout = () => {
  const { user, loading: userLoading } = useSelector((state) => state.auth);

  const [cart, setCart] = useState(null);

  const [mobileNumber, setMobileNumber] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [step, setStep] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["1"]));
  console.log(selectedKeys);
  const [loading, setLoading] = useState(false);
  const [measurementSlot, setMeasurementSlot] = useState(null);
  console.log(measurementSlot);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    pincodeInput,
    isPincodeValid,
    ServiceMessage,
    handlePincodeChange,
    handleSavePincode,
    reviewopen,
    handlereviewOpen,
    handlereviewClose,
  } = useAuth();


  const validationSchema = Yup.object({
    shippingAddress: Yup.object({
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
      zipCode: Yup.string().required("Zip Code is required"),
    }),

    billingAddress: Yup.object({
      street: Yup.string().when("sameAsBilling", {
        is: false,
        then: Yup.string().required("Street is required"),
      }),
      city: Yup.string().when("sameAsBilling", {
        is: false,
        then: Yup.string().required("City is required"),
      }),
      state: Yup.string().when("sameAsBilling", {
        is: false,
        then: Yup.string().required("State is required"),
      }),
      country: Yup.string().when("sameAsBilling", {
        is: false,
        then: Yup.string().required("Country is required"),
      }),
      zipCode: Yup.string().when("sameAsBilling", {
        is: false,
        then: Yup.string().required("Zip Code is required"),
      }),
    }),
    sameAsBilling: Yup.boolean(),
  });

  const initialData = {
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: ServiceMessage.area.pincode,
    },
    billingAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: ServiceMessage.area.pincode,
    },
    sameAsBilling: true,
  };
  
  const savedData = JSON.parse(localStorage.getItem("formData")) || initialData;
  
  const formik = useFormik({
    initialValues: savedData,
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      setStep(4);
      handlereviewOpen();
      localStorage.removeItem("formData"); // Clear data on submit if desired
    },
  });
  
  
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formik.values));
  }, [formik.values]);

  useEffect(() => {
    if (step === 1) {
      setSelectedKeys(new Set(["1"]));
    } else if (step === 2) {
      setSelectedKeys(new Set(["2"]));
    } else if (step === 3) {
      setSelectedKeys(new Set(["3"]));
    } else if (step === 4) {
      setSelectedKeys(new Set(["4"]));
    }
  }, [step]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart. Please try again.");
      if (error.response && error.response.status === 401) {
        router.push("/signin");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const initializeCheckout = async () => {
      if (!user) {
        try {
          await dispatch(loadUser()).unwrap();
        } catch (error) {
          console.error("Error loading user:", error);
          router.push("/signin");
          return;
        }
      }
      fetchCart();
    };

    initializeCheckout();

    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, [dispatch, router, user, fetchCart]);

  useEffect(() => {
    if (user) {
      setMobileNumber(user.mobileNumber || "");
      if (user.shippingAddress) {
        setShippingAddress(user.shippingAddress);
      }
    }
  }, [user]);

  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "shipping") {
      setShippingAddress((prev) => ({ ...prev, [name]: value }));
    } else {
      setBillingAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSlotSelect = (slot) => {
    setMeasurementSlot(slot);
  };

  const validateMobileNumber = (number) => /^[6-9]\d{9}$/.test(number);

  const handlePayment = async () => {
    try {
      if (!validateMobileNumber(mobileNumber)) {
        alert(
          "Invalid Indian mobile number. Please enter a 10-digit number starting with 6, 7, 8, or 9."
        );
        return;
      }

      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      }));

      if (measurementSlot == null) {
        alert("Select a mesurment Slot");
      }

      // alert(JSON.stringify(deliveryOption));
      // alert(JSON.stringify(formik.values.shippingAddress));
      // alert(JSON.stringify(formik.values.sameAsBilling));
      // alert(JSON.stringify(formik.values.shippingAddress));
      // alert(JSON.stringify(orderItems));
      // alert(JSON.stringify(mobileNumber));

      const response = await api.post("/orders/create-razorpay-order", {
        items: orderItems, // Add this line
        shippingAddress: formik.values.shippingAddress,
        billingAddress: formik.values.sameAsBilling
          ? formik.values.shippingAddress
          : formik.values.billingAddress,
        deliveryOption,
        mobileNumber,
        measurementSlot,
      });

      const { orderId, amount, currency, order } = response.data;

      // alert("reached line 259  razorpay!!")

      const options = {
        key: "rzp_test_0qKqvkp9NG7OBq",
        amount: amount,
        currency: currency,
        name: "WarSto",
        description: "Purchase Description",
        order_id: orderId,
        handler: handlePaymentSuccess,
        prefill: {
          name: user.name,
          email: user.email,
          contact: mobileNumber,
        },
        notes: {
          shipping_address: JSON.stringify(formik.values.shippingAddress),
          billing_address: JSON.stringify(
            formik.values.sameAsBilling
              ? formik.values.shippingAddress
              : formik.values.billingAddress
          ),
          delivery_option: deliveryOption,
        },
        theme: {
          color: "#3399cc",
        },
      };
        // alert("reached razorpay!!")

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      handlereviewClose();
      setLoading(true);
      const { data } = await api.post(
        "/orders/verify-payment",
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Payment successful!");
        dispatch(clearItem());
        router.push(`/order-confirmation?orderId=${data.order._id}`);
      } else {
        console.error("Payment verification failed:", data.message);
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error(
        "Error verifying payment. Please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  function calculateDeliveryDate(deliveryOption) {
    const today = new Date();
    let deliveryDays;

    // Determine the number of days based on the shipping method
    if (deliveryOption == "standard") {
      deliveryDays = 27;
    } else if (deliveryOption == "express") {
      deliveryDays = 22;
    } else {
      return "Invalid shipping method";
    }

    // Calculate the delivery date
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    // Format the date as needed (e.g., "DD/MM/YYYY")
    const formattedDate = format(deliveryDate, "dd MMMM yyyy");

    return formattedDate;
  }

  const calculateCartFee = () => {
    return cart ? cart.total * 0.02 : 0;
  };

  const calculateDeliveryFee = () => {
    return deliveryOption === "express" ? calculateCartFee() : 0;
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.total + calculateDeliveryFee();
  };

  if (userLoading || loading || !cart) return <div>Loading...</div>;
  if (!user) return null;

  const renderOrderSummary = () => (
    <Card className="sticky top-5 w-full">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {cart.items.map((item) => (
          <div key={item.product._id} className="flex justify-between py-2">
            <div>
              <span className="font-semibold">{item.product.name}</span>
              <br />
              <span className="text-sm text-gray-600">
                Quantity: {item.quantity} | Price per item: ₹{item.price}
              </span>
            </div>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{cart.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>₹{cart.discount}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>₹{calculateDeliveryFee()}</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderProductSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle>Products in Your Order</CardTitle>
      </CardHeader>
      <CardContent>
        {cart.items.map((item) => (
          <div key={item.product._id} className="flex items-center mb-4">
            <img
              src={item.product.images[0]?.url || "/placeholder-image.jpg"}
              alt={item.product.name}
              className="w-16 h-16 object-cover mr-4"
            />
            <div>
              <h4 className="font-semibold">{item.product.name}</h4>
              <p className="text-sm text-gray-600">
                {item.product.attributes.color.family} |{" "}
                {item.product.attributes.configuration}
              </p>
              <p className="text-sm">Quantity: {item.quantity}</p>
              <p className="text-sm">Price: ₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderAddressForm = (type, address, isDisabled = false) => (
    <Card>
      <CardHeader></CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(address).map(([key, value]) => (
          <div key={key}>
            <Label htmlFor={`${type}-${key}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            <Input
              id={`${type}-${key}`}
              type="text"
              name={`${type}Address.${key}`}
              value={formik.values[type + "Address"][key]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isDisabled} // Disable the input if not needed
            />
            {formik.touched[type + "Address"]?.[key] &&
            formik.errors[type + "Address"]?.[key] ? (
              <div className="text-red-600">
                {formik.errors[type + "Address"][key]}
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderDeliveryOptions = () => (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Options</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard">Standard Delivery (Free)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="express" id="express" />
            <Label htmlFor="express">Express Delivery (₹100)</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );

  const renderReviewOrder = () => (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Order And Proceed to Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderProductSummary()}
        {renderOrderSummary()}
        {measurementSlot && (
          <div>
            <h4 className="font-semibold">Measurement Slot</h4>
            <p>{`${measurementSlot.date} - ${measurementSlot.timeRange}`}</p>
          </div>
        )}
        <div>
          <h4 className="font-semibold">Shipping Address</h4>
          <p>{Object.values(formik.values.shippingAddress).join(", ")}</p>
        </div>
        <div>
          <h4 className="font-semibold">Billing Address</h4>
          <p>
            {Object.values(
              formik.values.sameAsBilling
                ? formik.values.shippingAddress
                : formik.values.billingAddress
            ).join(", ")}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Delivery Option</h4>
          <p>
            {deliveryOption === "express"
              ? "Express Delivery"
              : "Standard Delivery"}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Mobile Number</h4>
          <p>{mobileNumber}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container  px-0 md:px-24 mt-24 py-8 w-full">
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        <Accordion variant="bordered" selectedKeys={selectedKeys}>
          <AccordionItem
            hideIndicator={step === 1 ? true : false}
            disableIndicatorAnimation={true}
            subtitle={
              step === 1 ? null : (
                <div className="mt-4 ms-1">
                  <p className="font-bold text-black">Delivery by parcel to </p>
                  <p className="font-thin ">
                    Mumbai, Maharashtra {ServiceMessage.area.pincode}
                  </p>
                  <p className="font-bold mt-2 text-black">Delivery date</p>
                  <p className="font-thin ">
                    {calculateDeliveryDate(deliveryOption)}
                  </p>
                </div>
              )
            }
            indicator={
              step === 1 ? null : (
                <button
                  className=" text-sm underline text-black"
                  onClick={isPincodeValid ? () => setStep(1) : null}
                >
                  Edit
                </button>
              )
            }
            className={step === 1 ? null : "py-5"}
            key="1"
            isOpen={true}
            aria-label="Accordion 1"
            title={
              step === 1 ? null : (
                <>
                  <CheckCircleIcon color="success" /> Delivery Pincode
                </>
              )
            }
          >
            <div className="my-2">
              <div className="flex items-center ">
                <div className="pincode-input-section">
                  <h4 className="text-4xl">Delivery Pincode</h4>
                  <p className="mb-1 text-sm md:text-base">
                    Please enter your pincode to check if we deliver to your
                    area.
                  </p>
                  <div className="">
                    <input
                      type="text"
                      id="pincode"
                      value={ServiceMessage.area.pincode}
                      onChange={handlePincodeChange}
                      placeholder="Enter pincode"
                      className="w-full border-2 rounded-md p-2"
                    />
                    {isPincodeValid ? (
                      <p className="text-green-500 text-sm md:text-base mt-1">
                        {ServiceMessage.message}
                      </p>
                    ) : (
                      <p className="text-red-500 text-sm md:text-base mt-1">
                        {ServiceMessage.message}
                      </p>
                    )}

                    <NexBtn
                      isDisabled={
                        ServiceMessage?.area?.pincode == undefined
                          ? true
                          : false
                      }
                      className="bg-black w-full rounded-md text-white"
                      onClick={() => setStep(2)}
                    >
                      Show delivery options
                    </NexBtn>
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            hideIndicator={step === 2 ? true : false}
            disableIndicatorAnimation={true}
            subtitle={
              step <= 2 ? null : (
                <div className="mt-4 ms-1">
                  <p className="font-bold text-black">Measurement Slot</p>
                  <p className="font-thin ">
                    {measurementSlot == null ? (
                      <p className="font-thin ">Select Measurement Slot</p>
                    ) : (
                      <>
                        <p>
                          {format(
                            parseISO(measurementSlot.startTime),
                            "MMMM d, yyyy"
                          )}
                        </p>
                        <p>{measurementSlot.timeRange}</p>
                      </>
                    )}
                  </p>

                  <p className="font-bold mt-2 text-black">Delivery Option </p>
                  <p className="font-thin ">{deliveryOption}</p>
                </div>
              )
            }
            indicator={
              step === 2 ? null : (
                <button
                  className=" text-sm underline text-black"
                  onClick={isPincodeValid ? () => setStep(2) : null}
                >
                  Edit
                </button>
              )
            }
            // startContent={step > 2 ? <CheckCircleIcon color="success" /> : null}
            className={step === 2 ? null : "py-5"}
            key="2"
            isOpen={true}
            aria-label="Accordion 1"
            title={
              step === 2 ? null : (
                <>
                  {step < 2 ? null : <CheckCircleIcon color="success" />}{" "}
                  Delivery Options and Slot measurement
                </>
              )
            }
          >
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2" /> Delivery Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={deliveryOption}
                    onValueChange={setDeliveryOption}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-grow">
                        <span className="font-semibold">Standard Delivery</span>
                        <p className="text-sm text-gray-500">
                          Free - Delivered in 27 days
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-grow">
                        <span className="font-semibold">Express Delivery</span>
                        <p className="text-sm text-gray-500">
                          ₹{calculateCartFee()} - Delivered in 22 business days
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="mr-2" /> Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="mobile-number">Mobile Number</Label>
                  <Input
                    id="mobile-number"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter your 10-digit mobile number"
                    className="mt-1"
                  />
                </CardContent>
              </Card>
              <MeasurementSlotSelector onSlotSelect={handleSlotSelect} />
              <div className="flex justify-between mt-6">
                <Button onClick={() => setStep(1)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pincode
                </Button>
                <NexBtn
                  className="bg-black text-white rounded-md"
                  isDisabled={measurementSlot == null ? true : false}
                  onClick={() => setStep(3)}
                >
                  Continue to Address <ArrowRight className="ml-2 h-4 w-4" />
                </NexBtn>
              </div>
            </>
          </AccordionItem>
          <AccordionItem
            // hideIndicator={true}
            hideIndicator={step === 3 ? true : false}
            disableIndicatorAnimation={true}
            subtitle={
              step <= 3 ? null : (
                <div className="mt-4 ms-1">
                  <p className="font-bold text-black">Address Details</p>
                  <p className="font-thin ">
                    {formik.values.shippingAddress == null ? (
                      <p className="font-thin ">Enter your Address </p>
                    ) : (
                      <p className="font-thin ">
                        {Object.values(formik.values.shippingAddress).join(
                          ", "
                        )}
                      </p>
                    )}
                  </p>
                </div>
              )
            }
            indicator={
              step === 3 ? null : (
                <button
                  className=" text-sm underline text-black"
                  onClick={isPincodeValid ? () => setStep(3) : null}
                >
                  Edit
                </button>
              )
            }
            className={step === 3 ? null : "py-5"}
            key="3"
            aria-label="Accordion 2"
            title={
              step === 3 ? null : (
                <>
                  {step < 3 ? null : <CheckCircleIcon color="success" />}{" "}
                  Address Details
                </>
              )
            }
          >
            <>
              <form onSubmit={formik.handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2" /> Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {renderAddressForm(
                      "shipping",
                      formik.values.shippingAddress
                    )}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="same-as-billing"
                        checked={formik.values.sameAsBilling}
                        onCheckedChange={() =>
                          formik.setFieldValue(
                            "sameAsBilling",
                            !formik.values.sameAsBilling
                          )
                        }
                      />
                      <Label htmlFor="same-as-billing">
                        Billing address same as shipping
                      </Label>
                    </div>
                    <div className="mt-4">
                      {!formik.values.sameAsBilling && (
                        <div className="mt-4">
                          <CardTitle className="text-lg mb-4">
                            Billing Address
                          </CardTitle>
                          {renderAddressForm(
                            "billing",
                            formik.values.billingAddress,
                            formik.values.sameAsBilling
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-6">
                  <NexBtn
                    onClick={() => setStep(2)}
                    className="bg-black text-white rounded-md"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Delivery
                  </NexBtn>
                  <Button type="submit">
                    Review Order <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          </AccordionItem>
          {/* <AccordionItem
            startContent={step > 4 ? <CheckCircleIcon color="success" /> : null}
            // hideIndicator={true}
            disableIndicatorAnimation={true}
            indicator={
              <button
                className=" text-sm underline text-black"
                onClick={() => setStep(4)}
              >
                Edit
              </button>
            }
            className={step === 4 ? null : "py-5"}
            key="4"
            aria-label="Accordion 4"
            title={step === 4 ? null : "Payment"}
          >
            <>
              {renderReviewOrder()}
              <div className="flex justify-between mt-6">
                <Button onClick={() => setStep(3)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Delivery
                </Button>
                <Button onClick={handlePayment} disabled={loading}>
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment
                    </>
                  )}
                </Button>
              </div>
            </>
          </AccordionItem> */}
        </Accordion>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={reviewopen}
          onClose={handlereviewClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={reviewopen}>
            <Box sx={style} className="overflow-y-auto">
              <div>
                {renderReviewOrder()}
                <div className="flex justify-between p-2 mt-6">
                  <Button
                    onClick={() => {
                      handlereviewClose();
                      setStep(3);
                    }}
                    variant="outline"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Delivery
                  </Button>
                  <Button onClick={handlePayment} disabled={loading}>
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" /> Proceed to
                        Payment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Box>
          </Fade>
        </Modal>

        <div className="lg:w-1/3">{renderOrderSummary()}</div>
      </div>
    </div>
  );
};
// asdasdaldflds
export default Checkout;
