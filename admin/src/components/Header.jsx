import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/reducer/themeSlice";
import { IoSunnySharp, IoSunnyOutline } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { Sheet, SheetTrigger, SheetContent } from "../components/ui/sheet";
import { logoutAdmin } from "../redux/reducer/authSlice"; // ⬅ create this action if not available

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const theme = useSelector((state) => state.theme.mode);
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate("/login");
  };

  const renderLinks = () => (
    <>
      {admin && (
        <>
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/orders" onClick={() => setOpen(false)}>
            Orders
          </Link>
          <Link to="/lists" onClick={() => setOpen(false)}>
            List
          </Link>
          <Link to="/product" onClick={() => setOpen(false)}>
            Product
          </Link>
        </>
      )}
    </>
  );

  const DarkLightToggle = () => (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="text-xl p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <IoSunnyOutline />
      ) : (
        <IoSunnySharp className="text-yellow-300" />
      )}
    </button>
  );

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="logo"
            className="h-10 w-10 object-cover rounded-full"
          />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            MyShop
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-700 dark:text-gray-300 font-medium">
          {renderLinks()}
        </nav>

        {/* Right Controls (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {admin && (
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-white focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          )}

          <DarkLightToggle />

          {admin ? (
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                <FiMenu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="p-6 space-y-6 w-[70vw] sm:w-[300px]"
            >
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                MyShop
              </div>

              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
                {renderLinks()}
              </nav>

              {/* Theme toggle inside drawer */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center gap-2 text-sm mt-4"
              >
                {theme === "light" ? (
                  <>
                    <IoSunnyOutline /> Switch to Dark
                  </>
                ) : (
                  <>
                    <IoSunnySharp className="text-yellow-300" /> Switch to Light
                  </>
                )}
              </button>

              {/* Logout/Login inside drawer */}
              {admin ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="text-left text-red-500 cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
