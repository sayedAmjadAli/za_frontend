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


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/registerstudent",
    element:<Student/>  // Register Student
  },
  {
    path:"/candidateregister",
    element:<CandidateRegister/>  // Register Student
  },
  {
    path:"/vote",
    element:<Vote/>  // Register Student
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </AuthProvider>
);
