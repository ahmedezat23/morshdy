import { Outlet } from "react-router-dom";
import HomeImag from "../../assets/home2.svg";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen w-full">
       <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url(${HomeImag})`,
          filter: "brightness(0.5) blur(2px)", // تأثيرات مرعبة مثل السطوع والضباب
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          animation: "moveBackground 10s infinite linear", // إضافة الحركة
        }}
      ></div>
      <div className="relative flex flex-1 items-center justify-center bg-black bg-opacity-50 py-12 sm:px-6 text-center lg:text-left" >
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
