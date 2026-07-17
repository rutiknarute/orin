"use client";

import { DragEvent, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle,
  FileArrowUp,
  FileImage,
  FilePdf,
  FileText,
  MagicWand,
  Scan,
  SpinnerGap,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { evidenceDocuments } from "@/lib/demo-data";
import type { AnalysisResult } from "@/lib/types";
import { StatusPill } from "@/components/status-pill";

const pipeline = ["Upload", "Read", "Extract", "Normalize", "Review"];

export function DocumentLab() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  function chooseFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setPhase(0);
    setError("");
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  }

  async function analyze() {
    if (!fileName) {
      setError("Choose a PDF or image before starting extraction.");
      return;
    }
    setError("");
    setResult(null);
    setPhase(1);
    const timers = [
      window.setTimeout(() => setPhase(2), 260),
      window.setTimeout(() => setPhase(3), 620),
      window.setTimeout(() => setPhase(4), 920),
    ];
    try {
      const response = await fetch("/api/documents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: fileName }),
      });
      const payload = (await response.json()) as { result?: AnalysisResult; error?: string };
      if (!response.ok || !payload.result) throw new Error(payload.error ?? "Analysis failed");
      window.setTimeout(() => {
        setResult(payload.result ?? null);
        setPhase(5);
      }, 1100);
    } catch (caught) {
      timers.forEach(window.clearTimeout);
      setPhase(0);
      setError(caught instanceof Error ? caught.message : "We could not analyze this document.");
    }
  }

  function reset() {
    setFileName("");
    setResult(null);
    setPhase(0);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const busy = phase > 0 && phase < 5;

  return (
    <div className="workspace-page documents-page">
      <header className="workspace-page-header">
        <div>
          <span className="workspace-page-eyebrow">Document intelligence</span>
          <h1>Evidence lab</h1>
          <p>Turn a supplier document into structured, source-linked product data.</p>
        </div>
        <span className="prototype-badge"><MagicWand size={16} weight="duotone" /> Demo extraction</span>
      </header>

      <section className="document-lab-grid">
        <div className="workspace-card upload-card">
          <div className="workspace-card__header"><div><span className="card-kicker">Step 1</span><h2>Add supplier evidence</h2></div></div>
          <input
            ref={inputRef}
            className="sr-only"
            id="evidence-upload"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
          <div
            className={`upload-dropzone ${dragging ? "is-dragging" : ""} ${fileName ? "has-file" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {fileName ? (
              <div className="selected-file">
                <span className="selected-file__icon"><FilePdf size={27} weight="duotone" /></span>
                <span><strong>{fileName}</strong><small>Ready for demo extraction</small></span>
                <button type="button" onClick={reset} aria-label="Remove selected file"><X size={18} /></button>
              </div>
            ) : (
              <>
                <span className="upload-dropzone__icon"><FileArrowUp size={30} weight="duotone" /></span>
                <h3>Drop a certificate, report, or declaration</h3>
                <p>PDF, PNG, or JPG · up to 25MB</p>
                <button type="button" onClick={() => inputRef.current?.click()}>Choose a file</button>
                <span className="upload-dropzone__or">or try the demo sample</span>
                <button className="sample-file-button" type="button" onClick={() => setFileName("GRS_Certificate_Chromia_2026.pdf")}>
                  <FilePdf size={17} /> GRS_Certificate_Chromia_2026.pdf
                </button>
              </>
            )}
          </div>
          {error && <p className="form-error document-error" role="alert">{error}</p>}
          <button className="button-link button-link--primary analyze-button" type="button" onClick={analyze} disabled={busy} aria-busy={busy}>
            {busy ? <SpinnerGap className="spin" size={18} /> : <Scan size={18} weight="bold" />}
            {busy ? "Reading evidence…" : "Analyze document"}
            {!busy && <ArrowRight size={17} weight="bold" />}
          </button>
          <p className="upload-privacy"><CheckCircle size={15} weight="fill" /> Demo mode uses the filename only; no file content leaves your browser.</p>
        </div>

        <div className="workspace-card pipeline-card">
          <div className="workspace-card__header"><div><span className="card-kicker">Processing</span><h2>Evidence pipeline</h2></div>{phase === 5 && <span className="verified-chip"><Check size={13} weight="bold" /> Complete</span>}</div>
          <div className="pipeline-list" aria-live="polite">
            {pipeline.map((label, index) => {
              const step = index + 1;
              const complete = phase > step || phase === 5;
              const active = phase === step && phase < 5;
              return (
                <div className={`pipeline-step ${complete ? "is-complete" : ""} ${active ? "is-active" : ""}`} key={label}>
                  <span className="pipeline-step__icon">
                    {complete ? <Check size={15} weight="bold" /> : active ? <SpinnerGap className="spin" size={16} /> : step}
                  </span>
                  <span><strong>{label}</strong><small>{[
                    "Register file and source",
                    "Read visual and text content",
                    "Find product and compliance fields",
                    "Map values to the product record",
                    "Flag confidence and conflicts",
                  ][index]}</small></span>
                  {active && <i>Working</i>}
                  {complete && <i>Done</i>}
                </div>
              );
            })}
          </div>
          {!phase && <div className="pipeline-empty"><Scan size={24} weight="duotone" /><span><strong>Waiting for evidence</strong><small>The pipeline begins after you choose a file.</small></span></div>}
        </div>
      </section>

      {result && (
        <section className="workspace-card extraction-result-card">
          <div className="workspace-card__header extraction-result-card__header">
            <div>
              <span className="card-kicker">Extraction result</span>
              <h2>{result.filename}</h2>
              <p>{result.documentType} · {result.supplier}</p>
            </div>
            <div className="result-score"><strong>{result.confidence}%</strong><small>overall confidence</small></div>
          </div>
          <div className="result-summary-row">
            <span><CheckCircle size={18} weight="fill" /><strong>{result.fieldsFound}</strong> fields found</span>
            <span><WarningCircle size={18} weight="fill" /><strong>{result.reviewItems}</strong> need review</span>
            <span><LinkSimpleIcon /><strong>1</strong> product match</span>
          </div>
          <div className="result-fields" role="table" aria-label="Extracted fields">
            <div className="result-fields__head" role="row"><span role="columnheader">Field</span><span role="columnheader">Extracted value</span><span role="columnheader">Confidence</span><span role="columnheader">Review</span></div>
            {result.extracted.map((field) => (
              <div className={`result-field-row ${field.confidence < 80 ? "is-review" : ""}`} role="row" key={field.label}>
                <span role="cell">{field.label}</span>
                <strong role="cell">{field.value}</strong>
                <span role="cell"><i><b style={{ width: `${field.confidence}%` }} /></i>{field.confidence}%</span>
                <span role="cell">{field.confidence < 80 ? <button type="button"><WarningCircle size={15} weight="fill" /> Review</button> : <span className="field-approved"><CheckCircle size={16} weight="fill" /> Ready</span>}</span>
              </div>
            ))}
          </div>
          <div className="result-footer"><p><WarningCircle size={17} weight="fill" /> Human approval is required before extracted values update the product record.</p><div><button className="button-link button-link--quiet" type="button">Save as draft</button><button className="button-link button-link--primary" type="button">Review 2 items <ArrowRight size={16} /></button></div></div>
        </section>
      )}

      <section className="workspace-card recent-documents-card">
        <div className="workspace-card__header"><div><span className="card-kicker">Evidence inbox</span><h2>Recent documents</h2></div><button type="button">View all</button></div>
        <div className="evidence-table-wrap">
          <table className="evidence-table">
            <thead><tr><th>Document</th><th>Supplier</th><th>Received</th><th>Fields</th><th>Confidence</th><th>Status</th></tr></thead>
            <tbody>{evidenceDocuments.map((document, index) => <tr key={document.id}><td><span className={`table-file-icon ${index === 1 ? "table-file-icon--image" : ""}`}>{index === 1 ? <FileImage size={18} /> : <FileText size={18} />}</span><span><strong>{document.title}</strong><small>{document.type}</small></span></td><td>{document.supplier}</td><td>{document.received}</td><td>{document.fields || "—"}</td><td>{document.confidence ? `${document.confidence}%` : "—"}</td><td><StatusPill status={document.status} compact /></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function LinkSimpleIcon() {
  return <FileText size={18} weight="duotone" aria-hidden="true" />;
}
