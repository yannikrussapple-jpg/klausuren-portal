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
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2 text-black">Registrieren</h1>
            <p className="text-sm text-gray-600">Erstelle ein Konto für den Download-Zugriff</p>
          </div>

          {success && (
            <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-medium">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benutzername</label>
              <input
                type="text"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:border-black focus:outline-none transition-all shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
              <input
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:border-black focus:outline-none transition-all shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Bitte warten..." : "Registrieren"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Schon ein Konto? <a href="/account/login" className="text-black font-semibold hover:text-gray-700 transition">Anmelden</a>
            </p>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition"
            >
              ← Zurück zur Hauptseite
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
