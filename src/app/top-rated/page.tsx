import { Suspense } from "react";
import Link from "next/link";
import { getTopRatedMovies } from "@/lib/api";
import { MoviesGrid, MoviesGridSkeleton } from "@/app/components/ui/MoviesGrid";

export const dynamic = "force-dynamic";

async function Content() {
  const { results: movies } = await getTopRatedMovies();
  return <MoviesGrid movies={movies} />;
}

export default function TopRatedPage() {
  return (
    <main>
      <div style={{ background: "#3949ab", borderBottom: "4px solid #000" }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-xs font-black tracking-widest mb-1 uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
            Clasificacion
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none">
            TOP RATED
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6 p-4 border-2" style={{ borderColor: "#c5cae9", background: "#eef1ff" }}>
          <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: "#3949ab" }}>
            Modo compatible
          </p>
          <p className="text-sm font-semibold" style={{ color: "#3949ab" }}>
            Esta lista se aproxima con resultados de busqueda. Para mayor precision usa
            {" "}
            <Link href="/buscar?q=top%20rated" className="underline font-black">BUSCAR</Link>.
          </p>
        </div>
        <Suspense fallback={<MoviesGridSkeleton />}>
          <Content />
        </Suspense>
      </div>
    </main>
  );
}
