import { AlignJustify, LogOut,Bell  } from "lucide-react";
import { Button } from "../ui/button";

function StoreHeader({ setOpen }) {

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        {/* <button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow mx-3"
        >
          <Bell  />
        </button> */}
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default StoreHeader;
