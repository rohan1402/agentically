import Link from "next/link";

// ─── Feature cards ────────────────────────────────────────────────────────────

const features = [
  {
    icon: "🔍",
    title: "Semantic Search",
    desc: "Understands meaning, not just keywords. Ask naturally and get relevant results even when exact words don't match.",
  },
  {
    icon: "📄",
    title: "Exact Citations",
    desc: "Returns verbatim regulatory text on demand — no AI-generated summaries, no paraphrasing. Always citable.",
  },
  {
    icon: "⚡",
    title: "Instant Answers",
    desc: "Responses in 3–8 seconds. No more digging through hundreds of PDF pages to find one requirement.",
  },
  {
    icon: "🗂️",
    title: "Any Document Set",
    desc: "Works with NIAHO, Joint Commission, CMS, internal SOPs — any compliance library you throw at it.",
  },
  {
    icon: "💬",
    title: "Conversation Memory",
    desc: "Ask follow-up questions naturally. The agent remembers context across your entire session.",
  },
  {
    icon: "🔒",
    title: "Your Data, Your Control",
    desc: "Documents stay in your own database. No third-party training on your sensitive compliance content.",
  },
];

// ─── How it works steps ───────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Upload your documents",
    desc: "Send us your compliance PDFs — NIAHO, Joint Commission, internal SOPs, anything. We index them in hours.",
  },
  {
    number: "02",
    title: "Ask in plain English",
    desc: "Your staff types questions naturally. No training needed, no special syntax, no search operators.",
  },
  {
    number: "03",
    title: "Get cited answers",
    desc: "Precise answers with exact chapter references. Every response is traceable back to the source document.",
  },
];

// ─── Use cases ────────────────────────────────────────────────────────────────

const useCases = [
  { role: "Compliance Officers", example: "\"What are the documentation requirements for surgical consent?\"" },
  { role: "Nursing Staff", example: "\"Show me the infection control protocols for IV insertion.\"" },
  { role: "Hospital Administrators", example: "\"List all quality management chapters and their requirements.\"" },
  { role: "New Staff Onboarding", example: "\"What does the patient rights section say about grievances?\"" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Nav ── */}
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏥</span>
            <span className="font-semibold text-gray-900 text-sm">Healthcare Standards Agent</span>
          </div>
          <Link
            href="/demo"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Demo →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-6">
            Powered by Claude + MongoDB Atlas Vector Search
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Your compliance documents,{" "}
            <span className="text-blue-600">answered instantly</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            AI-powered search for NIAHO and healthcare accreditation standards.
            Ask in plain English, get precise cited answers in seconds —
            no more manual PDF searching.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/demo"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try the Live Demo →
            </Link>
            <a
              href="mailto:rohan.pant14@gmail.com?subject=Agentically — Demo Request"
              className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Request a Pilot
            </a>
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Compliance search is broken
          </h2>
          <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
            Healthcare staff spend hours manually searching through hundreds of pages of accreditation
            standards to find a single requirement — and they still risk citing the wrong version.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { stat: "Hours", label: "lost per week searching compliance docs" },
              { stat: "500+", label: "pages in a typical accreditation standards manual" },
              { stat: "High risk", label: "of citing outdated or incorrect requirements" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="text-2xl font-bold text-blue-600 mb-2">{item.stat}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">Live in under a week. No training required for your staff.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="text-4xl font-bold text-blue-100 mb-3">{step.number}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Built for healthcare compliance</h2>
            <p className="text-gray-500">Every feature designed around how compliance teams actually work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Who uses it</h2>
            <p className="text-gray-500">Across departments, anyone who references compliance standards.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map((u) => (
              <div key={u.role} className="rounded-2xl border border-gray-200 p-5">
                <div className="text-sm font-semibold text-gray-900 mb-2">{u.role}</div>
                <div className="text-sm text-gray-500 italic">{u.example}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to see it on your documents?</h2>
          <p className="text-blue-100 mb-10 text-lg">
            Try the live demo with NIAHO standards, or get in touch to run a pilot on your own compliance library.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/demo"
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors"
            >
              Try Live Demo →
            </Link>
            <a
              href="mailto:rohan.pant14@gmail.com?subject=Agentically — Pilot Request"
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl border border-blue-400 hover:bg-blue-400 transition-colors"
            >
              Request a Pilot
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-8 border-t border-gray-100 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>🏥</span>
            <span>Healthcare Standards Agent</span>
          </div>
          <div className="text-sm text-gray-400">
            Built by Rohan Pant & Siddhant Rawat
          </div>
          <a
            href="mailto:rohan.pant14@gmail.com"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            rohan.pant14@gmail.com
          </a>
        </div>
      </footer>

    </div>
  );
}
