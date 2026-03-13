import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUp,
  Brain,
  Briefcase,
  Building,
  Building2,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  MapPin,
  Menu,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Store,
  Users,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import api from "../../api/axios";
import AppDialog from "../../components/AppDialog";
import logo from "../../assets/img/logo.png";
import playIcon from "../../assets/img/google-play.png";
import appleIcon from "../../assets/img/apple-logo.png";
import fsm1 from "../../assets/img/fsm1.jpg";
import fsm2 from "../../assets/img/fsm2.jpg";
import fsm3 from "../../assets/img/fsm3.jpg";
import fsmWeb1 from "../../assets/img/fsmweb1.png";
import fsmWeb2 from "../../assets/img/fsmweb2.png";
import fsmWeb3 from "../../assets/img/fsmweb3.png";
import "./LandingPage.css";

type CardItem = {
  title: string;
  desc: string;
  icon: LucideIcon;
};

type SlideItem = {
  type: "mobile" | "web";
  src: string;
  alt: string;
};

type PlanItem = {
  name: string;
  features: string[];
  icon: LucideIcon;
  highlighted?: boolean;
};

type DemoForm = {
  name: string;
  mobileNo: string;
  email: string;
  organization: string;
  noOfEmployees: string;
  locationCity: string;
  locationState: string;
};

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
  { label: "Privacy", to: "/policy" },
  { label: "Terms", to: "/terms" },
  { label: "Refund", to: "/refund-policy" },
  { label: "Data Security", to: "/data-security" },
];

const featureItems: CardItem[] = [
  { title: "AI Dispatching", desc: "Auto assign work by location and technician load.", icon: Brain },
  { title: "Live Field Tracking", desc: "Track every visit in real time.", icon: MapPin },
  { title: "Payments and Invoices", desc: "Move from quote to paid invoice quickly.", icon: CreditCard },
  { title: "Service Reliability", desc: "AMC reminders and task checklists.", icon: ShieldCheck },
];

const moduleItems: CardItem[] = [
  { title: "Lead to Job Pipeline", desc: "Clean ownership from enquiry to completion.", icon: Zap },
  { title: "Smart Assignment", desc: "Match technicians by route, skills, and availability.", icon: Users },
  { title: "Visit Execution", desc: "Checklist based updates from the field app.", icon: ClipboardCheck },
  { title: "Billing Control", desc: "Quotations, invoices, and collections under one ledger.", icon: Receipt },
  { title: "AMC Management", desc: "Contract timelines, reminders, and renewal visibility.", icon: CalendarCheck },
  { title: "Inventory Visibility", desc: "Branch wise parts visibility before site visits.", icon: Briefcase },
];

const industryItems = [
  { label: "Appliance repair", icon: Wrench },
  { label: "Medical equipment service", icon: Stethoscope },
  { label: "Electrical maintenance", icon: Zap },
  { label: "Facility management", icon: Building },
];

const whoUsesItems: CardItem[] = [
  { title: "Service Franchises", desc: "Standardise operations across multiple locations.", icon: Store },
  { title: "Maintenance Vendors", desc: "Track technicians and requests in real time.", icon: Wrench },
  { title: "Enterprise Ops", desc: "Manage large scale service operations efficiently.", icon: Building2 },
  { title: "Growing Teams", desc: "Scale field operations with automation and visibility.", icon: Users },
];

const planItems: PlanItem[] = [
  {
    name: "Starter",
    icon: Zap,
    features: ["Up to 5 technicians", "Job scheduling", "Invoicing tools", "Mobile app access"],
  },
  {
    name: "Growth",
    icon: Briefcase,
    highlighted: true,
    features: ["Up to 25 technicians", "Smart job assignment", "Inventory tracking", "Advanced analytics"],
  },
  {
    name: "Enterprise",
    icon: Building2,
    features: ["Unlimited technicians", "Dedicated support", "Custom integrations", "Enterprise security"],
  },
];

const faqItems = [
  {
    q: "Can GoField handle both mobile and web users?",
    a: "Yes. GoField supports both mobile technicians and web based admin dashboards.",
  },
  {
    q: "Can we track technicians in real time?",
    a: "Yes. Live technician tracking helps you monitor visits and job status instantly.",
  },
  {
    q: "Does GoField support invoice workflow?",
    a: "Yes. From quote to invoice, GoField helps automate billing and payments.",
  },
  {
    q: "Is GoField suitable for AMC service?",
    a: "Yes. AMC reminders, maintenance schedules, and service history are built in.",
  },
];

const stats = [
  { label: "Active Technicians", value: "128" },
  { label: "Jobs Today", value: "486" },
  { label: "Invoice Success", value: "98.4%" },
  { label: "Avg ETA", value: "22 min" },
];

const LandingPage = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [submittingDemo, setSubmittingDemo] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [demoErrors, setDemoErrors] = useState<Partial<Record<keyof DemoForm, string>>>({});
  const [demoForm, setDemoForm] = useState<DemoForm>({
    name: "",
    mobileNo: "",
    email: "",
    organization: "",
    noOfEmployees: "",
    locationCity: "",
    locationState: "",
  });

  const slides = useMemo<SlideItem[]>(
    () => [
      { type: "mobile", src: fsm1, alt: "GoField mobile screen 1" },
      { type: "mobile", src: fsm2, alt: "GoField mobile screen 2" },
      { type: "mobile", src: fsm3, alt: "GoField mobile screen 3" },
      { type: "web", src: fsmWeb1, alt: "GoField web screen 1" },
      { type: "web", src: fsmWeb2, alt: "GoField web screen 2" },
      { type: "web", src: fsmWeb3, alt: "GoField web screen 3" },
    ],
    []
  );

  const currentSlide = slides[slideIndex];

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("demo") === "1") {
      setShowDemoModal(true);
      window.history.replaceState(null, "", location.pathname + location.hash);
    }
  }, [location.pathname, location.search, location.hash]);

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const openDemo = () => {
    setShowDemoModal(true);
  };

  const closeDemo = () => {
    setShowDemoModal(false);
    setDemoErrors({});
  };

  const updateDemoField = (field: keyof DemoForm, value: string) => {
    setDemoForm((prev) => ({ ...prev, [field]: value }));
    setDemoErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateDemoForm = () => {
    const errors: Partial<Record<keyof DemoForm, string>> = {};

    if (!demoForm.name.trim()) errors.name = "Name is required";
    if (!/^\d{10}$/.test(demoForm.mobileNo.trim())) errors.mobileNo = "Mobile number must be 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demoForm.email.trim())) errors.email = "Enter a valid email";
    if (!demoForm.organization.trim()) errors.organization = "Organization is required";
    if (!demoForm.noOfEmployees.trim()) errors.noOfEmployees = "No of employees is required";
    if (!demoForm.locationCity.trim()) errors.locationCity = "City is required";
    if (!demoForm.locationState.trim()) errors.locationState = "State is required";

    setDemoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitDemo = async () => {
    if (!validateDemoForm() || submittingDemo) {
      return;
    }

    try {
      setSubmittingDemo(true);
      await api.post("api/unknown/book-demo", {
        name: demoForm.name.trim(),
        mobileNo: demoForm.mobileNo.trim(),
        email: demoForm.email.trim(),
        organization: demoForm.organization.trim(),
        noOfEmployees: demoForm.noOfEmployees.trim(),
        locationCity: demoForm.locationCity.trim(),
        locationState: demoForm.locationState.trim(),
      });
      closeDemo();
      setDemoForm({
        name: "",
        mobileNo: "",
        email: "",
        organization: "",
        noOfEmployees: "",
        locationCity: "",
        locationState: "",
      });
      setDialogMessage("Demo request submitted successfully.");
    } catch {
      setDialogMessage("Unable to submit demo request right now.");
    } finally {
      setSubmittingDemo(false);
    }
  };

  const renderActionButtons = (mobile = false): ReactNode => (
    <div className="nav-buttons">
      <Link className="btn-ghost" to="/login" onClick={() => mobile && setMenuOpen(false)}>
        Login
      </Link>
      <button
        className="btn-ghost register-btn"
        onClick={() => {
          if (mobile) setMenuOpen(false);
          openDemo();
        }}
      >
        Register
      </button>
      <button
        className="btn-primary"
        onClick={() => {
          if (mobile) setMenuOpen(false);
          openDemo();
        }}
      >
        Book a Demo
      </button>
    </div>
  );

  return (
    <div className="landing-root">
      <header className="nav-bar">
        <div className="nav-content">
          <div className="brand">
            <img src={logo} alt="GoField logo" className="brand-logo" />
            <div>
              <h1>GoField</h1>
            </div>
          </div>

          <nav className="nav-links desktop-only">
            {navLinks.map((item) =>
              "href" in item ? (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.to}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="desktop-only">{renderActionButtons()}</div>

          <button className="menu-toggle" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            {navLinks.map((item) =>
              "href" in item ? (
                <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              )
            )}
            {renderActionButtons(true)}
          </div>
        )}
      </header>

      <section className="hero-section">
        <div className="hero-left">
          <span className="hero-badge">FIELD SERVICE MANAGEMENT PLATFORM</span>
          <h2>Modern operations for high-speed field teams.</h2>
          <p>
            GoField brings your complete service lifecycle into one system: <strong>Lead -&gt; Job -&gt; Technician
            Assignment -&gt; Quotation -&gt; Invoice -&gt; Payment.</strong> Access via mobile app for field users and a web
            portal for admins and owners.
          </p>

          <div className="hero-pills">
            <span>
              <Zap size={14} /> Smart dispatching
            </span>
            <span>
              <Receipt size={14} /> Instant invoicing
            </span>
            <span>
              <MapPin size={14} /> Live field visibility
            </span>
          </div>

          <div className="hero-actions">
            <Link className="btn-primary" to="/login">
              Start with Login
            </Link>
            <button className="btn-ghost register-btn" onClick={openDemo}>
              Register
            </button>
            <button className="btn-ghost" onClick={openDemo}>
              Book a Demo
            </button>
          </div>
        </div>

        <div className="hero-right">
          <article className="stats-card">
            <h3>Operations Snapshot</h3>
            <div className="stats-grid">
              {stats.map((item) => (
                <div key={item.label} className="stat-box">
                  <strong>{item.value}</strong>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="downloads-card">
            <p>Download the app from</p>
            <div>
              <a href="https://play.google.com/store" target="_blank" rel="noreferrer">
                <img src={playIcon} alt="Get it on Google Play" />
              </a>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer">
                <img src={appleIcon} alt="Download on the App Store" />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section-block">
        <h3>Stop managing work in chat threads and spreadsheets.</h3>
        <p>
          GoField is a field service platform for businesses running high-volume on-site work. Dispatch, field,
          finance, and leadership teams operate from a single real-time system.
        </p>
      </section>

      <section id="features" className="section-block">
        <h3>Everything your field operation needs</h3>
        <div className="grid-4">
          {featureItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="card">
                <div className="icon-box">
                  <Icon size={18} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <h3>Core modules businesses rely on daily</h3>
        <div className="grid-3">
          {moduleItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="card card-horizontal">
                <div className="icon-box">
                  <Icon size={18} />
                </div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <h3>Perfect for service-heavy industries</h3>
        <div className="chip-wrap">
          {industryItems.map((item) => {
            const Icon = item.icon;
            return (
              <span key={item.label} className="chip">
                <Icon size={14} /> {item.label}
              </span>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <h3>Who uses GoField</h3>
        <div className="grid-4">
          {whoUsesItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="card">
                <div className="icon-box">
                  <Icon size={18} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block mobile-showcase">
        <h3>Everything your team needs in their pocket</h3>
        <p>Native-like mobile and web experience for technicians and operations teams.</p>
        <div className="mobile-layout">
          <div className="carousel-wrap">
            <button className="carousel-btn" onClick={prevSlide} aria-label="Previous screen">
              <ChevronLeft size={16} />
            </button>
            <div className={currentSlide.type === "mobile" ? "preview-mobile" : "preview-web"}>
              <img src={currentSlide.src} alt={currentSlide.alt} />
            </div>
            <button className="carousel-btn" onClick={nextSlide} aria-label="Next screen">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="mobile-features">
            <article>
              <h4>Live Job Updates</h4>
              <p>Technicians receive assignments instantly.</p>
            </article>
            <article>
              <h4>Customer Details</h4>
              <p>Access location, notes, and service history.</p>
            </article>
            <article>
              <h4>On-site Updates</h4>
              <p>Upload notes and mark completion in real time.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="pricing" className="section-block">
        <h3>Pricing built for your team</h3>
        <div className="grid-3">
          {planItems.map((plan) => {
            const Icon = plan.icon;
            return (
              <article key={plan.name} className={`card pricing-card ${plan.highlighted ? "highlight" : ""}`}>
                <div className="icon-box">
                  <Icon size={18} />
                </div>
                <h4>{plan.name}</h4>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={14} /> {feature}
                    </li>
                  ))}
                </ul>
                <button className="btn-ghost" onClick={openDemo}>
                  Get Started
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section id="contact" className="section-block">
        <h3>Frequently asked questions</h3>
        <div className="faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <article key={item.q} className="faq-item">
                <button className="faq-btn" onClick={() => setOpenFaqIndex(isOpen ? null : index)}>
                  <span>{item.q}</span>
                  <ChevronDown size={16} className={isOpen ? "rotate" : ""} />
                </button>
                {isOpen && <p>{item.a}</p>}
              </article>
            );
          })}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <img src={logo} alt="GoField logo" className="brand-logo" />
              <div>
                <h3>GoField</h3>
              </div>
            </div>
            <p>
              Field service management platform for high-volume service teams. Run dispatch, field updates, billing,
              and reporting from one connected workflow.
            </p>
          </div>

          <div className="footer-links-grid">
            <section>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <button className="footer-link-btn" onClick={openDemo}>
                Book a demo
              </button>
              <Link to="/login">Login</Link>
              <button className="footer-link-btn" onClick={openDemo}>
                Register
              </button>
            </section>
            <section>
              <h4>Company</h4>
              <a href="#contact">Contact</a>
              <a href="mailto:mailus@napeans.com?subject=Careers%20at%20GoField">Careers</a>
              <a href="https://napeans.com" target="_blank" rel="noreferrer">
                Napeans Technologies
              </a>
            </section>
            <section>
              <h4>Legal</h4>
              <Link to="/policy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/refund-policy">Refund Policy</Link>
              <Link to="/data-security">Data Security</Link>
            </section>
            <section>
              <h4>Contact</h4>
              <a href="tel:+919384012319">+91 93840 12319</a>
              <a href="mailto:mailus@napeans.com">mailus@napeans.com</a>
              <a href="https://gofield.in" target="_blank" rel="noreferrer">
                gofield.in
              </a>
            </section>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright {new Date().getFullYear()} GoField. Built by Napeans Technologies.</p>
        </div>
      </footer>

      {showDemoModal && (
        <div className="demo-modal-overlay">
          <div className="demo-modal-card">
            <div className="demo-modal-header">
              <h3>Register</h3>
              <button onClick={closeDemo} aria-label="Close demo popup">
                <X size={18} />
              </button>
            </div>

            <div className="demo-modal-grid">
              <label>
                Name
                <input value={demoForm.name} onChange={(e) => updateDemoField("name", e.target.value)} />
                {demoErrors.name && <span>{demoErrors.name}</span>}
              </label>
              <label>
                MobileNo
                <input
                  value={demoForm.mobileNo}
                  maxLength={10}
                  onChange={(e) => updateDemoField("mobileNo", e.target.value.replace(/\\D/g, "").slice(0, 10))}
                />
                {demoErrors.mobileNo && <span>{demoErrors.mobileNo}</span>}
              </label>
              <label>
                Email
                <input value={demoForm.email} onChange={(e) => updateDemoField("email", e.target.value)} />
                {demoErrors.email && <span>{demoErrors.email}</span>}
              </label>
              <label>
                Organization
                <input value={demoForm.organization} onChange={(e) => updateDemoField("organization", e.target.value)} />
                {demoErrors.organization && <span>{demoErrors.organization}</span>}
              </label>
              <label>
                No of Employees
                <input
                  value={demoForm.noOfEmployees}
                  onChange={(e) => updateDemoField("noOfEmployees", e.target.value)}
                />
                {demoErrors.noOfEmployees && <span>{demoErrors.noOfEmployees}</span>}
              </label>
              <label>
                Location City
                <input value={demoForm.locationCity} onChange={(e) => updateDemoField("locationCity", e.target.value)} />
                {demoErrors.locationCity && <span>{demoErrors.locationCity}</span>}
              </label>
              <label>
                Location State
                <input value={demoForm.locationState} onChange={(e) => updateDemoField("locationState", e.target.value)} />
                {demoErrors.locationState && <span>{demoErrors.locationState}</span>}
              </label>
            </div>

            <div className="demo-modal-actions">
              <button className="btn-ghost" onClick={closeDemo}>
                Cancel
              </button>
              <button className="btn-primary" onClick={() => void submitDemo()} disabled={submittingDemo}>
                {submittingDemo ? "Submitting..." : "Book Demo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          aria-label="Scroll to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={16} />
        </button>
      )}

      <AppDialog
        open={Boolean(dialogMessage)}
        title="GoField"
        message={dialogMessage}
        mode="alert"
        onConfirm={() => setDialogMessage("")}
        onClose={() => setDialogMessage("")}
      />
    </div>
  );
};

export default LandingPage;
