import Link from "next/link";
import { searchMovies } from "@/lib/api";
import { MoviesGrid } from "@/app/components/ui/MoviesGrid";

export const dynamic = "force-dynamic";

function buildSearchUrl(query: string, page: number) {
  const params = new URLSearchParams();
  params.set("q", query);
  if (page > 1) {
    params.set("page", String(page));
  }
  return `/buscar?${params.toString()}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q: qParam, page: pageParam } = await searchParams;
  const query = (qParam ?? "").trim();
  const page = Math.min(500, Math.max(1, Number(pageParam ?? "1")));

  if (!query) {
    return (
      <main style={{ background: "#f5f5f5", minHeight: "100vh" }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-black uppercase tracking-widest text-black mb-3">Buscar películas</h1>
          <p className="text-sm font-semibold" style={{ color: "#777" }}>
            Escribe algo en el buscador de arriba y presiona Enter.
          </p>
        </div>
      </main>
    );
  }

  const { results, total_pages } = await searchMovies(query, page);
  const totalPages = Math.min(500, total_pages);

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 border-b-2 pb-4" style={{ borderColor: "#000" }}>
          <div>
            <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: "#999" }}>
              Resultados de búsqueda
            </p>
            <h1 className="text-xl font-black uppercase tracking-wide text-black">{query}</h1>
          </div>
          <span className="text-xs font-semibold" style={{ color: "#aaa" }}>
            Pág. {page} / {totalPages || 1}
          </span>
        </div>

        {results.length > 0 ? (
          <MoviesGrid movies={results} />
        ) : (
          <p className="text-sm font-bold text-center py-20" style={{ color: "#aaa" }}>
            No se encontraron películas para “{query}”.
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-10">
            {page > 1 ? (
              <Link
                href={buildSearchUrl(query, page - 1)}
                style={{ minWidth: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, border: "2px solid #000", color: "#000", textDecoration: "none", padding: "0 12px" }}
              >
                ←
              </Link>
            ) : (
              <span
                style={{ minWidth: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, border: "2px solid #ddd", color: "#ccc", padding: "0 12px" }}
              >
                ←
              </span>
            )}

            <Link
              href={buildSearchUrl(query, Math.max(1, page - 1))}
              style={{ minWidth: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, border: "2px solid #ccc", color: "#777", textDecoration: "none" }}
            >
              {Math.max(1, page - 1)}
            </Link>
            <span
              style={{ minWidth: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, border: "2px solid #000", background: "#ffbd3f", color: "#000" }}
            >
              {page}
            </span>
            <Link
              href={buildSearchUrl(query, Math.min(totalPages, page + 1))}
              style={{ minWidth: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, border: "2px solid #ccc", color: "#777", textDecoration: "none" }}
            >
              {Math.min(totalPages, page + 1)}
            </Link>

            {page < totalPages ? (
              <Link
                href={buildSearchUrl(query, page + 1)}
                style={{ minWidth: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, border: "2px solid #000", color: "#000", textDecoration: "none", padding: "0 12px" }}
              >
                →
              </Link>
            ) : (
              <span
                style={{ minWidth: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, border: "2px solid #ddd", color: "#ccc", padding: "0 12px" }}
              >
                →
              </span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
