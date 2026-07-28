import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  FileArrowUp,
  FileText,
  Package,
  PaperPlaneTilt,
  SealCheck,
  Sparkle,
  StackSimple,
  TrendUp,
  WarningCircle,
} from "@/components/icons";
import { StatusPill } from "@/components/status-pill";
import type { ActivityEvent, EvidenceDocument, Product } from "@/lib/types";

interface DashboardProps {
  product: Product;
  activity: ActivityEvent[];
  evidence: EvidenceDocument[];
}

export function Dashboard({ product, activity, evidence }: DashboardProps) {
  return (
    <div className="workspace-page dashboard-page">
      <header className="workspace-page-header">
        <div>
          <span className="workspace-page-eyebrow">Thursday, July 16</span>
          <h1>Good morning, Maya.</h1>
          <p>Three product records need an answer. One is at risk.</p>
        </div>
        <div className="workspace-page-actions">
          <Link className="button-link button-link--quiet" href="/workspace/products">View all products</Link>
          <Link className="button-link button-link--primary" href="/workspace/documents">
            <FileArrowUp size={18} weight="bold" /> Add evidence
          </Link>
        </div>
      </header>

      <section className="metric-grid" aria-label="Workspace summary">
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--blue"><Package size={21} weight="duotone" /></span>
          <div><small>Products in progress</small><strong>6</strong></div>
          <span className="metric-card__trend"><TrendUp size={14} /> 2 this week</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--green"><SealCheck size={21} weight="duotone" /></span>
          <div><small>Passport ready</small><strong>2</strong></div>
          <span className="metric-card__trend metric-card__trend--success"><Check size={14} /> 33% of catalog</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--amber"><WarningCircle size={21} weight="duotone" /></span>
          <div><small>Open evidence gaps</small><strong>12</strong></div>
          <span className="metric-card__trend metric-card__trend--warning"><Clock size={14} /> 3 overdue</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--violet"><Sparkle size={21} weight="duotone" /></span>
          <div><small>Fields extracted</small><strong>143</strong></div>
          <span className="metric-card__trend"><TrendUp size={14} /> 18 today</span>
        </article>
      </section>

      <section className="dashboard-main-grid">
        <article className="workspace-card priority-card">
          <div className="workspace-card__header priority-card__header">
            <div>
              <span className="card-kicker">Priority trace</span>
              <h2>{product.name}</h2>
              <p>{product.id} · {product.season} · {product.category}</p>
            </div>
            <StatusPill status={product.status} />
          </div>

          <div className="priority-readiness">
            <div className="readiness-dial" style={{ "--progress": product.completion } as React.CSSProperties}>
              <span><strong>{product.completion}%</strong><small>ready</small></span>
            </div>
            <div className="priority-readiness__copy">
              <small>Next required answer</small>
              <strong>{product.nextAction}</strong>
              <p>Chromia Works · Request overdue by 2 days</p>
            </div>
            <button className="request-button" type="button">
              <PaperPlaneTilt size={17} weight="bold" /> Send reminder
            </button>
          </div>

          <div className="chain-list" role="list" aria-label={`${product.name} supply chain`}>
            {product.chain.map((node, index) => (
              <div className="chain-row" role="listitem" key={node.id}>
                <div className="chain-row__rail" aria-hidden="true">
                  <span className={`chain-row__dot chain-row__dot--${node.status.toLowerCase().replace(" ", "-")}`}>
                    {node.status === "Verified" ? <Check size={12} weight="bold" /> : node.status === "Missing" ? <WarningCircle size={13} weight="fill" /> : <Clock size={13} weight="fill" />}
                  </span>
                  {index < product.chain.length - 1 && <i />}
                </div>
                <div className="chain-row__content">
                  <span><small>{node.stage}</small><strong>{node.company}</strong></span>
                  <span className="chain-row__location">{node.location}</span>
                  <span className="chain-row__docs"><FileText size={15} /> {node.documents}</span>
                  <StatusPill status={node.status} compact />
                </div>
              </div>
            ))}
          </div>

          <Link className="card-footer-link" href={`/workspace/products/${product.id}`}>
            Open complete product trace <ArrowRight size={16} weight="bold" />
          </Link>
        </article>

        <aside className="workspace-card action-queue-card">
          <div className="workspace-card__header">
            <div><span className="card-kicker">Action queue</span><h2>Needs your attention</h2></div>
            <span className="count-badge">4</span>
          </div>
          <div className="action-list">
            <Link href={`/workspace/products/${product.id}`} className="action-item action-item--urgent">
              <span className="action-item__icon"><WarningCircle size={19} weight="fill" /></span>
              <span><strong>Missing REACH declaration</strong><small>Aster Loop Jacket · 2 days late</small></span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/workspace/documents" className="action-item">
              <span className="action-item__icon"><FileText size={19} weight="duotone" /></span>
              <span><strong>Review factory declaration</strong><small>Coastline Overshirt · 91% confidence</small></span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/workspace/products" className="action-item">
              <span className="action-item__icon"><SealCheck size={19} weight="duotone" /></span>
              <span><strong>Publish Meridian passport</strong><small>All required evidence is verified</small></span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/workspace/products" className="action-item action-item--urgent">
              <span className="action-item__icon"><Clock size={19} weight="fill" /></span>
              <span><strong>Certificate expired</strong><small>Forma Tailored Trouser · Jul 8</small></span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="queue-summary">
            <span><StackSimple size={18} weight="duotone" /></span>
            <div><strong>Most open items belong to dyeing partners</strong><small>5 of 12 evidence gaps</small></div>
          </div>
        </aside>
      </section>

      <section className="dashboard-secondary-grid">
        <article className="workspace-card activity-card">
          <div className="workspace-card__header">
            <div><span className="card-kicker">Recent evidence</span><h2>Activity</h2></div>
            <Link href="/workspace/documents">View inbox</Link>
          </div>
          <div className="activity-list">
            {activity.map((item) => (
              <div className="activity-item" key={item.title}>
                <span className={`activity-item__dot activity-item__dot--${item.tone}`} />
                <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                <time>{item.time}</time>
              </div>
            ))}
          </div>
        </article>

        <article className="workspace-card coverage-card">
          <div className="workspace-card__header">
            <div><span className="card-kicker">Catalog coverage</span><h2>Evidence readiness</h2></div>
            <strong>86%</strong>
          </div>
          <div className="coverage-bars" aria-label="Evidence readiness by category">
            {[
              ["Identity & origin", 100],
              ["Materials", 94],
              ["Chemicals", 68],
              ["Certifications", 88],
              ["Care & end of life", 79],
            ].map(([label, value]) => (
              <div className="coverage-row" key={String(label)}>
                <span><strong>{label}</strong><small>{value}%</small></span>
                <div className="coverage-bar"><i style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="workspace-card evidence-snapshot">
        <div className="workspace-card__header">
          <div><span className="card-kicker">Latest documents</span><h2>Evidence inbox</h2></div>
          <Link href="/workspace/documents">Open document lab <ArrowRight size={15} /></Link>
        </div>
        <div className="evidence-table-wrap">
          <table className="evidence-table">
            <thead><tr><th>Document</th><th>Supplier</th><th>Confidence</th><th>Status</th></tr></thead>
            <tbody>
              {evidence.slice(0, 4).map((document) => (
                <tr key={document.id}>
                  <td><span className="table-file-icon"><FileText size={18} /></span><span><strong>{document.title}</strong><small>{document.type}</small></span></td>
                  <td>{document.supplier}</td>
                  <td>{document.confidence ? `${document.confidence}%` : "—"}</td>
                  <td><StatusPill status={document.status} compact /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
