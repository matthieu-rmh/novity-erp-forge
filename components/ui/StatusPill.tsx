export type OrderStatus = "DRAFT" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const ORDER_STATUS: Record<OrderStatus, { label: string; dot: string; ring: string }> = {
  DRAFT:     { label: "Brouillon", dot: "#888888", ring: "bg-brand-offwhite text-brand-dark-gray border-brand-light-gray" },
  CONFIRMED: { label: "Confirmée", dot: "#9B9BE0", ring: "bg-white text-brand-black border-brand-light-gray" },
  SHIPPED:   { label: "Expédiée",  dot: "#E89B73", ring: "bg-white text-brand-black border-brand-light-gray" },
  DELIVERED: { label: "Livrée",    dot: "#5FC9A8", ring: "bg-white text-brand-black border-brand-light-gray" },
  CANCELLED: { label: "Annulée",   dot: "#DC2626", ring: "bg-red-50 text-red-700 border-red-200" },
};

export const ORDER_FLOW: OrderStatus[] = ["DRAFT", "CONFIRMED", "SHIPPED", "DELIVERED"];

interface StatusPillProps {
  status: OrderStatus;
}

function StatusPill({ status }: StatusPillProps) {
  const s = ORDER_STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border pl-2 pr-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${s.ring}`}>
      <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export { StatusPill, ORDER_STATUS };
export type { StatusPillProps };
