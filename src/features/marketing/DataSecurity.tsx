import { Link } from "react-router-dom";
import "./LegalPages.css";

const DataSecurity = () => {
  return (
    <div className="legal-page">
      <article className="legal-wrap">
        <div className="legal-headline">
          <h1>Data Security Policy</h1>
          <Link to="/">Back to GoField</Link>
        </div>
        <p className="legal-meta">Effective date: March 13, 2026</p>

        <section className="legal-section">
          <h2>1. Security Commitment</h2>
          <p>
            GoField takes the security of customer data seriously. We maintain administrative, technical, and
            operational safeguards to protect the platform and associated services.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Platform and Hosting</h2>
          <p>
            Our current application stack is hosted on Windows VPS infrastructure and built using ASP.NET Web API with
            SSL/TLS enabled for secure communication.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Access Control and Logging</h2>
          <p>
            Access to production systems and customer data is restricted to authorized personnel based on role and
            business need. Security-relevant access and events are logged for monitoring and investigation.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Security Practices</h2>
          <p>
            We use secure coding practices, controlled deployment, patching, backup routines, and vulnerability checks
            to reduce security risks and improve service resilience.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Network and Transmission Security</h2>
          <p>
            Data in transit between users and GoField services is protected using SSL/TLS. Network controls and
            monitoring are applied to detect suspicious access patterns.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Backup and Continuity</h2>
          <p>
            We maintain periodic backups and operational recovery procedures to support continuity and reduce downtime
            risk.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Incident Management</h2>
          <p>
            Security incidents are handled through defined response procedures. Where required by law or contract,
            affected customers are informed within a reasonable time.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Data Deletion and Retention</h2>
          <p>
            Customer data retention and deletion follow contractual obligations, legal requirements, and internal
            retention standards. Deletion requests are processed as per policy and applicable law.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Shared Responsibility</h2>
          <p>
            Security is a shared responsibility between GoField and customers. Customers are responsible for proper user
            access management, credential protection, and lawful use of the platform.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Company Profile and Region</h2>
          <p>
            GoField is operated by Napeans Technologies, a registered software services company with GST and MSME
            registrations and a DUNS number. Current operations are focused in India, Tamil Nadu.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Contact</h2>
          <p>
            For data security or compliance queries, contact <a href="mailto:mailus@napeans.com">mailus@napeans.com</a>.
          </p>
        </section>
      </article>
    </div>
  );
};

export default DataSecurity;
