interface TopListCardProps {
  title: string;
  badge: string;
  gradient: string;
}

export function TopListCard({ title, badge, gradient }: TopListCardProps) {
  return (
    <div
      className="flex-shrink-0 w-64 h-36 rounded-xl overflow-hidden relative shadow-md"
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50" />
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="inline-flex self-start bg-[#FFC72C] text-gray-900 px-2.5 py-1 rounded-full">
          {badge}
        </div>
        <h3 className="text-white">{title}</h3>
      </div>
    </div>
  );
}
