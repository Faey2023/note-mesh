import Image from "next/image";
import { Button } from "../ui/button";

const GoogleLogin = () => {
  
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
  };

  return (
    <>
      <div className="flex items-center gap-4 my-3">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="text-sm text-gray-500">Or</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <Button
        onClick={handleGoogleLogin}
        className="w-full bg-red-600 hover:bg-red-800 flex items-center gap-2"
      >
        <Image
          width={28}
          height={28}
          className="rounded-full"
          src="https://i.ibb.co/dMy26rb/g.png"
          alt="Google logo"
        />
        Google Login
      </Button>
    </>
  );
};

export default GoogleLogin;
