import { Link } from "react-router-dom";
import "./LegalPages.css";

const RefundPolicy = () => {
  return (
    <div className="legal-page">
      <article className="legal-wrap">
        <div className="legal-headline">
          <h1>Refund Policy</h1>
          <Link to="/">Back to GoField</Link>
        </div>
        <p className="legal-meta">Effective date: March 13, 2026</p>

        <section className="legal-section">
          <h2>1. Overview</h2>
          <p>
            Napeans Technologies ("GoField", "we", "us", or "our") provides software to manage field service
            operations such as customers, vendors, attendance, sales, billing, and service workflows.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Eligible Refund Scenarios</h2>
          <p>
            Refunds may be requested only in the following situations:
          </p>
          <ul>
            <li>Payment was charged again after valid cancellation.</li>
            <li>GoField services were inaccessible due to technical issues for 3 consecutive days.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Review and Processing Timelines</h2>
          <p>
            Refund review typically takes 8 to 10 days. Once approved, refund credit generally takes 5 to 10 business
            days to reflect in the original payment method.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Fees and Payments</h2>
          <p>
            By subscribing to GoField, you agree to pay the initial and recurring charges as per your subscribed plan.
            Billing may be monthly or annual based on plan terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Cancellation Policy</h2>
          <p>
            We do not provide refunds or credits for cancellations made before the end of the active billing cycle or
            term, unless covered under eligible refund scenarios listed above.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Upgrades</h2>
          <p>
            If a plan is upgraded during an active term, applicable additional charges are billed for the remainder of
            that term.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Taxes</h2>
          <p>
            Fees are exclusive of applicable taxes, duties, levies, and other statutory charges unless explicitly
            stated. Customers are responsible for applicable taxes under law.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Personal Information Note</h2>
          <p>
            We collect and process personal information required for service delivery and legal compliance. If required
            information is not provided, some services may not be available.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Contact</h2>
          <p>
            For billing or refund support, contact <a href="mailto:mailus@napeans.com">mailus@napeans.com</a>.
          </p>
        </section>
      </article>
    </div>
  );
};

export default RefundPolicy;
