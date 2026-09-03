
import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-5">

          {/* =====================================================
              LEFT HERO SECTION
          ===================================================== */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white sm:p-10 lg:col-span-2 lg:p-12">

            {/* Decorative circles */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10" />

            <div className="relative z-10 flex h-full flex-col justify-between">

              <div>
                {/* Logo */}
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l8 4.5v5.25c0 4.5-3.5 7.5-8 8.25-4.5-.75-8-3.75-8-8.25V7.5L12 3z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.5 12l2.25 2.25L15.5 9.5"
                    />
                  </svg>
                </div>

                <p className="text-sm font-semibold uppercase tracking-wider text-purple-100">
                  Student Election
                </p>

                <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                  Election
                  <br />
                  Portal
                </h1>

                <p className="mt-5 max-w-sm text-sm leading-6 text-purple-100">
                  A simple and secure platform for managing student
                  registration and casting votes during your election.
                </p>
              </div>

              {/* Bottom Info */}
              <div className="mt-12">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
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
                          d="M12 3l7.5 4.5v5.25c0 4.5-3.25 7.5-7.5 8.25-4.25-.75-7.5-3.75-7.5-8.25V7.5L12 3z"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Secure & Simple
                      </p>

                      <p className="mt-1 text-xs leading-5 text-purple-100">
                        Verify student information before allowing votes to
                        be cast.
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

            {/* Header */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-violet-600">
                Welcome
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                What would you like to do?
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Choose an option below to continue. You can register a new
                student or proceed directly to the voting process.
              </p>
            </div>

            {/* =================================================
                ACTION CARDS
            ================================================= */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Register Student */}
              <button
                type="button"
                onClick={() => navigate("/registerstudent")}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70"
              >
                {/* Background decoration */}
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
                    Add a new student to the election system with their
                    class, section and vote number.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-violet-600">
                    Continue
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                </div>
              </button>

              {/* Vote */}
              <button
                type="button"
                onClick={() => navigate("/vote")}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/70"
              >
                {/* Background decoration */}
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
                          d="M12 3l7.5 4.5v5.25c0 4.5-3.25 7.5-7.5 8.25-4.25-.75-7.5-3.75-7.5-8.25V7.5L12 3z"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.5 12l2.25 2.25L15.5 9.5"
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
                    Cast Your Vote
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Verify a student and securely select candidates for
                    each available election position.
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
                QUICK INFORMATION
            ================================================= */}
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
                    Important
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    If you are registering a new student, make sure their
                    vote number is unique and the information is accurate.
                  </p>
                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400 sm:flex-row">
              <span>Election Portal</span>
              <span>Secure • Simple • Reliable</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

