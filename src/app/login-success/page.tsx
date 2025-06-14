"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "No token found. Please try again.",
      }).then(() => {
        router.push("/login");
      });
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
