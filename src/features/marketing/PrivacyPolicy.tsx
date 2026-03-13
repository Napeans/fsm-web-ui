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
        <p className="legal-meta">Effective date: March 13, 2026</p>

        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Thank you for visiting GoField (GoField.in), a software service product of{" "}
            <strong>Napeans Technologies</strong>. Napeans Technologies is a registered software services company with
            GST and MSME registrations and a DUNS number.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, process, disclose, and protect personal and business
            information through our website and platform services.
          </p>
          <p>
            <strong>Current service region:</strong> We currently provide services only within India, specifically
            Tamil Nadu.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Scope And Consent</h2>
          <p>
            By using GoField, submitting forms, or contacting us through electronic channels, you consent to
            collection and use of your data as described in this policy. If you share your contact details, we may
            communicate with you regarding product information and offers through call, SMS, email, or WhatsApp, as
            permitted by applicable law.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Personal Information We Collect</h2>
          <p>
            We may collect personal and business information such as name, email, mobile number, organization details,
            account credentials, job/service records, assignment details, invoice/payment data, and communication logs.
          </p>
          <p>
            Where relevant, this may include information submitted through forms, account registration, support
            requests, and operational use of the platform by our business customers.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Information Collected Automatically</h2>
          <p>
            We may automatically collect technical and usage data such as IP address, browser type, device data,
            session behavior, and interaction logs through cookies and similar technologies for security, analytics, and
            service improvement.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Data From Business Customers</h2>
          <p>
            When organizations use GoField to run operations, we may process end-customer or employee information on
            their behalf. In such cases, the organization remains the data controller and GoField acts as service
            provider/processor for the contracted scope.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. How We Use Information</h2>
          <p>
            We use collected information to provide and maintain services, support users, process requests, improve
            product experience, perform analytics, manage billing and operations, ensure platform security, and comply
            with legal obligations.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Communications</h2>
          <p>
            We may send transactional and service communications required for account and platform operations. We may
            also send product updates and offers, subject to applicable consent and opt-out mechanisms.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Sharing And Disclosure</h2>
          <p>
            We do not sell personal data. We may share data with trusted hosting, communication, payment, analytics,
            and support providers solely for business operations, and with authorities where disclosure is legally
            required.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Data Retention</h2>
          <p>
            We retain information only as long as needed for contracted services, legal compliance, dispute handling,
            and business continuity, after which data may be deleted or anonymized.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Data Security</h2>
          <p>
            We apply reasonable technical and organizational safeguards such as role-based access, authentication
            controls, monitoring, and secure processing practices to protect data from unauthorized access, loss, or
            misuse.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Your Rights And Choices</h2>
          <p>
            You may request access, correction, or deletion of your personal information, subject to contractual and
            legal requirements. Requests can be submitted through the contact details below.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Contact</h2>
          <p>
            For privacy or data protection queries, contact{" "}
            <a href="mailto:mailus@napeans.com">mailus@napeans.com</a>.
          </p>
        </section>
      </article>
    </div>
  );
};

export default PrivacyPolicy;
