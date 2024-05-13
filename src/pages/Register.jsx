import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../icon/EyeSlashFilledIcon";
import { Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import back1 from "../assets/back2.jpg";

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().required().min(3),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "password must match"),
});

//register
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    //add profilePicture to data
    data.profilePicture =
      "https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png";

    //remove confirmPassword from data
    delete data.confirmPassword;

    try {
      await axios.post("http://localhost:8080/api/auth/register", data);

      toast.success("Register successfully");

      navigate("/login");
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data);
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className="fixed  w-full flex h-screen flex-col items-center justify-center bg-neutral-100 "
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${back1})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100%",
      }}
    >
      <div className="flex w-[500px] bg-white h-[500px] items-center justify-center rounded-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-96 flex-col gap-3 max-sm:px-10 "
        >
          <div className="flex flex-col items-center justify-center ">
            <h1 className="mb-3  font-serif text-xl font-bold text-black ">
              Register Your Account
            </h1>
          </div>

          <Input
            size="md"
            variant="filled"
            type="text"
            className="text-sm "
            label="Username"
            placeholder="Enter your username"
            {...register("username")}
            isInvalid={errors.username}
            errorMessage={errors.username?.message}
          />
          <Input
            size="md"
            variant="filled"
            type="text"
            label="Email"
            className="text-sm "
            placeholder="Enter your email"
            {...register("email")}
            isInvalid={errors.email}
            errorMessage={errors.email?.message}
          />

          <Input
            size="md"
            variant="filled"
            label="Password"
            className="text-sm "
            placeholder="Enter your password"
            {...register("password")}
            isInvalid={errors.password}
            errorMessage={errors.password?.message}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          <Input
            size="md"
            variant="filled"
            className="text-sm "
            label="Confirm Password"
            placeholder="Enter your confirm password"
            {...register("confirmPassword")}
            isInvalid={errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          <Button
            type="submit"
            size="sm"
            className="bg-black text-white"
            isLoading={isSubmitting}
          >
            Register
          </Button>
          <span className="text-sm font-semibold ">
            Already have an account?{" "}
            <Link to="/login" className="font-normal text-black underline ">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};
export default Register;
