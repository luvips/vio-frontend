import { Suspense } from "react";
import SearchClient from "./SearchClient";

function SearchFallback() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <p className="text-sm font-bold text-center py-20" style={{ color: "#aaa" }}>
        Cargando búsqueda...
      </p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <Suspense fallback={<SearchFallback />}>
        <SearchClient />
      </Suspense>
    </main>
  );
}
