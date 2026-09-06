import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { College } from "../types";

export default function HomePage({ college }: { college: College }) {
  const [openCourse, setOpenCourse] = useState<number | null>(null);
  const [selectedSyllabus, setSelectedSyllabus] = useState(0);
  const [selectedFees, setSelectedFees] = useState(0);
  const navigate = useNavigate();

  return (
    <main id="top">
      <section className="hero">
        <div className="hero-art" aria-hidden="true">
          <div className="arch arch-one" />
          <div className="arch arch-two" />
          <div className="sun-disc" />
        </div>
        <div className="hero-content hero-entrance">
          <p className="eyebrow">{college.kicker}</p>
          <h1>{college.name}</h1>
          <p className="hero-copy">{college.summary}</p>
          <div className="hero-actions">
            <a className="button primary" href="#academics">
              Explore programs
            </a>
            <a className="button ghost" href="#contact">
              Apply now
            </a>
          </div>
        </div>
      </section>

      <section className="intro section-grid" data-reveal>
        <div>
          <p className="section-label">About Rampuria</p>
          <h2>A legacy college redesigned with a bold university presence.</h2>
        </div>
        <div>
          <p>{college.about.join(" ")}</p>
          <ul className="highlight-list">
            {college.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="stats-band" aria-label="College statistics">
        {college.stats.map((stat) => (
          <article className="stat" data-reveal key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="academics" id="academics">
        <div className="section-heading" data-reveal>
          <p className="section-label">Academics</p>
          <h2>Programs shaped for professional growth.</h2>
        </div>
        <div className="course-grid equal-course-grid">
          {college.courses.map((course, index) => (
            <article className={`course-card ${openCourse === index ? "expanded" : ""}`} data-reveal key={course.title}>
              <div className="course-topline">
                <span>{course.type}</span>
                <button
                  className="course-arrow"
                  type="button"
                  aria-label={`Open ${course.title} details`}
                  onClick={() => navigate(course.route)}
                >
                  &rarr;
                </button>
              </div>
              <h3>{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <blockquote>{course.quote}</blockquote>
              {course.route === "/ba" && (
                <div className="course-actions" aria-label="Arts course options">
                  <button type="button" onClick={() => navigate("/ba")}>Explore BA</button>
                  <button type="button" onClick={() => navigate("/ma")}>Explore MA</button>
                </div>
              )}
              {openCourse === index && (
                <div className="course-details">
                  <dl>
                    <div>
                      <dt>Duration</dt>
                      <dd>{course.duration}</dd>
                    </div>
                    <div>
                      <dt>Fees</dt>
                      <dd>{course.fees}</dd>
                    </div>
                    <div>
                      <dt>Focus</dt>
                      <dd>{course.focus}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="syllabus-section" id="syllabus">
        <div className="section-panel" data-reveal>
          <div className="section-heading">
            <p className="section-label">Syllabus</p>
            <h2>Course syllabus library.</h2>
            <p>Select a course to preview its syllabus PDF without leaving the page.</p>
          </div>
          <div className="spa-layout">
            <div className="spa-tabs">
              {college.courses.map((course, index) => (
                <button
                  className={selectedSyllabus === index ? "active" : ""}
                  type="button"
                  key={course.title}
                  onClick={() => setSelectedSyllabus(index)}
                >
                  {course.title}
                </button>
              ))}
            </div>
            <div className="pdf-viewer">
              <p className="viewer-label">Selected syllabus</p>
              <h3>{college.courses[selectedSyllabus].title}</h3>
              <iframe src={`${college.courses[selectedSyllabus].syllabus_pdf}#view=FitH`} title="Syllabus PDF preview" />
            </div>
          </div>
        </div>
      </section>

      <section className="fees-section" id="fees">
        <div className="section-panel" data-reveal>
          <div className="section-heading">
            <p className="section-label">Fees</p>
            <h2>Fee structure by course.</h2>
            <p>Current amount for every stream is 25k/year.</p>
          </div>
          <div className="spa-layout fees-layout">
            <div className="spa-tabs">
              {college.courses.map((course, index) => (
                <button
                  className={selectedFees === index ? "active" : ""}
                  type="button"
                  key={course.title}
                  onClick={() => setSelectedFees(index)}
                >
                  {course.title}
                </button>
              ))}
            </div>
            <div className="fees-viewer">
              <p className="viewer-label">Selected fee</p>
              <h3>{college.courses[selectedFees].title}</h3>
              <strong>{college.courses[selectedFees].fees}</strong>
              <p>{college.courses[selectedFees].type} stream. Annual fee for the selected course.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-band" id="campus">
        <div className="feature-copy" data-reveal>
          <p className="section-label">Campus life</p>
          <h2>Where classroom discipline meets friendship, creativity, and confidence.</h2>
          <p>The campus experience emphasizes practical learning, cultural participation, sports, workshops, seminars, and shared student energy.</p>
        </div>
        <div className="campus-panels">
          {college.campus_life.map((item, index) => (
            <Link className="campus-card" data-reveal key={item.title} to={`/campus/${index + 1}#campus-details`} aria-label={`Open ${item.title} details`}>
              <span className="campus-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <span className="campus-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="people" id="people">
        <div className="section-heading" data-reveal>
          <p className="section-label">Mentors and alumni</p>
          <h2>Faculty guidance, alumni stories, and a network beyond Bikaner.</h2>
        </div>
        <div className="split">
          <div>
            <h3>Mentors</h3>
            <div className="person-list">
              {college.faculty.map((person) => (
                <article className="person-card" data-reveal key={person.name}>
                  <h4>{person.name}</h4>
                  <p>{person.role}</p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h3>Alumni voices</h3>
            <div className="quote-list">
              {college.alumni.map((person) => (
                <article className="quote-card" data-reveal key={person.name}>
                  <p>&ldquo;{person.quote}&rdquo;</p>
                  <strong>{person.name}</strong>
                  <span>{person.role}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-heading" data-reveal>
          <p className="section-label">Contact</p>
          <h2>Reach the college campuses.</h2>
        </div>
        <div className="contact-grid">
          {college.contacts.map((contact) => (
            <article className="contact-card" data-reveal key={contact.campus}>
              <h3>{contact.campus}</h3>
              <p>{contact.address}</p>
              <a href={`tel:${contact.phone.replaceAll(" ", "")}`}>{contact.phone}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
