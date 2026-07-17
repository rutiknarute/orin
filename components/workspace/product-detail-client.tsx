"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Clock,
  DotsThree,
  DownloadSimple,
  FileText,
  LinkSimple,
  PaperPlaneTilt,
  PencilSimple,
  SealCheck,
  ShareNetwork,
  WarningCircle,
} from "@phosphor-icons/react";
import { StatusPill } from "@/components/status-pill";
import type { EvidenceDocument, Product } from "@/lib/types";

type Tab = "Trace" | "Evidence" | "Readiness";

export function ProductDetailClient({ product, evidence }: { product: Product; evidence: EvidenceDocument[] }) {
  const [tab, setTab] = useState<Tab>("Trace");

  return (
    <div className="workspace-page product-detail-page">
      <Link className="breadcrumb-back" href="/workspace/products"><ArrowLeft size={16} /> Products</Link>
      <header className="product-detail-header">
        <div className="product-detail-identity">
          <div className="product-detail-swatch" aria-hidden="true"><span /></div>
          <div>
            <span className="workspace-page-eyebrow">{product.season} · {product.category}</span>
            <h1>{product.name}</h1>
            <p>{product.id} · {product.sku}</p>
          </div>
        </div>
        <div className="product-detail-actions">
          <button className="icon-action" type="button" aria-label="More actions"><DotsThree size={22} weight="bold" /></button>
          <button className="button-link button-link--quiet" type="button"><ShareNetwork size={18} /> Share</button>
          <Link className="button-link button-link--primary" href={`/passport/${product.id}`} target="_blank">
            Preview passport <ArrowRight size={17} />
          </Link>
        </div>
      </header>

      <section className="product-detail-summary">
        <div className="summary-readiness">
          <div className="readiness-dial readiness-dial--small" style={{ "--progress": product.completion } as React.CSSProperties}>
            <span><strong>{product.completion}%</strong><small>ready</small></span>
          </div>
          <div><small>Passport readiness</small><strong>{product.openItems} open evidence items</strong><span>Updated {product.updatedAt}</span></div>
        </div>
        <div><small>Supply chain</small><strong>{product.suppliers} organizations</strong><span>{product.chain.length} connected stages</span></div>
        <div><small>Evidence</small><strong>{product.evidence} files linked</strong><span>94% average confidence</span></div>
        <div><small>Record owner</small><strong>{product.owner}</strong><span>Compliance lead</span></div>
      </section>

      <div className="product-tabs" role="tablist" aria-label="Product detail views">
        {(["Trace", "Evidence", "Readiness"] as Tab[]).map((item) => (
          <button key={item} role="tab" type="button" aria-selected={tab === item} className={tab === item ? "is-active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>

      {tab === "Trace" && (
        <div className="product-view-grid">
          <section className="workspace-card product-trace-card">
            <div className="workspace-card__header">
              <div><span className="card-kicker">Origin to assembly</span><h2>Supply-chain trace</h2></div>
              <span className="verified-count"><CheckCircle size={16} weight="fill" /> 4 verified</span>
            </div>
            <div className="trace-detail-list">
              {product.chain.map((node, index) => (
                <article className={`trace-detail-node ${node.status === "Missing" ? "trace-detail-node--warning" : ""}`} key={node.id}>
                  <div className="trace-detail-node__rail" aria-hidden="true">
                    <span>{node.status === "Verified" ? <Check size={14} weight="bold" /> : node.status === "Missing" ? <WarningCircle size={15} weight="fill" /> : <Clock size={15} weight="fill" />}</span>
                    {index < product.chain.length - 1 && <i />}
                  </div>
                  <div className="trace-detail-node__body">
                    <div className="trace-detail-node__title">
                      <span><small>{node.stage}</small><h3>{node.company}</h3><p>{node.location}</p></span>
                      <StatusPill status={node.status} compact />
                    </div>
                    <div className="trace-detail-node__meta">
                      <span><FileText size={16} /> {node.documents} linked documents</span>
                      <span><LinkSimple size={16} /> {node.note}</span>
                    </div>
                    {node.status === "Missing" && (
                      <div className="trace-gap-callout">
                        <WarningCircle size={18} weight="fill" />
                        <span><strong>Evidence gap</strong><small>The product cannot reach passport-ready status until this declaration is linked.</small></span>
                        <button type="button"><PaperPlaneTilt size={16} /> Send reminder</button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="product-side-stack">
            <section className="workspace-card product-material-card">
              <div className="workspace-card__header"><div><span className="card-kicker">Structured data</span><h2>Material composition</h2></div><button className="icon-action" type="button" aria-label="Edit material composition"><PencilSimple size={17} /></button></div>
              <p className="material-description">{product.material}</p>
              <div className="material-bar"><i style={{ width: "72%" }} /><b style={{ width: "28%" }} /></div>
              <div className="material-legend"><span><i /> Recycled polyester <strong>72%</strong></span><span><i /> Organic cotton <strong>28%</strong></span></div>
              <div className="source-proof"><SealCheck size={18} weight="duotone" /><span><strong>Supported by 3 evidence files</strong><small>Last verified Jul 15, 2026</small></span></div>
            </section>
            <section className="workspace-card open-items-card">
              <div className="workspace-card__header"><div><span className="card-kicker">Blocking readiness</span><h2>Open items</h2></div><span className="count-badge">{product.openItems}</span></div>
              <div className="open-item"><span className="open-item__priority">High</span><strong>REACH dye-lot declaration</strong><small>Chromia Works · 2 days overdue</small></div>
              <div className="open-item"><span className="open-item__priority open-item__priority--medium">Review</span><strong>Factory conformity statement</strong><small>Atelier Miro · Awaiting approval</small></div>
              <div className="open-item"><span className="open-item__priority open-item__priority--low">Info</span><strong>Confirm repair guidance</strong><small>Internal · Due Jul 20</small></div>
            </section>
          </aside>
        </div>
      )}

      {tab === "Evidence" && (
        <section className="workspace-card product-evidence-card">
          <div className="workspace-card__header"><div><span className="card-kicker">Source ledger</span><h2>Linked evidence</h2></div><button className="button-link button-link--primary" type="button"><FileText size={17} /> Add evidence</button></div>
          <div className="evidence-table-wrap">
            <table className="evidence-table">
              <thead><tr><th>Document</th><th>Supplier</th><th>Received</th><th>Fields</th><th>Confidence</th><th>Status</th></tr></thead>
              <tbody>{evidence.map((document) => <tr key={document.id}><td><span className="table-file-icon"><FileText size={18} /></span><span><strong>{document.title}</strong><small>{document.type}</small></span></td><td>{document.supplier}</td><td>{document.received}</td><td>{document.fields || "—"}</td><td>{document.confidence ? `${document.confidence}%` : "—"}</td><td><StatusPill status={document.status} compact /></td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "Readiness" && (
        <div className="readiness-view">
          <section className="workspace-card readiness-checklist-card">
            <div className="workspace-card__header"><div><span className="card-kicker">Passport checklist</span><h2>Readiness by data group</h2></div><strong>{product.completion}%</strong></div>
            {[
              ["Product identity", "Unique ID, SKU, category, market", 100, "Complete"],
              ["Origin and manufacturing", "Country, facility, supplier trail", 92, "Review"],
              ["Material composition", "Fibers, weights, recycled content", 100, "Complete"],
              ["Chemical compliance", "REACH statements and substances", 58, "Blocked"],
              ["Certifications", "Scope, issuer, validity, transactions", 88, "Review"],
              ["Care and end of life", "Care, repair, recycling guidance", 76, "Open"],
            ].map(([label, detail, value, state]) => (
              <div className="readiness-check-row" key={String(label)}>
                <span className={`readiness-check-row__icon readiness-check-row__icon--${state.toString().toLowerCase()}`}>{state === "Complete" ? <Check size={16} weight="bold" /> : <WarningCircle size={17} weight="fill" />}</span>
                <span><strong>{label}</strong><small>{detail}</small></span>
                <div><i><b style={{ width: `${value}%` }} /></i><strong>{value}%</strong></div>
              </div>
            ))}
          </section>
          <aside className="workspace-card readiness-export-card">
            <span className="readiness-export-card__icon"><DownloadSimple size={26} weight="duotone" /></span>
            <h2>Record export</h2>
            <p>Export will unlock when all blocking evidence has been verified.</p>
            <button className="button-link button-link--quiet" type="button" disabled><DownloadSimple size={17} /> Export JSON</button>
          </aside>
        </div>
      )}
    </div>
  );
}
