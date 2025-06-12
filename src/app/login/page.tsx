"use client";

import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const handleTogglePassword = () => setPasswordVisible((prev) => !prev);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      localStorage.setItem("token", res.data.token);

      Swal.fire({
        title: "Login successful!",
        icon: "success",
      });

      router.push("/");
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Login failed",
        text: "Invalid credentials",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto my-10">
      <h3 className="text-3xl font-semibold text-center mb-5">Login</h3>
      <div className="flex  items-center ">
        <form
          className="max-w-screen-md mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="mt-8 mb-2 text-xl font-semibold">Email Address</h3>
          <input
            {...register("email", { required: true })}
            type="text"
            placeholder="Enter your email"
            className="max-w-full md:w-[550px] bg-[#F3F3F3] h-14 pl-5"
          />
          {errors.email && (
            <span className="text-xs text-red-600">
              Email is required to login.
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
          {errors.password && (
            <span className="text-xs text-red-600">
              Password is required to login.
            </span>
          )}

          <Button variant={"auth"}>Login</Button>

          <div className="mt-4">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="hover:underline text-[#002172] hover:text-blue-700 font-bold"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
