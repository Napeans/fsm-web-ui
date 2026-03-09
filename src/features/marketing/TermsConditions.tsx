import { Link } from "react-router-dom";
import "./LegalPages.css";

const TermsConditions = () => {
  return (
    <div className="legal-page">
      <article className="legal-wrap">
        <div className="legal-headline">
          <h1>Terms & Conditions</h1>
          <Link to="/">Back to GoField</Link>
        </div>
        <p className="legal-meta">Effective date: March 9, 2026</p>

        <section className="legal-section">
          <h2>1. Acceptance</h2>
          <p>
            By using GoField, you agree to these terms. If you do not agree, do not use the service.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Service Scope</h2>
          <p>
            GoField provides field service workflow tooling including lead management, job creation, technician
            assignment, quotation, invoicing, payment handling, and operational tracking.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. User Responsibilities</h2>
          <p>
            Customers are responsible for lawful use, maintaining account credentials, and ensuring data entered into
            the system is accurate and authorized.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Billing & Integrations</h2>
          <p>
            Paid plans, invoices, and third-party integration terms (including payment gateways) are governed by the
            commercial agreement signed with Napeans Technologies.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Contact</h2>
          <p>
            For legal queries, contact <a href="mailto:contact@gofield.in">contact@gofield.in</a>.
          </p>
        </section>
      </article>
    </div>
  );
};

export default TermsConditions;
