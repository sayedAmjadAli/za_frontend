
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [positions, setPositions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentClassSearch, setStudentClassSearch] = useState("");

  // =========================================================
  // FILTER STUDENTS BY EXACT CLASS
  // =========================================================
  const filteredStudents = useMemo(() => {
    const search = studentClassSearch.trim().toLowerCase();

    if (!search) {
      return students;
    }

    return students.filter((student) => {
      const studentClass = String(student.class || "")
        .trim()
        .toLowerCase();

      return studentClass === search;
    });
  }, [students, studentClassSearch]);

  // =========================================================
  // FETCH DATA
  // =========================================================
  const fetchData = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const studentsRes = await api.get("/student/getStudents");

      console.log("STUDENTS API RESPONSE:", studentsRes.data);

      setStudents(
        Array.isArray(studentsRes.data?.students)
          ? studentsRes.data.students
          : []
      );
    } catch (error) {
      console.error(
        "STUDENTS API ERROR:",
        error.response?.data || error.message
      );

      setStudents([]);

      toast.error(
        error.response?.data?.message || "Unable to load students"
      );
    }

    try {
      const positionsRes = await api.get("/candidate/Positions");

      console.log("POSITIONS API RESPONSE:", positionsRes.data);

      setPositions(
        Array.isArray(positionsRes.data?.positions)
          ? positionsRes.data.positions
          : []
      );
    } catch (error) {
      console.error(
        "POSITIONS API ERROR:",
        error.response?.data || error.message
      );

      setPositions([]);
    }

    try {
      const votesRes = await api.get("/vote/getVotes");

      console.log("VOTES API RESPONSE:", votesRes.data);

      setVotes(
        Array.isArray(votesRes.data?.votes)
          ? votesRes.data.votes
          : []
      );
    } catch (error) {
      console.error(
        "VOTES API ERROR:",
        error.response?.data || error.message
      );

      setVotes([]);
    }

    if (showRefresh) {
      toast.success("Dashboard refreshed successfully");
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================================
  // DELETE STUDENT
  // =========================================================
  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/student/${id}`);

      toast.success("Student deleted successfully");

      fetchData();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Error deleting student"
      );
    }
  };

  // =========================================================
  // DELETE CANDIDATE
  // =========================================================
  const deleteCandidate = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this candidate?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/candidate/${id}`);

      toast.success("Candidate deleted successfully");

      fetchData();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Error deleting candidate"
      );
    }
  };

  // =========================================================
  // COUNT VOTES
  // =========================================================
  const getVoteCount = (candidateId, position) => {
    return votes.filter(
      (v) =>
        String(v.candidate) === String(candidateId) &&
        v.position === position
    ).length;
  };

  // =========================================================
  // FIND WINNER
  // =========================================================
  const getWinner = (candidates, position) => {
    if (!candidates || candidates.length === 0) {
      return null;
    }

    let winner = candidates[0];
    let maxVotes = getVoteCount(winner._id, position);

    candidates.forEach((candidate) => {
      const count = getVoteCount(candidate._id, position);

      if (count > maxVotes) {
        winner = candidate;
        maxVotes = count;
      }
    });

    return {
      winner,
      maxVotes,
    };
  };

  // =========================================================
  // DASHBOARD STATISTICS
  // =========================================================
  const totalCandidates = useMemo(() => {
    return positions.reduce(
      (total, position) =>
        total + (position.candidates?.length || 0),
      0
    );
  }, [positions]);

  const totalPositions = positions.length;
  const totalStudents = students.length;
  const totalVotes = votes.length;

  // =========================================================
  // PIE CHART DATA
  // =========================================================
  const chartData = useMemo(() => {
    return positions.flatMap((position) =>
      (position.candidates || []).map((candidate) => ({
        candidate: candidate.name,
        position: position.position,
        votes: getVoteCount(candidate._id, position.position),
      }))
    );
  }, [positions, votes]);

  // Pie chart colors
  const PIE_COLORS = [
    "#7c3aed",
    "#4f46e5",
    "#2563eb",
    "#0891b2",
    "#059669",
    "#65a30d",
    "#ca8a04",
    "#ea580c",
    "#dc2626",
    "#db2777",
  ];

  // =========================================================
  // TOTAL VOTES IN PIE CHART
  // =========================================================
  const pieTotalVotes = useMemo(() => {
    return chartData.reduce(
      (total, item) => total + item.votes,
      0
    );
  }, [chartData]);

  // =========================================================
  // EXPORT RESULTS
  // =========================================================
  const exportResults = () => {
    if (positions.length === 0) {
      toast.warning("No election results available to export.");
      return;
    }

    let csv = "Position,Candidate,Votes,Winner\n";

    positions.forEach((pos) => {
      const winnerData = getWinner(
        pos.candidates,
        pos.position
      );

      pos.candidates.forEach((candidate) => {
        const voteCount = getVoteCount(
          candidate._id,
          pos.position
        );

        const isWinner =
          winnerData &&
          winnerData.winner._id === candidate._id
            ? "Yes"
            : "No";

        csv += `"${pos.position}","${candidate.name}",${voteCount},"${isWinner}"\n`;
      });
    });

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      "election_results.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("Election results exported successfully!");
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
            <svg
              className="h-8 w-8 animate-spin text-violet-600"
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
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-800">
            Loading Dashboard
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while we load election data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 text-white shadow-xl shadow-purple-200/50 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
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
                    d="M3 13.5l6-6 4.5 4.5L21 4.5"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 4.5v6h-6"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5h15"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm font-medium text-purple-100">
                  Election Management
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Admin Dashboard
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100">
                  Monitor students, candidates, votes and election
                  results from one place.
                </p>
              </div>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12a7.5 7.5 0 0112.75-5.3L19.5 9"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 4.5V9h-4.5"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12a7.5 7.5 0 01-12.75 5.3L4.5 15"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5V15H9"
                  />
                </svg>

                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <button
                type="button"
                onClick={exportResults}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
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
                    d="M12 3v12"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 10.5L12 15l4.5-4.5"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 21h15"
                  />
                </svg>

                Export Results
              </button>

            </div>
          </div>
        </div>

        {/* =====================================================
            STATISTICS
        ====================================================== */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Students */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.7"
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
                </svg>
              </div>

              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
                Students
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {totalStudents}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Registered students
            </p>
          </div>

          {/* Candidates */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 7.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 20.25a8.25 8.25 0 0116.5 0"
                  />
                </svg>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                Candidates
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {totalCandidates}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Registered candidates
            </p>
          </div>

          {/* Positions */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l2.5 5.25L20.25 9l-4.125 4.125L17.25 19.5 12 16.75 6.75 19.5l1.125-6.375L3.75 9l5.75-.75L12 3z"
                  />
                </svg>
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                Positions
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {totalPositions}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Election positions
            </p>
          </div>

          {/* Votes */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l7.5 4.5v5.25c0 4.5-3.25 7.5-7.5 8.25-4.25-.75-7.5-3.75-7.5-8.25V7.5L12 3z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.5 12l2.25 2.25L15.5 9.5"
                  />
                </svg>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Votes
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {totalVotes}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Votes submitted
            </p>
          </div>
        </div>

        {/* =====================================================
            ELECTION RESULTS PIE CHART
        ====================================================== */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-violet-50/60 px-5 py-5 sm:px-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

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
                      d="M11.25 3.75a8.25 8.25 0 108.25 8.25h-8.25V3.75z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 3.75v6h6"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Election Results Overview
                  </h2>

                  <p className="text-xs text-slate-500">
                    Live vote distribution across all Students Council candidates.
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-2">

                <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700">
                  {totalVotes} Total Votes
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  Live Results
                </span>

              </div>

            </div>
          </div>

          {chartData.length === 0 || pieTotalVotes === 0 ? (

            <div className="flex min-h-[360px] items-center justify-center p-6">

              <div className="rounded-2xl bg-slate-50 px-8 py-12 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

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
                      d="M11.25 3.75a8.25 8.25 0 108.25 8.25h-8.25V3.75z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 3.75v6h6"
                    />
                  </svg>

                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No voting results yet
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Candidate vote results will appear here as students cast their votes.
                </p>

              </div>

            </div>

          ) : (

            <div className="p-4 sm:p-6">

              <div className="mb-5 flex flex-wrap items-center gap-2">

                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  Highest vote:{" "}
                  {Math.max(
                    ...chartData.map((item) => item.votes)
                  )}
                </span>

                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {chartData.length} Candidates
                </span>

                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {pieTotalVotes} Votes in Chart
                </span>

              </div>

              <div className="h-[500px] w-full">

                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>

                    <Pie
                      data={chartData}
                      dataKey="votes"
                      nameKey="candidate"
                      cx="50%"
                      cy="45%"
                      outerRadius="70%"
                      innerRadius="0%"
                      paddingAngle={2}
                      label={({ candidate, percent }) =>
                        `${candidate} (${Math.round(percent * 100)}%)`
                      }
                      labelLine={true}
                    >

                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_COLORS[
                              index % PIE_COLORS.length
                            ]
                          }
                        />
                      ))}

                    </Pie>

                    <Tooltip
                      content={({ active, payload }) => {

                        if (!active || !payload?.length) {
                          return null;
                        }

                        const item = payload[0].payload;

                        const percentage =
                          pieTotalVotes > 0
                            ? Math.round(
                                (item.votes /
                                  pieTotalVotes) *
                                  100
                              )
                            : 0;

                        return (
                          <div className="min-w-[210px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">

                            <p className="font-bold text-slate-900">
                              {item.candidate}
                            </p>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              Position: {item.position}
                            </p>

                            <div className="mt-3 flex items-end justify-between gap-4">

                              <span className="text-xs font-semibold text-slate-500">
                                Votes
                              </span>

                              <span className="text-2xl font-extrabold text-violet-600">
                                {item.votes}
                              </span>

                            </div>

                            <p className="mt-2 text-xs font-semibold text-slate-500">
                              {percentage}% of chart votes
                            </p>

                          </div>
                        );
                      }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      height={55}
                      iconType="circle"
                      formatter={(value) => (
                        <span className="text-xs font-semibold text-slate-600">
                          {value}
                        </span>
                      )}
                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

          )}

        </div>

        {/* =====================================================
            POSITIONS & RESULTS
        ====================================================== */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">

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
                    d="M12 3l2.5 5.25L20.25 9l-4.125 4.125L17.25 19.5 12 16.75 6.75 19.5l1.125-6.375L3.75 9l5.75-.75L12 3z"
                  />
                </svg>

              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Positions & Results
                </h2>

                <p className="text-xs text-slate-500">
                  Monitor candidate performance and winners.
                </p>

              </div>

            </div>

            <span className="self-start rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 sm:self-auto">
              {positions.length} Positions
            </span>

          </div>

          {positions.length === 0 ? (

            <div className="rounded-2xl bg-slate-50 p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

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
                    d="M12 3l2.5 5.25L20.25 9l-4.125 4.125L17.25 19.5 12 16.75 6.75 19.5l1.125-6.375L3.75 9l5.75-.75L12 3z"
                  />
                </svg>

              </div>

              <h3 className="mt-4 font-bold text-slate-800">
                No Positions Available
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Election positions will appear here.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

              {positions.map((position, index) => {

                const winnerData = getWinner(
                  position.candidates,
                  position.position
                );

                const totalPositionVotes =
                  position.candidates?.reduce(
                    (total, candidate) =>
                      total +
                      getVoteCount(
                        candidate._id,
                        position.position
                      ),
                    0
                  ) || 0;

                return (

                  <div
                    key={position._id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
                  >

                    {/* Position Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-600">
                          {index + 1}
                        </div>

                        <div>

                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Position
                          </p>

                          <h3 className="font-bold text-slate-800">
                            {position.position}
                          </h3>

                        </div>

                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                        {totalPositionVotes} votes
                      </span>

                    </div>

                    {/* Candidates */}
                    <div className="space-y-3 p-4">

                      {position.candidates?.length > 0 ? (

                        position.candidates.map((candidate) => {

                          const candidateVotes =
                            getVoteCount(
                              candidate._id,
                              position.position
                            );

                          const percentage =
                            totalPositionVotes > 0
                              ? Math.round(
                                  (candidateVotes /
                                    totalPositionVotes) *
                                    100
                                )
                              : 0;

                          const isWinner =
                            winnerData?.winner?._id ===
                            candidate._id;

                          return (

                            <div
                              key={candidate._id}
                              className={`rounded-2xl border bg-white p-4 transition ${
                                isWinner
                                  ? "border-emerald-200 shadow-sm"
                                  : "border-slate-200"
                              }`}
                            >

                              <div className="flex items-center justify-between gap-3">

                                <div className="flex min-w-0 items-center gap-3">

                                  <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                                      isWinner
                                        ? "bg-emerald-100 text-emerald-600"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {candidate.name
                                      ?.charAt(0)
                                      ?.toUpperCase()}
                                  </div>

                                  <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                      <p className="truncate text-sm font-bold text-slate-800">
                                        {candidate.name}
                                      </p>

                                      {isWinner && (
                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                          WINNER
                                        </span>
                                      )}

                                    </div>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                      {percentage}% of votes
                                    </p>

                                  </div>

                                </div>

                                <div className="flex shrink-0 items-center gap-3">

                                  <span
                                    className={`text-sm font-bold ${
                                      isWinner
                                        ? "text-emerald-600"
                                        : "text-violet-600"
                                    }`}
                                  >
                                    {candidateVotes}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteCandidate(
                                        candidate._id
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                                    title="Delete candidate"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 7.5h12M9.75 7.5V5.25h4.5V7.5m-6.75 0l.75 12h7.5l.75-12"
                                      />
                                    </svg>
                                  </button>

                                </div>

                              </div>

                              {/* Progress */}
                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isWinner
                                      ? "bg-emerald-500"
                                      : "bg-violet-500"
                                  }`}
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />

                              </div>

                            </div>

                          );
                        })

                      ) : (

                        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">
                          No candidates available.
                        </div>

                      )}

                    </div>

                    {/* Winner */}
                    {winnerData && (

                      <div className="border-t border-emerald-100 bg-emerald-50 px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

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
                                d="M12 3l2.5 5.25L20.25 9l-4.125 4.125L17.25 19.5 12 16.75 6.75 19.5l1.125-6.375L3.75 9l5.75-.75L12 3z"
                              />
                            </svg>

                          </div>

                          <div className="min-w-0">

                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                              Current Winner
                            </p>

                            <p className="truncate font-bold text-emerald-800">

                              {winnerData.winner.name}

                              <span className="ml-2 font-medium">
                                ({winnerData.maxVotes} votes)
                              </span>

                            </p>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>
                );
              })}

            </div>

          )}

        </div>

        {/* =====================================================
            REGISTERED STUDENTS
        ====================================================== */}
        <div className="mb-6 mt-6 overflow-hidden rounded-3xl border-2 border-violet-200 bg-white shadow-lg shadow-violet-100/60">

          {/* Highlighted Section Header */}
          <div className="border-b border-violet-200 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 p-5 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.7"
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
                  </svg>

                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="font-bold text-slate-900">
                      Registered Students
                    </h2>

                    <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Student Records
                    </span>

                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Search and manage students registered in the election.
                  </p>

                </div>

              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">

                {/* Class Search */}
                <div className="relative w-full sm:w-72">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
                    />
                  </svg>

                  <input
                    type="text"
                    value={studentClassSearch}
                    onChange={(e) =>
                      setStudentClassSearch(e.target.value)
                    }
                    placeholder="Search exact class e.g. X"
                    className="w-full rounded-xl border-2 border-violet-100 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />

                </div>

                {/* Student Count */}
                <span className="self-start rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm sm:self-auto">
                  {filteredStudents.length} Students
                </span>

              </div>

            </div>

            {/* Search Information */}
            {studentClassSearch.trim() && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-violet-100 bg-white/80 px-4 py-3 text-xs text-violet-700">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
                  />
                </svg>

                <span>
                  Showing students from exact class{" "}
                  <strong>
                    "{studentClassSearch.trim()}"
                  </strong>
                </span>

              </div>
            )}

          </div>

          {students.length === 0 ? (

            <div className="p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

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
                    d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 20.25a7.5 7.5 0 0115 0"
                  />
                </svg>

              </div>

              <h3 className="mt-4 font-bold text-slate-800">
                No Students Registered
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Registered students will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="bg-violet-50 text-left text-xs uppercase tracking-wider text-violet-700">

                    <th className="px-6 py-4 font-bold">
                      Student
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Father Name
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Class
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Section
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Vote Number
                    </th>

                    <th className="px-6 py-4 text-right font-bold">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-violet-50">

                  {filteredStudents.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center"
                      >

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-400">

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
                              d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
                            />
                          </svg>

                        </div>

                        <p className="mt-3 font-semibold text-slate-700">
                          No students found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          No students belong to class "
                          {studentClassSearch.trim()}".
                        </p>

                      </td>

                    </tr>

                  ) : (

                    filteredStudents.map((student) => (

                      <tr
                        key={student._id}
                        className="transition hover:bg-violet-50/50"
                      >

                        {/* Student Username */}
                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-600">

                              {student.username
                                ?.charAt(0)
                                ?.toUpperCase()}

                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {student.username}
                              </p>

                              <p className="text-xs text-slate-400">
                                Student
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Father Name */}
                        <td className="px-6 py-4">

                          <p className="font-medium text-slate-700">
                            {student.fatherName}
                          </p>

                        </td>

                        {/* Class */}
                        <td className="px-6 py-4">

                          <span className="inline-flex rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-700">
                            {student.class}
                          </span>

                        </td>

                        {/* Section */}
                        <td className="px-6 py-4">

                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {student.section}
                          </span>

                        </td>

                        {/* Vote Number */}
                        <td className="px-6 py-4">

                          <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-bold text-violet-600">
                            {student.voteNumber}
                          </span>

                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              deleteStudent(student._id)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 7.5h12M9.75 7.5V5.25h4.5V7.5m-6.75 0l.75 12h7.5l.75-12"
                              />
                            </svg>

                            Delete

                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <div className="py-6 text-center">

          <p className="text-xs text-slate-400">
            Election Admin Dashboard
          </p>

          <p className="mt-1 text-[11px] text-slate-300">
            Secure • Simple • Reliable
          </p>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
