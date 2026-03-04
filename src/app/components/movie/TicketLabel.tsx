export default function TicketLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: "#aaa" }}>
      {children}
    </p>
  );
}
