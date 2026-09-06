import { Link, useParams } from "react-router-dom";
import type { College } from "../types";

export default function CampusDetailPage({ college }: { college: College }) {
  const { id } = useParams();
  const index = Math.max(Number(id ?? "1") - 1, 0);
  const item = college.campus_life[index] ?? college.campus_life[0];
  const number = String(index + 1).padStart(2, "0");

  return (
    <main className="campus-detail-page">
      <Link className="detail-back" to="/#campus">
        &lt; Back to Campus
      </Link>
      <section className="campus-detail-hero hero-entrance">
        <p className="section-label">Campus life</p>
        <span>{number}</span>
        <h1>{item.title}</h1>
        <p>{item.subtitle ?? item.description}</p>
      </section>
      <section className="campus-detail-content" id="campus-details">
        {item.details.map((paragraph) => (
          <p data-reveal key={paragraph}>{paragraph}</p>
        ))}
      </section>
      {item.detail_cards && (
        <section className="campus-detail-cards">
          {item.detail_cards.map((card) => (
            <article data-reveal key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </section>
      )}
      {item.quote && <blockquote className="campus-detail-quote" data-reveal>{item.quote}</blockquote>}
    </main>
  );
}
