import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api";

const VoteForm = () => {
  const voteNumberRef = useRef(null);
  const [student, setStudent] = useState(null);
  const [positions, setPositions] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [votedPositions, setVotedPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingStudent, setFetchingStudent] = useState(false);

  // ✅ Fetch all positions & candidates
  const fetchPositions = async () => {
    try {
      const response = await api.get("/candidate/Positions");
      setPositions(response.data.positions || []);
    } catch (error) {
      toast.error("Error fetching positions");
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // ✅ Fetch student by vote number
  const fetchStudent = async () => {
    const voteNumber = voteNumberRef.current.value.trim();
    if (!voteNumber) return toast.warning("Please enter vote number");

    try {
      setFetchingStudent(true);
      const response = await api.get(`/student/getStudentByVoteNumber/${voteNumber}`);
      if (response.data && response.data.student) {
        setStudent(response.data.student);
        toast.success("Student found!");
      } else {
        setStudent(null);
        toast.error("Student not found");
      }
    } catch (error) {
      setStudent(null);
      toast.error("Error fetching student");
    } finally {
      setFetchingStudent(false);
    }
  };

  // ✅ Handle vote for a specific position
  const handleVote = async (position) => {
    const candidateId = selectedCandidates[position];
    if (!candidateId) return toast.warning(`Please select a candidate for ${position}`);
    if (!student) return toast.warning("Please fetch student first");

    try {
      setLoading(true);
      await api.post("/vote/cast", {
        studentId: student._id,
        candidateId,
        position,
      });

      toast.success(`Vote given for ${position}`);
      setVotedPositions((prev) => [...prev, position]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error casting vote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Cast Your Vote
        </h1>

        {/* ✅ Vote Number Input */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            ref={voteNumberRef}
            type="text"
            placeholder="Enter Vote Number"
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={fetchStudent}
            disabled={fetchingStudent}
            className={`px-6 py-2 rounded-lg text-white font-semibold ${
              fetchingStudent ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {fetchingStudent ? "Checking..." : "Check"}
          </button>
        </div>

        {/* ✅ Student Info */}
        {student && (
          <div className="border p-4 rounded-lg bg-gray-50">
            <p><strong>Username:</strong> {student.username}</p>
            <p><strong>Class:</strong> {student.class}</p>
            <p><strong>Section:</strong> {student.section}</p>
            <p><strong>Vote Number:</strong> {student.voteNumber}</p>
          </div>
        )}

        {/* ✅ Positions & Candidates */}
        {student && positions.map((pos) => (
          <div key={pos._id} className="border p-4 rounded-lg bg-white shadow-sm flex flex-col sm:flex-row justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-gray-700 mb-2">{pos.position}</h2>
              <div className="flex flex-col gap-2">
                {pos.candidates.map((c) => (
                  <label key={c._id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={pos.position}
                      value={c._id}
                      disabled={votedPositions.includes(pos.position)}
                      checked={selectedCandidates[pos.position] === c._id}
                      onChange={() =>
                        setSelectedCandidates((prev) => ({ ...prev, [pos.position]: c._id }))
                      }
                      className="form-radio text-blue-600"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              {votedPositions.includes(pos.position) ? (
                <span className="text-green-600 font-semibold">Vote Given</span>
              ) : (
                <button
                  onClick={() => handleVote(pos.position)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white font-semibold ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "Submitting..." : "Vote"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoteForm;
