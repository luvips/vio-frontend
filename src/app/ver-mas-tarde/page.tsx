import StoredMoviesSection from "@/app/components/ui/StoredMoviesSection";

export default function VerMasTardePage() {
  return (
    <StoredMoviesSection
      kind="watchLater"
      title="Ver mas tarde"
      subtitle="Tu lista para mirar despues"
      emptyText="Aun no agregaste peliculas para ver mas tarde."
    />
  );
}
