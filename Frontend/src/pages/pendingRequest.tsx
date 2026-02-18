import React from "react";

type PendingApprovalPageProps = {
  role?: "donor" | "hospital" | "admin";
  email?: string;
};

const PendingApprovalPage: React.FC<PendingApprovalPageProps> = ({
  role = "donor",
  email,
}) => {
  const roleLabel =
    role === "hospital" ? "Hospital" : role === "admin" ? "Admin" : "Donor";

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute -top-32 left-10 h-96 w-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 h-96 w-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur">

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl text-2xl border border-white/10">
            ⏳
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Your request is pending
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {roleLabel} account verification is not completed yet.
            </p>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400/10 text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-semibold">
                Pending Approval
              </span>
              {email && (
                <span className="text-xs text-slate-400">
                  • {email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-5 bg-white/5 border border-white/10 rounded-xl p-4 text-sm">
          <h2 className="font-semibold">What happens next?</h2>
          <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-300">
            <li>An admin will review your registration details.</li>
            <li>Once approved, you can log in and access your dashboard.</li>
            <li>If information is missing, we’ll contact you via email.</li>
          </ul>
        </div>

        {/* Notice */}
        <div className="mt-4 bg-sky-400/10 border border-sky-300/20 rounded-xl p-4 text-sm">
          <span className="font-semibold">Tip:</span> Try again later. If it
          takes too long, contact support.
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-3 flex-wrap">
          <button className="bg-white text-slate-950 font-semibold px-4 py-2 rounded-xl hover:bg-gray-200 transition">
            Back to Login
          </button>

          <button className="border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/10 transition">
            Contact Support
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Status: <code className="bg-white/10 px-2 py-0.5 rounded-lg">
            isVerified = false
          </code>
        </p>

      </div>
    </div>
  );
};

export default PendingApprovalPage;
