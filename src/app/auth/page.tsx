"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";

type Mode = "login" | "register";

function humanizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "No se pudo completar la solicitud";
}

export default function AuthPage() {
  const router = useRouter();
  const { login, register, status } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const credentials = { email: email.trim(), password };

      if (mode === "register") {
        await register(credentials);
        setMessage("Cuenta creada. Ahora inicia sesion.");
        setMode("login");
      } else {
        await login(credentials);
        setMessage("Sesion iniciada correctamente.");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(humanizeError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="border-4" style={{ borderColor: "#000", background: "#fff" }}>
          <div className="p-6 border-b-4" style={{ borderColor: "#000", background: "#ffbd3f" }}>
            <p className="text-xs font-black tracking-widest uppercase mb-1 text-black">VIO Backend</p>
            <h1 className="text-2xl font-black uppercase text-black">{mode === "login" ? "Iniciar sesion" : "Crear cuenta"}</h1>
          </div>

          <div className="p-6">
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="px-4 py-2 text-xs font-black tracking-widest uppercase border-2"
                style={mode === "login" ? { borderColor: "#000", background: "#000", color: "#ffbd3f" } : { borderColor: "#ccc", color: "#666" }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className="px-4 py-2 text-xs font-black tracking-widest uppercase border-2"
                style={mode === "register" ? { borderColor: "#000", background: "#000", color: "#ffbd3f" } : { borderColor: "#ccc", color: "#666" }}
              >
                Registro
              </button>
            </div>

            {status === "authenticated" && mode === "login" && (
              <p className="text-xs font-bold mb-4" style={{ color: "#43a047" }}>
                Ya tienes una sesion activa.
              </p>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black tracking-widest uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border-2 px-3 py-2 text-sm font-semibold outline-none"
                  style={{ borderColor: "#ccc" }}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black tracking-widest uppercase mb-1">Contrasena</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border-2 px-3 py-2 text-sm font-semibold outline-none"
                  style={{ borderColor: "#ccc" }}
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-xs font-black tracking-widest uppercase disabled:opacity-50"
                style={{ background: "#000", color: "#ffbd3f" }}
              >
                {isSubmitting ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
              </button>
            </form>

            {message && <p className="text-xs font-bold mt-4" style={{ color: "#43a047" }}>{message}</p>}
            {error && <p className="text-xs font-bold mt-4" style={{ color: "#e53935" }}>{error}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
