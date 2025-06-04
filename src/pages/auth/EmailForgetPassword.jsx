import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

function EmailForgetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  

  // بيانات النموذج
  const [email, setEmail] = useState("");
  
  // دالة إرسال البريد الإلكتروني
  const handleSubmitEmail = async (event) => {
    event.preventDefault();

    try {
      // إرسال البريد الإلكتروني (ملاحظة: استخدم API حقيقي هنا)
      const res = await fetch("http://localhost:3000/api/v1/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast({
          title: "Email sent successfully",
          description: "Please check your email inbox for further instructions.",
        });
        navigate(`/auth/${email}/changePassword`)
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  return (
    <div className="mx-auto w-full max-w-md space-y-8 px-6 py-8 bg-white/50 rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Morshdy
        </h1>
        <h2 className="text-xl font-medium">
          { "Send Verification Email"}
        </h2>
      </div>

      <form
        onSubmit={handleSubmitEmail}
        className="space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-[#333] text-white font-bold rounded-lg hover:bg-[#000] transition duration-300"
        >
          {"Send Email"}
        </button>
      </form>

    </div>
  );
}

export default EmailForgetPassword;
