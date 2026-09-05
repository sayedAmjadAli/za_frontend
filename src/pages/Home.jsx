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

              {/* =================================================
                  BRANDING
              ================================================= */}
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

              {/* =================================================
                  BOTTOM INFORMATION
              ================================================= */}
              <div className="mt-12">

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-md">

                  <div className="flex items-start gap-3">

                    {/* Icon */}
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
                        Every student's vote matters. Please verify your
                        information before participating.
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

            {/* =================================================
                HEADER
            ================================================= */}
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
                Choose an option below to register a student or participate
                in the election.
              </p>

            </div>

            {/* =================================================
                ACTION CARDS
            ================================================= */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* =================================================
                  REGISTER STUDENT
              ================================================= */}
              <button
                type="button"
                onClick={() => navigate("/registerstudent")}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70"
              >

                {/* Background Decoration */}
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-50 transition duration-300 group-hover:scale-125" />

                <div className="relative z-10">

                  <div className="flex items-start justify-between">

                    {/* Icon */}
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

                    {/* Arrow */}
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
                    Register a student for the Students Council Election
                    with their class, section, and vote number.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-violet-600">

                    Continue

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>

                  </div>

                </div>

              </button>

              {/* =================================================
                  CAST VOTE
              ================================================= */}
              <button
                type="button"
                onClick={() => navigate("/vote")}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/70"
              >

                {/* Background Decoration */}
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-50 transition duration-300 group-hover:scale-125" />

                <div className="relative z-10">

                  <div className="flex items-start justify-between">

                    {/* Icon */}
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
                          d="M12 3l7.5 4.5v5.25c0 4.25-3.25 7.5-7.5 8.25-4.25-.75-7.5-4-7.5-8.25V7.5L12 3z"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.5 12l2.25 2.25L15.5 9.5"
                        />

                      </svg>

                    </div>

                    {/* Arrow */}
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
                    Cast Your Vote
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Verify your student information and securely vote for
                    your preferred Students Council candidates.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">

                    Start Voting

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>

                  </div>

                </div>

              </button>

            </div>

            {/* =================================================
                IMPORTANT INFORMATION
            ================================================= */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">

              <div className="flex items-start gap-3">

                {/* Info Icon */}
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
                    Important
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Please make sure your student information is accurate
                    before voting. Each student can cast their vote according
                    to the election rules.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}
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