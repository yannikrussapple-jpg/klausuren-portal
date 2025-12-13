import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const LoginPage = () => {
  const router = useRouter();
  const nextUrl = (router.query.next as string) || '/';
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.query.registered === '1') {
      setInfo('Registrierung erfolgreich. Bitte mit den Zugangsdaten einloggen.');
    }
  }, [router.query.registered]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await axios.post("/api/users/login", { username, password });
      
      // Auto-authorize portal access when user logs in
      if (typeof window !== 'undefined') {
        const { loginWithPassword } = await import('../../lib/auth');
        loginWithPassword('Monte');
        
        // Check if there's a pending download
        const pendingDownload = sessionStorage.getItem('pendingDownload');
        if (pendingDownload) {
          sessionStorage.removeItem('pendingDownload');
          // Open download in new tab
          window.open(pendingDownload, '_blank');
        }
      }
      
      router.push(nextUrl);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Login fehlgeschlagen";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2 text-black">Anmelden</h1>
            <p className="text-sm text-gray-600">Zugriff auf alle Downloads</p>
          </div>
          
          {info && (
            <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-medium">
              {info}
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

            {error && (
              <div className="text-red-600 text-sm font-medium px-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Bitte warten..." : "Anmelden"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Noch kein Konto? <a href="/account/register" className="text-black font-semibold hover:text-gray-700 transition">Registrieren</a>
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

export default LoginPage;
