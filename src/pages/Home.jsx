import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-200 to-green-400">
      <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-900 mb-8">Welcome to Election Portal</h1>
        <p className="text-gray-700 mb-8">Please select an action below to continue:</p>

        <div className="flex flex-col gap-6">
          <button
            onClick={() => navigate("/registerstudent")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            Register Student
          </button>

          <button
            onClick={() => navigate("/vote")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
