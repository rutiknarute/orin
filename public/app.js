const app = document.querySelector("#app");

const state = {
  session: undefined,
  products: [],
  evidence: [],
  activities: [],
  catalogLoaded: false,
  catalogLoading: false,
  catalogError: "",
  query: "",
  filter: "All",
  productTab: "Trace",
  fileName: "",
  analysis: null,
  analyzing: false,
  savingEvidence: false,
  evidenceSaved: false,
  reviewed: new Set(),
  faqOpen: new Set([0]),
  chatOpen: false,
  chatExpanded: false,
  chatThread: [],
  loginBusy: false,
  loginError: "",
  passportCache: new Map(),
  passportLoading: new Set(),
  toast: "",
  toastTimer: null,
};

const iconPaths = {
  arrow: '<path d="M5 12h14M14 6l6 6-6 6"/>',
  back: '<path d="M19 12H5m6 6-6-6 6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  document: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/>',
  dots: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
  collapse: '<path d="M9 3v6H3M21 15h-6v6M10 10 3.5 3.5M14 14l6.5 6.5"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h7"/>',
  file: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  package: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>',
  passport: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="11" r="4"/><path d="M8 11h8M12 7c1.4 1.3 1.4 6.7 0 8M12 7c-1.4 1.3-1.4 6.7 0 8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.8 3.1 8.1 7.5 9.5 4.4-1.4 7.5-4.7 7.5-9.5V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
  sliders: '<path d="M4 8h9M19 8h1M4 16h4M14 16h6"/><circle cx="16" cy="8" r="2.4"/><circle cx="11" cy="16" r="2.4"/>',
  sparkle: '<path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4zM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M5 20h14"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  warning: '<path d="M12 3 2.5 20h19z"/><path d="M12 9v4M12 17h.01"/>',
};

function icon(name, className = "") {
  return `<svg class="icon ${className}" aria-hidden="true" viewBox="0 0 24 24">${iconPaths[name] ?? iconPaths.sparkle}</svg>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

function statusClass(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function status(value) {
  return `<span class="status status--${statusClass(value)}">${escapeHtml(value)}</span>`;
}

async function api(path, options = {}) {
  const headers = { Accept: "application/json", ...(options.headers ?? {}) };
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  const response = await fetch(path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error ?? "The request could not be completed.");
    error.status = response.status;
    throw error;
  }
  return body;
}

function navigate(path, { replace = false } = {}) {
  if (replace) history.replaceState({}, "", path);
  else history.pushState({}, "", path);
  window.scrollTo({ top: 0, behavior: "auto" });
  render();
}

function showToast(message) {
  state.toast = message;
  clearTimeout(state.toastTimer);
  render();
  state.toastTimer = setTimeout(() => {
    state.toast = "";
    render();
  }, 3000);
}

function toastMarkup() {
  return state.toast ? `<div class="toast" role="status">${icon("check")}<span>${escapeHtml(state.toast)}</span></div>` : "";
}

function logoMarkup() {
  return '<span class="wordmark"><img class="brand-mark" src="/logo-orin.png" alt="" width="256" height="256" decoding="async" /><span>orin</span></span>';
}

function navLink(path, label, iconName, current) {
  const active = current === path || (path === "/app/products" && current.startsWith("/app/products/"));
  return `<a href="${path}" data-nav${active ? ' aria-current="page"' : ""}>${icon(iconName)}<span>${label}</span></a>`;
}

function legacyPath(path) {
  if (path === "/workspace") return "/app";
  if (path.startsWith("/workspace/products")) return path.replace("/workspace/products", "/app/products");
  if (path.startsWith("/workspace/documents")) return path.replace("/workspace/documents", "/app/documents");
  return path;
}

function pageTitle(path) {
  if (path === "/") return "Orin — Product compliance workspace";
  if (path === "/login") return "Sign in — Orin";
  if (path === "/app") return "Overview — Orin";
  if (path === "/app/products") return "Products — Orin";
  if (path.startsWith("/app/products/")) return "Product record — Orin";
  if (path === "/app/documents") return "Document lab — Orin";
  if (path.startsWith("/passport/")) return "Digital product passport — Orin";
  return "Page not found — Orin";
}

function shell({ section, title, actions = "", content }) {
  const path = window.location.pathname;
  const user = state.session?.user ?? { name: "Maya Chen", initials: "MC", role: "Compliance lead" };
  return `
    <div class="app-shell">
      <aside class="sidebar" aria-label="Workspace navigation">
        <a class="sidebar__brand" href="/app" data-nav aria-label="Orin overview">${logoMarkup()}</a>
        <div class="sidebar__workspace">
          <span class="workspace-avatar">NS</span>
          <span><strong>Northline Studio</strong><span>Product compliance</span></span>
        </div>
        <p class="sidebar__label">Workspace</p>
        <nav class="sidebar__nav">
          ${navLink("/app", "Overview", "dashboard", path)}
          ${navLink("/app/products", "Products", "package", path)}
          ${navLink("/app/documents", "Document lab", "document", path)}
        </nav>
        <div class="sidebar__spacer"></div>
        <div class="sidebar__user">
          <span class="user-avatar">${escapeHtml(user.initials)}</span>
          <span class="sidebar__user-copy"><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.role)}</span></span>
          <button class="icon-button" type="button" data-action="logout" aria-label="Sign out" title="Sign out">${icon("logout")}</button>
        </div>
      </aside>
      <div class="workspace">
        <header class="mobile-header">
          <a href="/app" data-nav aria-label="Orin overview">${logoMarkup()}</a>
          <button class="icon-button" type="button" data-action="logout" aria-label="Sign out">${icon("logout")}</button>
        </header>
        <header class="workspace-header">
          <div class="breadcrumb"><span>Northline Studio</span><span>/</span><strong>${escapeHtml(section)}</strong></div>
          <div class="workspace-header__actions">${actions}</div>
        </header>
        <main class="workspace-content" id="main-content" tabindex="-1">
          ${content}
        </main>
        <nav class="mobile-nav" aria-label="Mobile workspace navigation">
          ${navLink("/app", "Overview", "dashboard", path)}
          ${navLink("/app/products", "Products", "package", path)}
          ${navLink("/app/documents", "Documents", "document", path)}
        </nav>
      </div>
    </div>`;
}

const trustedBy = [
  "Northline Studio",
  "Marrow & Vale",
  "Atelier Sundry",
  "Kestrel Apparel",
  "Halden Textiles",
  "Verdiga",
  "Lumen Field Goods",
  "Bracken & Co.",
  "Saltmarsh Denim",
  "Ostara Knitwear",
];

function tickerSection() {
  // The row is rendered twice so the loop can restart with no visible seam.
  // The duplicate is hidden from assistive tech to avoid reading it out again.
  const row = (duplicate) =>
    `<div class="ticker__row"${duplicate ? ' aria-hidden="true"' : ""}>${trustedBy
      .map((name) => `<span class="ticker__item">${escapeHtml(name)}</span>`)
      .join("")}</div>`;

  return `
    <section class="ticker" aria-label="Teams tracking evidence in Orin">
      <span class="ticker__label">Trusted by product teams at</span>
      <div class="ticker__viewport">
        <div class="ticker__track">${row(false)}${row(true)}</div>
      </div>
    </section>`;
}

const ctaPoints = [
  {
    icon: "shield",
    title: "Complete records.",
    detail: "Every supplier answer attached to the product it belongs to.",
  },
  {
    icon: "search",
    title: "Fewer chases.",
    detail: "Gaps surface early, before they hold up a launch.",
  },
  {
    icon: "passport",
    title: "Passports worth trusting.",
    detail: "Published from verified evidence, never from guesswork.",
  },
];

const flowSteps = [
  {
    kicker: "01 — Evidence intake",
    title: "Collect without chasing",
    body: "Keep supplier, product, and evidence context together instead of losing it across inboxes and sheets.",
    action: "See the document lab",
    href: "/login",
    art: `<img class="flow-art" src="/flow-01-intake.jpg" alt="Evidence from suppliers gathering into a single product record." width="900" height="563" loading="lazy" decoding="async" />`,
  },
  {
    kicker: "02 — Review queue",
    title: "Review what matters",
    body: "See missing declarations and low-confidence fields immediately, with a focused queue for your team.",
    action: "See the review queue",
    href: "/login",
    art: `<img class="flow-art" src="/flow-02-review.jpg" alt="Layered review cards showing items queued for a human check." width="900" height="450" loading="lazy" decoding="async" />`,
  },
  {
    kicker: "03 — Passport publication",
    title: "Publish with confidence",
    body: "Turn verified records into a public product passport with a clear, auditable supply-chain story.",
    action: "View a live passport",
    href: "/passport/OR-24019",
    art: `<img class="flow-art" src="/flow-03-passport.jpg" alt="A published digital product passport with its supply-chain trail and QR code." width="900" height="563" loading="lazy" decoding="async" />`,
  },
];

const chatIntro =
  "Orin keeps every supplier certificate, test report and declaration attached to the product it belongs to — so you can see what is verified and what is still missing. Want to look around the workspace?";

function chatWidget() {
  if (!state.chatOpen) {
    return `
      <button class="chat-launcher" type="button" data-action="chat-open">
        <span class="chat-launcher__mark" aria-hidden="true">
          <img src="/logo-orin.png" alt="" width="256" height="256" decoding="async" />
        </span>
        <span class="chat-launcher__label">Ask Orin</span>
      </button>`;
  }

  const thread = state.chatThread
    .map(
      (entry) =>
        `<p class="chat-msg chat-msg--${entry.from}">${escapeHtml(entry.text)}</p>`,
    )
    .join("");

  return `
    <section class="chat-panel${state.chatExpanded ? " chat-panel--expanded" : ""}" role="dialog" aria-label="Ask Orin">
      <div class="chat-panel__top">
        <span class="chat-orb" aria-hidden="true">
          <img src="/logo-orin.png" alt="" width="256" height="256" decoding="async" />
        </span>
        <span>Ask Orin</span>
        <div class="chat-panel__controls">
          <button
            class="chat-expand"
            type="button"
            data-action="chat-expand"
            aria-expanded="${state.chatExpanded}"
            aria-label="${state.chatExpanded ? "Shrink the assistant" : "Expand the assistant"}"
            title="${state.chatExpanded ? "Shrink" : "Expand"}"
          >
            ${icon(state.chatExpanded ? "collapse" : "expand")}
          </button>
          <button class="chat-close" type="button" data-action="chat-close" aria-label="Close the assistant">
            ${icon("plus")}
          </button>
        </div>
      </div>
      <div class="chat-body">
        <p class="chat-intro">${escapeHtml(chatIntro)}</p>
        ${thread}
      </div>
      <a class="chat-cta" href="/login" data-nav>Open the workspace</a>
      <form class="chat-input" id="chat-form">
        <input
          id="chat-question"
          name="question"
          type="text"
          autocomplete="off"
          placeholder="Ask about a product or supplier"
          aria-label="Ask the Orin assistant a question"
        />
        <button class="chat-send" type="submit" aria-label="Send">${icon("arrow")}</button>
      </form>
      <p class="chat-legal">
        This assistant points you to the right place in the demo. Nothing is sent to an external service.
      </p>
    </section>`;
}

function landingPage() {
  return `
    <div class="marketing-page">
      <header class="marketing-header">
        <div class="marketing-header__inner">
          <a href="/" data-nav aria-label="Orin home">${logoMarkup()}</a>
          <nav class="marketing-header__links" aria-label="Main navigation">
            <a href="#workflow">How it works</a>
            <a href="#results">Results</a>
            <a href="#faq">FAQ</a>
            <a href="/passport/OR-24019" data-nav>Passport example</a>
          </nav>
          <div class="marketing-header__actions">
            <a class="button button--ghost button--small" href="/login" data-nav>Sign in</a>
            <a class="button button--mint button--small" href="/login" data-nav>Open demo ${icon("arrow")}</a>
          </div>
        </div>
      </header>
      <main id="main-content">
        <section class="hero">
          <div class="hero__copy">
            <div class="hero__label">Built for product compliance teams</div>
            <h1>Supply chain clarity, without <em>spreadsheet archaeology.</em></h1>
            <p class="hero__lede">Turn scattered supplier evidence into complete, auditable digital product passports—inside one fast workspace.</p>
            <div class="hero__actions">
              <a class="button button--mint" href="/login" data-nav>Explore the workspace ${icon("arrow")}</a>
              <a class="button button--ghost" href="/passport/OR-24019" data-nav>View a live passport ${icon("external")}</a>
            </div>
          </div>
          <div class="hero-visual" aria-label="Product compliance workspace preview">
            <div class="query-frame">
              <div class="query-card">
                <div class="query-card__head">
                  <img class="query-card__thumb" src="/product-aster-loop-jacket.jpg" alt="" width="540" height="486" decoding="async" />
                  <span class="query-card__title"><strong>Product record</strong><span>OR-24017 · Aster Loop Jacket</span></span>
                </div>
                <div class="query-bar">
                  <span class="query-bar__add" aria-hidden="true">${icon("plus")}</span>
                  <span class="query-bar__text"><span class="query-bar__typed">Which suppliers still owe evidence for this product?</span></span>
                  <span class="query-bar__filter" aria-hidden="true">${icon("sliders")}</span>
                  <span class="query-bar__action" aria-hidden="true">${icon("sparkle")}</span>
                </div>
                <div class="query-sources">
                  ${[
                    ["shield", "Certificates"],
                    ["document", "Test reports"],
                    ["file", "Declarations"],
                    ["package", "Mill records"],
                    ["globe", "Origin data"],
                  ]
                    .map(
                      ([name, label]) =>
                        `<span class="source-chip">${icon(name)}<span>${label}</span></span>`,
                    )
                    .join("")}
                  <span class="query-sources__more" aria-hidden="true">${icon("dots")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        ${tickerSection()}
        <section class="marketing-strip" id="results" aria-label="Customer results">
          <div><strong>84%</strong><span>less manual evidence entry</span></div>
          <div><strong>3.4×</strong><span>faster product reviews</span></div>
          <div><strong>100%</strong><span>traceable evidence history</span></div>
          <div><strong>1 place</strong><span>for every product record</span></div>
        </section>
        <section class="marketing-section" id="workflow">
          <div class="section-inner">
            <div class="section-heading">
              <h2>From supplier file to passport, in one clean flow.</h2>
              <p>Orin keeps the work understandable: collect evidence, resolve the gaps, and publish a passport customers can trust.</p>
            </div>
            <div class="flow-grid">
              ${flowSteps
                .map(
                  (step) => `
                <article class="flow-card">
                  <div class="flow-card__media">${step.art}</div>
                  <span class="flow-card__kicker">${escapeHtml(step.kicker)}</span>
                  <h3>${escapeHtml(step.title)}</h3>
                  <p>${escapeHtml(step.body)}</p>
                  <a class="flow-card__link" href="${step.href}" data-nav>
                    <span class="flow-card__arrow" aria-hidden="true">${icon("arrow")}</span>
                    <span>${escapeHtml(step.action)}</span>
                  </a>
                </article>`,
                )
                .join("")}
            </div>
          </div>
        </section>
        ${faqSection()}
        <section class="marketing-cta">
          <div class="cta-copy">
            <span class="cta-rule" aria-hidden="true"></span>
            <h2>Your product data deserves a calmer home.</h2>
            <p>Open the local demo and move from overview to product passport in under a minute.</p>
            <a class="button" href="/login" data-nav>Enter the workspace ${icon("arrow")}</a>
          </div>
          <div class="cta-stack">
            ${ctaPoints
              .map(
                (point, index) => `
              <article class="cta-card">
                <span class="cta-card__icon" aria-hidden="true">${icon(point.icon)}</span>
                <div class="cta-card__body">
                  <span class="cta-card__index">${String(index + 1).padStart(2, "0")}</span>
                  <span class="cta-card__text">
                    <strong>${escapeHtml(point.title)}</strong>
                    <span>${escapeHtml(point.detail)}</span>
                  </span>
                </div>
              </article>`,
              )
              .join("")}
          </div>
        </section>
        <section class="showcase" aria-label="How Orin traces a product">
          <img
            class="showcase__image"
            src="/hero-supply-chain.jpg"
            width="1672"
            height="941"
            loading="lazy"
            decoding="async"
            alt="Orin's product journey runs from raw materials through tier 3, tier 2 and tier 1 suppliers to manufacturing, the brand, and you — alongside supply chain transparency, document intelligence, sustainability compliance, and a scannable digital product passport."
          />
        </section>
      </main>
      ${chatWidget()}
      <footer class="marketing-footer"><span>${logoMarkup()}</span><span>Product compliance, made legible.</span><span>© 2026 Orin</span></footer>
    </div>`;
}

const faqs = [
  {
    question: "What is Orin?",
    answer:
      "Orin is a workspace for product compliance teams. It gathers the evidence your suppliers send you — certificates, test reports, declarations — keeps it attached to the right product, shows you exactly what is still missing, and turns a complete record into a digital product passport you can publish.",
  },
  {
    question: "Who is it for?",
    answer:
      "Compliance, sourcing, and product teams at brands that have to prove what a product is made of and where it came from. It is built for the person who currently keeps that answer in a spreadsheet and a shared inbox.",
  },
  {
    question: "What is a digital product passport?",
    answer:
      "A public, shareable record of a product's materials, origin, and supply-chain stages, backed by the evidence behind each claim. Regulations such as the EU Ecodesign for Sustainable Products Regulation are making them mandatory for more categories, and customers increasingly expect them.",
  },
  {
    question: "How does the document lab work?",
    answer:
      "Upload a supplier PDF or scan and Orin reads it into structured fields — certificate number, issuing body, material, validity dates. Each field carries a confidence score, and anything the system is unsure about is held back for a human to confirm before it becomes evidence.",
  },
  {
    question: "When is a product considered passport ready?",
    answer:
      "When every required field is filled, each supply-chain stage has verified supporting evidence, and no open review items remain. Until then the record shows a completion score and the specific next action that will move it forward.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "This build runs as a single local Node process. The interface, the API, and your saved evidence all live on your own machine — there is no hosted database, no third-party analytics, and nothing is sent to an external service.",
  },
  {
    question: "How do I try it?",
    answer:
      "Open the demo workspace and sign in with maya@orin.demo / orin-demo. It is preloaded with six products at different stages of completion, so you can move from the overview to a published passport in about a minute.",
  },
];

function faqSection() {
  const items = faqs
    .map((item, index) => {
      const open = state.faqOpen.has(index);
      return `
        <article class="faq-item">
          <h3>
            <button
              class="faq-question"
              type="button"
              id="faq-trigger-${index}"
              data-action="faq"
              data-index="${index}"
              aria-expanded="${open}"
              aria-controls="faq-panel-${index}"
            >
              <span>${escapeHtml(item.question)}</span>
              <span class="faq-toggle" aria-hidden="true"></span>
            </button>
          </h3>
          <div
            class="faq-answer"
            id="faq-panel-${index}"
            role="region"
            aria-labelledby="faq-trigger-${index}"
            ${open ? "" : "hidden"}
          >
            <p>${escapeHtml(item.answer)}</p>
          </div>
        </article>`;
    })
    .join("");

  return `
    <section class="marketing-section faq-section" id="faq">
      <div class="section-inner faq-inner">
        <div class="faq-intro">
          <span class="eyebrow">FAQ</span>
          <h2>Questions, answered.</h2>
          <p>What Orin does, how the evidence gets there, and where your data lives.</p>
          <a class="text-link faq-intro__link" href="/login" data-nav>Open the demo ${icon("arrow")}</a>
        </div>
        <div class="faq-list">${items}</div>
      </div>
    </section>`;
}

function loginPage() {
  return `
    <main class="login-page" id="main-content">
      <section class="login-panel">
        <div class="login-panel__top">
          <a href="/" data-nav aria-label="Orin home">${logoMarkup()}</a>
          <a class="text-link" href="/" data-nav>${icon("back")} Back to site</a>
        </div>
        <div class="login-panel__form">
          <span class="eyebrow">Local workspace</span>
          <h1>Welcome back.</h1>
          <p>Sign in to review products, evidence, and passports.</p>
          <form id="login-form" novalidate>
            <div class="form-field"><label for="email">Email</label><input class="form-input" id="email" name="email" type="email" autocomplete="username" required value="maya@orin.demo" /></div>
            <div class="form-field"><label for="password">Password</label><input class="form-input" id="password" name="password" type="password" autocomplete="current-password" required value="orin-demo" /></div>
            ${state.loginError ? `<p class="form-error" role="alert">${escapeHtml(state.loginError)}</p>` : ""}
            <button class="button button--wide" type="submit" ${state.loginBusy ? "disabled" : ""}>${state.loginBusy ? "Signing in…" : `Sign in ${icon("arrow")}`}</button>
          </form>
          <div class="demo-box"><strong>Demo access is ready</strong><code>maya@orin.demo / orin-demo</code><br /><button class="text-link" type="button" data-action="demo-fill">Fill demo details ${icon("arrow")}</button></div>
        </div>
      </section>
      <aside class="login-art" aria-label="Orin workspace overview">
        <span class="login-art__label">One record. Every supplier. Complete context.</span>
        <blockquote>Compliance work should feel <em>clear,</em> not chaotic.</blockquote>
        <div class="login-art__proof"><span class="login-art__avatars"><span>MC</span><span>NW</span><span>IC</span></span><span>Built around the way product teams actually review evidence.</span></div>
      </aside>
    </main>`;
}

function pageHeading(title, description, actions = "") {
  return `<div class="page-heading"><div><span class="eyebrow">Compliance workspace</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div>${actions ? `<div class="page-heading__actions">${actions}</div>` : ""}</div>`;
}

function dashboardPage() {
  const needsAttention = state.products.filter((product) => product.openItems > 0);
  const ready = state.products.filter((product) => product.status === "Passport ready").length;
  const totalEvidence = state.products.reduce((sum, product) => sum + product.evidence, 0);
  const average = Math.round(state.products.reduce((sum, product) => sum + product.completion, 0) / Math.max(state.products.length, 1));
  const focus = state.products[0];
  const date = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  const metrics = [
    ["Products tracked", state.products.length, "+2 this week", "package"],
    ["Open review items", needsAttention.reduce((sum, product) => sum + product.openItems, 0), "3 due soon", "warning"],
    ["Evidence records", totalEvidence, "+12 this month", "document"],
    ["Passports ready", ready, `${average}% avg. complete`, "passport"],
  ];

  const priorities = needsAttention.slice(0, 3).map((product) => `
    <li><a class="priority-row" href="/app/products/${encodeURIComponent(product.id)}" data-nav>
      <span class="product-token">${escapeHtml(product.name.charAt(0))}</span>
      <span class="priority-row__copy"><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(product.nextAction)}</span></span>
      ${status(product.status)}
    </a></li>`).join("");

  const activityRows = state.activities.map((item) => `
    <li class="activity-row">
      <span class="activity-dot activity-dot--${escapeHtml(item.tone)}">${icon(item.tone === "warning" ? "warning" : "check")}</span>
      <span class="activity-row__copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></span>
      <time>${escapeHtml(item.time)}</time>
    </li>`).join("");

  const content = `
    ${pageHeading(`Good morning, ${state.session.user.firstName}.`, `${date} · Here is what needs attention today.`, `<a class="button" href="/app/documents" data-nav>${icon("upload")} Add evidence</a>`)}
    <section class="metric-grid" aria-label="Workspace summary">
      ${metrics.map(([label, value, note, iconName]) => `<article class="metric-card"><div class="metric-card__top"><span>${label}</span><span class="metric-card__icon">${icon(iconName)}</span></div><strong>${value}</strong><small>${note}</small></article>`).join("")}
    </section>
    <div class="dashboard-grid">
      <div class="dashboard-stack">
        <section class="focus-card">
          <div class="focus-card__top"><div><small>Focus product</small><h2>${escapeHtml(focus.name)}</h2><p>${escapeHtml(focus.sku)} · ${escapeHtml(focus.season)}</p></div><div class="focus-score" aria-label="${focus.completion}% complete"><span>${focus.completion}%</span></div></div>
          <div class="focus-card__stats"><div><strong>${focus.evidence}</strong><span>Evidence</span></div><div><strong>${focus.suppliers}</strong><span>Suppliers</span></div><div><strong>${focus.openItems}</strong><span>Open items</span></div></div>
          <div class="focus-card__action"><p>Next best action<strong>${escapeHtml(focus.nextAction)}</strong></p><a class="button button--mint button--small" href="/app/products/${encodeURIComponent(focus.id)}" data-nav>Open record ${icon("arrow")}</a></div>
        </section>
        <section class="card"><header class="card__header"><div><h2>Priority queue</h2><span>${needsAttention.length} products need action</span></div><a class="text-link" href="/app/products" data-nav>View all ${icon("arrow")}</a></header><ul class="priority-list">${priorities}</ul></section>
      </div>
      <div class="dashboard-stack">
        <section class="card"><header class="card__header"><div><h2>Recent activity</h2><span>Across your workspace</span></div></header><ul class="activity-list">${activityRows}</ul></section>
        <aside class="dashboard-callout">${icon("sparkle")}<h3>Document lab</h3><p>Extract structured evidence fields from a supplier PDF in seconds.</p><a class="text-link" href="/app/documents" data-nav>Analyze a document ${icon("arrow")}</a></aside>
      </div>
    </div>`;

  return shell({ section: "Overview", title: "Overview", actions: `<span class="status status--verified">Local data connected</span>`, content });
}

function productsPage() {
  const filters = ["All", "Needs evidence", "In review", "At risk", "Passport ready"];
  const query = state.query.trim().toLowerCase();
  const visible = state.products.filter((product) => {
    const matchesFilter = state.filter === "All" || product.status === state.filter;
    const haystack = `${product.name} ${product.sku} ${product.id} ${product.category}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });

  const cards = visible.length ? visible.map((product) => `
    <a class="product-card" href="/app/products/${encodeURIComponent(product.id)}" data-nav aria-label="Open ${escapeHtml(product.name)}">
      <div class="product-card__visual${product.image ? " product-card__visual--photo" : ""}">
        ${product.image ? `<img class="product-photo" src="${escapeHtml(product.image)}" alt="" loading="lazy" decoding="async" />` : ""}
        <span class="product-card__completion">${product.completion}% complete</span>
      </div>
      <div class="product-card__body">
        <div class="product-card__meta"><code>${escapeHtml(product.id)}</code>${status(product.status)}</div>
        <h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.category)} · ${escapeHtml(product.season)} · ${escapeHtml(product.color)}</p>
        <div class="product-card__footer"><span>${icon("document")} ${product.evidence} files</span><span>${icon("globe")} ${product.suppliers} suppliers</span><span>Updated ${escapeHtml(product.updatedAt)}</span></div>
      </div>
    </a>`).join("") : `<div class="empty-state">${icon("search")}<h2>No products found</h2><p>Try another search or clear the current filter.</p><button class="button button--soft button--small" type="button" data-action="clear-filters">Clear filters</button></div>`;

  const content = `
    ${pageHeading("Product library", "Every product record, evidence gap, and passport status in one view.", `<a class="button" href="/app/documents" data-nav>${icon("plus")} Add evidence</a>`)}
    <div class="catalog-toolbar">
      <label class="search-wrap">${icon("search")}<span class="sr-only">Search products</span><input class="search-input" id="product-search" type="search" placeholder="Search name, SKU, or category" value="${escapeHtml(state.query)}" autocomplete="off" /></label>
      <div class="filters" aria-label="Filter products">${filters.map((filter) => `<button class="filter-button" type="button" data-action="filter" data-value="${escapeHtml(filter)}" aria-pressed="${state.filter === filter}">${escapeHtml(filter)}</button>`).join("")}</div>
    </div>
    <div class="catalog-meta"><span>${visible.length} of ${state.products.length} products</span><span>Sorted by recent activity</span></div>
    <section class="product-grid" aria-label="Products">${cards}</section>`;

  return shell({ section: "Products", title: "Products", actions: `<span class="status status--verified">${state.products.length} active records</span>`, content });
}

function detailEvidence() {
  return `<section class="card"><header class="card__header"><div><h2>Evidence library</h2><span>${state.evidence.length} records connected to this product</span></div><a class="button button--soft button--small" href="/app/documents" data-nav>${icon("plus")} Add evidence</a></header><ul class="evidence-list">${state.evidence.map((item) => `<li class="evidence-row"><span class="file-icon">${icon("file")}</span><span class="evidence-row__copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.supplier)} · ${escapeHtml(item.type)} · ${escapeHtml(item.received)}</span></span><span class="confidence">${item.confidence ? `${item.confidence}% confidence` : "Awaiting file"}</span>${status(item.status)}</li>`).join("")}</ul></section>`;
}

function detailTrace(product) {
  return `<div class="detail-layout"><section class="card"><header class="card__header"><div><h2>Supply chain trace</h2><span>${product.chain.length} stages connected</span></div><span class="status status--verified">${product.chain.filter((item) => item.status === "Verified").length} verified</span></header><ol class="chain-list">${product.chain.map((item, index) => `<li class="chain-row"><span class="chain-row__index">${String(index + 1).padStart(2, "0")}</span><span class="chain-row__copy"><strong>${escapeHtml(item.company)}</strong><span>${escapeHtml(item.stage)} · ${escapeHtml(item.location)}</span></span><span class="chain-row__meta">${status(item.status)}<small>${item.documents} documents</small></span></li>`).join("")}</ol></section><aside class="summary-panel"><div class="summary-panel__top"><small>Next best action</small><h3>Close the final evidence gaps.</h3><p>${escapeHtml(product.nextAction)} to improve this product’s readiness score.</p></div><div class="summary-panel__items"><div class="summary-panel__item"><span>Product owner</span><strong>${escapeHtml(product.owner)}</strong></div><div class="summary-panel__item"><span>Open items</span><strong>${product.openItems}</strong></div><div class="summary-panel__item"><span>Last updated</span><strong>${escapeHtml(product.updatedAt)}</strong></div></div><div class="summary-panel__action"><button class="button button--mint button--wide" type="button" data-action="send-reminder" data-product="${escapeHtml(product.id)}">${icon("mail")} Send supplier reminder</button></div></aside></div>`;
}

function detailPassport(product) {
  return `<section class="card passport-ready"><div class="passport-ready__score"><span>${product.completion}%</span></div><h2>${product.completion === 100 ? "Passport ready to share" : "Passport draft in progress"}</h2><p>${product.completion === 100 ? "All required fields and supplier evidence are verified." : `${product.openItems} open items remain before this passport is ready to publish.`}</p><div class="page-heading__actions"><button class="button button--soft" type="button" data-action="share" data-url="/passport/${escapeHtml(product.id)}">${icon("external")} Copy share link</button><a class="button" href="/passport/${encodeURIComponent(product.id)}" data-nav>Open public passport ${icon("arrow")}</a></div></section>`;
}

function productDetailPage(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return notFoundPage("Product not found", "This product record does not exist or is no longer available.", "/app/products", "Back to products");
  const tabs = ["Trace", "Evidence", "Passport"];
  const tabContent = state.productTab === "Evidence" ? detailEvidence() : state.productTab === "Passport" ? detailPassport(product) : detailTrace(product);
  const content = `
    <a class="back-link" href="/app/products" data-nav>${icon("back")} All products</a>
    <div class="page-heading detail-heading"><div class="detail-title"><span class="detail-token">${escapeHtml(product.name.charAt(0))}</span><div><span class="eyebrow">${escapeHtml(product.category)} · ${escapeHtml(product.season)}</span><h1>${escapeHtml(product.name)}</h1><code>${escapeHtml(product.id)} · ${escapeHtml(product.sku)}</code></div></div><div class="page-heading__actions">${status(product.status)}<a class="button" href="/passport/${encodeURIComponent(product.id)}" data-nav>View passport ${icon("external")}</a></div></div>
    <section class="detail-metrics" aria-label="Product summary"><div class="detail-metric"><span>Complete</span><strong>${product.completion}%</strong></div><div class="detail-metric"><span>Evidence</span><strong>${product.evidence} files</strong></div><div class="detail-metric"><span>Suppliers</span><strong>${product.suppliers} connected</strong></div><div class="detail-metric"><span>Recycled content</span><strong>${product.recycledContent}%</strong></div><div class="detail-metric"><span>Material</span><strong>${escapeHtml(product.material)}</strong></div></section>
    <div class="tabs" role="tablist" aria-label="Product record sections">${tabs.map((tab) => `<button class="tab-button" type="button" role="tab" data-action="tab" data-value="${tab}" aria-selected="${state.productTab === tab}">${tab}</button>`).join("")}</div>
    ${tabContent}`;
  return shell({ section: "Products / Record", title: product.name, actions: `<span class="status status--verified">Saved locally</span>`, content });
}

function analysisMarkup() {
  if (!state.analysis) {
    return `<section class="card analysis-panel analysis-empty"><div class="analysis-empty__graphic" aria-hidden="true"></div><h2>Structured fields will appear here</h2><p>Choose a supplier document and Orin will organize its important product and certificate data for review.</p></section>`;
  }
  const result = state.analysis;
  return `<section class="card analysis-panel"><header class="card__header"><div><h2>Extracted evidence</h2><span>${escapeHtml(result.filename)}</span></div>${status(state.evidenceSaved ? "Verified" : "In review")}</header><div class="analysis-summary"><div><span>Document type</span><strong>${escapeHtml(result.documentType)}</strong></div><div><span>Supplier</span><strong>${escapeHtml(result.supplier)}</strong></div><div><span>Fields found</span><strong>${result.fieldsFound}</strong></div><div><span>Confidence</span><strong>${result.confidence}%</strong></div></div><div class="extracted-list">${result.extracted.map((field, index) => `<div class="extracted-row"><span class="extracted-row__label">${escapeHtml(field.label)}</span><span class="extracted-row__value">${escapeHtml(field.value)}</span><span class="confidence">${field.confidence}%</span>${state.reviewed.has(index) ? '<span class="reviewed-badge">Reviewed</span>' : `<button class="button button--soft button--small" type="button" data-action="review" data-index="${index}">Review</button>`}</div>`).join("")}</div><footer class="analysis-footer"><p>${result.reviewItems} low-confidence field needs a human check before saving.</p><div class="analysis-footer__actions"><button class="button button--soft button--small" type="button" data-action="review-all" ${state.evidenceSaved ? "disabled" : ""}>Review all</button><button class="button button--small" type="button" data-action="save-draft" ${state.savingEvidence || state.evidenceSaved ? "disabled" : ""}>${state.savingEvidence ? "Saving…" : state.evidenceSaved ? "Evidence saved" : "Save evidence"}</button></div></footer></section>`;
}

function documentsPage() {
  const file = state.fileName ? `<div class="selected-file"><span class="file-icon">${icon("file")}</span><span class="selected-file__copy"><strong>${escapeHtml(state.fileName)}</strong><span>Ready for secure local analysis</span></span>${icon("check")}</div>` : "";
  const content = `
    ${pageHeading("Document lab", "Turn supplier PDFs and scans into structured evidence fields.", `<span class="status status--verified">Processed locally</span>`)}
    <div class="document-layout">
      <section class="card upload-panel"><h2>Add supplier evidence</h2><p>PDF, PNG, or JPG · filename only is used in this local demo.</p><label class="drop-zone" for="document-file"><span class="drop-zone__icon">${icon("upload")}</span><strong>Choose a document</strong><span>Click to browse from your computer</span><input class="sr-only" id="document-file" type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" /></label>${file}<div class="upload-actions"><button class="button button--wide" type="button" data-action="analyze" ${!state.fileName || state.analyzing ? "disabled" : ""}>${state.analyzing ? "Analyzing…" : `${icon("sparkle")} Analyze document`}</button></div><p class="sample-link">No file ready? <button type="button" data-action="choose-sample">Use sample certificate.pdf</button></p></section>
      ${analysisMarkup()}
    </div>`;
  return shell({ section: "Document lab", title: "Document lab", actions: `<span class="status status--verified">Analysis API ready</span>`, content });
}

function passportPage(product) {
  return `
    <div class="passport-page">
      <header class="passport-nav"><div class="passport-nav__inner"><a href="/" data-nav aria-label="Orin home">${logoMarkup()}</a><span class="passport-nav__badge">Verified product record</span></div></header>
      <main id="main-content">
        <section class="passport-hero">
          <div class="passport-hero__visual${product.image ? " passport-hero__visual--photo" : ""}">${product.image ? `<img class="product-photo" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" decoding="async" />` : '<div class="passport-garment" aria-hidden="true"></div>'}<code>${escapeHtml(product.id)} · ${escapeHtml(product.sku)}</code></div>
          <div class="passport-hero__copy"><small>Digital product passport</small><h1>${escapeHtml(product.name)}</h1><p>${escapeHtml(product.material)} · Made across ${product.chain.length} verified supply-chain stages.</p><div class="passport-hero__facts"><div><strong>${product.recycledContent}%</strong><span>Recycled content</span></div><div><strong>${product.evidence}</strong><span>Evidence files</span></div><div><strong>${product.completion}%</strong><span>Data complete</span></div></div></div>
        </section>
        <section class="passport-content">
          <article class="passport-card"><span class="eyebrow">Materials</span><h2>Designed with circular inputs.</h2><div class="material-score"><strong>${product.recycledContent}%</strong><span>verified recycled content<br />across primary materials</span></div><div class="material-bar" aria-label="${product.recycledContent}% recycled content"><span style="--value: ${product.recycledContent}"></span></div><p style="margin: 18px 0 0; color: var(--muted); font-size: 12px">${escapeHtml(product.material)}</p></article>
          <article class="passport-card"><span class="eyebrow">Traceability</span><h2>Follow the product journey.</h2><div class="passport-chain">${product.chain.map((item, index) => `<div class="passport-chain__row"><span>${index + 1}</span><span><strong>${escapeHtml(item.company)}</strong><small>${escapeHtml(item.stage)} · ${escapeHtml(item.location)}</small></span><small>${escapeHtml(item.status)}</small></div>`).join("")}</div></article>
        </section>
      </main>
      <footer class="passport-footer">This passport was generated from verified evidence in Orin · Product record ${escapeHtml(product.id)}</footer>
    </div>`;
}

function loadingPage(message = "Loading workspace…") {
  return `<main class="boot-screen" id="main-content"><span class="brand-mark" aria-hidden="true">O</span><p>${escapeHtml(message)}</p></main>`;
}

function notFoundPage(title = "Page not found", detail = "The page you requested does not exist.", backPath = "/", backLabel = "Back to Orin") {
  return `<main class="error-page" id="main-content"><span class="error-page__code">404 · ORIN</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(detail)}</p><a class="button button--mint" href="${backPath}" data-nav>${escapeHtml(backLabel)} ${icon("arrow")}</a></main>`;
}

async function ensureCatalog() {
  if (state.catalogLoaded || state.catalogLoading) return;
  state.catalogLoading = true;
  state.catalogError = "";
  try {
    const data = await api("/api/products");
    state.products = data.products;
    state.evidence = data.evidence;
    state.activities = data.activities;
    state.catalogLoaded = true;
  } catch (error) {
    if (error.status === 401) {
      state.session = null;
      navigate("/login", { replace: true });
      return;
    }
    state.catalogError = error.message;
  } finally {
    state.catalogLoading = false;
    render();
  }
}

async function ensurePassport(id) {
  if (state.passportCache.has(id) || state.passportLoading.has(id)) return;
  const local = state.products.find((product) => product.id === id);
  if (local) {
    state.passportCache.set(id, local);
    render();
    return;
  }
  state.passportLoading.add(id);
  try {
    const data = await api(`/api/passport/${encodeURIComponent(id)}`);
    state.passportCache.set(id, data.product);
  } catch (error) {
    state.passportCache.set(id, { error: error.message });
  } finally {
    state.passportLoading.delete(id);
    render();
  }
}

function render() {
  const original = window.location.pathname;
  const path = legacyPath(original);
  if (path !== original) {
    history.replaceState({}, "", `${path}${window.location.search}${window.location.hash}`);
  }
  document.title = pageTitle(path);

  let markup;
  if (state.session === undefined) {
    markup = loadingPage("Opening local workspace…");
  } else if (path === "/") {
    markup = landingPage();
  } else if (path === "/login") {
    if (state.session) {
      navigate("/app", { replace: true });
      return;
    }
    markup = loginPage();
  } else if (path.startsWith("/passport/")) {
    const id = decodeURIComponent(path.slice("/passport/".length));
    const product = state.passportCache.get(id) ?? state.products.find((item) => item.id === id);
    if (!product) {
      markup = loadingPage("Loading product passport…");
      ensurePassport(id);
    } else if (product.error) {
      markup = notFoundPage("Passport not found", product.error, "/", "Back to Orin");
    } else {
      markup = passportPage(product);
    }
  } else if (path === "/app" || path === "/app/products" || path === "/app/documents" || path.startsWith("/app/products/")) {
    if (!state.session) {
      navigate("/login", { replace: true });
      return;
    }
    if (!state.catalogLoaded) {
      markup = state.catalogError
        ? notFoundPage("Workspace could not load", state.catalogError, "/login", "Return to sign in")
        : loadingPage("Loading product records…");
      ensureCatalog();
    } else if (path === "/app") {
      markup = dashboardPage();
    } else if (path === "/app/products") {
      markup = productsPage();
    } else if (path === "/app/documents") {
      markup = documentsPage();
    } else {
      const id = decodeURIComponent(path.slice("/app/products/".length));
      markup = productDetailPage(id);
    }
  } else {
    markup = notFoundPage();
  }

  app.innerHTML = `${markup}${toastMarkup()}`;
}

document.addEventListener("click", async (event) => {
  const navigation = event.target.closest("[data-nav]");
  if (navigation instanceof HTMLAnchorElement) {
    const url = new URL(navigation.href, window.location.origin);
    if (url.origin === window.location.origin) {
      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
      return;
    }
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;

  if (action === "demo-fill") {
    document.querySelector("#email").value = "maya@orin.demo";
    document.querySelector("#password").value = "orin-demo";
    document.querySelector("#email").focus();
  } else if (action === "logout") {
    actionTarget.disabled = true;
    await api("/api/logout", { method: "POST" }).catch(() => null);
    state.session = null;
    state.catalogLoaded = false;
    state.products = [];
    state.evidence = [];
    navigate("/login", { replace: true });
  } else if (action === "filter") {
    state.filter = actionTarget.dataset.value;
    render();
  } else if (action === "clear-filters") {
    state.filter = "All";
    state.query = "";
    render();
  } else if (action === "tab") {
    state.productTab = actionTarget.dataset.value;
    render();
  } else if (action === "chat-open") {
    state.chatOpen = true;
    render();
    document.querySelector("#chat-question")?.focus();
  } else if (action === "chat-expand") {
    state.chatExpanded = !state.chatExpanded;
    render();
    document.querySelector(".chat-expand")?.focus();
  } else if (action === "chat-close") {
    state.chatOpen = false;
    state.chatExpanded = false;
    render();
    document.querySelector(".chat-launcher")?.focus();
  } else if (action === "faq") {
    const index = Number(actionTarget.dataset.index);
    if (state.faqOpen.has(index)) state.faqOpen.delete(index);
    else state.faqOpen.add(index);
    render();
    // render() replaces the markup, so return focus to the question the user
    // just activated instead of dropping it back to the document.
    document.querySelector(`#faq-trigger-${index}`)?.focus({ preventScroll: true });
  } else if (action === "choose-sample") {
    state.fileName = "sample-transaction-certificate.pdf";
    state.analysis = null;
    state.reviewed = new Set();
    state.evidenceSaved = false;
    render();
  } else if (action === "analyze") {
    if (!state.fileName || state.analyzing) return;
    state.analyzing = true;
    render();
    try {
      const data = await api("/api/documents/analyze", { method: "POST", body: JSON.stringify({ filename: state.fileName }) });
      state.analysis = data.result;
      state.reviewed = new Set();
      state.evidenceSaved = false;
    } catch (error) {
      showToast(error.message);
    } finally {
      state.analyzing = false;
      render();
    }
  } else if (action === "review") {
    state.reviewed.add(Number(actionTarget.dataset.index));
    render();
  } else if (action === "review-all") {
    state.analysis?.extracted.forEach((_, index) => state.reviewed.add(index));
    render();
    showToast("All extracted fields marked as reviewed.");
  } else if (action === "save-draft") {
    if (!state.analysis || state.savingEvidence || state.evidenceSaved) return;
    state.savingEvidence = true;
    render();
    try {
      const data = await api("/api/evidence", { method: "POST", body: JSON.stringify({ filename: state.analysis.filename, reviewedFields: [...state.reviewed] }) });
      state.evidence.unshift(data.evidence);
      state.evidenceSaved = true;
      showToast("Evidence saved through the local backend.");
    } catch (error) {
      showToast(error.message);
    } finally {
      state.savingEvidence = false;
      render();
    }
  } else if (action === "send-reminder") {
    actionTarget.disabled = true;
    try {
      const data = await api("/api/reminders", { method: "POST", body: JSON.stringify({ productId: actionTarget.dataset.product }) });
      showToast(data.message);
    } catch (error) {
      showToast(error.message);
    }
  } else if (action === "share") {
    const shareUrl = `${window.location.origin}${actionTarget.dataset.url}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Passport link copied to your clipboard.");
    } catch {
      showToast(`Passport link: ${shareUrl}`);
    }
  }
});

document.addEventListener("submit", (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "chat-form") return;
  event.preventDefault();
  const field = event.target.querySelector("#chat-question");
  const question = field.value.trim();
  if (!question) return;
  // This demo has no model behind it, so the assistant acknowledges and points
  // at the workspace rather than inventing an answer.
  state.chatThread.push({ from: "user", text: question });
  state.chatThread.push({
    from: "bot",
    text: "That lives in the workspace — open the demo and you will see every evidence record behind it, including anything still outstanding.",
  });
  render();
  document.querySelector("#chat-question")?.focus();
});

document.addEventListener("submit", async (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "login-form") return;
  event.preventDefault();
  if (state.loginBusy) return;
  const formData = new FormData(event.target);
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    state.loginError = "Enter both your email and password.";
    render();
    return;
  }

  state.loginBusy = true;
  state.loginError = "";
  const submitButton = event.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Signing in…";
  try {
    const data = await api("/api/login", { method: "POST", body: JSON.stringify({ email, password }) });
    state.session = data;
    state.catalogLoaded = false;
    navigate("/app", { replace: true });
  } catch (error) {
    state.loginError = error.message;
    render();
  } finally {
    state.loginBusy = false;
  }
});

document.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement && event.target.id === "product-search") {
    const cursor = event.target.selectionStart;
    state.query = event.target.value;
    render();
    const replacement = document.querySelector("#product-search");
    replacement?.focus();
    replacement?.setSelectionRange(cursor, cursor);
  }
});

document.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement && event.target.id === "document-file") {
    const file = event.target.files?.[0];
    state.fileName = file?.name ?? "";
    state.analysis = null;
    state.reviewed = new Set();
    state.evidenceSaved = false;
    render();
  }
});

window.addEventListener("popstate", render);

async function initialize() {
  try {
    const session = await api("/api/session");
    state.session = session.authenticated ? session : null;
  } catch {
    state.session = null;
  }
  render();
}

initialize();
