import { Suspense } from "react";
import FilmsGrid, { FilmsGridSkeleton } from "./components/ui/FilmsGrid";

export default function Home() {
  return (
    <main>
      <div style={{ background: "#ffbd3f", borderBottom: "4px solid #000" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-xs font-black tracking-widest text-black mb-2 uppercase">
            Bienvenido a GALI
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-black leading-none mb-3">
            BUSCA Y EXPLORA<br />PELICULAS
          </h1>
          <p className="text-sm font-bold text-black/70 max-w-2xl">
            Conectado con VIO Backend: usa el buscador para encontrar peliculas y abre cada detalle para ver su informacion completa.
          </p>
        </div>
      </div>

      <Suspense fallback={<FilmsGridSkeleton />}>
        <FilmsGrid />
      </Suspense>
    </main>
  );
}
