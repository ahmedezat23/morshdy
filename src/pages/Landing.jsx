import { useNavigate } from 'react-router-dom';
import HomeImag from "../assets/home2.svg"; 
import { Button } from "@/components/ui/button";

function Landing() {
  const navigate = useNavigate(); // استخدام useNavigate للتنقل بين الصفحات

  // دوال التنقل
  const handleSignUpClick = () => {
    navigate('/auth/selectRole'); // التنقل إلى صفحة التسجيل
  };

  const handleSignInClick = () => {
    navigate('/auth/login'); // التنقل إلى صفحة تسجيل الدخول
  };

  return (
    <div className="relative flex min-h-screen w-full">
      {/* الجزء الخاص بالصورة الخلفية مع تأثير الحركة */}
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

      {/* الجزء الخاص بالنصوص والأزرار */}
      <div className="relative flex flex-1 items-center justify-center bg-black bg-opacity-50 py-12 sm:px-6 text-center lg:text-left">
        <div className="max-w-lg px-4 text-white">
          <h1 className="text-[50px] font-bold text-[#EB8317] font-cairo mb-4 italic text-center">
            Welcome to Egypt
          </h1>
          <p className="text-lg mb-6 text-center">
            We have all the antiques you need, and in less than seconds you will get what you want.
          </p>
          <div className="flex gap-4 justify-center lg:justify-center">
            <Button
              className="px-12 py-7 text-white bg-primary hover:bg-primary-dark transition-colors text-[17px]"
              onClick={handleSignInClick} // إضافة حدث التنقل إلى صفحة "Sign In"
            >
              Sign In
            </Button>
            <Button
              className="px-12 py-7 text-[17px] text-[#EB8317] border-2 border-[#EB8317] hover:bg-[#EB8317] hover:text-white transition-all"
              onClick={handleSignUpClick} // إضافة حدث التنقل إلى صفحة "Sign Up"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
