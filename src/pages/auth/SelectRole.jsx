import { Binoculars, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
function SelectRole() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="flex flex-col items-center mt-1 bg-white/50 px-5 py-14 rounded-lg shadow-lg max-w-lg w-full mx-auto ">
      <h2 className="text-xl font-semibold mb-8 text-center">Are you looking to create a tourist account or would you prefer to build an online store ?</h2>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
        <button
          className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-lg text-white bg-[#EB8317] font-medium w-full sm:w-auto`}
          value="tourist"
          onClick={()=>navigate('/auth/register/tourist')}
        >
          <Binoculars className="h-7 w-7" />
          <span className="text-[18px] sm:text-[20px]">Tourist</span>
        </button>
        <button
          className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-lg text-white font-medium bg-[#000] w-full sm:w-auto`}
          value="store"
          onClick={()=>navigate('/auth/register/store')}
        >
          <Store className="h-7 w-7" />
          <span className="text-[18px] sm:text-[20px]">Store</span>
        </button>
      </div>

    </div>
  );
}

export default SelectRole;
