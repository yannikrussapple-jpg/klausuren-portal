import { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      await axios.post("/api/users/register", { username, password });
      
      setSuccess("Registrierung erfolgreich! Weiterleitung zum Login...");
      setTimeout(() => {
        router.push("/account/login?registered=1");
      }, 800);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Registrierung fehlgeschlagen";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-emerald-100">
          <h1 className="text-3xl font-bold mb-2 text-emerald-800">Registrieren</h1>
          <p className="text-sm text-gray-600 mb-6">Neues Konto anlegen, um Downloads freizuschalten.</p>

          {success && (
            <div className="mb-4 rounded-md bg-green-50 text-green-700 px-3 py-2 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Benutzername</label>
              <input
                type="text"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full border border-emerald-200 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Passwort</label>
              <input
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-emerald-200 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Bitte warten..." : "Registrieren"}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6">
            Schon ein Konto? <a href="/account/login" className="text-emerald-700 underline font-semibold">Login</a>
          </p>

          <button
            onClick={() => router.push('/')}
            className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg"
          >
            ← Zurück zur Hauptseite
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
