"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Copy,
  Eye,
  EyeSlash,
  FileText,
  LinkSimple,
  SpinnerGap,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DEMO_CREDENTIALS } from "@/lib/auth";

export function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function useDemoAccount() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError("");
  }

  async function copyCredentials() {
    await navigator.clipboard.writeText(
      `${DEMO_CREDENTIALS.email}\n${DEMO_CREDENTIALS.password}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "We could not sign you in. Try the demo credentials below.");
        return;
      }
      router.replace("/workspace");
      router.refresh();
    } catch {
      setError("The demo is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Orin product overview">
        <div className="login-story__content">
          <span className="login-story__eyebrow"><span /> Demo workspace</span>
          <h1>Follow every answer back to its source.</h1>
          <p>
            Explore a realistic product trace, review extracted evidence, and see how one missing declaration
            affects passport readiness.
          </p>
          <div className="login-trace-card">
            <div className="login-trace-card__header">
              <span><FileText size={18} weight="duotone" /></span>
              <div><strong>Aster Loop Jacket</strong><small>OR-24017 · 15 evidence files</small></div>
              <b>84%</b>
            </div>
            <div className="login-trace">
              {[
                ["Raw", true],
                ["Fabric", true],
                ["Dye", false],
                ["Make", true],
                ["Pack", true],
              ].map(([label, ready]) => (
                <div key={String(label)} className={ready ? "is-ready" : "is-open"}>
                  <span>{ready ? <CheckCircle size={16} weight="fill" /> : <LinkSimple size={16} />}</span>
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="login-story__note">From origin to compliance</p>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <Link href="/" className="back-link"><ArrowLeft size={17} /> Back to Orin</Link>
          <div className="login-heading">
            <span>Welcome to the demo</span>
            <h2>Sign in to Orin</h2>
            <p>Use the demo account to explore the complete product experience.</p>
          </div>

          <form className="login-form" onSubmit={submit} noValidate>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                aria-invalid={Boolean(error)}
              />
            </div>
            <div className="form-field">
              <div className="form-field__label-row">
                <label htmlFor="password">Password</label>
                <span>Demo access only</span>
              </div>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlash size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && <p className="form-error" id="login-error" role="alert">{error}</p>}

            <Button type="submit" size="lg" className="login-submit" disabled={loading} aria-busy={loading}>
              {loading ? <SpinnerGap className="spin" size={19} aria-hidden="true" /> : null}
              {loading ? "Opening workspace…" : "Sign in"}
              {!loading && <ArrowRight size={18} weight="bold" aria-hidden="true" />}
            </Button>
          </form>

          <div className="demo-divider"><span>Demo account</span></div>
          <div className="demo-credentials">
            <div>
              <span><small>Email</small><strong>{DEMO_CREDENTIALS.email}</strong></span>
              <span><small>Password</small><strong>{DEMO_CREDENTIALS.password}</strong></span>
            </div>
            <button type="button" onClick={copyCredentials} aria-label="Copy demo credentials">
              {copied ? <CheckCircle size={18} weight="fill" /> : <Copy size={18} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <Button type="button" variant="secondary" size="lg" className="demo-fill-button" onClick={useDemoAccount}>
            Use demo account
          </Button>
          <p className="login-privacy">No personal data is collected in this demo.</p>
        </div>
      </section>
    </main>
  );
}
