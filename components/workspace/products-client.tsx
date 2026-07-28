"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CaretDown,
  FunnelSimple,
  MagnifyingGlass,
  Package,
  Plus,
} from "@/components/icons";
import { StatusPill } from "@/components/status-pill";
import type { Product, ProductStatus } from "@/lib/types";

const filters: Array<"All" | ProductStatus> = [
  "All",
  "Passport ready",
  "In review",
  "Needs evidence",
  "At risk",
];

export function ProductsClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return products.filter((product) => {
      const matchesQuery =
        !normalized ||
        [product.name, product.id, product.sku, product.category]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesStatus = status === "All" || product.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, status]);

  return (
    <div className="workspace-page products-page">
      <header className="workspace-page-header">
        <div>
          <span className="workspace-page-eyebrow">Product records</span>
          <h1>Products</h1>
          <p>Trace every supplier answer, evidence file, and readiness gap by product.</p>
        </div>
        <button className="button-link button-link--primary" type="button">
          <Plus size={18} weight="bold" /> Add product
        </button>
      </header>

      <section className="product-summary-strip" aria-label="Product catalog summary">
        <div><span><Package size={19} weight="duotone" /></span><p><strong>6</strong><small>Total products</small></p></div>
        <div><i className="summary-dot summary-dot--green" /><p><strong>2</strong><small>Passport ready</small></p></div>
        <div><i className="summary-dot summary-dot--amber" /><p><strong>3</strong><small>Need attention</small></p></div>
        <div><i className="summary-dot summary-dot--red" /><p><strong>1</strong><small>At risk</small></p></div>
      </section>

      <section className="workspace-card catalog-card">
        <div className="catalog-toolbar">
          <div className="catalog-search">
            <MagnifyingGlass size={19} aria-hidden="true" />
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <input
              id="product-search"
              type="search"
              placeholder="Search product, SKU, or category"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="catalog-filters" role="group" aria-label="Filter by status">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={status === filter ? "is-active" : ""}
                onClick={() => setStatus(filter)}
                aria-pressed={status === filter}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="mobile-filter-button" type="button">
            <FunnelSimple size={18} /> Filter <CaretDown size={14} />
          </button>
        </div>

        {filtered.length ? (
          <>
            <div className="catalog-table-wrap">
              <table className="catalog-table">
                <thead>
                  <tr><th>Product</th><th>Readiness</th><th>Evidence</th><th>Owner</th><th>Status</th><th><span className="sr-only">Open</span></th></tr>
                </thead>
                <tbody>
                  {filtered.map((product, index) => (
                    <tr key={product.id}>
                      <td>
                        <Link href={`/workspace/products/${product.id}`} className="product-cell">
                          <span className={`product-swatch product-swatch--${(index % 6) + 1}`} aria-hidden="true" />
                          <span><strong>{product.name}</strong><small>{product.id} · {product.sku}</small></span>
                        </Link>
                      </td>
                      <td>
                        <div className="table-progress"><span><strong>{product.completion}%</strong><small>{product.openItems} open</small></span><i><b style={{ width: `${product.completion}%` }} /></i></div>
                      </td>
                      <td><strong>{product.evidence}</strong><small className="table-subtext"> across {product.suppliers} suppliers</small></td>
                      <td><span className="owner-cell"><i>{product.owner.split(" ").map((part) => part[0]).join("")}</i>{product.owner}</span></td>
                      <td><StatusPill status={product.status} compact /></td>
                      <td><Link className="table-open-link" href={`/workspace/products/${product.id}`} aria-label={`Open ${product.name}`}><ArrowRight size={17} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-product-list">
              {filtered.map((product, index) => (
                <Link className="mobile-product-card" href={`/workspace/products/${product.id}`} key={product.id}>
                  <div className="mobile-product-card__top">
                    <span className={`product-swatch product-swatch--${(index % 6) + 1}`} />
                    <span><strong>{product.name}</strong><small>{product.id} · {product.category}</small></span>
                    <ArrowRight size={17} />
                  </div>
                  <div className="mobile-product-card__progress"><span><strong>{product.completion}% ready</strong><small>{product.openItems} open items</small></span><i><b style={{ width: `${product.completion}%` }} /></i></div>
                  <StatusPill status={product.status} compact />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <span><MagnifyingGlass size={26} weight="duotone" /></span>
            <h2>No products match</h2>
            <p>Try a different search or remove the status filter.</p>
            <button type="button" onClick={() => { setQuery(""); setStatus("All"); }}>Clear filters</button>
          </div>
        )}
      </section>
    </div>
  );
}
