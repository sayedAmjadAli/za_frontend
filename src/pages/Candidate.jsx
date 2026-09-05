
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const CandidateManager = () => {
  const [positions, setPositions] = useState([]);
  const [position, setPosition] = useState("");
  const [candidates, setCandidates] = useState([""]);
  const [newCandidate, setNewCandidate] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================================
  // FETCH POSITIONS
  // ============================================================
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

  // ============================================================
  // CREATE NEW POSITION
  // ============================================================
  const handleCreatePosition = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formattedCandidates = candidates
        .filter((c) => c.trim() !== "")
        .map((name) => ({ name }));

      await api.post("/candidate/create", {
        position,
        candidates: formattedCandidates,
      });

      setPosition("");
      setCandidates([""]);

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
  // ADD CANDIDATE
  // ============================================================
  const handleAddCandidate = async (e) => {
    e.preventDefault();

    if (!selectedPosition || !newCandidate.trim()) {
      return toast.warning("Select position and enter candidate");
    }

    try {
      setLoading(true);

      await api.post(
        `/candidate/positions/${selectedPosition}/add`,
        {
          name: newCandidate.trim(),
        }
      );

      setNewCandidate("");

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
      await api.delete(
        `/candidate/positions/${pos}/${candidateId}`
      );

      await fetchPositions();

      toast.success("Candidate removed successfully");
    } catch (err) {
      toast.error("Error deleting candidate");
    }
  };

  // ============================================================
  // CANDIDATE INPUT CHANGE
  // ============================================================
  const handleCandidateChange = (index, value) => {
    const updated = [...candidates];
    updated[index] = value;
    setCandidates(updated);
  };

  // ============================================================
  // ADD CANDIDATE INPUT FIELD
  // ============================================================
  const addCandidateField = () => {
    setCandidates([...candidates, ""]);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* ======================================================
            HEADER
        ====================================================== */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-6 text-white shadow-xl sm:p-8">

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute right-1/4 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              {/* Badge */}
              <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">

                <span className="mr-2 h-2 w-2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/50" />

                <span className="text-xs font-bold uppercase tracking-[0.15em] text-purple-100">
                  Official Election Portal
                </span>

              </div>

              {/* Institute */}
              <p className="whitespace-nowrap text-sm font-extrabold uppercase tracking-wider text-purple-200 sm:text-base">
                SZABIST ZAB-ed LRK
              </p>

              {/* Main Title */}
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Students Council Election
              </h1>

              {/* Description */}
              <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100">
                Manage election positions and candidates for the
                2026–27 Students Council Election.
              </p>

            </div>

            {/* Election Year */}
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

        {/* ======================================================
            CREATE NEW POSITION
        ====================================================== */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">

          <div className="mb-6 flex items-start gap-4">

            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15M4.5 12h15"
                />
              </svg>

            </div>

            <div>

              <h2 className="text-xl font-extrabold text-slate-900">
                Create New Position
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create a Students Council position and add its
                initial candidates.
              </p>

            </div>

          </div>

          <form
            onSubmit={handleCreatePosition}
            className="space-y-5"
          >

            {/* Position Name */}
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

            {/* Candidates */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Candidates
              </label>

              <div className="space-y-3">

                {candidates.map((candidate, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >

                    {/* Candidate Number */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-600">
                      {index + 1}
                    </div>

                    <input
                      type="text"
                      placeholder={`Candidate ${index + 1} name`}
                      value={candidate}
                      onChange={(e) =>
                        handleCandidateChange(
                          index,
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      required
                    />

                  </div>

                ))}

              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">

              <button
                type="button"
                onClick={addCandidateField}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
              >
                <span className="text-lg">+</span>
                Add Candidate
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

                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-30"
                      />

                      <path
                        d="M21 12a9 9 0 00-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>

                    Creating...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Create Position
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

        {/* ======================================================
            ADD CANDIDATE TO EXISTING POSITION
        ====================================================== */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">

          <div className="mb-6 flex items-start gap-4">

            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 20.25a7.5 7.5 0 0115 0"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25v4.5M21.75 10.5h-4.5"
                />

              </svg>

            </div>

            <div>

              <h2 className="text-xl font-extrabold text-slate-900">
                Add Candidate
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add a new candidate to an existing Students Council
                position.
              </p>

            </div>

          </div>

          <form
            onSubmit={handleAddCandidate}
            className="grid gap-4 sm:grid-cols-3"
          >

            {/* Select Position */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Select Position
              </label>

              <select
                value={selectedPosition}
                onChange={(e) =>
                  setSelectedPosition(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                required
              >

                <option value="">
                  -- Select Position --
                </option>

                {positions.map((pos) => (

                  <option
                    key={pos._id}
                    value={pos.position}
                  >
                    {pos.position}
                  </option>

                ))}

              </select>

            </div>

            {/* Candidate Name */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Candidate Name
              </label>

              <input
                type="text"
                placeholder="Enter candidate name"
                value={newCandidate}
                onChange={(e) =>
                  setNewCandidate(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                required
              />

            </div>

            {/* Add Button */}
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

        {/* ======================================================
            ALL POSITIONS & CANDIDATES
        ====================================================== */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">

          {/* Section Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h7.5M8.25 12h7.5M8.25 17.25h7.5"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 6.75h.008v.008H5.25V6.75zM5.25 12h.008v.008H5.25V12zM5.25 17.25h.008v.008H5.25v-.008z"
                  />

                </svg>

              </div>

              <div>

                <h2 className="text-xl font-extrabold text-slate-900">
                  All Positions & Candidates
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all registered election positions.
                </p>

              </div>

            </div>

            {/* Position Count */}
            <div className="w-fit rounded-xl bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">

              {positions.length}{" "}

              {positions.length === 1
                ? "Position"
                : "Positions"}

            </div>

          </div>

          {/* Empty State */}
          {positions.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3h.008"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.29 3.86L1.82 18a1.75 1.75 0 001.5 2.63h17.36a1.75 1.75 0 001.5-2.63L13.71 3.86a2 2 0 00-3.42 0z"
                  />

                </svg>

              </div>

              <p className="mt-4 font-semibold text-slate-700">
                No positions found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first Students Council position above.
              </p>

            </div>

          ) : (

            /* Positions Grid */
            <div className="grid gap-5 md:grid-cols-2">

              {positions.map((pos) => (

                <div
                  key={pos._id}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-white hover:shadow-lg"
                >

                  {/* Position Header */}
                  <div className="flex items-center justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a3 3 0 100-6 3 3 0 000 6z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 21a6.75 6.75 0 0113.5 0"
                          />

                        </svg>

                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate font-extrabold text-slate-800">
                          {pos.position}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {pos.candidates?.length || 0}{" "}
                          {pos.candidates?.length === 1
                            ? "Candidate"
                            : "Candidates"}
                        </p>

                      </div>

                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Active
                    </span>

                  </div>

                  {/* Candidates */}
                  <div className="mt-5 space-y-2">

                    {pos.candidates?.length === 0 ? (

                      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center">

                        <p className="text-sm text-slate-500">
                          No candidates added yet.
                        </p>

                      </div>

                    ) : (

                      pos.candidates.map((candidate, index) => (

                        <div
                          key={candidate._id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                        >

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                              {index + 1}
                            </div>

                            <span className="truncate text-sm font-semibold text-slate-700">
                              {candidate.name}
                            </span>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteCandidate(
                                pos.position,
                                candidate._id
                              )
                            }
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

        {/* ======================================================
            FOOTER
        ====================================================== */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row">

          <span className="font-semibold">
            SZABIST ZAB-ed LRK
          </span>

          <span>
            Students Council Election 2026–27
          </span>

        </div>

      </div>

    </div>
  );
};

export default CandidateManager;

