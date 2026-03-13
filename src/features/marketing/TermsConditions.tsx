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
        <p className="legal-meta">Effective date: March 13, 2026</p>

        <section className="legal-section">
          <h2>1. Overview</h2>
          <p>
            Please read this Terms of Service agreement carefully. Napeans Technologies ("Napeans", "GoField", "we",
            "us", or "our") owns and operates GoField.in and related services, including web and mobile interfaces.
            These Terms apply to all users who access, use, or view content on the platform.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Registration of Accounts</h2>
          <h3>a. Accounts</h3>
          <p>
            To use the Service, you must create and maintain an account with accurate and complete information. You are
            responsible for activity under your account and for protecting account credentials. Any unauthorized access
            must be reported to us immediately.
          </p>
          <h3>b. Qualification</h3>
          <p>
            You must be of legal majority age in your jurisdiction and legally permitted to use the Service. By
            registering, you confirm your use complies with applicable laws.
          </p>
          <h3>c. Organizational Units</h3>
          <p>
            If you accept these Terms on behalf of a company, you represent that you are authorized to bind that
            entity. If affiliates use your account, you remain responsible for their use. Separate businesses may
            require separate licenses and agreements.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Support</h2>
          <p>
            Paying customers receive standard technical support according to the subscribed plan and any specific
            support agreement.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Fees and Payment</h2>
          <h3>a. General Payment Terms</h3>
          <p>
            Certain Service features are paid. Applicable charges and taxes are shown before purchase. Fees are
            generally non-refundable except where expressly agreed in writing.
          </p>
          <h3>b. Pricing</h3>
          <p>
            We may revise pricing with prior notice. Promotional pricing or features offered to specific customers do
            not automatically apply to all users.
          </p>
          <h3>c. Subscription Services</h3>
          <p>
            Subscription charges are billed on a recurring basis until cancellation. To avoid renewal charges, cancel
            before the next billing date.
          </p>
          <h3>d. Delinquent Accounts</h3>
          <p>
            We may suspend or terminate unpaid accounts. Collection and chargeback-related costs may be recoverable
            from the account holder, where applicable.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Service Scope</h2>
          <p>
            GoField provides field service workflow tooling including lead management, job creation, technician
            assignment, quotation, invoicing, payment handling, and operational tracking.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. User Responsibilities</h2>
          <p>
            Customers are responsible for lawful use, maintaining account credentials, and ensuring data entered into
            the system is accurate and authorized.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Term and Termination</h2>
          <h3>a. Term</h3>
          <p>
            This Agreement remains in effect for your subscription duration and may auto-renew as per your plan unless
            cancelled according to notice requirements in your commercial agreement.
          </p>
          <h3>b. Termination for Cause</h3>
          <p>
            We may suspend or terminate access for breach of Terms, security threats, malicious activity, unlawful use,
            or behavior that degrades the Service.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Data and Security</h2>
          <p>
            Data handling and privacy practices are governed by the Privacy Policy and Data Security Policy published
            by GoField.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Limitation Of Liability</h2>
          <p>
            To the maximum extent permitted by law, Napeans Technologies shall not be liable for indirect, incidental,
            or consequential losses arising from use of the platform.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Governing Law and Region</h2>
          <p>
            These Terms are governed by applicable laws of India. At present, GoField operations are focused in India,
            Tamil Nadu, unless otherwise agreed in writing.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Contact</h2>
          <p>
            For legal queries, contact <a href="mailto:mailus@napeans.com">mailus@napeans.com</a>.
          </p>
        </section>
      </article>
    </div>
  );
};

export default TermsConditions;
