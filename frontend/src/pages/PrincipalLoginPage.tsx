import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PrincipalLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitting(true); setMessage("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      if (!response.ok) throw new Error();
      const data = await response.json(); sessionStorage.setItem("principal-session", data.token); navigate("/principal-dashboard");
    } catch { setMessage("The login details were not recognised. Please try again."); }
    finally { setSubmitting(false); }
  };
  return <main className="admin-page"><section className="admin-card login-card"><Link className="detail-back" to="/">&lt; Back to website</Link><p className="section-label">Principal portal</p><h1>Manage college information.</h1><p>Secure access for updating fees, courses, and faculty details when needed.</p><form onSubmit={submit}><label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{message && <p className="form-message" role="alert">{message}</p>}<button className="button primary" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button></form></section></main>;
}
