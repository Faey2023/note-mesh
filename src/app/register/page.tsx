"use client";

import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { RegisterFormInputs } from "@/types";
import { Button } from "@/components/ui/button";

const Register = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const image_hosting_api =
    "https://api.imgbb.com/1/upload?key=c084c8b20a0b148ed52505b8c63510a2";

  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const imageFile = data.image[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      // 1. Upload image to imgbb
      const imageRes = await axios.post(image_hosting_api, formData);
      const imageUrl = imageRes.data.data.display_url;

      // 2. Register user to backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
        {
          fullName: data.name,
          email: data.email,
          password: data.password,
          avatar: imageUrl,
        }
      );

      // 3. Save token (optional)
      localStorage.setItem("token", res.data.token);
      Swal.fire({
        title: "Registration successful!",
        icon: "success",
      });
      router.push("/login");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Registration failed",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto my-10">
      <h3 className="text-3xl font-semibold text-center mb-5">Register</h3>
      <div className="flex  items-center ">
        <form
          className="max-w-screen-md mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="mt-8 mb-2 text-xl font-semibold">Name</h3>
          <input
            {...register("name", { required: true })}
            type="text"
            name="name"
            placeholder="Enter your Name"
            className="max-w-full md:w-[550px] bg-[#F3F3F3] h-14 pl-5"
          />
          {errors.name && (
            <span className="text-xs text-red-600">
              Name is required to register.
            </span>
          )}

          <h3 className="mt-8 mb-2 text-xl font-semibold">Image</h3>
          <input
            {...register("image", { required: true })}
            type="file"
            className="max-w-full  bg-[#F3F3F3] md:w-[550px] h-14  file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#002172] file:text-white hover:file:bg-[#142a9b] file:h-14 file:w-fit cursor-pointer"
          />

          {errors.image && (
            <span className="text-xs text-red-600">
              Image is required to register.
            </span>
          )}

          <h3 className="mt-8 mb-2 text-xl font-semibold">Email Address</h3>
          <input
            {...register("email", { required: true })}
            type="email"
            name="email"
            placeholder="Enter your email address"
            className="max-w-full md:w-[550px] bg-[#F3F3F3] h-14 pl-5"
          />
          {errors.email && (
            <span className="text-xs text-red-600">
              Email is required to register.
            </span>
          )}

          <h3 className="text-xl font-semibold my-3">Password</h3>
          <div className="relative h-fit w-fit ">
            <input
              {...register("password", {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[A-Z]).{6,}$/i,
              })}
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="max-w-full md:w-[550px] bg-[#F3F3F3] h-14 pl-5 mb-7"
            />
            <span
              className="cursor-pointer text-xl absolute top-4 right-3"
              onClick={handleTogglePassword}
            >
              {passwordVisible ? <EyeIcon /> : <EyeClosedIcon />}
            </span>
          </div>
          {errors.password?.type === "minLength" && (
            <span className="text-red-700">
              Password length should be at least 6 characters.
            </span>
          )}
          {errors.password?.type === "required" && (
            <span className="text-red-700">
              Password is required to register.
            </span>
          )}
          {errors.password?.type === "pattern" && (
            <span className="text-red-700">
              Password should contain at least one capital letter.
            </span>
          )}

          <Button variant={"auth"}>Register</Button>

          <div className="mt-3">
            Already have an account?
            <Link
              href="/login"
              className="hover:underline text-[#002172] hover:text-blue-700 font-bold ml-1"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
