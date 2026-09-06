import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CampusDetailPage from "./pages/CampusDetailPage";
import CoursePage from "./pages/CoursePage";
import HomePage from "./pages/HomePage";
import PrincipalDashboardPage from "./pages/PrincipalDashboardPage";
import PrincipalLoginPage from "./pages/PrincipalLoginPage";
import { routedCourses } from "./data/coursePages";
import type { College } from "./types";

const fallbackCollege: College = {
  name: "S. B. J. S. Rampuria Jain College",
  kicker: "Knowledge meets innovation",
  summary:
    "Established in 1934 as one of Bikaner's oldest institutions of higher learning, SBJS Rampuria Jain College carries a legacy of quality education.",
  about: [
    "The college combines academic rigor, practical learning, cultural life, and professional preparation for students in Bikaner.",
  ],
  highlights: ["AICTE-approved MBA since 1984", "Strong alumni base", "Digital learning resources"],
  stats: [
    { value: "50,000+", label: "Undergraduate and graduate enrollments" },
    { value: "150+", label: "Dedicated staff serving students and society" },
    { value: "40,000+", label: "SBJSR Jain College alumni worldwide" },
    { value: "60,000+", label: "Books, e-books, journals, and dailies" },
  ],
  courses: [
    {
      title: "Business Administration, MBA",
      type: "Postgraduate",
      description: "A management program focused on leadership, enterprise, analytics, and industry practice.",
      duration: "2 years",
      fees: "25k/year",
      route: "/mba",
      syllabus_pdf: "assets/syllabus/mba.pdf",
      focus: "Leadership, finance, marketing, strategy, entrepreneurship, and management analytics.",
      why_choose: ["Business-focused learning", "Industry conversations", "Professional confidence"],
      quote: "Choose MBA here if you want your ambition to become practical and ready for the real business world.",
    },
  ],
  campus_life: [
    {
      title: "Pulse of Campus",
      description: "Ideas find their voice and friendships are formed through shared pursuit of knowledge.",
      details: ["Classroom conversations, seminars, and daily student life create the pulse of campus."],
    },
  ],
  faculty: [],
  alumni: [],
  contacts: [],
  links: [],
};

export default function App() {
  const location = useLocation();
  const [college, setCollege] = useState<College>(fallbackCollege);
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("college-theme") as "dark" | "light" | null) ?? "dark",
  );

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("college-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetch("/api/college")
      .then((response) => response.json())
      .then((data: College) => setCollege(data))
      .catch(() => setCollege(fallbackCollege));
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = () => document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (reducedMotion) {
      revealItems().forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.toggle("is-visible", entry.isIntersecting);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px" },
    );

    const observeItems = () => revealItems().forEach((item) => observer.observe(item));
    observeItems();
    const mutationObserver = new MutationObserver(observeItems);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const scrollToDestination = () => {
      const targetId = location.hash.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;

      if (target) {
        target.scrollIntoView({ block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0 });
      }
    };

    const frame = window.requestAnimationFrame(scrollToDestination);
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  return (
    <>
      <Navbar theme={theme} onThemeChange={setTheme} />
      <Routes>
        <Route path="/" element={<HomePage college={college} />} />
        <Route path="/principal-login" element={<PrincipalLoginPage />} />
        <Route path="/principal-dashboard" element={<PrincipalDashboardPage />} />
        <Route path="/campus/:id" element={<CampusDetailPage college={college} />} />
        {routedCourses.map((course) => (
          <Route key={course.path} path={course.path} element={<CoursePage />} />
        ))}
      </Routes>
      <Footer college={college} />
    </>
  );
}
