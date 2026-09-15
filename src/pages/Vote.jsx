import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import logo from "../assets/logo.jpeg";
import electionLogo from "../assets/election.jpeg"; // Import the election logo

const VoteForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [student, setStudent] = useState(null);
  const [positions, setPositions] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [votedPositions, setVotedPositions] = useState([]);
  const [loadingPosition, setLoadingPosition] = useState(null);
  const [fetchingStudent, setFetchingStudent] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(true);



  // Fetch all positions and candidates
  const fetchPositions = async () => {
    try {
      setLoadingPositions(true);
      const response = await api.get("/candidate/Positions");
      setPositions(response.data.positions || []);
    } catch (error) {
      console.error("Error fetching positions:", error);
      toast.error("Unable to load positions and candidates.");
    } finally {
      setLoadingPositions(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // Login / Verify student with username and password
  const handleStudentLogin = async (e) => {
    if (e) e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.warning("Please enter both username and password.");
      return;
    }

    try {
      setFetchingStudent(true);

      const response = await api.post("/student/login", {
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data?.student) {
        setStudent(response.data.student);
        setSelectedCandidates({});
        setVotedPositions([]);
        toast.success("Student logged in successfully!");
      } else {
        setStudent(null);
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      console.error("Student login error:", error);
      setStudent(null);
      toast.error(
        error.response?.data?.message || "Invalid username or password."
      );
    } finally {
      setFetchingStudent(false);
    }
  };

  // Handle candidate selection
  const handleCandidateChange = (position, candidateId) => {
    if (votedPositions.includes(position)) return;

    setSelectedCandidates((prev) => ({
      ...prev,
      [position]: candidateId,
    }));
  };

  // Handle voting
  const handleVote = async (position) => {
    const candidateId = selectedCandidates[position];

    if (!candidateId) {
      toast.warning(`Please select a candidate for ${position}.`);
      return;
    }

    if (!student) {
      toast.warning("Please log in first.");
      return;
    }

    try {
      setLoadingPosition(position);

      await api.post("/vote/cast", {
        studentId: student._id,
        candidateId,
        position,
      });

      toast.success(`Vote successfully submitted for ${position}!`);
      setVotedPositions((prev) => [...prev, position]);

      setSelectedCandidates((prev) => {
        const updated = { ...prev };
        delete updated[position];
        return updated;
      });
    } catch (error) {
      console.error("Vote error:", error);
      toast.error(
        error.response?.data?.message || "Error casting vote. Please try again."
      );
    } finally {
      setLoadingPosition(null);
    }
  };

  const votedCount = votedPositions.length;
  const totalPositions = positions.length;

  const progress =
    totalPositions > 0
      ? Math.round((votedCount / totalPositions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-stretch justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-5">
          {/* LEFT SIDEBAR / ELECTION BRANDING */}
          {/* LEFT SIDEBAR / ELECTION BRANDING */}
<aside className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-8 text-white sm:p-10 lg:col-span-2 lg:p-12">
  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
  <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10" />
  <div className="absolute right-0 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-white/5" />

  <div className="relative z-10 flex h-full flex-col justify-between">
    <div>
      {/* BOTH LOGOS CONTAINER */}
      <div className="mb-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:gap-4">
        {/* Primary School Logo */}
        <div className="flex h-16 flex-1 items-center justify-center sm:h-20">
          <img
            src={logo}
            alt="SZABIST ZAB-ed LRK"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Divider line between logos */}
        <div className="h-12 w-px shrink-0 bg-purple-200" />

        {/* Election Council Logo */}
        <div className="flex h-16 flex-1 items-center justify-center sm:h-20">
          <img
            src= {electionLogo}
            alt="Students Council Election"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      <div className="text-center lg:text-left">
        <p className="whitespace-nowrap text-base font-extrabold tracking-wide text-white sm:text-lg">
          SZABIST ZAB-ed LRK
        </p>
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-purple-300 lg:mx-0" />
      </div>

      <div className="mb-5 mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
        <span className="mr-2 h-2 w-2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/50" />
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-purple-100">
          Official School Election
        </span>
      </div>

      <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
        Students
        <br />
        <span className="text-purple-200">Council</span>
        <br />
        Election
      </h1>

      <div className="mt-7 inline-flex items-center rounded-xl bg-white px-5 py-3 shadow-xl">
        <span className="text-xl font-extrabold tracking-wide text-violet-700">
          2026–27
        </span>
      </div>

      <p className="mt-6 max-w-sm text-sm leading-7 text-purple-100">
        Empowering students to participate, lead, and make their
        voices heard through a fair, secure, and transparent
        Students Council Election.
      </p>
    </div>

    <div className="mt-12 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75l2 2 4-4.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3l7.5 4.5v5.25c0 4.5-3.25 7.5-7.5 8.25-4.25-.75-7.5-3.75-7.5-8.25V7.5L12 3z"
            />
          </svg>
        </div>
        <div>
          <h2 className="font-bold text-white">
            Fair &amp; Secure Election
          </h2>
          <p className="mt-1 text-xs leading-5 text-purple-100">
            Every student's vote matters. Please verify all student,
            candidate, and election details prior to submission.
          </p>
        </div>
      </div>
    </div>
  </div>
</aside>

          {/* RIGHT CONTENT */}
          <main className="min-w-0 p-6 sm:p-10 lg:col-span-3 lg:p-12">
            <div className="mb-6 flex flex-col gap-5 border-b border-slate-100 pb-6">
              <div>
                <p className="text-sm font-semibold text-violet-600">
                  Student Election
                </p>
                <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Cast Your Vote
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Log in with your credentials and select one candidate for
                  each available position.
                </p>
              </div>

              {student && (
                <div className="w-full rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-violet-700">
                      Voting Progress
                    </span>
                    <span className="font-bold text-violet-900">
                      {votedCount}/{totalPositions}
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-violet-600">
                    {progress === 100
                      ? "All positions completed"
                      : `${progress}% completed`}
                  </p>
                </div>
              )}
            </div>

          {/* STUDENT LOGIN FORM */}
          {!student ? (
            <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
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
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Student Login</h2>
                  <p className="text-xs text-slate-500">
                    Enter your username and password to vote.
                  </p>
                </div>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      disabled={fetchingStudent}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      disabled={fetchingStudent}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={fetchingStudent}
                  className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {fetchingStudent ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Login & Verify
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
                          d="M13.5 6l6 6-6 6M18.5 12H4.5"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* STUDENT INFORMATION */
            <div className="mb-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 bg-emerald-50/70 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
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
                        d="M9 12.75l2 2 4-4.5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3l7.5 4.5v5.25c0 4.5-3.25 7.5-7.5 8.25-4.25-.75-7.5-3.75-7.5-8.25V7.5L12 3z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">Student Verified</h2>
                    <p className="text-xs text-emerald-600">
                      Logged in as {student.username}.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStudent(null)}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50"
                >
                  Change Student
                </button>
              </div>

              <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Username
                  </p>
                  <p className="mt-1 truncate font-semibold text-slate-800">
                    {student.username}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Class
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {student.class}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Section
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {student.section}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Vote Number
                  </p>
                  <p className="mt-1 font-semibold text-violet-600">
                    {student.voteNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LOADING POSITIONS */}
          {student && loadingPositions && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <svg
                className="mx-auto h-8 w-8 animate-spin text-violet-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <p className="mt-3 text-sm font-medium text-slate-600">
                Loading positions...
              </p>
            </div>
          )}

          {/* POSITIONS & CANDIDATE CARDS */}
          {student && !loadingPositions && positions.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-600">
                    Election Positions
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Choose Your Candidates
                  </h2>
                </div>

                <span className="hidden rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 sm:block">
                  {votedCount} of {totalPositions} completed
                </span>
              </div>

              {positions.map((pos, index) => {
                const isVoted = votedPositions.includes(pos.position);
                const selectedCandidate = selectedCandidates[pos.position];
                const isSubmitting = loadingPosition === pos.position;

                return (
                  <div
                    key={pos._id}
                    className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-200 ${
                      isVoted
                        ? "border-emerald-200"
                        : "border-slate-200 hover:border-violet-200 hover:shadow-md"
                    }`}
                  >
                    {/* Position Header */}
                    <div
                      className={`flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
                        isVoted
                          ? "border-emerald-100 bg-emerald-50/60"
                          : "border-slate-100 bg-slate-50/70"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            isVoted
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-violet-100 text-violet-600"
                          }`}
                        >
                          {isVoted ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Position {index + 1}
                          </p>
                          <h3 className="mt-0.5 text-lg font-bold text-slate-800">
                            {pos.position}
                          </h3>
                        </div>
                      </div>

                      {isVoted && (
                        <div className="flex items-center gap-2 self-start rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:self-auto">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Vote Given
                        </div>
                      )}
                    </div>

                    {/* Candidates Grid */}
                    <div className="p-5 sm:p-6">
                      {pos.candidates?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {pos.candidates.map((candidate) => {
                            const isSelected =
                              selectedCandidate === candidate._id;
                            const rawImg = candidate.profile || "";
                            const imageUrl = rawImg;

                            return (
                              <label
                                key={candidate._id}
                                className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-200 ${
                                  isVoted
                                    ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-70"
                                    : isSelected
                                    ? "border-violet-500 bg-violet-50/50 shadow-md ring-4 ring-violet-500/10"
                                    : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/30 hover:shadow-md"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`position-${pos._id}`}
                                  value={candidate._id}
                                  disabled={isVoted || isSubmitting}
                                  checked={isSelected}
                                  onChange={() =>
                                    handleCandidateChange(
                                      pos.position,
                                      candidate._id
                                    )
                                  }
                                  className="sr-only"
                                />

                                {/* Selection Indicator Badge */}
                                <div className="absolute top-3 right-3 z-10">
                                  <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                                      isSelected
                                        ? "border-violet-600 bg-violet-600 text-white"
                                        : "border-slate-300 bg-white/80 group-hover:border-violet-400"
                                    }`}
                                  >
                                    {isSelected && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>

                                {/* Candidate Image & Profile Info */}
                                <div className="flex flex-col items-center text-center">
                                  <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-2xl border-2 border-slate-100 shadow-sm transition group-hover:scale-105 group-hover:border-violet-300">
                                    {imageUrl ? (
                                      <img
                                        src={imageUrl}
                                        alt={candidate.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                          e.target.nextSibling.style.display = "flex";
                                        }}
                                      />
                                    ) : null}

                                    {/* Fallback Initial Avatar */}
                                    <div
                                      className={`flex h-full w-full items-center justify-center font-bold text-2xl uppercase ${
                                        isSelected
                                          ? "bg-violet-600 text-white"
                                          : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600"
                                      }`}
                                      style={{
                                        display: imageUrl ? "none" : "flex",
                                      }}
                                    >
                                      {candidate.name?.charAt(0)?.toUpperCase() || "C"}
                                    </div>
                                  </div>

                                  <h4
                                    className={`text-base font-bold transition-colors ${
                                      isSelected
                                        ? "text-violet-900"
                                        : "text-slate-800 group-hover:text-violet-700"
                                    }`}
                                  >
                                    {candidate.name}
                                  </h4>

                                  {(candidate.symbol || candidate.manifesto) && (
                                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                      {candidate.symbol || candidate.manifesto}
                                    </p>
                                  )}
                                </div>

                                {/* Selection Status Label */}
                                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                                  <span
                                    className={`text-xs font-semibold ${
                                      isSelected
                                        ? "text-violet-600"
                                        : "text-slate-400 group-hover:text-violet-500"
                                    }`}
                                  >
                                    {isSelected
                                      ? "Candidate Selected"
                                      : "Click to select"}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                          No candidates available for this position.
                        </div>
                      )}

                      {/* Vote Button */}
                      {!isVoted && (
                        <div className="mt-5 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleVote(pos.position)}
                            disabled={isSubmitting || !selectedCandidate}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/15 transition duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-400 disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
                          >
                            {isSubmitting ? (
                              <>
                                <svg
                                  className="h-5 w-5 animate-spin"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                  />
                                </svg>
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Vote
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
                                    d="M13.5 6l6 6-6 6M18.5 12H4.5"
                                  />
                                </svg>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* NO POSITIONS */}
          {student && !loadingPositions && positions.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2.25-12H6.75A2.25 2.25 0 004.5 6.25v11.5A2.25 2.25 0 006.75 20h10.5a2.25 2.25 0 002.25-2.25V6.25A2.25 2.25 0 0017.25 4z"
                  />
                </svg>
              </div>

              <h3 className="mt-4 font-bold text-slate-800">
                No Voting Positions Available
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                There are currently no positions available for voting.
              </p>
            </div>
          )}

          {/* COMPLETED MESSAGE */}
          {student &&
            !loadingPositions &&
            positions.length > 0 &&
            votedPositions.length === positions.length && (
              <div className="mt-6 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6 text-center sm:p-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 text-xl font-bold text-emerald-800">
                  Voting Completed
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-emerald-700">
                  All available positions have been successfully voted for.
                  Thank you for participating in the election.
                </p>
              </div>
            )}

          {/* Footer */}
          <p className="py-6 text-center text-xs text-slate-400">
            Please review your selection carefully before submitting each vote.
          </p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VoteForm;