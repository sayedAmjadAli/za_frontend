import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const CandidateManager = () => {
  const [positions, setPositions] = useState([]);
  const [position, setPosition] = useState("");
  // Form structure for position creation: name and file object
  const [candidates, setCandidates] = useState([{ name: "", profile: null }]);

  // Add single candidate state
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateProfile, setNewCandidateProfile] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");

  const [loading, setLoading] = useState(false);

  // Updated Base URL to match port 3000 static file serving
  const BASE_IMAGE_URL = "http://localhost:3000/profile/";

  // Helper function to format profile URLs cleanly
  const getProfileImageUrl = (candidate) => {
    if (!candidate?.profile) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        candidate?.name || "User"
      )}&background=7c3aed&color=fff`;
    }
    const fileName = candidate.profile.replace(/\\/g, "/").split("/").pop();
    return `${BASE_IMAGE_URL}${fileName}`;
  };

  // ============================================================
  // FETCH POSITIONS
  // ============================================================
  const fetchPositions = async () => {
    try {
      const { data } = await api.get("/candidate/positions");
      setPositions(data.positions || []);
    } catch (err) {
      console.info("Error fetching positions:", err);
      toast.info("No positions found. Create a new position to get started.");
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // ============================================================
  // CREATE NEW POSITION (With File Uploads)
  // ============================================================
  const handleCreatePosition = async (e) => {
    e.preventDefault();

    // Validation check
    const invalidCandidate = candidates.some(
      (c) => !c.name.trim() || !c.profile
    );
    if (!position.trim() || invalidCandidate) {
      return toast.warning(
        "Position name, candidate name, and profile pictures are all required."
      );
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("position", position.trim());

      const candidateNames = candidates.map((c) => ({ name: c.name.trim() }));
      formData.append("candidates", JSON.stringify(candidateNames));

      // Append image files in order matching the candidates array
      candidates.forEach((cand) => {
        formData.append("profiles", cand.profile);
      });

      await api.post("/candidate/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosition("");
      setCandidates([{ name: "", profile: null }]);
      await fetchPositions();

      toast.success("Position created successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error creating position"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ADD SINGLE CANDIDATE TO EXISTING POSITION
  // ============================================================
  const handleAddCandidate = async (e) => {
    e.preventDefault();

    if (!selectedPosition || !newCandidateName.trim() || !newCandidateProfile) {
      return toast.warning(
        "Select a position, enter name, and upload a profile image."
      );
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", newCandidateName.trim());
      formData.append("profile", newCandidateProfile);

      await api.post(
        `/candidate/positions/${selectedPosition}/add`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setNewCandidateName("");
      setNewCandidateProfile(null);

      // Reset file input element manually
      const fileInput = document.getElementById("single-candidate-file");
      if (fileInput) fileInput.value = "";

      await fetchPositions();
      toast.success("Candidate added successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error adding candidate"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DELETE CANDIDATE
  // ============================================================
  const handleDeleteCandidate = async (pos, candidateId) => {
    try {
      await api.delete(`/candidate/positions/${pos}/${candidateId}`);
      await fetchPositions();
      toast.success("Candidate removed successfully");
    } catch (err) {
      toast.error("Error deleting candidate");
    }
  };

  // ============================================================
  // FORM FIELD HANDLERS FOR POSITION CREATION
  // ============================================================
  const handleCandidateNameChange = (index, value) => {
    const updated = [...candidates];
    updated[index].name = value;
    setCandidates(updated);
  };

  const handleCandidateFileChange = (index, file) => {
    const updated = [...candidates];
    updated[index].profile = file;
    setCandidates(updated);
  };

  const addCandidateField = () => {
    setCandidates([...candidates, { name: "", profile: null }]);
  };

  const removeCandidateField = (index) => {
    if (candidates.length === 1) return;
    const updated = candidates.filter((_, i) => i !== index);
    setCandidates(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute right-1/4 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="mr-2 h-2 w-2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/50" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-purple-100">
                  Official Election Portal
                </span>
              </div>
              <p className="whitespace-nowrap text-sm font-extrabold uppercase tracking-wider text-purple-200 sm:text-base">
                SZABIST ZAB-ed LRK
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Students Council Election
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100">
                Manage election positions and candidates for the 2026–27 Students Council Election.
              </p>
            </div>

            <div className="relative shrink-0 rounded-2xl bg-white px-6 py-4 text-center shadow-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Election
              </p>
              <p className="mt-1 text-2xl font-extrabold text-violet-700">
                2026–27
              </p>
            </div>
          </div>
        </div>

        {/* CREATE NEW POSITION FORM */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15M4.5 12h15" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Create New Position
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Create a position and upload profile pictures for initial candidates.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreatePosition} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Position Name
              </label>
              <input
                type="text"
                placeholder="e.g. President"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Candidates & Profile Pictures
              </label>
              <div className="space-y-4">
                {candidates.map((candidate, index) => (
                  <div key={index} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-600">
                      {index + 1}
                    </div>

                    <input
                      type="text"
                      placeholder={`Candidate ${index + 1} name`}
                      value={candidate.name}
                      onChange={(e) => handleCandidateNameChange(index, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      required
                    />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCandidateFileChange(index, e.target.files[0])}
                      className="w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                      required
                    />

                    {candidates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCandidateField(index)}
                        className="self-end rounded-lg p-2 text-xs font-bold text-red-500 hover:bg-red-50 sm:self-center"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={addCandidateField}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
              >
                <span className="text-lg">+</span> Add Candidate Field
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition ${
                  loading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-violet-600 shadow-violet-200 hover:bg-violet-700 hover:shadow-violet-300"
                }`}
              >
                {loading ? "Creating..." : "✓ Create Position"}
              </button>
            </div>
          </form>
        </div>

        {/* ADD SINGLE CANDIDATE TO EXISTING POSITION */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a7.5 7.5 0 0115 0" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Add Candidate
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add a single candidate with a profile image to an existing position.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddCandidate} className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Select Position
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                required
              >
                <option value="">-- Select Position --</option>
                {positions.map((pos) => (
                  <option key={pos._id} value={pos.position}>
                    {pos.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Candidate Name
              </label>
              <input
                type="text"
                placeholder="Candidate name"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Profile Picture
              </label>
              <input
                id="single-candidate-file"
                type="file"
                accept="image/*"
                onChange={(e) => setNewCandidateProfile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-2 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-3 file:py-2.5 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition ${
                  loading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300"
                }`}
              >
                {loading ? "Adding..." : "+ Add Candidate"}
              </button>
            </div>
          </form>
        </div>

        {/* DISPLAY ALL POSITIONS & CANDIDATES */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5M8.25 17.25h7.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  All Positions & Candidates
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  View candidates and their profile pictures.
                </p>
              </div>
            </div>

            <div className="w-fit rounded-xl bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">
              {positions.length} {positions.length === 1 ? "Position" : "Positions"}
            </div>
          </div>

          {positions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <p className="font-semibold text-slate-700">No positions found</p>
              <p className="mt-1 text-sm text-slate-500">
                Create your first Students Council position above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {positions.map((pos) => (
                <div key={pos._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:border-violet-200 hover:bg-white hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate font-extrabold text-slate-800">
                      {pos.position}
                    </h3>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Active
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {pos.candidates?.length === 0 ? (
                      <p className="text-sm text-slate-500">No candidates added yet.</p>
                    ) : (
                      pos.candidates.map((candidate) => (
                        <div key={candidate._id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                          <div className="flex items-center gap-3">
                           <img
  src={
    candidate.profile
      ? `${BASE_IMAGE_URL}${candidate.profile.replace(/\\/g, "/").split("/").pop()}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=7c3aed&color=fff`
  }
  alt={candidate.name}
  className="h-10 w-10 rounded-full object-cover border border-slate-200"
  onError={(e) => {
    console.error("Failed image URL:", e.target.src);
    e.target.onerror = null;
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=7c3aed&color=fff`;
  }}
/>
                            <span className="truncate text-sm font-semibold text-slate-700">
                              {candidate.name}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteCandidate(pos.position, candidate._id)}
                            className="shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row">
          <span className="font-semibold">SZABIST ZAB-ed LRK</span>
          <span>Students Council Election 2026–27</span>
        </div>
      </div>
    </div>
  );
};

export default CandidateManager;