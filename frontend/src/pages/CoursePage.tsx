import { Link, useLocation } from "react-router-dom";
import { routedCourses } from "../data/coursePages";

export default function CoursePage() {
  const location = useLocation();
  const course = routedCourses.find((item) => item.path === location.pathname) ?? routedCourses[0];

  return (
    <main className="course-page">
      <Link className="detail-back" to="/#academics">
        &lt; Back to academics
      </Link>
      <section className="course-page-hero hero-entrance">
        <p className="section-label">{course.type}</p>
        <h1>{course.title}</h1>
        <p>{course.summary}</p>
      </section>
      <section className="course-page-grid">
          <article data-reveal>
          <span>Duration</span>
          <strong>{course.duration}</strong>
        </article>
          <article data-reveal>
          <span>Fees</span>
          <strong>{course.fees}</strong>
        </article>
        {course.highlights.map((item) => (
          <article data-reveal key={item}>
            <span>Focus</span>
            <strong>{item}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
