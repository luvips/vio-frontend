import Link from "next/link";
import { GENRE_NAMES } from "@/lib/tmdb";
import { getHomeGridData, PAGE_SIZE, type HomeTab } from "@/services/home";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";

const TABS: { label: string; key: HomeTab }[] = [
  { label: "TODOS", key: "all" },
  { label: "POPULARES", key: "popular" },
  { label: "MEJOR VALORADAS", key: "top" },
];

const genres = Object.keys(GENRE_NAMES)
  .map(Number)
  .sort((a, b) => GENRE_NAMES[a].localeCompare(GENRE_NAMES[b]));

function buildUrl(tab: HomeTab, genre: number | null, page: number) {
  const p = new URLSearchParams();
  p.set("tab", tab);
  if (genre !== null) p.set("genre", String(genre));
  if (page > 1) p.set("page", String(page));
  return `/?${p}`;
}

function visiblePages(page: number, totalPages: number) {
  const delta = 2;
  const range: number[] = [];
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    range.push(i);
  }
  return range;
}

const btnBase: React.CSSProperties = {
  minWidth: 36,
  height: 36,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 900,
  border: "2px solid",
  textDecoration: "none",
};
const btnActive: React.CSSProperties = { ...btnBase, padding: "0 12px", borderColor: "#000", color: "#000" };
const btnDisabled: React.CSSProperties = { ...btnBase, padding: "0 12px", borderColor: "#ddd", color: "#ccc" };
const btnPage: React.CSSProperties = { ...btnBase, borderColor: "#ccc", color: "#777" };
const btnCurrent: React.CSSProperties = { ...btnBase, background: "#ffbd3f", borderColor: "#000", color: "#000" };

interface Props {
  tab: HomeTab;
  genre: number | null;
  page: number;
}

export default async function FilmsGrid({ tab, genre, page }: Props) {
  const { movies, totalPages } = await getHomeGridData(tab, genre, page);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex items-center gap-0 mb-4 border-b-2" style={{ borderColor: "#000" }}>
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={buildUrl(t.key, null, 1)}
            className="px-6 py-3 text-xs font-black tracking-widest"
            style={tab === t.key ? { background: "#000", color: "#ffbd3f" } : { color: "#999" }}
          >
            {t.label}
          </Link>
        ))}
        <span className="ml-auto text-xs font-semibold" style={{ color: "#aaa" }}>
          Pág. {page} / {totalPages}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={buildUrl(tab, null, 1)}
          className="px-3 py-1 text-xs font-black tracking-wide border-2"
          style={genre === null
            ? { background: "#ffbd3f", borderColor: "#000", color: "#000" }
            : { borderColor: "#ccc", color: "#777" }}
        >
          TODOS
        </Link>
        {genres.map((id) => (
          <Link
            key={id}
            href={buildUrl(tab, id, 1)}
            className="px-3 py-1 text-xs font-black tracking-wide border-2"
            style={genre === id
              ? { background: "#ffbd3f", borderColor: "#000", color: "#000" }
              : { borderColor: "#ccc", color: "#777" }}
          >
            {GENRE_NAMES[id].toUpperCase()}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-10">
          {page > 1 ? (
            <Link href={buildUrl(tab, genre, page - 1)} style={btnActive}>←</Link>
          ) : (
            <span style={btnDisabled}>←</span>
          )}

          {page > 3 && (
            <>
              <Link href={buildUrl(tab, genre, 1)} style={btnPage}>1</Link>
              {page > 4 && <span style={{ color: "#aaa", fontSize: 12, fontWeight: 700 }}>…</span>}
            </>
          )}

          {visiblePages(page, totalPages).map((p) => (
            <Link
              key={p}
              href={buildUrl(tab, genre, p)}
              style={p === page ? btnCurrent : btnPage}
            >
              {p}
            </Link>
          ))}

          {page < totalPages - 2 && (
            <>
              {page < totalPages - 3 && <span style={{ color: "#aaa", fontSize: 12, fontWeight: 700 }}>…</span>}
              <Link href={buildUrl(tab, genre, totalPages)} style={btnPage}>{totalPages}</Link>
            </>
          )}

          {page < totalPages ? (
            <Link href={buildUrl(tab, genre, page + 1)} style={btnActive}>→</Link>
          ) : (
            <span style={btnDisabled}>→</span>
          )}
        </div>
      )}
    </section>
  );
}

export function FilmsGridSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="h-10 w-64 mb-8" style={{ background: "#e0e0e0" }} />
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
