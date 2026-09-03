import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarCheck,
  CalendarOff,
  CircleUser,
  HomeIcon,
  Menu,
  Package,
  Search,
  TrendingUp,
  User,
  View,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "react-toastify";
import logo from "../assets/animated.gif";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const {username} = useAuth();

  console.log(username,userRole)


  const handleLogout = async () => {
    try {
      const response = await api.post("/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed. Please try again.");
      }

      logout();
      navigate("/auth/login");
      toast.success("Logout successful");
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr]   lg:grid-cols-[280px_1fr] bg-white">
      <div className="hidden border-r  md:block ">
        <div className="flex h-full max-h-screen flex-col gap-4 min-h-screen">
          <div className="flex h-14 items-center px-4 py-4 my-4 mx-4 lg:h-[80px] rounded-3xl lg:px-6  ">
            <Link
              to="/dashboard/home"
              className="flex items-center gap-2 font-semibold hover:text-white transition-colors duration-300 ease-in-out"
            >
              <img src={logo} alt="Logo" className="h-12 rounded-lg" />
            </Link>
          </div>

          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium lg:px-6">
              <Link
                to="/dashboard/home"
                className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
              >
                <HomeIcon className="h-6 w-6 text-[#BA0D09]" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/projects"
                className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
              >
                <BriefcaseBusiness className="h-6 w-6 text-[#BA0D09]" />
                Manage Projects
              </Link>
              <Link
                to="/dashboard/team"
                className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
              >
                <User className="h-6 w-6 text-[#BA0D09]" />
                Manage Team
              </Link>
              <Link
                to="/dashboard/leaves"
                className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
              >
                <CalendarOff className="h-6 w-6 text-[#BA0D09]" />
                Manage Leave
              </Link>
              <Link
                to="/dashboard/attendance"
                className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
              >
                <CalendarCheck className="h-6 w-6 text-[#BA0D09]" />
                Manage Attendance
              </Link>
              <Link
                to="/dashboard/performance"
                className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
              >
                <TrendingUp className="h-6 w-6 text-[#BA0D09]" />
                Performance
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col ">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-50  px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5 text-[#BA0D09]" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-white">
              <nav className="grid gap-2 text-lg font-medium">
                <div className="flex h-14 items-center border-b px-2 lg:h-[60px] lg:px-6 bg-white">
                  <Link
                    to="/dashboard/home"
                    className="flex items-center gap-2 font-semibold"
                  ></Link>
                </div>
                <Link
                  to="/dashboard/home"
                  className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
                >
                  <HomeIcon className="h-5 w-5 text-[#BA0D09]" />
                  Home
                </Link>
                <Link
                  to="/dashboard/projects"
                  className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
                >
                  <Package className="h-6 w-6 text-[#BA0D09]" />
                  Manage Projects
                </Link>
                <Link
                  to="/dashboard/team"
                  className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
                >
                  <User className="h-6 w-6 text-[#BA0D09]" />
                  Manage Users
                </Link>
                <Link
                  to="/dashboard/leaves"
                  className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
                >
                  <Package className="h-6 w-6 text-[#BA0D09]" />
                  Manage Leave
                </Link>
                <Link
                  to="/dashboard/performance"
                  className="flex items-center gap-3 rounded-lg px-3 py-4 text-gray-700 transition-all hover:bg-green-100 hover:text-green-700"
                >
                  <Package className="h-6 w-6 text-[#BA0D09]" />
                  Performance
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 ">
            <form>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search Projects ..."
                  className="border p-2 rounded-3xl w-full pr-10 focus:outline-none focus:ring focus:ring-green-200  md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5 text-[#BA0D09]" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white shadow-md border border-gray-300"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {userRole === "1" && (
                  <p>
                 
                    Welcome
                    <span className="font-bold text-red-500"> Admin </span>{" "}
                  </p>
                )}
                {userRole === "2" && (
                  <p>
                   Welcome
                    <span className="font-bold text-red-500"> Team Lead </span>
                  </p>
                )}
                {userRole === "3" && (
                  <p>
                   Welcome
                    <span className="font-bold text-red-500"> User </span>
                  </p>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem> Name : {username}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <Button variant="link" className="text-[#BA0D09]">
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50   ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
