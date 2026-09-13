import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const CandidateManager = () => {
  const [positions, setPositions] = useState([]);
  const [position, setPosition] = useState("");
  const [candidates, setCandidates] = useState([{ name: "", profile: null, preview: null }]);

  // Single candidate state
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateProfile, setNewCandidateProfile] = useState(null);
  const [newCandidatePreview, setNewCandidatePreview] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");

  const [loading, setLoading] = useState(false);

  // ============================================================
  // HELPER FUNCTION: Resolve Cloudinary & Fallback Profile Images
  // ============================================================
  const getProfileImageUrl = (candidate) => {
    if (!candidate?.profile) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        candidate?.name || "Candidate"
      )}&background=7c3aed&color=fff&size=512`;
    }

    // Direct Cloudinary or HTTP/HTTPS URL from Database
    if (
      candidate.profile.startsWith("http://") ||
      candidate.profile.startsWith("https://")
    ) {
      return candidate.profile;
    }

    // Legacy fallback for relative paths
    const fileName = candidate.profile.replace(/\\/g, "/").split("/").pop();
    return `http://localhost:3000/profile/${fileName}`;
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
  // CREATE NEW POSITION
  // ============================================================
  const handleCreatePosition = async (e) => {
    e.preventDefault();

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

      candidates.forEach((cand) => {
        formData.append("profiles", cand.profile);
      });

      await api.post("/candidate/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosition("");
      setCandidates([{ name: "", profile: null, preview: null }]);

      if (e.target) e.target.reset();

      await fetchPositions();
      toast.success("Position created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating position");
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
      setNewCandidatePreview(null);

      const fileInput = document.getElementById("single-candidate-file");
      if (fileInput) fileInput.value = "";

      await fetchPositions();
      toast.success("Candidate added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding candidate");
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
      toast.error(err.response?.data?.message || "Error deleting candidate");
    }
  };

  // ============================================================
  // FORM FIELD & FILE PREVIEW HANDLERS
  // ============================================================
  const handleCandidateNameChange = (index, value) => {
    const updated = [...candidates];
    updated[index].name = value;
    setCandidates(updated);
  };

  const handleCandidateFileChange = (index, file) => {
    const updated = [...candidates];
    updated[index].profile = file;
    updated[index].preview = file ? URL.createObjectURL(file) : null;
    setCandidates(updated);
  };

  const handleSingleFileChange = (file) => {
    setNewCandidateProfile(file);
    setNewCandidatePreview(file ? URL.createObjectURL(file) : null);
  };

  const addCandidateField = () => {
    setCandidates([...candidates, { name: "", profile: null, preview: null }]);
  };

  const removeCandidateField = (index) => {
    if (candidates.length === 1) return;
    const updated = candidates.filter((_, i) => i !== index);
    setCandidates(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-6 text-white shadow-xl sm:p-8">
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
                Manage positions and candidates. Images are securely saved and served directly via Cloudinary.
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
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
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
                Define a position and add initial candidates with high-resolution profile pictures.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreatePosition} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Position Name
              </label>
              <input
                type="text"
                placeholder="e.g. President, Vice President"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Candidates & Profile Images
              </label>
              <div className="space-y-4">
                {candidates.map((candidate, index) => (
                  <div key={index} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-600">
                        {index + 1}
                      </div>
                      {candidate.preview && (
                        <img
                          src={candidate.preview}
                          alt="preview"
                          className="h-12 w-12 rounded-xl object-cover ring-2 ring-violet-500"
                        />
                      )}
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

        {/* ADD SINGLE CANDIDATE FORM */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a7.5 7.5 0 0115 0" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Add Individual Candidate
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Attach a new candidate to an existing position.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddCandidate} className="grid gap-4 sm:grid-cols-4 sm:items-end">
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
              <div className="flex items-center gap-2">
                {newCandidatePreview && (
                  <img
                    src={newCandidatePreview}
                    alt="preview"
                    className="h-10 w-10 shrink-0 rounded-lg object-cover ring-2 ring-emerald-500"
                  />
                )}
                <input
                  id="single-candidate-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSingleFileChange(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-2 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-3 file:py-2.5 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                  required
                />
              </div>
            </div>

            <div>
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

        {/* DISPLAY POSITIONS & CANDIDATES (CARDS SHOWCASING LARGE CLOUDINARY IMAGES) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Official Candidates
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Browse candidate entries grouped by electoral positions.
                </p>
              </div>
            </div>

            <div className="w-fit rounded-xl bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">
              {positions.length} {positions.length === 1 ? "Position" : "Positions"} Registered
            </div>
          </div>

          {positions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <p className="text-base font-bold text-slate-700">No active positions</p>
              <p className="mt-1 text-sm text-slate-500">
                Create a position above to begin adding candidates.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {positions.map((pos) => (
                <div key={pos._id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                  {/* POSITION TITLE HEADER */}
                  <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-violet-600" />
                      <h3 className="text-xl font-black text-slate-800">
                        {pos.position}
                      </h3>
                    </div>
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                      {pos.candidates?.length || 0} {pos.candidates?.length === 1 ? "Candidate" : "Candidates"}
                    </span>
                  </div>

                  {/* CANDIDATES CARD GRID */}
                  {pos.candidates?.length === 0 ? (
                    <p className="text-sm font-medium text-slate-500">No candidates registered for this position yet.</p>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {pos.candidates.map((candidate) => (
                        <div
                          key={candidate._id}
                          className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100"
                        >
                          {/* LARGE CANDIDATE IMAGE */}
                          <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                            <img
                              src={getProfileImageUrl(candidate)}
                              alt={candidate.name}
                              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  candidate?.name || "User"
                                )}&background=7c3aed&color=fff&size=512`;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
                            <span className="absolute bottom-3 left-3 rounded-md bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                              {pos.position}
                            </span>
                          </div>

                          {/* CARD CONTENT BODY */}
                          <div className="flex flex-1 flex-col justify-between p-5">
                            <div>
                              <h4 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition">
                                {candidate.name}
                              </h4>
                              <p className="mt-1 text-xs text-slate-400">
                                Official Candidate
                              </p>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                              <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                                <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                Verified Profile
                              </span>

                              <button
                                type="button"
                                onClick={() => handleDeleteCandidate(pos.position, candidate._id)}
                                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-6 text-xs text-slate-400 sm:flex-row">
          <span className="font-bold text-slate-500">SZABIST ZAB-ed LRK</span>
          <span>Students Council Election 2026–27</span>
        </div>
      </div>
    </div>
  );
};

export default CandidateManager;