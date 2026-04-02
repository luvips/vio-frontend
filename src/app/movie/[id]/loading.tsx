export default function MovieDetailLoading() {
  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="h-10 w-32 mb-6" style={{ background: "#e0e0e0" }} />
        <div className="border-4" style={{ borderColor: "#000", background: "#fff" }}>
          <div className="h-64" style={{ background: "#ddd" }} />
          <div className="p-6 space-y-4">
            <div className="h-8 w-2/3" style={{ background: "#e0e0e0" }} />
            <div className="h-4 w-full" style={{ background: "#e0e0e0" }} />
            <div className="h-4 w-5/6" style={{ background: "#e0e0e0" }} />
            <div className="h-4 w-4/5" style={{ background: "#e0e0e0" }} />
          </div>
        </div>
      </div>
    </main>
  );
}
