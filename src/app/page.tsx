import { Suspense } from "react";
import FilmsGrid, { FilmsGridSkeleton } from "./components/ui/FilmsGrid";
import { type HomeTab } from "@/services/home";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; genre?: string; page?: string }>;
}) {
  const { tab: tabParam, genre: genreParam, page: pageParam } = await searchParams;
  const tab: HomeTab = tabParam === "popular" || tabParam === "top" ? tabParam : "all";
  const genre = genreParam ? Number(genreParam) : null;
  const page = Math.max(1, Number(pageParam ?? 1));

  return (
    <main>
      <div style={{ background: "#ffbd3f", borderBottom: "4px solid #000" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-xs font-black tracking-widest text-black mb-2 uppercase">
            Bienvenido a GALI
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-black leading-none mb-3">
            DESCUBRE LAS<br />MEJORES PELICULAS
          </h1>
          <p className="text-sm font-semibold text-black opacity-60">
            Ratings, resenas y listas de la comunidad cinematografica
          </p>
        </div>
      </div>

      <Suspense fallback={<FilmsGridSkeleton />}>
        <FilmsGrid tab={tab} genre={genre} page={page} />
      </Suspense>
    </main>
  );
}
