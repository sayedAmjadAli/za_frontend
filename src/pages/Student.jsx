import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api"; // your axios instance

const StudentRegister = () => {
  const usernameRef = useRef(null);
  const classRef = useRef(null);
  const sectionRef = useRef(null);
  const voteRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameRef.current.value.trim();
    const studentClass = classRef.current.value.trim();
    const section = sectionRef.current.value.trim();
    const voteNumber = voteRef.current.value.trim();

    if (!username) return toast.warning("Please enter username");
    if (!studentClass) return toast.warning("Please enter class");
    if (!section) return toast.warning("Please enter section");
    if (!voteNumber) return toast.warning("Please enter vote number");

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.post("/student/register", {
        username,
        class: studentClass,
        section,
        voteNumber,
      });

      if (response.status === 201) {
        toast.success("Student registered successfully!");
        console.log("Student registered:", response.data);

        // Reset form after success
        usernameRef.current.value = "";
        classRef.current.value = "";
        sectionRef.current.value = "";
        voteRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { ref: usernameRef, type: "text", placeholder: "Enter Username" },
    { ref: classRef, type: "text", placeholder: "Enter Class" },
    { ref: sectionRef, type: "text", placeholder: "Enter Section" },
    { ref: voteRef, type: "number", placeholder: "Enter Vote Number" },
  ];

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-100 to-purple-300">
      <div className="bg-white shadow-2xl rounded-2xl px-12 py-10 w-[400px]">
        <h1 className="text-2xl font-bold text-center text-purple-900 mb-6">
          Student Registration
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Fill in the details to register the student
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field, index) => (
            <input
              key={index}
              ref={field.ref}
              type={field.type}
              placeholder={field.placeholder}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-purple-400 focus:outline-none transition"
            />
          ))}

          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 rounded-xl text-white font-semibold shadow-md transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Registering..." : "Register Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
