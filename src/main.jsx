import ReactDOM from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Home from "./pages/Home";
import Student from "./pages/Student";
import CandidateRegister from "./pages/Candidate";
import Vote from "./pages/Vote";
import Admin from "./pages/Admin";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Vote />,
  },
  {
    path:"/registerstudent",
    element:<Student/>  // Register Student`
  },
  {
    path:"/candidateregister",
    element:<CandidateRegister/>  // Register Student
  },
  {
    path:"/vote",
    element:<Vote/>  // Register Student
  },
  {
    path:"/admin",
    element:<Home/>  
  },
{
    path:"/results",
    element:<Admin/>  
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </AuthProvider>
);
