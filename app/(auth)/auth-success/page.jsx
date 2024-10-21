"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";

const AuthSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      dispatch(setUser(token));
      setTimeout(() => router.push("/"), 100);
    }
  }, [router, dispatch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>Redirecting...</div>
    </Suspense>
  );
};

export default AuthSuccess;
