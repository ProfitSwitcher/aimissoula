import { useState, useEffect, useRef } from "react";

/* ─── Helpers ─── */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── Data ─── */
const SERVICES = [
  {
    icon: "💬",
    title: "AI Chatbots & Customer Service",
    desc: "Intelligent assistants that handle inquiries, book appointments, and convert leads around the clock — so you never miss a customer again.",
    features: ["Website live chat", "Lead qualification", "Appointment booking", "SMS & social integration"],
  },
  {
    icon: "⚡",
    title: "Business Process Automation",
    desc: "Stop doing the same thing twice. We automate your workflows, reporting, invoicing, and data entry so your team can focus on real work.",
    features: ["Workflow automation", "Smart reporting", "Invoice & billing", "CRM integration"],
  },
  {
    icon: "📈",
    title: "AI-Powered Marketing",
    desc: "Smarter ad campaigns, better SEO rankings, and content that actually converts — powered by AI that learns what works for your market.",
    features: ["Automated ad campaigns", "Local SEO", "AI content creation", "Performance dashboards"],
  },
  {
    icon: "🛠️",
    title: "Custom AI Tools & Apps",
    desc: "Need something that doesn't exist yet? We build purpose-built AI tools designed around your specific business challenges.",
    features: ["Custom dashboards", "Industry-specific tools", "API integrations", "Mobile-ready solutions"],
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discovery Call",
    desc: "We sit down (or hop on a call) and learn how your business actually runs — the bottlenecks, the repetitive stuff, the opportunities you don't have time to chase.",
    color: "#00d2ff",
  },
  {
    step: "02",
    title: "Strategy & Blueprint",
    desc: "We map out exactly which AI tools and automations will move the needle for you. No fluff — just a clear plan with realistic timelines and expected ROI.",
    color: "#7b2ff7",
  },
  {
    step: "03",
    title: "Build & Deploy",
    desc: "We build your AI systems, test them thoroughly, and deploy them into your existing workflow. We handle the tech so you can keep running your business.",
    color: "#00d2ff",
  },
  {
    step: "04",
    title: "Optimize & Grow",
    desc: "AI gets smarter over time. We monitor performance, fine-tune your systems, and identify new opportunities to automate as your business scales.",
    color: "#7b2ff7",
  },
];

const RESULTS = [
  { stat: "80%", label: "Less time on repetitive tasks" },
  { stat: "3×", label: "Faster customer response" },
  { stat: "24/7", label: "Always-on automation" },
  { stat: "40%", label: "Average cost reduction" },
];

const INDUSTRIES = [
  "Trades & Construction",
  "Restaurants & Hospitality",
  "Retail & E-Commerce",
  "Real Estate & Property Management",
  "Professional Services",
  "Healthcare & Wellness",
  "Nonprofits & Community Orgs",
  "Tourism & Outfitters",
];

const FAQS = [
  {
    q: "How much does it cost?",
    a: "Every business is different. We offer free consultations to scope out your needs and provide a clear quote. Most projects start with a one-time build fee plus an optional monthly management plan. No hidden costs.",
  },
  {
    q: "I'm not tech-savvy. Is that a problem?",
    a: "Not at all — that's exactly why we exist. We handle all the technical work and give you simple tools you can actually use. If you can send an email, you can use what we build.",
  },
  {
    q: "How long does it take to get up and running?",
    a: "Simple automations and chatbots can be live within 1-2 weeks. Custom AI tools and larger projects typically take 3-6 weeks. We'll give you a clear timeline during the discovery call.",
  },
  {
    q: "Do I need to sign a long-term contract?",
    a: "Nope. Build projects are one-time. If you want ongoing optimization and management, we offer flexible monthly plans you can cancel anytime.",
  },
  {
    q: "Will AI replace my employees?",
    a: "That's not the goal. AI handles the tedious, repetitive stuff so your team can focus on the work that actually requires a human touch — customer relationships, creative decisions, and growing the business.",
  },
];

/* ─── Utility Components ─── */
function AnimatedSection({ children, className = "", delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ color = "#00d2ff", children }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color,
        letterSpacing: "3px",
        textTransform: "uppercase",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "clamp(32px, 4.5vw, 52px)",
        fontWeight: 800,
        color: "#fff",
        margin: "16px 0 0",
        letterSpacing: "-1.5px",
        lineHeight: 1.1,
      }}
    >
      {children}
    </h2>
  );
}

function GradientText({ children, gradient = "linear-gradient(135deg, #00d2ff, #7b2ff7)" }) {
  return (
    <span
      style={{
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}

/* ─── Navbar ─── */
function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(8,10,18,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,210,255,0.06)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", cursor: "pointer" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 15,
              color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            AI
          </div>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            AI Missoula
          </span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Services", "Process", "About", "FAQ"].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); scrollTo(s.toLowerCase()); }}
              style={{
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.5px",
                transition: "color 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#00d2ff")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.55)")}
            >
              {s}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}
            style={{
              background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
              color: "#fff",
              padding: "10px 26px",
              borderRadius: 9,
              textDecoration: "none",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.3px",
              transition: "transform 0.2s, box-shadow 0.3s",
              boxShadow: "0 4px 20px rgba(0,210,255,0.2)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 30px rgba(0,210,255,0.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 20px rgba(0,210,255,0.2)";
            }}
          >
            Try It Free
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const fadeIn = (d) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(35px)",
    transition: `all 0.8s cubic-bezier(.22,1,.36,1) ${d}s`,
  });

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "140px 32px 100px",
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,210,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-8%",
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(123,47,247,0.12) 0%, transparent 65%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 9s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-12%",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 65%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 11s ease-in-out infinite reverse",
        }}
      />
      {/* Ring decoration */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "8%",
          width: 200,
          height: 200,
          border: "1px solid rgba(0,210,255,0.06)",
          borderRadius: "50%",
          animation: "spin-slow 30s linear infinite",
        }}
      />

      <div style={{ maxWidth: 920, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={fadeIn(0)}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 20px",
              borderRadius: 100,
              border: "1px solid rgba(0,210,255,0.15)",
              background: "rgba(0,210,255,0.04)",
              marginBottom: 32,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00d2ff",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: "#00d2ff",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Missoula's AI Agency
            </span>
          </div>
        </div>

        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 900,
            lineHeight: 1.04,
            color: "#fff",
            margin: "0 0 28px",
            letterSpacing: "-3px",
            ...fadeIn(0.15),
          }}
        >
          AI That Works
          <br />
          <GradientText gradient="linear-gradient(135deg, #00d2ff 0%, #7b2ff7 50%, #c471f5 100%)">
            As Hard As You Do
          </GradientText>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "clamp(16px, 2.2vw, 20px)",
            color: "rgba(255,255,255,0.48)",
            lineHeight: 1.75,
            maxWidth: 620,
            margin: "0 auto 48px",
            ...fadeIn(0.3),
          }}
        >
          We build AI chatbots, automations, and marketing tools for businesses
          across western Montana. Real solutions that save time, cut costs, and
          help you grow — built by someone who runs a business here too.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            ...fadeIn(0.45),
          }}
        >
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}
            style={{
              background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
              color: "#fff",
              padding: "17px 40px",
              borderRadius: 11,
              textDecoration: "none",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.2px",
              boxShadow: "0 8px 36px rgba(0,210,255,0.28)",
              transition: "transform 0.25s, box-shadow 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 14px 44px rgba(0,210,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 36px rgba(0,210,255,0.28)";
            }}
          >
            Try It Free →
          </a>
          <a
            href="#services"
            onClick={(e) => { e.preventDefault(); scrollTo("services"); }}
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.8)",
              padding: "17px 40px",
              borderRadius: 11,
              textDecoration: "none",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 16,
              fontWeight: 500,
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "rgba(0,210,255,0.3)";
              e.target.style.background = "rgba(0,210,255,0.05)";
              e.target.style.color = "#00d2ff";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.12)";
              e.target.style.background = "rgba(255,255,255,0.03)";
              e.target.style.color = "rgba(255,255,255,0.8)";
            }}
          >
            See What We Build
          </a>
        </div>

        {/* Trust bar */}
        <div style={{ marginTop: 64, ...fadeIn(0.6) }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Serving Western Montana
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {["Missoula", "Bonner", "Seeley Lake", "Potomac", "Greenough", "Hamilton"].map((town) => (
              <span
                key={town}
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.22)",
                  letterSpacing: "0.5px",
                }}
              >
                {town}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Services ─── */
function ServiceCard({ service, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <AnimatedSection delay={index * 100}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? "linear-gradient(145deg, rgba(0,210,255,0.07), rgba(123,47,247,0.05))"
            : "rgba(255,255,255,0.018)",
          border: `1px solid ${hovered ? "rgba(0,210,255,0.2)" : "rgba(255,255,255,0.05)"}`,
          borderRadius: 18,
          padding: "38px 32px",
          transition: "all 0.4s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.35)" : "0 4px 20px rgba(0,0,0,0.1)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: hovered ? "rgba(0,210,255,0.08)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${hovered ? "rgba(0,210,255,0.15)" : "rgba(255,255,255,0.05)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            marginBottom: 24,
            transition: "all 0.3s",
          }}
        >
          {service.icon}
        </div>
        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 12,
            letterSpacing: "-0.5px",
          }}
        >
          {service.title}
        </h3>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 15,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.75,
            marginBottom: 28,
            flex: 1,
          }}
        >
          {service.desc}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {service.features.map((f) => (
            <span
              key={f}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                background: "rgba(0,210,255,0.05)",
                border: "1px solid rgba(0,210,255,0.08)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(0,210,255,0.6)",
                letterSpacing: "0.3px",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function Services() {
  return (
    <section id="services" style={{ padding: "120px 32px", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <SectionLabel color="#7b2ff7">What We Do</SectionLabel>
            <SectionTitle>
              AI Solutions That <GradientText>Actually Deliver</GradientText>
            </SectionTitle>
            <p
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 17,
                color: "rgba(255,255,255,0.4)",
                marginTop: 20,
                maxWidth: 560,
                margin: "20px auto 0",
                lineHeight: 1.7,
              }}
            >
              We don't sell hype. We build AI tools that plug into your business
              and start saving you time and money from day one.
            </p>
          </div>
        </AnimatedSection>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Process ─── */
function ProcessSection() {
  return (
    <section
      id="process"
      style={{
        padding: "120px 32px",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 30% 50%, rgba(0,210,255,0.03) 0%, transparent 60%)",
        }}
      />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <SectionLabel color="#00d2ff">How It Works</SectionLabel>
            <SectionTitle>
              From Idea to <GradientText gradient="linear-gradient(135deg, #7b2ff7, #00d2ff)">Automation</GradientText>
            </SectionTitle>
          </div>
        </AnimatedSection>

        <div style={{ display: "grid", gap: 0 }}>
          {PROCESS.map((p, i) => (
            <AnimatedSection key={p.step} delay={i * 120}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: 32,
                  padding: "40px 0",
                  borderBottom:
                    i < PROCESS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 48,
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.04)",
                    letterSpacing: "-2px",
                    lineHeight: 1,
                    position: "relative",
                  }}
                >
                  {p.step}
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      left: 0,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 48,
                      fontWeight: 900,
                      background: `linear-gradient(135deg, ${p.color}, transparent)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      opacity: 0.3,
                      letterSpacing: "-2px",
                      lineHeight: 1,
                    }}
                  >
                    {p.step}
                  </div>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 10,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontSize: 16,
                      color: "rgba(255,255,255,0.42)",
                      lineHeight: 1.75,
                      maxWidth: 540,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Results ─── */
function ResultsSection() {
  return (
    <section
      id="results"
      style={{
        padding: "100px 32px",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(123,47,247,0.04) 0%, transparent 65%)",
        }}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel>The Impact</SectionLabel>
            <SectionTitle>
              Results You Can{" "}
              <GradientText gradient="linear-gradient(135deg, #7b2ff7, #c471f5)">Measure</GradientText>
            </SectionTitle>
          </div>
        </AnimatedSection>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
          }}
        >
          {RESULTS.map((r, i) => (
            <AnimatedSection key={r.label} delay={i * 100}>
              <div
                style={{
                  textAlign: "center",
                  padding: "36px 24px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 60,
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1,
                    marginBottom: 14,
                    letterSpacing: "-2px",
                  }}
                >
                  {r.stat}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 15,
                    color: "rgba(255,255,255,0.42)",
                    letterSpacing: "0.3px",
                  }}
                >
                  {r.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Industries ─── */
function IndustriesSection() {
  return (
    <section style={{ padding: "100px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel color="#7b2ff7">Who We Serve</SectionLabel>
            <SectionTitle>
              Built for <GradientText>Montana Business</GradientText>
            </SectionTitle>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={150}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            {INDUSTRIES.map((ind) => (
              <span
                key={ind}
                style={{
                  padding: "13px 26px",
                  borderRadius: 100,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  transition: "all 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "rgba(0,210,255,0.25)";
                  e.target.style.background = "rgba(0,210,255,0.05)";
                  e.target.style.color = "#00d2ff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.06)";
                  e.target.style.background = "rgba(255,255,255,0.02)";
                  e.target.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                {ind}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  return (
    <section
      id="about"
      style={{
        padding: "120px 32px",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "10%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(0,210,255,0.04) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />
      <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center" }}>
            <SectionLabel color="#00d2ff">About</SectionLabel>
            <SectionTitle>
              Local Roots.{" "}
              <GradientText gradient="linear-gradient(135deg, #7b2ff7, #c471f5)">Future Tech.</GradientText>
            </SectionTitle>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <div style={{ marginTop: 40 }}>
            <p
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 17,
                color: "rgba(255,255,255,0.48)",
                lineHeight: 1.85,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              AI Missoula was founded by a Montana business owner who got tired of
              watching small businesses struggle with the same problems that AI can
              solve overnight. After years of running a company in the Blackfoot
              corridor, building custom automation tools, and seeing firsthand how
              much time gets wasted on tasks a machine could handle — starting an
              AI agency was the obvious next step.
            </p>
            <p
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 17,
                color: "rgba(255,255,255,0.48)",
                lineHeight: 1.85,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              We're not a Silicon Valley startup dropping buzzwords. We're locals
              who understand Montana margins, Montana work ethic, and what it
              actually takes to run a business here. We build AI systems that
              pay for themselves — chatbots that convert leads at 2am, automations
              that eliminate hours of data entry, and marketing tools that outperform
              agencies charging three times as much.
            </p>
            <p
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 17,
                color: "rgba(255,255,255,0.48)",
                lineHeight: 1.85,
                textAlign: "center",
              }}
            >
              We don't just consult. We build, deploy, and manage. If it
              doesn't save you time or make you money, we don't ship it.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              marginTop: 56,
            }}
          >
            {[
              { label: "Based in", value: "Missoula, MT" },
              { label: "Approach", value: "Build, Deploy, Manage" },
              { label: "Guarantee", value: "Results or We Fix It" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  textAlign: "center",
                  padding: "28px 16px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "rgba(0,210,255,0.5)",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <AnimatedSection delay={index * 80}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "24px 0",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
          }}
        >
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: open ? "#00d2ff" : "#fff",
              letterSpacing: "-0.3px",
              transition: "color 0.3s",
            }}
          >
            {faq.q}
          </h3>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 24,
              color: open ? "#00d2ff" : "rgba(255,255,255,0.2)",
              transition: "all 0.3s",
              transform: open ? "rotate(45deg)" : "rotate(0)",
              flexShrink: 0,
            }}
          >
            +
          </span>
        </div>
        <div
          style={{
            maxHeight: open ? 200 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.42)",
              lineHeight: 1.75,
              marginTop: 14,
              paddingRight: 48,
            }}
          >
            {faq.a}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}

function FAQSection() {
  return (
    <section
      id="faq"
      style={{
        padding: "120px 32px",
        borderTop: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel color="#7b2ff7">FAQ</SectionLabel>
            <SectionTitle>
              Questions? <GradientText>Answered.</GradientText>
            </SectionTitle>
          </div>
        </AnimatedSection>
        {FAQS.map((faq, i) => (
          <FAQItem key={faq.q} faq={faq} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ─── Shared Form Styles ─── */
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.3s",
};

const btnStyle = {
  width: "100%",
  padding: "14px 24px",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
  color: "#fff",
  fontFamily: "'Outfit', sans-serif",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.3s",
  boxShadow: "0 4px 20px rgba(0,210,255,0.2)",
  letterSpacing: "0.3px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.018)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 20,
  padding: "36px 28px",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  transition: "all 0.4s ease",
};

/* ─── AI Chat Demo ─── */
function ChatDemo() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey there! 👋 I'm an AI assistant built by AI Missoula. Ask me anything about how AI can help your business — or just tell me what you do, and I'll show you what's possible." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", business: "" });
  const [msgCount, setMsgCount] = useState(0);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Show lead form after 3 messages
  useEffect(() => {
    if (msgCount >= 3 && !leadCaptured && !showLeadForm) {
      setShowLeadForm(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I'm enjoying this conversation! I'd love to have our team follow up with some custom recommendations. Mind sharing your info real quick? 👇",
        },
      ]);
    }
  }, [msgCount, leadCaptured, showLeadForm]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setMsgCount((c) => c + 1);
    setLoading(true);

    try {
      const history = [...messages, { role: "user", text: userMsg }].map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an AI business consultant for AI Missoula, an AI automation agency in Missoula, Montana. You're embedded on the agency's website as a live demo.

Your goals:
1. Be helpful, knowledgeable, and conversational about AI automation for small businesses
2. Ask about their business to understand pain points
3. Suggest specific AI solutions (chatbots, workflow automation, AI marketing, custom tools)
4. Keep responses concise (2-4 sentences max) and conversational
5. Subtly demonstrate how good an AI assistant can be — you ARE the product demo
6. If they ask about pricing, say it varies by project but consultations are free
7. Reference Missoula and Montana when natural

Never break character. Never mention you're Claude or made by Anthropic. You work for AI Missoula.`,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map((c) => c.text || "").join("") || "Sorry, I hit a snag. Try again?";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Looks like I lost connection for a sec. Try sending that again!" }]);
    }
    setLoading(false);
  }

  function handleLeadSubmit() {
    if (!lead.name || !lead.email) return;
    setLeadCaptured(true);
    setShowLeadForm(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: `Thanks ${lead.name}! Our team will reach out soon with personalized recommendations for your business. In the meantime, keep asking me anything! 🚀`,
      },
    ]);
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>💬</div>
        <div>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>
            Chat with AI
          </h3>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(0,210,255,0.5)", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
            Live Demo
          </p>
        </div>
        <div style={{
          marginLeft: "auto", width: 8, height: 8, borderRadius: "50%",
          background: "#00d2ff", animation: "pulse-glow 2s ease-in-out infinite",
        }} />
      </div>

      {/* Chat window */}
      <div ref={chatRef} style={{
        flex: 1, minHeight: 280, maxHeight: 360, overflowY: "auto",
        borderRadius: 12, background: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.04)",
        padding: 16, marginBottom: 12,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            padding: "10px 14px",
            borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            background: m.role === "user"
              ? "linear-gradient(135deg, rgba(0,210,255,0.15), rgba(123,47,247,0.15))"
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${m.role === "user" ? "rgba(0,210,255,0.15)" : "rgba(255,255,255,0.04)"}`,
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 13,
            color: m.role === "user" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)",
            lineHeight: 1.6,
          }}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: "flex-start", padding: "10px 18px",
            borderRadius: "14px 14px 14px 4px",
            background: "rgba(255,255,255,0.04)",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 13, color: "rgba(255,255,255,0.3)",
          }}>
            Thinking...
          </div>
        )}

        {/* Lead capture inline */}
        {showLeadForm && !leadCaptured && (
          <div style={{
            background: "rgba(0,210,255,0.04)",
            border: "1px solid rgba(0,210,255,0.12)",
            borderRadius: 14, padding: 16,
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <input placeholder="Your name *" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })}
              style={{ ...inputStyle, padding: "10px 12px", fontSize: 13 }} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            <input placeholder="Email *" type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })}
              style={{ ...inputStyle, padding: "10px 12px", fontSize: 13 }} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            <input placeholder="Phone (optional)" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              style={{ ...inputStyle, padding: "10px 12px", fontSize: 13 }} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            <input placeholder="Business name (optional)" value={lead.business} onChange={(e) => setLead({ ...lead, business: e.target.value })}
              style={{ ...inputStyle, padding: "10px 12px", fontSize: 13 }} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            <button onClick={handleLeadSubmit} style={{ ...btnStyle, padding: "10px 16px", fontSize: 13 }}>
              Send & Keep Chatting →
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about AI for your business..."
          style={{ ...inputStyle, flex: 1 }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(0,210,255,0.3)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "12px 20px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
            color: "#fff", fontWeight: 700, cursor: loading ? "wait" : "pointer",
            fontSize: 16, transition: "transform 0.2s",
            opacity: loading ? 0.6 : 1,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}

/* ─── AI Phone Demo ─── */
function PhoneDemo() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [status, setStatus] = useState("idle"); // idle | calling | success | error

  async function handleSubmit() {
    if (!phone || !name) return;
    setStatus("calling");

    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, business }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
      } else {
        console.error("Call error:", data);
        setStatus("error");
      }
    } catch (err) {
      console.error("Call failed:", err);
      setStatus("error");
    }
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "linear-gradient(135deg, #7b2ff7, #c471f5)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>📞</div>
        <div>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>
            AI Phone Assistant
          </h3>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(123,47,247,0.6)", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
            Live Demo Call
          </p>
        </div>
      </div>

      {status === "idle" && (
        <>
          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14,
            color: "rgba(255,255,255,0.42)", lineHeight: 1.7, marginBottom: 20,
          }}>
            Enter your number and our AI will call you right now — not in an hour, not tomorrow. It'll book appointments, answer questions, and show you what an AI phone system sounds like in action.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
            <input placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)}
              style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            <input placeholder="Phone number *" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            <input placeholder="Business name (optional)" value={business} onChange={(e) => setBusiness(e.target.value)}
              style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            <button onClick={handleSubmit} style={btnStyle}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(0,210,255,0.35)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(0,210,255,0.2)"; }}
            >
              Call Me Right Now →
            </button>
          </div>
        </>
      )}

      {status === "calling" && (
        <div style={{ textAlign: "center", padding: "40px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(123,47,247,0.15), rgba(196,113,245,0.15))",
            border: "2px solid rgba(123,47,247,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, marginBottom: 20,
            animation: "pulse-glow 1.5s ease-in-out infinite",
          }}>📞</div>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            Dialing you now...
          </h4>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
            Pick up when your phone rings — our AI assistant is calling you.
          </p>
        </div>
      )}

      {status === "success" && (
        <div style={{ textAlign: "center", padding: "40px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(0,200,117,0.15), rgba(0,210,255,0.15))",
            border: "2px solid rgba(0,200,117,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, marginBottom: 20,
          }}>✅</div>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            Call Sent!
          </h4>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 20 }}>
            Your phone should be ringing any second, {name}. Pick up and chat with our AI!
          </p>
          <button onClick={() => setStatus("idle")} style={{
            padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "rgba(255,255,255,0.5)",
            fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, cursor: "pointer",
          }}>
            Try again
          </button>
        </div>
      )}

      {status === "error" && (
        <div style={{ textAlign: "center", padding: "40px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,99,99,0.1)",
            border: "2px solid rgba(255,99,99,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, marginBottom: 20,
          }}>📱</div>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            Couldn't connect right now
          </h4>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 20 }}>
            No worries — our team will reach out to {name} within 24 hours for a live demo.
          </p>
          <button onClick={() => setStatus("idle")} style={{
            padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "rgba(255,255,255,0.5)",
            fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, cursor: "pointer",
          }}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── ROI Calculator ─── */
function ROICalculator() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ industry: "", employees: "", hours: "", email: "", name: "", phone: "" });
  const [result, setResult] = useState(null);

  const industries = ["Trades & Construction", "Restaurant & Hospitality", "Retail", "Real Estate", "Professional Services", "Healthcare", "Other"];

  function calculate() {
    const hrs = parseInt(data.hours) || 10;
    const emps = parseInt(data.employees) || 3;
    const hourlyRate = 28;
    const weeklySaved = Math.round(hrs * 0.7);
    const monthlySaved = Math.round(weeklySaved * 4.3 * hourlyRate);
    const yearlySaved = monthlySaved * 12;
    setResult({ weeklySaved, monthlySaved, yearlySaved });
    setStep(3);
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "linear-gradient(135deg, #00d2ff, #0090b8)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>⚡</div>
        <div>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>
            ROI Calculator
          </h3>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(0,210,255,0.5)", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
            See Your Savings
          </p>
        </div>
      </div>

      {step === 0 && (
        <>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, marginBottom: 16 }}>
            Quick 3-question calculator — see how much time and money AI automation could save your business.
          </p>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>
            What industry are you in?
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
            {industries.map((ind) => (
              <button key={ind} onClick={() => { setData({ ...data, industry: ind }); setStep(1); }}
                style={{
                  padding: "9px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)",
                  fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.target.style.borderColor = "rgba(0,210,255,0.3)"; e.target.style.color = "#00d2ff"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.color = "rgba(255,255,255,0.6)"; }}
              >{ind}</button>
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          <div style={{
            padding: "8px 14px", borderRadius: 8, background: "rgba(0,210,255,0.05)",
            border: "1px solid rgba(0,210,255,0.1)", display: "inline-block", alignSelf: "flex-start",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(0,210,255,0.6)",
          }}>
            {data.industry}
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
            How many employees do you have?
          </p>
          <input placeholder="e.g., 5" value={data.employees} onChange={(e) => setData({ ...data, employees: e.target.value })}
            style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
            Hours per week on repetitive tasks?
          </p>
          <input placeholder="e.g., 15" value={data.hours} onChange={(e) => setData({ ...data, hours: e.target.value })}
            style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <button onClick={() => setStep(2)} style={{ ...btnStyle, marginTop: "auto" }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
          >Calculate My ROI →</button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>
            Almost there! Enter your info and we'll send your full results along with custom recommendations.
          </p>
          <input placeholder="Your name *" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}
            style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <input placeholder="Email *" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })}
            style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <input placeholder="Phone (optional)" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })}
            style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <button onClick={calculate} style={{ ...btnStyle, marginTop: "auto" }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
          >Show My Results →</button>
        </div>
      )}

      {step === 3 && result && (
        <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 48, fontWeight: 900,
            background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            lineHeight: 1, marginBottom: 6,
          }}>
            ${result.yearlySaved.toLocaleString()}
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
            estimated annual savings
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 16, borderRadius: 12, background: "rgba(0,210,255,0.04)", border: "1px solid rgba(0,210,255,0.08)" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800, color: "#00d2ff" }}>
                {result.weeklySaved}hrs
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                saved per week
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 12, background: "rgba(123,47,247,0.04)", border: "1px solid rgba(123,47,247,0.08)" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800, color: "#7b2ff7" }}>
                ${result.monthlySaved.toLocaleString()}
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                saved per month
              </div>
            </div>
          </div>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
            We'll email you a detailed breakdown with custom recommendations for {data.industry.toLowerCase()}.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── AI Ad Copy Generator ─── */
function AdCopyDemo() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ businessName: "", businessType: "", name: "", email: "", phone: "" });
  const [adCopy, setAdCopy] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateCopy() {
    if (!data.name || !data.email) return;
    setLoading(true);
    setStep(2);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert social media copywriter for AI Missoula, an AI automation agency. Generate a single compelling Facebook/Instagram ad for the user's business. Include:
- A scroll-stopping headline (with emoji)
- 3-4 lines of punchy body copy
- A clear call to action

Make it specific to their business type and location (Montana/Missoula area). Keep the total output under 100 words. Output ONLY the ad copy, no explanations or options.`,
          messages: [
            {
              role: "user",
              content: `Business name: ${data.businessName || "my business"}\nBusiness type: ${data.businessType || "small business"}\nLocation: Missoula, Montana area`,
            },
          ],
        }),
      });
      const result = await res.json();
      setAdCopy(result.content?.map((c) => c.text || "").join("") || "Couldn't generate — but our team will send you custom copy!");
    } catch {
      setAdCopy("Couldn't generate right now — but our team will send you custom ad copy within 24 hours!");
    }
    setLoading(false);
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>✍️</div>
        <div>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>
            AI Ad Copy Generator
          </h3>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,107,107,0.6)", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
            Free Sample Ad
          </p>
        </div>
      </div>

      {step === 0 && (
        <>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, marginBottom: 16 }}>
            Tell us about your business and our AI will write you a ready-to-post social media ad — for free. See what AI-powered marketing looks like.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
            <input placeholder="Business name" value={data.businessName} onChange={(e) => setData({ ...data, businessName: e.target.value })}
              style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            <input placeholder="What do you do? (e.g., plumbing, restaurant, real estate)" value={data.businessType} onChange={(e) => setData({ ...data, businessType: e.target.value })}
              style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            <button onClick={() => setStep(1)} style={{ ...btnStyle, background: "linear-gradient(135deg, #ff6b6b, #ff8e53)", boxShadow: "0 4px 20px rgba(255,107,107,0.2)" }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
            >Generate My Ad →</button>
          </div>
        </>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>
            Drop your info and we'll generate your ad copy plus send over more custom marketing ideas.
          </p>
          <input placeholder="Your name *" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}
            style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <input placeholder="Email *" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })}
            style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <input placeholder="Phone (optional)" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })}
            style={inputStyle} onFocus={(e) => e.target.style.borderColor = "rgba(0,210,255,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <button onClick={generateCopy} style={{ ...btnStyle, marginTop: "auto", background: "linear-gradient(135deg, #ff6b6b, #ff8e53)", boxShadow: "0 4px 20px rgba(255,107,107,0.2)" }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
          >Generate My Free Ad →</button>
        </div>
      )}

      {step === 2 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 12, animation: "spin-slow 2s linear infinite", display: "inline-block" }}>✍️</div>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                Writing your ad...
              </p>
            </div>
          ) : (
            <>
              <div style={{
                background: "rgba(255,107,107,0.04)",
                border: "1px solid rgba(255,107,107,0.12)",
                borderRadius: 14, padding: 20, marginBottom: 16,
              }}>
                <p style={{
                  fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14,
                  color: "rgba(255,255,255,0.7)", lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                }}>
                  {adCopy}
                </p>
              </div>
              <p style={{
                fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12,
                color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 1.6,
              }}>
                This is just a taste. We'll follow up with a full AI marketing strategy for {data.businessName || "your business"}.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Get Started / Try It Section ─── */
function GetStarted() {
  return (
    <section
      id="contact"
      style={{
        padding: "120px 32px",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        position: "relative",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 60% 30%, rgba(0,210,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(123,47,247,0.03) 0%, transparent 50%)",
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel color="#00d2ff">Get Started</SectionLabel>
            <SectionTitle>
              Try AI <GradientText gradient="linear-gradient(135deg, #00d2ff, #7b2ff7, #ff6b6b)">Before You Buy</GradientText>
            </SectionTitle>
            <p style={{
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 17,
              color: "rgba(255,255,255,0.4)", marginTop: 20,
              maxWidth: 580, margin: "20px auto 0", lineHeight: 1.7,
            }}>
              Don't take our word for it — test it yourself. Chat with our AI,
              calculate your ROI, get a free ad written, or request a live phone demo.
              Every tool below is a taste of what we build for clients.
            </p>
          </div>
        </AnimatedSection>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          alignItems: "stretch",
        }}>
          <AnimatedSection delay={0} style={{ display: "flex" }}>
            <ChatDemo />
          </AnimatedSection>
          <AnimatedSection delay={100} style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
              <PhoneDemo />
              <AdCopyDemo />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200} style={{ display: "flex" }}>
            <ROICalculator />
          </AnimatedSection>
        </div>

        {/* Bottom CTA */}
        <AnimatedSection delay={300}>
          <div style={{
            textAlign: "center", marginTop: 72,
            padding: "48px 32px", borderRadius: 20,
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <p style={{
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16,
              color: "rgba(255,255,255,0.4)", marginBottom: 16, lineHeight: 1.7,
            }}>
              Prefer to talk to a human? We get it.
            </p>
            <a href="mailto:hello@aimissoula.com" style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700,
              background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              textDecoration: "none",
            }}>
              hello@aimissoula.com
            </a>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: "rgba(255,255,255,0.15)", marginTop: 12, letterSpacing: "1.5px", textTransform: "uppercase",
            }}>
              Missoula, Montana
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}


/* ─── Footer ─── */
function Footer() {
  return (
    <footer
      style={{
        padding: "40px 32px",
        borderTop: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "linear-gradient(135deg, #00d2ff, #7b2ff7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 11,
              color: "#fff",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            AI
          </div>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            AI Missoula
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {["Services", "Process", "About", "FAQ", "Contact"].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); scrollTo(s.toLowerCase()); }}
              style={{
                color: "rgba(255,255,255,0.2)",
                textDecoration: "none",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 13,
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.2)")}
            >
              {s}
            </a>
          ))}
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.15)",
          }}
        >
          © 2025 AI Missoula. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

/* ─── App ─── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#080a12", overflowX: "hidden" }}>
      <Navbar scrolled={scrolled} />
      <Hero />
      <Services />
      <ProcessSection />
      <ResultsSection />
      <IndustriesSection />
      <About />
      <FAQSection />
      <GetStarted />
      <Footer />
    </div>
  );
}
