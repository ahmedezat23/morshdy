import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { useState } from "react";
// import { useDispatch } from "react-redux";
import { Binoculars, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState(initialState);
  // const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
  
    // send login request
    fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then((data) => {
        console.log(data);
        
        const { Token, user } = data;
  
        // Save to localStorage
        localStorage.setItem('token', Token);
        localStorage.setItem('user', JSON.stringify(user));
  
        // show success message
        toast({
          title: 'Login Successful',
          description: `Welcome ${user.fullName || user.email}`,
        });
       console.log(user);
       
        // navigate based on role
        switch (data.Role) {
          case 'Admin':
            navigate('/admin/dashboard');
            break;
          case 'Store':
            navigate('/store/dashboard');
            break;
          case 'Tourist':
            navigate('/tourist/home');
            break;
          default:
            navigate('/');
        }
  
    
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      });
  }
  

  return (
<div className="mx-auto w-full max-w-md space-y-8 px-6 py-8 bg-white/50 rounded-lg shadow-lg">
  <div className="text-center">
    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
        Morshdy
    </h1>
  </div>
  
  <CommonForm
    formControls={loginFormControls}
    buttonText={"Sign In"}
    formData={formData}
    setFormData={setFormData}
    onSubmit={onSubmit}
  />
  <hr />
  <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
        <button
          className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-lg text-white bg-[#EB8317] font-medium w-full `}
          value="tourist"
          onClick={()=>navigate('/auth/register/tourist')}
        >
          <Binoculars className="h-6 w-6" />
          <span className="text-[17px]">Tourist</span>
        </button>
        <button
          className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-lg text-white font-medium bg-[#000] w-full `}
          value="store"
          onClick={()=>navigate('/auth/register/store')}
        >
          <Store className="h-6 w-6" />
          <span className="text-[17px]">Store</span>
        </button>
      </div>
</div>

  );
}

export default AuthLogin;
