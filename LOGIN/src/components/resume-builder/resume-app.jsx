import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import { Toaster } from "react-hot-toast";

const ResumeApp = () => {
  return (
    <>
      <Toaster />
      <Routes>
        {/* /resume-builder → /resume-builder/app */}
        <Route index element={<Navigate to="app" replace />} />

        {/* /resume-builder/app */}
        <Route path="app" element={<Layout />}>
          {/* /resume-builder/app */}
          <Route index element={<Dashboard />} />

          {/* /resume-builder/app/builder/:resumeId */}
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        {/* /resume-builder/view/:resumeId */}
        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </>
  );
};

export default ResumeApp;
