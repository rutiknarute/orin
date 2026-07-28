import Link from "next/link";
import { PassportQr } from "@/app/passport/[id]/passport-qr";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Factory,
  Leaf,
  MapPin,
  Package,
  Recycle,
  SealCheck,
  ShieldCheck,
  Sparkle,
} from "@/components/icons";
import { BrandLogo } from "@/components/brand-logo";
import type { Product } from "@/lib/types";

export function PassportView({ product }: { product: Product }) {
  return (
    <div className="passport-page">
      <div className="passport-demo-banner"><span>Demo product passport</span><p>This record uses illustrative prototype data.</p></div>
      <header className="passport-header">
        <div className="passport-container passport-header__inner">
          <Link href="/" aria-label="Orin home"><BrandLogo priority /></Link>
          <nav aria-label="Passport navigation"><a href="#origin">Origin</a><a href="#materials">Materials</a><a href="#care">Care</a></nav>
          <Link className="passport-back-link" href={`/workspace/products/${product.id}`}><ArrowLeft size={16} /> Workspace</Link>
        </div>
      </header>

      <main>
        <section className="passport-hero">
          <div className="passport-hero__grid" aria-hidden="true" />
          <div className="passport-container passport-hero__inner">
            <div className="passport-product-art" aria-label={`${product.name} abstract material preview`}>
              <span className="passport-product-art__tag">ORIN / {product.id}</span>
              <div className="passport-product-art__shape"><i /><b /></div>
              <span className="passport-product-art__material">72% recycled polyester</span>
            </div>
            <div className="passport-hero__copy">
              <div className="passport-verified"><ShieldCheck size={17} weight="fill" /> Evidence-backed record</div>
              <span className="passport-kicker">{product.season} · {product.category}</span>
              <h1>{product.name}</h1>
              <p>{product.color} · {product.sku}</p>
              <div className="passport-hero__facts">
                <div><span><MapPin size={19} weight="duotone" /></span><p><small>Final assembly</small><strong>Porto, Portugal</strong></p></div>
                <div><span><Factory size={19} weight="duotone" /></span><p><small>Supply chain</small><strong>{product.suppliers} organizations</strong></p></div>
                <div><span><SealCheck size={19} weight="duotone" /></span><p><small>Evidence</small><strong>{product.evidence} verified files</strong></p></div>
              </div>
              <div className="passport-qr-card">
                <span className="passport-qr"><PassportQr value={`https://orin.example/passport/${product.id}`} /></span>
                <span><strong>Digital Product Passport</strong><small>Scan to reopen this verified record</small><code>{product.id}</code></span>
              </div>
            </div>
          </div>
        </section>

        <section className="passport-section passport-origin" id="origin">
          <div className="passport-container">
            <div className="passport-section-heading"><span>01 · Origin</span><h2>From fiber to finished product.</h2><p>Each stage is backed by evidence collected from the organization responsible for that claim.</p></div>
            <div className="passport-chain">
              {product.chain.map((node, index) => (
                <article key={node.id}>
                  <div className="passport-chain__number"><span>{String(index + 1).padStart(2, "0")}</span>{index < product.chain.length - 1 && <i />}</div>
                  <div className="passport-chain__content"><small>{node.stage}</small><h3>{node.company}</h3><p>{node.location}</p><span><CheckCircle size={14} weight="fill" /> {node.status === "Missing" ? "Request open" : `${node.documents} evidence files`}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="passport-section passport-materials" id="materials">
          <div className="passport-container passport-materials__grid">
            <div>
              <div className="passport-section-heading"><span>02 · Materials</span><h2>What this product is made from.</h2></div>
              <div className="passport-composition">
                <div className="passport-composition__ring"><span><strong>72%</strong><small>recycled</small></span></div>
                <div><p><i /> <span><strong>Recycled polyester</strong><small>GRS certified</small></span><b>72%</b></p><p><i /> <span><strong>Organic cotton</strong><small>GOTS scope verified</small></span><b>28%</b></p></div>
              </div>
            </div>
            <div className="passport-benefit-grid">
              <article><span><Recycle size={25} weight="duotone" /></span><small>Recycled content</small><strong>72%</strong><p>Verified by transaction certificate</p></article>
              <article><span><Leaf size={25} weight="duotone" /></span><small>Restricted substances</small><strong>Screened</strong><p>REACH evidence review pending</p></article>
              <article><span><Sparkle size={25} weight="duotone" /></span><small>Certifications</small><strong>3 active</strong><p>GRS, GOTS scope, FSC packaging</p></article>
              <article><span><Package size={25} weight="duotone" /></span><small>Packaging</small><strong>FSC</strong><p>Recyclable paper-based packaging</p></article>
            </div>
          </div>
        </section>

        <section className="passport-section passport-care" id="care">
          <div className="passport-container passport-care__grid">
            <div className="passport-section-heading"><span>03 · Care & longevity</span><h2>Keep it in use for longer.</h2><p>Thoughtful care protects the garment and reduces the need for replacement.</p></div>
            <div className="care-list">
              <div><span>30°</span><p><strong>Wash cool</strong><small>Gentle cycle with similar colors</small></p></div>
              <div><span>—</span><p><strong>Air dry</strong><small>Do not tumble dry</small></p></div>
              <div><span>R</span><p><strong>Repair first</strong><small>Patch small tears before washing</small></p></div>
              <div><span><Recycle size={21} /></span><p><strong>Return responsibly</strong><small>Use a textile collection point</small></p></div>
            </div>
          </div>
        </section>

        <section className="passport-proof-section">
          <div className="passport-container passport-proof-card">
            <span><ShieldCheck size={34} weight="duotone" /></span>
            <div><small>Record integrity</small><h2>Every claim keeps its source.</h2><p>This passport connects structured product data to {product.evidence} evidence files from {product.suppliers} organizations.</p></div>
            <div className="passport-proof-list"><span><Check size={15} weight="bold" /> Source linked</span><span><Check size={15} weight="bold" /> Human reviewed</span><span><Check size={15} weight="bold" /> Updated Jul 16, 2026</span></div>
          </div>
        </section>
      </main>

      <footer className="passport-footer"><div className="passport-container"><BrandLogo variant="reverse" /><p>Connected evidence for responsible products.</p><span>{product.id} · Demo record</span></div></footer>
    </div>
  );
}
