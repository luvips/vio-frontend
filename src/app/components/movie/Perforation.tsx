export default function Perforation() {
  return (
    <div className="relative flex items-center my-0" style={{ margin: "0 -1px" }}>
      <div className="w-4 h-4 flex-shrink-0" style={{ background: "#f5f5f5", border: "3px solid #000", marginLeft: "-10px", zIndex: 10 }} />
      <div className="flex-1" style={{ borderTop: "3px dashed #000" }} />
      <div className="w-4 h-4 flex-shrink-0" style={{ background: "#f5f5f5", border: "3px solid #000", marginRight: "-10px", zIndex: 10 }} />
    </div>
  );
}
