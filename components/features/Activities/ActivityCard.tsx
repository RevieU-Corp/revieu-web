
interface ActivityCardProps {
  title: string;
  subtitle?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}

export function ActivityCard({
  title,
  subtitle,
  image,
  badge,
  badgeColor = "bg-red-500",
  onClick
}: ActivityCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative flex-shrink-0 w-64 h-32 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>

      {/* Badge */}
      {badge && (
        <div className={`absolute top-3 left-3 ${badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse`}>
          {badge}
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300 group-hover:translate-y-[-2px]">
        <h3 className="font-bold text-lg leading-tight mb-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm opacity-90 leading-tight" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Shine Effect - 火车站大屏效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

      {/* 边框光效 */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-300"></div>
    </div>
  );
}