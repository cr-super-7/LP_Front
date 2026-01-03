"use client";

import { useTheme } from "../../contexts/ThemeContext";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import CoursesProperties from "./CoursesProperties";
import ContinueLearning from "./ContinueLearning";
import RecentlyAdded from "./RecentlyAdded";

export default function CoursesContent() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-blue-950" : "bg-gray-50"}`}>
      <Sidebar />
      <Navbar />
      <main className="ml-64 mt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <CoursesProperties />
          <ContinueLearning />
          <RecentlyAdded />
        </div>
      </main>
    </div>
  );
}

