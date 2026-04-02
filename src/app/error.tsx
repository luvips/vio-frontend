"use client";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-4" style={{ borderColor: "#000", background: "#fff" }}>
          <div className="p-6 border-b-4" style={{ borderColor: "#000", background: "#ffbd3f" }}>
            <p className="text-xs font-black tracking-widest uppercase mb-1 text-black">VIO</p>
            <h1 className="text-2xl font-black uppercase text-black">Error al renderizar</h1>
          </div>
          <div className="p-6">
            <p className="text-sm font-semibold" style={{ color: "#555" }}>
              Ocurrio un error al cargar esta pantalla. Intenta nuevamente.
            </p>
            {error.digest && (
              <p className="text-xs font-mono mt-3" style={{ color: "#888" }}>
                Digest: {error.digest}
              </p>
            )}
            <button
              type="button"
              onClick={reset}
              className="mt-5 px-4 py-2 text-xs font-black tracking-widest uppercase"
              style={{ background: "#000", color: "#ffbd3f" }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
