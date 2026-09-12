import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-5">

          {/* =====================================================
              LEFT HERO SECTION
          ===================================================== */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-8 text-white sm:p-10 lg:col-span-2 lg:p-12">

            {/* Decorative Background */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10" />
            <div className="absolute right-0 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-white/5" />

            <div className="relative z-10 flex h-full flex-col justify-between">

              {/* BRANDING */}
              <div>
                {/* Horizontal Logo */}
                <div className="mb-7 flex w-full items-center justify-center rounded-2xl bg-white px-5 py-4 shadow-xl">
                  <img
                    src={logo}
                    alt="SZABIST ZAB-ed LRK"
                    className="h-20 w-full object-contain sm:h-24"
                  />
                </div>

                {/* Institute Name */}
                <div className="mb-6 text-center lg:text-left">
                  <p className="whitespace-nowrap text-base font-extrabold tracking-wide text-white sm:text-lg">
                    SZABIST ZAB-ed LRK
                  </p>
                  <div className="mt-2 h-1 w-16 rounded-full bg-purple-300" />
                </div>

                {/* Official Election Badge */}
                <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <span className="mr-2 h-2 w-2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/50" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-purple-100">
                    Official School Election
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                  Students
                  <br />
                  <span className="text-purple-200">
                    Council
                  </span>
                  <br />
                  Election
                </h1>

                {/* Election Year */}
                <div className="mt-6">
                  <div className="inline-flex items-center rounded-xl bg-white px-5 py-3 shadow-xl">
                    <span className="text-xl font-extrabold tracking-wide text-violet-700">
                      2026–27
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-6 max-w-sm text-sm leading-7 text-purple-100">
                  Empowering students to participate, lead, and make their
                  voices heard through a fair, secure, and transparent
                  Students Council Election.
                </p>
              </div>

              {/* BOTTOM INFORMATION */}
              <div className="mt-12">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
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
                          d="M9 12.75L11.25 15 15 9.75"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3l7.5 4.5v5.25c0 4.25-3.25 7.5-7.5 8.25-4.25-.75-7.5-4-7.5-8.25V7.5L12 3z"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Fair & Secure Election
                      </p>
                      <p className="mt-1 text-xs leading-5 text-purple-100">
                        Every student's vote matters. Please verify all student,
                        candidate, and election details prior to submission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* =====================================================
              RIGHT ACTION SECTION
          ===================================================== */}
          <div className="p-6 sm:p-10 lg:col-span-3 lg:p-12">

            {/* HEADER */}
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-wider text-violet-600">
                SZABIST ZAB-ed LRK
              </p>

              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                Students Council
                <br />
                <span className="text-violet-600">
                  Election 2026–27
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-500">
                Welcome to the official Students Council Election portal.
                Choose an option below to register voters, nominate candidates,
                or view election records and results.
              </p>
            </div>

            {/* ACTION CARDS */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* 1. REGISTER STUDENT */}
              <button
                type="button"
                onClick={() => navigate("/registerstudent")}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-50 transition duration-300 group-hover:scale-125" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition duration-300 group-hover:bg-violet-600 group-hover:text-white">
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25v4.5M21.75 10.5h-4.5"
                        />
                      </svg>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition duration-300 group-hover:bg-violet-100 group-hover:text-violet-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
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
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    Register Student
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Register a student voter for the election with their class,
                    section, and assigned vote number.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-violet-600">
                    Register Student
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </button>

              {/* 2. REGISTER CANDIDATE */}
              <button
                type="button"
                onClick={() => navigate("/candidateregister")}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/70"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-50 transition duration-300 group-hover:scale-125" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition duration-300 group-hover:bg-indigo-600 group-hover:text-white">
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
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.486-.425.878-.852.623l-4.771-2.861a.563.563 0 00-.58 0l-4.771 2.861c-.427.255-.968-.137-.852-.623l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition duration-300 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
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
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    Register Candidate
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Nominate a candidate running for Students Council positions,
                    assigning their portfolio and details.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                    Register Candidate
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </button>

              {/* 3. ELECTION RECORDS & RESULTS */}
              <button
                type="button"
                onClick={() => navigate("/results")}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/70 sm:col-span-2 lg:col-span-2"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-50 transition duration-300 group-hover:scale-125" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white">
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
                          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                        />
                      </svg>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
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
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    Election Records & Results
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Access registered student records, check candidate logs,
                    and review real-time or final election vote tallies.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    View Records & Results
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </button>

            </div>

            {/* IMPORTANT INFORMATION */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
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
                      d="M12 16.5v-4.25m0-3.5h.008"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Important Notice
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Ensure all student and candidate entries are accurate before submission. Registrations and election tallies update in real time in accordance with school policies.
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400 sm:flex-row">
              <span className="font-medium">
                SZABIST ZAB-ed LRK
              </span>
              <span>
                Students Council Election 2026–27
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;