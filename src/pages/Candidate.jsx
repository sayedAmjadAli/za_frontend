import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api"; // Axios instance

const CandidateManager = () => {
  const [positions, setPositions] = useState([]);
  const [position, setPosition] = useState("");
  const [candidates, setCandidates] = useState([""]);
  const [newCandidate, setNewCandidate] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all positions
  const fetchPositions = async () => {
    try {
      const { data } = await api.get("/candidate/Positions");
      setPositions(data.positions || []);
    } catch (err) {
      console.error("Error fetching positions:", err);
      toast.error("Error fetching positions");
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // ✅ Create a new position with candidates
  const handleCreatePosition = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // ✅ Convert candidate strings to objects before sending
      const formattedCandidates = candidates
        .filter((c) => c.trim() !== "")
        .map((name) => ({ name }));

      await api.post("/candidate/create", {
        position,
        candidates: formattedCandidates,
      });

      setPosition("");
      setCandidates([""]);
      fetchPositions();
      toast.success("Position created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating position");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add candidate to existing position
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!selectedPosition || !newCandidate)
      return toast.warning("Select position and enter candidate");

    try {
      setLoading(true);
      await api.post(`/candidate/positions/${selectedPosition}/add`, { name: newCandidate });
      setNewCandidate("");
      fetchPositions();
      toast.success("Candidate added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding candidate");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete candidate from position
  const handleDeleteCandidate = async (pos, candidateId) => {
    try {
      await api.delete(`/candidate/positions/${pos}/${candidateId}`);
      fetchPositions();
      toast.success("Candidate removed successfully");
    } catch (err) {
      toast.error("Error deleting candidate");
    }
  };

  // ✅ Add candidate field for new position
  const handleCandidateChange = (index, value) => {
    const updated = [...candidates];
    updated[index] = value;
    setCandidates(updated);
  };

  const addCandidateField = () => setCandidates([...candidates, ""]);

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl space-y-6">
        {/* Create New Position */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Position</h2>
          <form onSubmit={handleCreatePosition} className="space-y-4">
            <input
              type="text"
              placeholder="Enter position (e.g., President)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none"
              required
            />
            {candidates.map((c, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Candidate ${i + 1}`}
                value={c}
                onChange={(e) => handleCandidateChange(i, e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none"
                required
              />
            ))}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={addCandidateField}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold"
              >
                + Add Candidate
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white font-semibold ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Position"}
              </button>
            </div>
          </form>
        </div>

        {/* Add Candidate to Existing Position */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Candidate to Position</h2>
          <form onSubmit={handleAddCandidate} className="flex flex-col sm:flex-row gap-4 items-center">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none"
              required
            >
              <option value="">-- Select Position --</option>
              {positions.map((pos) => (
                <option key={pos._id} value={pos.position}>
                  {pos.position}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Candidate Name"
              value={newCandidate}
              onChange={(e) => setNewCandidate(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white font-semibold ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Candidate"}
            </button>
          </form>
        </div>

        {/* All Positions & Candidates */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Positions & Candidates</h2>
          {positions.length === 0 ? (
            <p className="text-gray-600">No positions found</p>
          ) : (
            <div className="space-y-4">
              {positions.map((pos) => (
                <div key={pos._id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold text-gray-700 mb-2">{pos.position}</h3>
                  <ul className="list-disc pl-5">
                    {pos.candidates.map((c) => (
                      <li key={c._id} className="flex justify-between items-center">
                        <span>{c.name}</span>
                        <button
                          onClick={() => handleDeleteCandidate(pos.position, c._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ❌ Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateManager;
