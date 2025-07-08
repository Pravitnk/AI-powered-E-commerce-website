import { useCallback, useEffect, useRef, useState } from "react";
import { FiShoppingCart, FiMenu } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/reducers/themeSlice";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { IoSunnySharp } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { debounce } from "lodash";

const Header = () => {
  const { products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.mode);

  // Debounced filtering logic
  const handleSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setFiltered([]);
        return;
      }
      const matches = products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(matches.slice(0, 5)); // Top 5
      setShowDropdown(true);
    }, 300), // Throttle delay
    [products]
  );

  useEffect(() => {
    handleSearch(search);
  }, [search, handleSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (id) => {
    navigate(`/products/${id}`);
    setSearch("");
    setShowDropdown(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div
          className="cursor-pointer flex items-center gap-5"
          onClick={() => navigate("/")}
        >
          {/* Logo */}
          <img src={logo} alt="logo" className="h-10 w-10" />
          {!open && (
            <h1 className="text-2xl font-bold text-gray-800">MyShop</h1>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
          <Link to="/" className="hover:text-black transition duration-200">
            Home
          </Link>
          <Link
            to="/products"
            className="hover:text-black transition duration-200"
          >
            Products
          </Link>
          <Link
            to="/about"
            className="hover:text-black transition duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-black transition duration-200"
          >
            Contact
          </Link>
        </nav>

        <div className="relative w-full max-w-xs md:max-w-md" ref={dropdownRef}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products..."
            className="w-full px-4 py-2 border border-gray-300  rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {showDropdown && search && (
            <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md z-50 max-h-64 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <div
                    key={p._id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-800 dark:text-gray-200 flex items-center gap-3"
                    onClick={() => handleResultClick(p._id)}
                  >
                    <img
                      src={p.image1}
                      alt={p.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span>{p.name}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                  No products found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <>
            <FiShoppingCart className="w-6 h-6 text-gray-700 hover:text-black cursor-pointer" />

            <Popover>
              <PopoverTrigger asChild>
                <button>
                  {!user ? (
                    <MdAccountCircle className="h-6 w-6 text-gray-700 hover:text-black" />
                  ) : user.picture ? (
                    <img
                      src={user.picture}
                      alt="User"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4 flex flex-col gap-3">
                <div className="text-sm font-medium text-gray-800 dark:text-white">
                  My Account
                </div>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-left text-sm hover:underline"
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  className="text-left text-sm hover:underline"
                >
                  📦 Orders
                </button>
                {user ? (
                  <button
                    onClick={() => {
                      // TODO: dispatch logout
                      console.log("Logging out...");
                    }}
                    className="text-left text-sm text-red-500 hover:text-red-600"
                  >
                    🚪 Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm px-4 py-1 border rounded-md hover:bg-gray-100 dark:hover:text-black"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-sm px-4 py-1 bg-black text-white rounded-md hover:bg-gray-800"
                    >
                      Register
                    </Link>
                  </>
                )}
              </PopoverContent>
            </Popover>

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
          </>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
              {!open && <FiMenu className="w-6 h-6 text-gray-700" />}
            </SheetTrigger>
            <SheetContent side="right" className="p-6 space-y-6">
              <div className="text-xl font-bold">MyShop</div>
              <nav className="flex flex-col gap-4 text-gray-700">
                <Link to="/" onClick={() => setOpen(false)}>
                  Home
                </Link>
                <Link to="/products" onClick={() => setOpen(false)}>
                  Products
                </Link>
                <Link to="/about" onClick={() => setOpen(false)}>
                  About
                </Link>
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Contact
                </Link>
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      👤 Profile
                    </Link>
                    <Link to="/orders" onClick={() => setOpen(false)}>
                      📦 Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="text-left text-red-500"
                    >
                      🚪 Logout
                    </button>

                    {/* Theme toggle inside drawer */}
                    <button
                      onClick={() => {
                        dispatch(toggleTheme());
                      }}
                      className="flex items-center gap-2 text-sm mt-4"
                    >
                      {theme === "light" ? (
                        <>
                          <IoSunnyOutline /> Switch to Dark
                        </>
                      ) : (
                        <>
                          <IoSunnySharp className="text-yellow-300" /> Switch to
                          Light
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)}>
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
