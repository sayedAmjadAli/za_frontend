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

const Election = () => {
  const [positions, setPositions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultPassword, setResultPassword] = useState("");
  const [resultCountdown, setResultCountdown] = useState(0);
  const [unlockingResults, setUnlockingResults] = useState(false);

  // Change this password to your private election-results password.
  // IMPORTANT: for real security, validate the password on the backend too.
  const RESULTS_SECRET_PASSWORD = "Election@2026";

  useEffect(() => {
    return () => {
      // Countdown is local to the page and is cleared by lock/unmount logic.
    };
  }, []);

  const fetchResults = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [positionsRes, votesRes] = await Promise.all([
        api.get("/candidate/Positions"),
        api.get("/vote/getVotes"),
      ]);

      setPositions(
        Array.isArray(positionsRes.data?.positions)
          ? positionsRes.data.positions
          : []
      );

      setVotes(
        Array.isArray(votesRes.data?.votes)
          ? votesRes.data.votes
          : []
      );

      if (showRefresh) toast.success("Election data refreshed successfully");
    } catch (error) {
      console.error("ELECTION RESULTS ERROR:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Unable to load election results");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const getVoteCount = (candidateId, position) => {
    return votes.filter(
      (vote) =>
        String(vote.candidate) === String(candidateId) &&
        vote.position === position
    ).length;
  };

  const getWinner = (candidates, position) => {
    if (!candidates || candidates.length === 0) return null;

    let winner = candidates[0];
    let maxVotes = getVoteCount(winner._id, position);

    candidates.forEach((candidate) => {
      const count = getVoteCount(candidate._id, position);
      if (count > maxVotes) {
        winner = candidate;
        maxVotes = count;
      }
    });

    return { winner, maxVotes };
  };

  const chartData = useMemo(() => {
    return positions.flatMap((position) =>
      (position.candidates || []).map((candidate) => ({
        candidate: candidate.name,
        position: position.position,
        votes: getVoteCount(candidate._id, position.position),
      }))
    );
  }, [positions, votes]);

  const pieTotalVotes = useMemo(
    () => chartData.reduce((total, item) => total + item.votes, 0),
    [chartData]
  );

  const totalCandidates = useMemo(
    () => positions.reduce((total, position) => total + (position.candidates?.length || 0), 0),
    [positions]
  );

  const totalWinners = positions.reduce(
    (total, position) => total + (position.candidates?.length ? 1 : 0),
    0
  );

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

  const unlockResults = () => {
    if (resultPassword !== RESULTS_SECRET_PASSWORD) {
      toast.error("Incorrect results password.");
      return;
    }

    if (unlockingResults || showResults) return;

    setUnlockingResults(true);
    setResultCountdown(300);

    let seconds = 300;
    const timer = setInterval(() => {
      seconds -= 1;
      setResultCountdown(seconds);

      if (seconds <= 0) {
        clearInterval(timer);
        setUnlockingResults(false);
        setShowResults(true);
        setResultPassword("");
        toast.success("Election results are now available.");
      }
    }, 1000);
  };

  const lockResults = () => {
    setShowResults(false);
    setUnlockingResults(false);
    setResultCountdown(0);
    setResultPassword("");
  };

  const exportResults = () => {
    if (!showResults) {
      toast.warning("Unlock the election results before exporting.");
      return;
    }

    if (positions.length === 0) {
      toast.warning("No election results available to export.");
      return;
    }

    let csv = "Position,Candidate,Votes,Winner\n";

    positions.forEach((position) => {
      const winnerData = getWinner(position.candidates, position.position);

      position.candidates?.forEach((candidate) => {
        const voteCount = getVoteCount(candidate._id, position.position);
        const isWinner = winnerData?.winner?._id === candidate._id ? "Yes" : "No";
        csv += `"${position.position}","${candidate.name}",${voteCount},"${isWinner}"\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "election_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Election results exported successfully!");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
            <svg className="h-8 w-8 animate-spin text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
          <h2 className="mt-5 text-lg font-bold text-slate-800">Loading Election Results</h2>
          <p className="mt-1 text-sm text-slate-500">Please wait while election data is loaded...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 text-white shadow-xl shadow-purple-200/50 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 3.75a8.25 8.25 0 108.25 8.25h-8.25V3.75z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 3.75v6h6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-100">Students Council Election</p>
                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Election Results</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100">
                  Securely reveal the final election results, vote distribution and winners.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => fetchResults(true)}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0112.75-5.3L19.5 9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5V9h-4.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 01-12.75 5.3L4.5 15" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5V15H9" />
                </svg>
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <button
                type="button"
                onClick={exportResults}
                disabled={!showResults}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export Results
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Positions</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{positions.length}</p>
            <p className="mt-1 text-sm text-slate-400">Election positions</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Candidates</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalCandidates}</p>
            <p className="mt-1 text-sm text-slate-400">Registered candidates</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Votes</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{votes.length}</p>
            <p className="mt-1 text-sm text-slate-400">Votes submitted</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Status</p>
            <p className={`mt-2 text-xl font-bold ${showResults ? "text-emerald-600" : "text-amber-600"}`}>
              {showResults ? "Results Revealed" : "Results Locked"}
            </p>
            <p className="mt-1 text-sm text-slate-400">Secure result access</p>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-violet-50/60 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Election Results Overview</h2>
                <p className="text-xs text-slate-500">Vote distribution across all candidates.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700">{votes.length} Total Votes</span>
                {showResults ? (
                  <button type="button" onClick={lockResults} className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-200">Lock Results</button>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">Results Locked</span>
                )}
              </div>
            </div>
          </div>

          {!showResults ? (
            <div className="flex min-h-[430px] items-center justify-center p-6">
              <div className="w-full max-w-md rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 text-center shadow-sm sm:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3 3 0 100-6 3 3 0 000 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 10.5V8.25a6.75 6.75 0 0113.5 0v2.25M6.75 10.5h10.5A1.5 1.5 0 0118.75 12v7.5A1.5 1.5 0 0117.25 21H6.75a1.5 1.5 0 01-1.5-1.5V12A1.5 1.5 0 016.75 10.5z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-slate-900">Election Results Locked</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter the secret password. After the correct password is entered, the results will appear after a 5-minute countdown.
                </p>

                <input
                  type="password"
                  value={resultPassword}
                  onChange={(e) => setResultPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !unlockingResults) unlockResults();
                  }}
                  disabled={unlockingResults}
                  placeholder="Enter secret password"
                  className="mt-5 w-full rounded-xl border-2 border-violet-100 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

                <button
                  type="button"
                  onClick={unlockResults}
                  disabled={unlockingResults || !resultPassword}
                  className="mt-3 w-full rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {unlockingResults ? `Preparing Results... ${resultCountdown}s` : "Reveal Election Results"}
                </button>

                {unlockingResults && (
                  <div className="mt-5">
                    <div className="h-2 overflow-hidden rounded-full bg-violet-100">
                      <div className="h-full rounded-full bg-violet-600 transition-all duration-1000" style={{ width: `${((300 - resultCountdown) / 300) * 100}%` }} />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-violet-600">Results will be revealed in {resultCountdown} seconds...</p>
                  </div>
                )}
              </div>
            </div>
          ) : chartData.length === 0 || pieTotalVotes === 0 ? (
            <div className="flex min-h-[430px] items-center justify-center p-6">
              <div className="rounded-2xl bg-slate-50 px-8 py-12 text-center">
                <h3 className="font-bold text-slate-800">No voting results yet</h3>
                <p className="mt-1 text-sm text-slate-500">Candidate vote results are not available yet.</p>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Highest vote: {Math.max(...chartData.map((item) => item.votes))}</span>
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{chartData.length} Candidates</span>
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{pieTotalVotes} Votes in Chart</span>
              </div>

              <div className="h-[520px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="votes"
                      nameKey="candidate"
                      cx="50%"
                      cy="45%"
                      outerRadius="70%"
                      paddingAngle={2}
                      label={({ candidate, percent }) => `${candidate} (${Math.round(percent * 100)}%)`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const item = payload[0].payload;
                        const percentage = pieTotalVotes > 0 ? Math.round((item.votes / pieTotalVotes) * 100) : 0;
                        return (
                          <div className="min-w-[210px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                            <p className="font-bold text-slate-900">{item.candidate}</p>
                            <p className="mt-1 text-xs font-medium text-slate-400">Position: {item.position}</p>
                            <div className="mt-3 flex items-end justify-between gap-4">
                              <span className="text-xs font-semibold text-slate-500">Votes</span>
                              <span className="text-2xl font-extrabold text-violet-600">{item.votes}</span>
                            </div>
                            <p className="mt-2 text-xs font-semibold text-slate-500">{percentage}% of chart votes</p>
                          </div>
                        );
                      }}
                    />
                    <Legend verticalAlign="bottom" height={55} iconType="circle" formatter={(value) => <span className="text-xs font-semibold text-slate-600">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Positions & Results</h2>
              <p className="text-xs text-slate-500">Candidate performance and winners for every position.</p>
            </div>
            <span className="self-start rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 sm:self-auto">{positions.length} Positions</span>
          </div>

          {!showResults ? (
            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">🔒</div>
              <h3 className="mt-4 font-bold text-slate-800">Detailed Results Locked</h3>
              <p className="mt-1 text-sm text-slate-500">Enter the password above and wait for the 5-minute countdown to view detailed results.</p>
            </div>
          ) : positions.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-10 text-center">
              <h3 className="font-bold text-slate-800">No Positions Available</h3>
              <p className="mt-1 text-sm text-slate-500">Election positions will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {positions.map((position, index) => {
                const winnerData = getWinner(position.candidates, position.position);
                const totalPositionVotes = position.candidates?.reduce(
                  (total, candidate) => total + getVoteCount(candidate._id, position.position),
                  0
                ) || 0;

                return (
                  <div key={position._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-600">{index + 1}</div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Position</p>
                          <h3 className="font-bold text-slate-800">{position.position}</h3>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">{totalPositionVotes} votes</span>
                    </div>

                    <div className="space-y-3 p-4">
                      {position.candidates?.length > 0 ? position.candidates.map((candidate) => {
                        const candidateVotes = getVoteCount(candidate._id, position.position);
                        const percentage = totalPositionVotes > 0 ? Math.round((candidateVotes / totalPositionVotes) * 100) : 0;
                        const isWinner = winnerData?.winner?._id === candidate._id;
                        const profileImage = candidate?.profile || "";

                        return (
                          <div key={candidate._id} className={`rounded-2xl border bg-white p-4 ${isWinner ? "border-emerald-200 shadow-sm" : "border-slate-200"}`}>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className={`h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 ${isWinner ? "border-emerald-400" : "border-slate-200"} bg-slate-100`}>
                                  {profileImage ? (
                                    <img src={profileImage} alt={`${candidate.name} profile`} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling.style.display = "flex"; }} />
                                  ) : null}
                                  <div className={`${profileImage ? "hidden" : "flex"} h-full w-full items-center justify-center font-bold ${isWinner ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                                    {candidate.name?.charAt(0)?.toUpperCase()}
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="truncate text-sm font-bold text-slate-800">{candidate.name}</p>
                                    {isWinner && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">WINNER</span>}
                                  </div>
                                  <p className="mt-0.5 text-xs text-slate-400">{percentage}% of votes</p>
                                </div>
                              </div>
                              <span className={`shrink-0 text-sm font-bold ${isWinner ? "text-emerald-600" : "text-violet-600"}`}>{candidateVotes}</span>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                              <div className={`h-full rounded-full transition-all duration-500 ${isWinner ? "bg-emerald-500" : "bg-violet-500"}`} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">No candidates available.</div>
                      )}
                    </div>

                    {winnerData && (
                      <div className="border-t border-emerald-100 bg-emerald-50 px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Current Winner</p>
                        <p className="mt-1 truncate font-bold text-emerald-800">{winnerData.winner.name} <span className="ml-2 font-medium">({winnerData.maxVotes} votes)</span></p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="py-6 text-center">
          <p className="text-xs text-slate-400">Election Results • Secure • Simple • Reliable</p>
        </div>
      </div>
    </div>
  );
};

export default Election;
