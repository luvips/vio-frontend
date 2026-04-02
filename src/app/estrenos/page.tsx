import { Suspense } from "react";
import Link from "next/link";
import { getUpcomingMovies } from "@/lib/api";
import { MoviesGrid, MoviesGridSkeleton } from "@/app/components/ui/MoviesGrid";

export const dynamic = "force-dynamic";

async function Content() {
  const { results: movies } = await getUpcomingMovies();
  return <MoviesGrid movies={movies} />;
}

export default function EstrenosPage() {
  return (
    <main>
      <div style={{ background: "#e53935", borderBottom: "4px solid #000" }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-xs font-black tracking-widest mb-1 uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
            Proximos lanzamientos
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none">
            ESTRENOS
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6 p-4 border-2" style={{ borderColor: "#ffcdd2", background: "#ffebee" }}>
          <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: "#e53935" }}>
            Modo compatible
          </p>
          <p className="text-sm font-semibold" style={{ color: "#b71c1c" }}>
            Esta lista se aproxima con resultados de busqueda. Para encontrar algo puntual, usa
            {" "}
            <Link href="/buscar?q=upcoming" className="underline font-black">BUSCAR</Link>.
          </p>
        </div>
        <Suspense fallback={<MoviesGridSkeleton />}>
          <Content />
        </Suspense>
      </div>
    </main>
  );
}
