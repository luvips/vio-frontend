"use client";

import { useState } from "react";
import Link from "next/link";
import { addToFavorites, addToWatchLater } from "@/lib/api";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { addStoredMovieId } from "@/lib/movies/lists";

function humanizeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo completar la accion";
}

export default function MovieActions({ tmdbId }: { tmdbId: number }) {
  const { status, refreshSession } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<"favorite" | "watch_later" | null>(null);

  async function runAction(type: "favorite" | "watch_later") {
    setFeedback(null);
    setError(null);
    setLoadingAction(type);

    try {
      if (type === "favorite") {
        const result = await addToFavorites(tmdbId);
        addStoredMovieId("favorites", tmdbId);
        setFeedback(result.message || "Anadido a favoritos");
      } else {
        const result = await addToWatchLater(tmdbId);
        addStoredMovieId("watchLater", tmdbId);
        setFeedback(result.message || "Anadido a ver mas tarde");
      }
    } catch (err) {
      setError(humanizeError(err));
      await refreshSession();
    } finally {
      setLoadingAction(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex flex-wrap gap-2 mt-6">
        <button
          className="px-5 py-2.5 text-xs font-black tracking-widest uppercase"
          style={{ background: "#ddd", color: "#666" }}
          disabled
        >
          Cargando sesion...
        </button>
      </div>
    );
  }

  if (status === "guest") {
    return (
      <div className="flex flex-wrap gap-2 mt-6">
        <Link
          href="/auth"
          className="px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-opacity hover:opacity-80"
          style={{ background: "#000", color: "#ffbd3f" }}
        >
          Inicia sesion para guardar
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => runAction("favorite")}
          disabled={loadingAction !== null}
          className="px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: "#ffbd3f", color: "#000" }}
        >
          {loadingAction === "favorite" ? "Guardando..." : "Agregar a favoritos"}
        </button>
        <button
          onClick={() => runAction("watch_later")}
          disabled={loadingAction !== null}
          className="px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: "#000", color: "#ffbd3f" }}
        >
          {loadingAction === "watch_later" ? "Guardando..." : "Ver mas tarde"}
        </button>
      </div>

      {feedback && <p className="text-xs font-bold mt-3" style={{ color: "#43a047" }}>{feedback}</p>}
      {error && <p className="text-xs font-bold mt-3" style={{ color: "#e53935" }}>{error}</p>}
    </div>
  );
}
