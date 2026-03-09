import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Apple,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  ClipboardCheck,
  CloudSun,
  Cpu,
  CreditCard,
  Gem,
  LifeBuoy,
  MapPinned,
  Menu,
  Navigation,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import logo from "../../assets/img/logo.png";
import appShot1 from "../../assets/img/i1.jpeg";
import appShot2 from "../../assets/img/i2.jpeg";
import appShot3 from "../../assets/img/i3.jpeg";
import "./LandingPage.css";

type IconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const [activeWebSlide, setActiveWebSlide] = useState(0);

  const featureCards: IconCard[] = [
    {
      title: "AI Dispatching",
      description: "Auto-assign work by location, skill, and live technician load.",
      icon: Cpu,
    },
    {
      title: "Live Field Tracking",
      description: "Track every visit with real-time route visibility and status updates.",
      icon: Navigation,
    },
    {
      title: "Payments and Invoices",
      description: "Move from quote to paid invoice in one flow with fewer delays.",
      icon: Wallet,
    },
    {
      title: "Service Reliability",
      description: "AMC reminders and task checklists keep teams consistent every day.",
      icon: CalendarCheck2,
    },
  ];

  const industries = [
    "Appliance repair and servicing",
    "Medical equipment field service",
    "Mechanical and electrical maintenance",
    "Facility management and AMC operations",
  ];

  const clients = [
    {
      title: "Service Franchises",
      description: "Run multi-city field teams with one dispatch brain.",
      icon: Building2,
    },
    {
      title: "Maintenance Vendors",
      description: "Track SLAs, visits, and spares across branches.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Enterprise Ops",
      description: "Centralize reporting for service, finance, and leadership.",
      icon: TrendingUp,
    },
    {
      title: "Growing Teams",
      description: "Replace spreadsheets with structured workflows and alerts.",
      icon: Rocket,
    },
  ];

  const coreModules = [
    {
      title: "Lead to Job Pipeline",
      body: "Convert enquiries fast with clean ownership at each stage.",
      icon: Users,
    },
    {
      title: "Smart Assignment",
      body: "Match technicians to jobs with route, skills, and availability.",
      icon: Sparkles,
    },
    {
      title: "Visit Execution",
      body: "Checklist-based updates from the field app in real time.",
      icon: ClipboardCheck,
    },
    {
      title: "Billing Control",
      body: "Quotations, invoices, and collections under one ledger.",
      icon: CreditCard,
    },
    {
      title: "AMC Management",
      body: "Contract timelines, service reminders, and renewal visibility.",
      icon: LifeBuoy,
    },
    {
      title: "Inventory Visibility",
      body: "Branch-wise part availability before technicians reach site.",
      icon: Gem,
    },
  ];

  const faqItems = [
    {
      question: "Can GoField handle both mobile and web users?",
      answer:
        "Yes. Field staff use the mobile app while dispatch and management teams run operations from the web dashboard.",
    },
    {
      question: "Can we track technicians in real time?",
      answer:
        "Yes. GoField provides live location and job progress visibility to help dispatchers and supervisors make faster decisions.",
    },
    {
      question: "Does GoField support invoice and payment workflow?",
      answer:
        "Yes. Teams can move from lead to job, quotation, invoice, and payment inside one connected workflow.",
    },
    {
      question: "Is GoField suitable for AMC and recurring service models?",
      answer:
        "Yes. AMC contracts, periodic service reminders, and repeat visit management are supported for recurring operations.",
    },
  ];

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  const mobileSlides = [
    {
      title: "Mobile dashboard",
      image: appShot1,
      description: "Technicians and supervisors can open the app and see their day at a glance.",
      chip: "Real-time tasks",
    },
    {
      title: "Job details",
      image: appShot2,
      description: "Each job record contains customer info, parts used, and a checklist of tasks.",
      chip: "Guided execution",
    },
    {
      title: "Payments",
      image: appShot3,
      description: "Take payments on the spot and mark invoices paid without paper.",
      chip: "Instant collections",
    },
  ];

  const webSlides = [
    {
      title: "Dispatch board",
      image: appShot1,
      description: "Assign jobs, watch technician locations, and keep SLAs on track from the web.",
      chip: "Ops command center",
    },
    {
      title: "Lead to invoice",
      image: appShot2,
      description: "Convert new leads into invoices with a few clicks and track payment status.",
      chip: "Connected workflow",
    },
    {
      title: "Reports and analytics",
      image: appShot3,
      description: "Dashboards give owners the numbers they need: revenue, response times, stock levels.",
      chip: "Decision ready",
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveMobileSlide((prev) => (prev + 1) % mobileSlides.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [mobileSlides.length]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveWebSlide((prev) => (prev + 1) % webSlides.length);
    }, 4300);
    return () => window.clearInterval(timer);
  }, [webSlides.length]);

  const showPrevSlide = () => {
    setActiveMobileSlide((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length);
  };

  const showNextSlide = () => {
    setActiveMobileSlide((prev) => (prev + 1) % mobileSlides.length);
  };

  const showPrevWebSlide = () => {
    setActiveWebSlide((prev) => (prev - 1 + webSlides.length) % webSlides.length);
  };

  const showNextWebSlide = () => {
    setActiveWebSlide((prev) => (prev + 1) % webSlides.length);
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="brand-block">
          <div className="brand-logo-wrap">
            <img src={logo} alt="GoField logo" />
          </div>
          <div>
            <p className="brand-kicker">GoField.in</p>
            <h1>GoField</h1>
          </div>
        </div>

        <button
          className="mobile-menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={17} /> : <Menu size={17} />}
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>

        <nav className="landing-nav desktop-nav">
          {navLinks.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="landing-cta desktop-cta">
          <Link className="btn-outline-dark" to="/login">
            Login
          </Link>
          <a className="btn-solid-dark" href="#contact">
            Book a Demo
          </a>
        </div>
      </header>

      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <nav className="landing-nav">
          {navLinks.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="landing-cta">
          <Link className="btn-outline-dark" to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <a className="btn-solid-dark" href="#contact" onClick={() => setMenuOpen(false)}>
            Book a Demo
          </a>
        </div>
      </div>

      <section className="hero">
        <div className="hero-content">
          <p className="hero-pill">Field Service Management Platform</p>
          <h2>Modern operations for high-speed field teams.</h2>
          <p>
            GoField brings your complete service lifecycle into one system:
            <strong> Lead -&gt; Job -&gt; Technician Assignment -&gt; Quotation -&gt; Invoice -&gt; Payment</strong>.
            Access via mobile app for field users and a web portal for admins and owners.
          </p>
          <div className="hero-buttons">
            <Link className="btn-solid-accent" to="/login">
              Start with Login <ArrowRight size={16} />
            </Link>
            <a className="btn-outline-accent" href="#contact">
              Book a Demo
            </a>
          </div>
          <div className="hero-mini-points">
            <span>
              <ChevronRight size={14} /> Smart dispatching
            </span>
            <span>
              <ChevronRight size={14} /> Instant invoicing
            </span>
            <span>
              <ChevronRight size={14} /> Live field visibility
            </span>
          </div>
          <div className="store-buttons">
            <a href="https://play.google.com/store" target="_blank" rel="noreferrer">
              <Bot size={16} /> Download on Play Store
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer">
              <Apple size={16} /> Download on App Store
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <h3>Operations Snapshot</h3>
          <div className="hero-metric-grid">
            <article>
              <span>Active Technicians</span>
              <strong>128</strong>
            </article>
            <article>
              <span>Jobs Today</span>
              <strong>486</strong>
            </article>
            <article>
              <span>Invoice Success</span>
              <strong>98.4%</strong>
            </article>
            <article>
              <span>Avg ETA</span>
              <strong>22 min</strong>
            </article>
          </div>
          <div className="hero-screen">
            <img src={appShot1} alt="GoField dashboard preview" />
            <div className="hero-screen-badge">
              <Sparkles size={15} /> Live dispatch intelligence
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="content-block about-block">
        <span className="section-pill">Built for fast-moving service teams</span>
        <h3>Stop managing work in chat threads and spreadsheets</h3>
        <p>
          GoField is a field service platform for businesses running high-volume on-site work. Dispatch, field,
          finance, and leadership teams operate from a single real-time system.
        </p>
        <p>
          Product by <strong>Napeans Technologies</strong> (
          <a href="https://napeans.com" target="_blank" rel="noreferrer">
            napeans.com
          </a>
          )
        </p>
      </section>

      <section id="features" className="content-block">
        <h3>What teams love in GoField</h3>
        <div className="feature-grid">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-block">
        <h3>Core modules businesses rely on daily</h3>
        <div className="module-grid">
          {coreModules.map((module) => {
            const Icon = module.icon;
            return (
              <article key={module.title}>
                <div className="module-head">
                  <Icon size={16} />
                  <h4>{module.title}</h4>
                </div>
                <p>{module.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-block">
        <h3>Perfect for service-heavy industries</h3>
        <div className="chip-grid">
          {industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </div>
      </section>

      <section id="clients" className="content-block">
        <h3>Who uses GoField</h3>
        <div className="client-grid">
          {clients.map((client) => {
            const Icon = client.icon;
            return (
              <article key={client.title}>
                <div className="client-icon">
                  <Icon size={16} />
                </div>
                <h4>{client.title}</h4>
                <p>{client.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="app" className="app-section">
        <div className="app-section-header">
          <span className="section-pill">Mobile first</span>
          <h3>Everything your team needs, in their pocket</h3>
          <p>Native-like app experience for technicians on the move with updates, navigation, and payments.</p>
        </div>

        <div className="app-slider-wrap">
          <article className="app-slider-card">
            <div className="app-slider-top">
              <div>
                <div className="app-tag">{mobileSlides[activeMobileSlide].chip}</div>
                <h4>{mobileSlides[activeMobileSlide].title}</h4>
              </div>
              <div className="app-slider-controls">
                <button onClick={showPrevSlide} aria-label="Previous mobile screen">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={showNextSlide} aria-label="Next mobile screen">
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            </div>
            <div className="app-device-frame slider" style={{ backgroundImage: `url(${mobileSlides[activeMobileSlide].image})` }}></div>
            <p>{mobileSlides[activeMobileSlide].description}</p>
            <div className="app-slider-dots">
              {mobileSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  className={index === activeMobileSlide ? "active" : ""}
                  onClick={() => setActiveMobileSlide(index)}
                  aria-label={`View ${slide.title}`}
                />
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="web" className="desktop-section">
        <div className="app-section-header">
          <span className="section-pill">Desktop control center</span>
          <h3>Powerful web experience for operations teams</h3>
          <p>Dispatch managers and admins get a full control surface for planning, tracking, and decisions.</p>
        </div>

        <div className="web-slider-wrap">
          <article className="web-shot-card">
            <div className="web-slider-top">
              <div>
                <span>{webSlides[activeWebSlide].chip}</span>
                <p>{webSlides[activeWebSlide].title}</p>
              </div>
              <div className="web-slider-controls">
                <button onClick={showPrevWebSlide} aria-label="Previous web screen">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={showNextWebSlide} aria-label="Next web screen">
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            </div>
            <div className="web-shot-screen" style={{ backgroundImage: `url(${webSlides[activeWebSlide].image})` }}></div>
            <p>{webSlides[activeWebSlide].description}</p>
            <div className="web-slider-dots">
              {webSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  className={index === activeWebSlide ? "active" : ""}
                  onClick={() => setActiveWebSlide(index)}
                  aria-label={`View ${slide.title}`}
                />
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="pricing" className="content-block pricing">
        <h3>Plans and Consultation</h3>
        <p>Pricing is customized based on team size, branches, and workflow needs. Contact us for a tailored quote.</p>
        <div className="pricing-grid">
          <article>
            <h4>Starter</h4>
            <p>Ideal for growing teams replacing spreadsheets and manual calls.</p>
          </article>
          <article>
            <h4>Growth</h4>
            <p>Built for multi-team operations that need stronger automation and tracking.</p>
          </article>
          <article>
            <h4>Enterprise</h4>
            <p>Designed for custom workflows, API integrations, and dedicated success support.</p>
          </article>
        </div>
        <p>
          Call us at <a href="tel:+919384012319">9384012319</a> or email <a href="mailto:mailus@napeans.com">mailus@napeans.com</a>.
        </p>
      </section>

      <section id="contact" className="content-block contact">
        <h3>Book a demo</h3>
        <div className="contact-grid">
          <p>
            <ShieldCheck size={16} /> Domain:
            <a href="https://gofield.in" target="_blank" rel="noreferrer">
              GoField.in
            </a>
          </p>
          <p>
            <CloudSun size={16} /> Company: Napeans Technologies
          </p>
          <p>
            <MapPinned size={16} /> Website:
            <a href="https://napeans.com" target="_blank" rel="noreferrer">
              napeans.com
            </a>
          </p>
          <p>
            <a href="mailto:mailus@napeans.com">mailus@napeans.com</a>
          </p>
          <p>Tell us your team size and service model, and we will set up a tailored walkthrough.</p>
        </div>
      </section>

      <section className="content-block">
        <h3>Frequently asked questions</h3>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
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
