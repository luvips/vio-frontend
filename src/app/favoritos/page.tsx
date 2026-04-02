import StoredMoviesSection from "@/app/components/ui/StoredMoviesSection";

export default function FavoritosPage() {
  return (
    <StoredMoviesSection
      kind="favorites"
      title="Favoritos"
      subtitle="Peliculas que marcaste para volver a ver"
      emptyText="Aun no agregaste peliculas a favoritos."
    />
  );
}
