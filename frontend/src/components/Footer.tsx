import type { College } from "../types";

export default function Footer({ college }: { college: College }) {
  return (
    <footer className="site-footer">
      <div className="footer-main" data-reveal>
        <p className="footer-kicker">Begin here. Go further.</p>
        <strong>{college.name}</strong>
        <p>Dauji Road, Bikaner, Rajasthan. A legacy campus for ambitious students and future professionals.</p>
        <div className="footer-actions">
          <a className="footer-button explore-academics" href="/#academics">
            Explore academics
          </a>
          <a className="footer-button outline" href="#top">
            Back to top
          </a>
        </div>
      </div>
      <div className="footer-side" data-reveal>
        <div className="footer-contact">
          <span>Call</span>
          <a href="tel:+919214241043">+91 9214241043</a>
        </div>
        <div className="footer-contact">
          <span>Email</span>
          <a href="mailto:bjsrjaincollege@gmail.com">bjsrjaincollege@gmail.com</a>
        </div>
        <div>
          <h3>Important links</h3>
          <div className="footer-links">
            {college.links.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
