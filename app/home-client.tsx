"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle,
  CirclesThreePlus,
  Factory,
  FileMagnifyingGlass,
  FileText,
  LinkSimple,
  Package,
  Scan,
  ShieldCheck,
  Sparkle,
  StackSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { MarketingHeader } from "@/components/marketing-header";
import { BrandLogo } from "@/components/brand-logo";

const supplierRoles = [
  { label: "Raw material", name: "Fina Fiber", icon: StackSimple },
  { label: "Fabric mill", name: "NovaTex", icon: Factory },
  { label: "Dyeing", name: "Chromia", icon: Sparkle, warning: true },
  { label: "Assembly", name: "Atelier Miro", icon: Package },
  { label: "Certification", name: "Control Union", icon: ShieldCheck },
  { label: "Packaging", name: "Packwise", icon: CirclesThreePlus },
];

const demoFashionClients = [
  { mark: "NS", name: "Northline Studio", style: "structured" },
  { mark: "A&L", name: "Aster & Loom", style: "editorial" },
  { mark: "VF", name: "Vela Form", style: "minimal" },
  { mark: "F+F", name: "Field + Found", style: "grounded" },
  { mark: "N", name: "Noema Atelier", style: "editorial" },
  { mark: "MT", name: "Morrow Thread", style: "structured" },
  { mark: "AG", name: "Arcline Goods", style: "minimal" },
  { mark: "LW", name: "Lune Works", style: "grounded" },
];

export function HomeClient() {
  return (
    <div className="marketing-page">
      <MarketingHeader />
      <main>
        <section className="hero-section">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orb hero-orb--one" aria-hidden="true" />
          <div className="hero-orb hero-orb--two" aria-hidden="true" />
          <div className="marketing-container hero-layout">
            <div className="hero-copy">
              <div className="eyebrow-pill">
                <span className="eyebrow-pill__dot" />
                Traceability intelligence for fashion
              </div>
              <h1>
                Every supplier answer.
                <span>One trusted product record.</span>
              </h1>
              <p>
                Orin connects evidence from raw material to finished product, turns scattered documents into
                structured data, and shows your team exactly what is ready—and what still needs an answer.
              </p>
              <div className="hero-actions">
                <Link className="button-link button-link--primary button-link--large" href="/login">
                  Open the demo workspace
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </Link>
                <a className="button-link button-link--quiet button-link--large" href="#how-it-works">
                  See how it works
                </a>
              </div>
              <div className="hero-proof" aria-label="Orin product principles">
                <span><Check size={15} weight="bold" /> Evidence-linked data</span>
                <span><Check size={15} weight="bold" /> Human review built in</span>
                <span><Check size={15} weight="bold" /> Llama-ready architecture</span>
              </div>
            </div>

            <div className="hero-product-visual">
              <div className="hero-window">
                <div className="hero-window__topbar">
                  <div>
                    <span className="window-dot" />
                    <span className="window-dot" />
                    <span className="window-dot" />
                  </div>
                  <span>Product trace · OR-24017</span>
                  <span className="live-chip"><span /> Live</span>
                </div>
                <div className="hero-window__body">
                  <div className="hero-window__title">
                    <div>
                      <p>AW 2026 · Outerwear</p>
                      <h2>Aster Loop Jacket</h2>
                    </div>
                    <div className="readiness-ring" style={{ "--progress": "84" } as React.CSSProperties}>
                      <span>84%</span>
                      <small>ready</small>
                    </div>
                  </div>

                  <div className="trace-canvas">
                    <div className="trace-line" aria-hidden="true"><span /></div>
                    {[
                      ["Raw", "Fina", "ok"],
                      ["Fabric", "NovaTex", "ok"],
                      ["Dye", "Chromia", "warn"],
                      ["Make", "Miro", "review"],
                      ["Pack", "Packwise", "ok"],
                    ].map(([stage, company, state]) => (
                      <div className={`trace-node trace-node--${state}`} key={stage}>
                        <span className="trace-node__icon">
                          {state === "ok" ? <CheckCircle weight="fill" /> : state === "warn" ? <WarningCircle weight="fill" /> : <Scan />}
                        </span>
                        <small>{stage}</small>
                        <strong>{company}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="hero-evidence-grid">
                    <div className="evidence-stack">
                      <div className="evidence-stack__head">
                        <span>Evidence linked</span>
                        <strong>15 documents</strong>
                      </div>
                      <div className="mini-document">
                        <FileText size={20} />
                        <span><strong>GRS Certificate</strong><small>98% extraction confidence</small></span>
                        <CheckCircle size={18} weight="fill" />
                      </div>
                      <div className="mini-document mini-document--warning">
                        <FileText size={20} />
                        <span><strong>REACH declaration</strong><small>Requested · 2 days overdue</small></span>
                        <WarningCircle size={18} weight="fill" />
                      </div>
                    </div>
                    <div className="next-action-card">
                      <span className="next-action-card__label">Next action</span>
                      <strong>Collect dye-lot declaration</strong>
                      <p>Chromia Works · Como, Italy</p>
                      <span className="next-action-card__link">View request <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </div>
                <div className="scan-beam" aria-hidden="true" />
              </div>
              <div className="hero-float-card hero-float-card--left">
                <span><FileMagnifyingGlass size={19} weight="duotone" /></span>
                <div><strong>11 fields extracted</strong><small>Ready for human review</small></div>
              </div>
              <div className="hero-float-card hero-float-card--right">
                <span><ShieldCheck size={19} weight="duotone" /></span>
                <div><strong>Evidence verified</strong><small>Certificate matched</small></div>
              </div>
            </div>
          </div>
        </section>

        <section className="client-network" aria-label="Fashion company logos">
          <p className="sr-only" id="demo-network-instructions">
            Focus or hover over the moving company list to pause it.
          </p>
          <div
            className="client-ticker"
            role="region"
            aria-label="Fictional fashion companies in the Orin demo"
            aria-describedby="demo-network-instructions"
            tabIndex={0}
          >
            <div className="client-ticker__track">
              {[false, true].map((duplicate) => (
                <div
                  className="client-ticker__group"
                  role={duplicate ? undefined : "list"}
                  aria-hidden={duplicate ? "true" : undefined}
                  key={duplicate ? "duplicate" : "primary"}
                >
                  {demoFashionClients.map(({ mark, name, style }) => (
                    <div
                      className={`client-wordmark client-wordmark--${style}`}
                      role={duplicate ? undefined : "listitem"}
                      key={`${duplicate ? "duplicate" : "primary"}-${name}`}
                    >
                      <span className="client-wordmark__mark" aria-hidden="true">{mark}</span>
                      <strong>{name}</strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="problem-strip" id="why-orin">
          <div className="marketing-container problem-strip__inner">
            <p>The reality behind one product</p>
            <div className="problem-stat">
              <strong>6</strong>
              <span>supplier relationships</span>
            </div>
            <span className="problem-plus">+</span>
            <div className="problem-stat">
              <strong>100s</strong>
              <span>of scattered documents</span>
            </div>
            <span className="problem-equals">becomes</span>
            <div className="problem-result">
              <LinkSimple size={22} weight="duotone" />
              <span><strong>one connected record</strong><small>with every source visible</small></span>
            </div>
          </div>
        </section>

        <section className="marketing-section supply-section" id="product">
          <div className="marketing-container">
            <div className="section-heading section-heading--split">
              <div>
                <span className="section-kicker">The complete evidence chain</span>
                <h2>Trace the product, not the paperwork.</h2>
              </div>
              <p>
                Orin organizes every company, certificate, and claim around the product it proves—so teams can
                see the chain, the evidence, and the gaps in one view.
              </p>
            </div>

            <div className="supplier-chain" role="list" aria-label="Example Orin supply chain">
              <div className="supplier-chain__flow" aria-hidden="true"><span /></div>
              {supplierRoles.map(({ label, name, icon: Icon, warning }) => (
                <div
                  className={`supplier-card ${warning ? "supplier-card--warning" : ""}`}
                  role="listitem"
                  key={label}
                >
                  <span className="supplier-card__icon"><Icon size={22} weight="duotone" /></span>
                  <small>{label}</small>
                  <strong>{name}</strong>
                  <span className={`supplier-card__state ${warning ? "is-warning" : ""}`}>
                    {warning ? <WarningCircle size={14} weight="fill" /> : <CheckCircle size={14} weight="fill" />}
                    {warning ? "1 gap" : "Verified"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing-section how-section" id="how-it-works">
          <div className="marketing-container">
            <div className="section-heading section-heading--center">
              <span className="section-kicker">From inbox to evidence</span>
              <h2>A cleaner path from document to decision.</h2>
              <p>Designed for the real work compliance and supply-chain teams do every day.</p>
            </div>

            <div className="steps-grid">
              {[
                { number: "01", title: "Collect", copy: "Bring supplier PDFs, scans, certificates, and declarations into one evidence inbox.", icon: FileText },
                { number: "02", title: "Extract", copy: "Turn document content into typed product fields with confidence and source links.", icon: Scan },
                { number: "03", title: "Review", copy: "Focus human attention on conflicts, missing proof, and lower-confidence answers.", icon: FileMagnifyingGlass },
                { number: "04", title: "Share", copy: "Publish an evidence-backed product passport with a clear audit trail.", icon: CirclesThreePlus },
              ].map(({ number, title, copy, icon: Icon }) => (
                <article className="step-card" key={number}>
                  <div className="step-card__top"><span>{number}</span><Icon size={25} weight="duotone" /></div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing-section intelligence-section">
          <div className="marketing-container intelligence-layout">
            <div className="intelligence-copy">
              <span className="section-kicker section-kicker--dark">Document intelligence</span>
              <h2>AI does the reading. Your team keeps the judgment.</h2>
              <p>
                Each extracted value keeps its document source, confidence, and review state. Orin is ready for
                a future Llama service without locking the product workflow to one model.
              </p>
              <ul className="check-list">
                <li><CheckCircle size={18} weight="fill" /> Source-linked fields</li>
                <li><CheckCircle size={18} weight="fill" /> Confidence-aware review</li>
                <li><CheckCircle size={18} weight="fill" /> Replaceable model adapter</li>
              </ul>
              <Link className="button-link button-link--light button-link--large" href="/login">
                Try document analysis <ArrowRight size={18} weight="bold" />
              </Link>
            </div>

            <div className="extraction-panel">
              <div className="extraction-panel__head">
                <span className="document-icon"><FileText size={22} weight="duotone" /></span>
                <span><strong>GRS_Certificate_24-9081.pdf</strong><small>Processed in 3.2 seconds</small></span>
                <span className="verified-chip"><Check size={13} weight="bold" /> Complete</span>
              </div>
              <div className="extraction-table" role="table" aria-label="Extracted document fields">
                {[
                  ["Certificate", "CU-1167824", "99%"],
                  ["Issued to", "Chromia Works S.r.l.", "97%"],
                  ["Material", "Recycled polyester", "95%"],
                  ["Valid until", "30 Sep 2027", "93%"],
                  ["REACH statement", "Review needed", "72%"],
                ].map(([label, value, confidence]) => (
                  <div className="extraction-row" role="row" key={label}>
                    <span role="cell">{label}</span>
                    <strong role="cell">{value}</strong>
                    <span role="cell" className={confidence === "72%" ? "is-low" : ""}>{confidence}</span>
                  </div>
                ))}
              </div>
              <div className="extraction-review">
                <WarningCircle size={18} weight="fill" />
                <span><strong>1 field needs review</strong><small>Low-confidence statements are never auto-approved.</small></span>
                <ArrowRight size={17} />
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-section final-cta-section">
          <div className="marketing-container final-cta">
            <div className="final-cta__grid" aria-hidden="true" />
            <span className="section-kicker section-kicker--dark">See the connected record</span>
            <h2>Start with the product that needs an answer today.</h2>
            <p>Use the demo workspace to follow its evidence chain, review documents, and preview the passport.</p>
            <Link className="button-link button-link--light button-link--large" href="/login">
              Explore Orin <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="marketing-footer">
        <div className="marketing-container marketing-footer__inner">
          <BrandLogo />
          <p>Connected evidence for responsible products.</p>
          <div><Link href="/login">Demo login</Link><a href="#why-orin">Why Orin</a></div>
          <span>© 2026 Orin</span>
        </div>
      </footer>
    </div>
  );
}
