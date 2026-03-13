import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
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

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderActionButtons = (mobile = false): ReactNode => (
    <div className="nav-buttons">
      <Link className="btn-ghost" to="/login" onClick={() => mobile && setMenuOpen(false)}>
        Login
      </Link>
      <a className="btn-primary" href="#contact" onClick={() => mobile && setMenuOpen(false)}>
        Book a Demo
      </a>
    </div>
  );

  return (
    <div className="landing-root">
      <header className="nav-bar">
        <div className="nav-content">
          <div className="brand">
            <img src={logo} alt="GoField logo" className="brand-logo" />
            <div>
              <p className="brand-kicker">GoField.in</p>
              <h1>GoField</h1>
            </div>
          </div>

          <nav className="nav-links desktop-only">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="desktop-only">{renderActionButtons()}</div>

          <button className="menu-toggle" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
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
            <a className="btn-ghost" href="#contact">
              Book a Demo
            </a>
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
                <button className="btn-ghost">Get Started</button>
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
        <p>(c) {new Date().getFullYear()} GoField. Built by Napeans Technologies.</p>
        <div>
          <Link to="/policy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/login">Login</Link>
          <a href="#contact">Book a demo</a>
          <a href="mailto:mailus@napeans.com?subject=Careers%20at%20GoField">Careers</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
