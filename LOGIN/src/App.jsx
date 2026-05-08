import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// Use the standalone Auth page for the /login route to avoid nested router conflicts
import Login from "./components/Login-Page/Login.jsx";
import AuthPage from "./components/Login-Page/pages/Auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./components/Login-Page/lib/queryClient";
import { Toaster } from "./components/Login-Page/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "./components/Login-Page/components/ui/tooltip";
import Home from "./components/Home";
import ResumeApp from "./components/resume-builder/resume-app.jsx";
import Quiz from './components/Quiz/Quiz'
import ResumeAnalyzer from "./components/Resume-Analyzer/ResumeAnalyzer";
import DashboardLayout from "./components/DashboardLayout";
import ProblemsPage from "./components/technical-iterview/ProblemsPage.jsx";
import ProblemPage from "./components/technical-iterview/ProblemPage";
import MainInterface from "./components/main-interface/MainInterface.jsx";
import TechnicalInterviewStarter from "./components/tecstarter/tecstarter/src/TechnicalInterviewStarter.jsx";
import DashboardMain from "./components/Dashboard-ui/DashboardMain.jsx";
import GD from "./components/gd--final/App.jsx";
import GDLobby from "./components/gd--final/GDLobby.jsx"
import HRI from "./components/hr_interview/HRI";
import MockInterview from "./components/MockInterview/MockInterview";
import SettingsHub from "./components/Dashboard-ui/Profile.jsx";
import SettingsModule from "./components/Dashboard-ui/Settings.jsx";
import MentorModule from "./components/Dashboard-ui/InterviewMentor.jsx";
import HRInterviewModule from './components/hr_interview/App.jsx';
import CompanySimulation from './components/company-sim/CompanySimulation.jsx';
import Report from './components/company-sim/Report.jsx';
import SkillRoadmap from './components/skill-roadmap/SkillRoadmap.jsx';
import ReadinessRadar from './components/readiness-radar/ReadinessRadar.jsx';
import JourneyTimeline from './components/journey-timeline/JourneyTimeline.jsx';
import PerformanceReport from './components/performance-report/PerformanceReport.jsx';
import CodingIntelligence from './components/coding-intelligence/CodingIntelligence.jsx';


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <HotToaster />
        <Routes>
          <Route path="/" element={<MainInterface />} />
          <Route path="/login" element={<AuthPage />} />
      {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/home" element={<DashboardLayout activeNav="dashboard"><DashboardMain /></DashboardLayout>} />
      <Route
          path="/quiz"
          element={
            <DashboardLayout activeNav="Aptitude Test">
              <Quiz />
            </DashboardLayout>
          }
        />
      <Route
          path="/resume-analyzer"
          element={
            <DashboardLayout activeNav="resume">
              <ResumeAnalyzer />
            </DashboardLayout>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <DashboardLayout activeNav="Mock Interview">
              <MockInterview />
            </DashboardLayout>
          }
        />
        <Route
          path="/group-discussion"
          element={<GD/>}
        />

        <Route
          path="/Group-Discussion-Lobby"
          element={
            <DashboardLayout activeNav="Group Discussion">
              <GDLobby />
            </DashboardLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <DashboardLayout activeNav="dashboard">
              <SettingsHub />
            </DashboardLayout>
          }
        />

        <Route
          path="/interview-mentor"
          element={
            <DashboardLayout activeNav="Interview Mentor">
              <MentorModule />
            </DashboardLayout>
          }
        />

        <Route
          path="/company-sim"
          element={
            <DashboardLayout activeNav="Company Simulation">
              <CompanySimulation />
            </DashboardLayout>
          }
        />

        <Route
          path="/detailed-report"
          element={
            <DashboardLayout activeNav="Company Simulation">
              <Report />
            </DashboardLayout>
          }
        />

        <Route
          path="/skill-roadmap"
          element={
            <DashboardLayout activeNav="Skill Roadmap">
              <SkillRoadmap />
            </DashboardLayout>
          }
        />

        <Route
          path="/readiness-radar"
          element={
            <DashboardLayout activeNav="Readiness Radar">
              <ReadinessRadar />
            </DashboardLayout>
          }
        />

        <Route
          path="/journey-timeline"
          element={
            <DashboardLayout activeNav="Journey Timeline">
              <JourneyTimeline />
            </DashboardLayout>
          }
        />


        <Route
          path="/performance-report"
          element={
            <DashboardLayout activeNav="Performance Report">
              <PerformanceReport />
            </DashboardLayout>
          }
        />

        <Route
          path="/coding-intelligence"
          element={
            <DashboardLayout activeNav="Coding Intelligence">
              <CodingIntelligence />
            </DashboardLayout>
          }
        />


        <Route
          path="/settings"
          element={
            <DashboardLayout activeNav="settings">
              <SettingsModule />
            </DashboardLayout>
          }
        />

      {/* Redirect old /app to resume builder */}
      <Route path="/app" element={<Navigate to="/resume-builder/app" replace />} />
        
      {/* Resume Builder */}
      <Route path="/resume-builder/*" element={<ResumeApp />} />
      <Route path="/technical-interview" element={<ProblemsPage />} />
        {/* Preserve legacy /live and /report URLs by redirecting to the HR Interview nested routes */}
        <Route path="/live" element={<Navigate to="/hr-interview/live" replace />} />
        <Route path="/report" element={<Navigate to="/hr-interview/report" replace />} />
        {/* HR Interview nested routes */}
        <Route
          path="/hr-interview/*"
          element={
            <DashboardLayout activeNav="F-D Interview">
              <HRI />
            </DashboardLayout>
          }
        />
      <Route path="/problem/:id" element={<ProblemPage />} />
      <Route
        path="/technical-interview-main"
        element={
          <DashboardLayout activeNav="technical">
            <TechnicalInterviewStarter base="/technical-interview-main" />
          </DashboardLayout>
        }
      />

        </Routes>
      </TooltipProvider>
    </QueryClientProvider>

    
  );
};

export default App;
