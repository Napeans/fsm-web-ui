import { Link } from "react-router-dom";
import "./LegalPages.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <article className="legal-wrap">
        <div className="legal-headline">
          <h1>Privacy Policy</h1>
          <Link to="/">Back to GoField</Link>
        </div>
        <p className="legal-meta">Effective date: March 9, 2026</p>

        <section className="legal-section">
          <h2>1. About</h2>
          <p>
            This Privacy Policy describes how GoField (GoField.in), a product by Napeans Technologies, collects and
            uses information for service operations and support.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Data We Collect</h2>
          <p>
            We may collect account details, lead and job records, technician assignment data, location and battery
            telemetry, invoice/payment data, and communication logs required to provide field service workflows.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Use Of Data</h2>
          <p>
            Data is used to operate dispatch workflows, provide product features, monitor service quality, secure the
            platform, and improve user experience.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Security</h2>
          <p>
            We apply reasonable technical and organizational safeguards. Access is restricted to authorized personnel
            and controlled through authentication and role-based controls.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Contact</h2>
          <p>
            For privacy inquiries, contact{" "}
            <a href="mailto:contact@gofield.in">contact@gofield.in</a>.
          </p>
        </section>
      </article>
    </div>
  );
};

export default PrivacyPolicy;
