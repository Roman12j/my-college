import { FormEvent, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { routedCourses } from "../data/coursePages";

type NavbarProps = { theme: "dark" | "light"; onThemeChange: (theme: "dark" | "light") => void };

export default function Navbar({ theme, onThemeChange }: NavbarProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const goToSection = (sectionId: string) => {
    navigate("/");
    window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };
  const toggleSearch = () => {
    setSearchOpen((open) => {
      if (open) setSearchTerm("");
      window.setTimeout(() => searchInput.current?.focus(), 0);
      return !open;
    });
  };
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;
    const course = routedCourses.find((item) => `${item.shortName} ${item.path}`.toLowerCase().includes(query));
    if (course) { navigate(course.path); setSearchTerm(""); setSearchOpen(false); return; }
    const section = [["academics", "academics"], ["course", "academics"], ["program", "academics"], ["syllabus", "syllabus"], ["fee", "fees"], ["campus", "campus"], ["faculty", "people"], ["people", "people"], ["contact", "contact"]].find(([keyword]) => keyword.includes(query) || query.includes(keyword));
    if (section) { goToSection(section[1]); setSearchTerm(""); setSearchOpen(false); }
  };

  return <header className="site-header">
    <button className="brand brand-button" type="button" onClick={() => goToSection("top")} aria-label="S. B. J. S. Rampuria Jain College home"><span className="brand-mark">R</span><span>S. B. J. S. Rampuria Jain College</span></button>
    <nav className="desktop-nav" aria-label="Primary navigation">
      <div className="nav-dropdown"><button className="nav-trigger" type="button" onClick={() => goToSection("academics")}>Academics</button><div className="nav-menu route-menu">{routedCourses.map((course) => <NavLink key={course.path} to={course.path}>{course.shortName}</NavLink>)}</div></div>
      <button type="button" onClick={() => goToSection("syllabus")}>Syllabus</button><button type="button" onClick={() => goToSection("fees")}>Fees</button><button type="button" onClick={() => goToSection("campus")}>Campus</button><button type="button" onClick={() => goToSection("people")}>Faculty</button><button type="button" onClick={() => goToSection("contact")}>Contact</button>
      <form className={`nav-search ${searchOpen ? "is-open" : ""}`} role="search" onSubmit={handleSearch}><label className="sr-only" htmlFor="site-search">Search the college website</label><input id="site-search" ref={searchInput} type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search the site" tabIndex={searchOpen ? 0 : -1} /><button type={searchOpen ? "submit" : "button"} onClick={searchOpen ? undefined : toggleSearch} aria-label={searchOpen ? "Search the college website" : "Open site search"} aria-expanded={searchOpen}><span className="search-icon" aria-hidden="true" /></button></form>
      <button className="nav-icon-button principal-login" type="button" onClick={() => navigate("/principal-login")} aria-label="Principal login" title="Principal login"><span aria-hidden="true">&#9819;</span></button>
      <button className="theme-switch" type="button" onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}><span className="theme-switch-track" aria-hidden="true"><span>{theme === "dark" ? "☾" : "☀"}</span></span><span className="theme-switch-label">{theme === "dark" ? "Dark" : "Light"}</span></button>
    </nav>
  </header>;
}
