import { Clock, Zap } from 'lucide-react';

interface TimeDealCardProps {
  title: string;
  discount: string;
  timeRange: string;
  description: string;
}

export function TimeDealCard({ title, discount, timeRange, description }: TimeDealCardProps) {
  return (
    <div className="relative">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <div className="absolute top-1 left-2 w-4 h-4 rounded-full bg-purple-300/30 blur-sm animate-float" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-yellow-300/40 blur-sm animate-float-delayed" />
        <div className="absolute bottom-3 left-6 w-2.5 h-2.5 rounded-full bg-purple-400/25 blur-sm animate-float" />
        <div className="absolute top-6 right-8 w-2 h-2 bg-yellow-400/30 blur-sm rotate-45 animate-float-delayed" />
        <div className="absolute bottom-5 right-3 w-3.5 h-3.5 rounded-full bg-purple-300/35 blur-sm animate-float" />
        <div className="absolute top-8 left-4 w-1.5 h-1.5 bg-yellow-400/40 blur-sm rotate-12 animate-float-delayed" />
      </div>

      {/* Ticket Card */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600 rounded-xl overflow-visible shadow-lg">
        {/* Paper Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Left Semi-circle Cutout */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-inner" />
        
        {/* Right Semi-circle Cutout */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-inner" />

        <div className="relative p-2.5">
          {/* Top Section - Discount Amount */}
          <div className="pb-2 mb-2 relative">
            {/* Lightning Badge */}
            <div className="absolute -top-1 -right-1">
              <div className="bg-yellow-400 rounded-full p-1 shadow-md">
                <Zap className="w-2.5 h-2.5 fill-yellow-50 text-yellow-50" />
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <div className="inline-block bg-yellow-400 text-purple-900 px-1.5 py-0.5 rounded-full text-[10px] font-bold mb-1 shadow-sm">
                  LIMITED TIME
                </div>
                <h3 className="font-bold text-sm text-white mb-0.5">{title}</h3>
                <div className="flex items-center gap-1 text-white/90 text-[11px]">
                  <Clock className="w-2.5 h-2.5" />
                  <span className="font-semibold">{timeRange}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-yellow-300 drop-shadow-lg leading-none">
                  {discount}
                </div>
              </div>
            </div>

            {/* Dashed Line Separator */}
            <div className="absolute bottom-0 left-0 right-0 border-b border-dashed border-white/30" />
          </div>

          {/* Bottom Section - Details */}
          <div className="pt-1">
            <p className="text-white/95 text-[11px] mb-2 leading-relaxed">{description}</p>

            {/* Claim Button */}
            <button className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 font-bold py-1.5 px-3 rounded-lg shadow-md active:shadow-sm active:translate-y-0.5 transition-all relative overflow-hidden group">
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Pressed effect shadow */}
              <div className="absolute inset-x-1 bottom-0 h-0.5 bg-yellow-600/50 rounded-full blur-sm" />
              
              <span className="relative text-xs tracking-wide">Claim Now</span>
            </button>
          </div>
        </div>

        {/* Bottom Edge Decoration - Ticket Perforation */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-purple-400/30 last:border-r-0" />
          ))}
        </div>
      </div>
    </div>
  );
}