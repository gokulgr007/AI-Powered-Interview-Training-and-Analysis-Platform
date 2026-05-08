import React from "react";
import DashboardLayout from "./DashboardLayout";
import { TrendingUp, FileText, Users } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout activeNav="dashboard">
      {/* MAIN CONTENT */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-semibold">Dashboard</h2>
            <p className="text-gray-600">
              Track your progress and prepare for your next big opportunity.
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm shadow">
            View Detailed Report
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard title="Overall Score" value="78%" icon={<TrendingUp />} />
          <StatCard title="Tests Taken" value="12" icon={<FileText />} />
          <StatCard title="Interviews" value="5" icon={<Users />} />
        </div>

        {/* READINESS */}
        <div className="bg-white rounded-2xl p-8 mb-10 shadow border border-black/10">
          <h3 className="text-xl font-semibold mb-6">Readiness Score</h3>
          <Progress label="Technical Skills" value={85} />
          <Progress label="Communication" value={65} />
          <Progress label="Problem Solving" value={92} />
        </div>

        {/* ACTION CARDS */}
        <div className="grid grid-cols-3 gap-6">
          <ActionCard
            title="Aptitude Test"
            desc="Sharpen your logical reasoning with adaptive tests"
          />
          <ActionCard
            title="Group Discussion"
            desc="Practice debating with AI driven simulations"
          />
          <ActionCard
            title="Resume Analysis"
            desc="Get ATS scores and improvement tips"
          />
        </div>
    </DashboardLayout>
  );
}

// ...existing code...


// Removed duplicate/broken StatCard definition

/* ================= COMPONENTS ================= */

function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
        active
          ? "bg-indigo-100 text-indigo-600"
          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 flex justify-between items-center border border-black/10 shadow">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-3xl font-semibold mt-2">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        {icon}
      </div>
    </div>
  );
}

function Progress({ label, value }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-700">{value}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ActionCard({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-black/10 shadow hover:border-indigo-600 transition">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
