

interface CategoryButtonProps {
  title: string;
  background: string;
  textColor?: string;   // tailwind class，例如 "text-[#990000]"
  badge?: string;       // 左上角小标签，例如 "TOP" / "DEAL"
  iconEmoji?: string;   // 左侧图标，用 emoji 简单搞定
}

export function CategoryButton({
  title,
  background,
  textColor = "text-white",
  badge,
  iconEmoji,
}: CategoryButtonProps) {
  return (
    <button
      className={`
        relative flex-shrink-0
        w-40 h-24                  /* 比之前更小更紧凑 */
        rounded-2xl shadow-md
        overflow-hidden
        flex flex-col justify-between
        p-3
        ${textColor}
      `}
      style={{ background }}
    >
      {/* 左上角角标 */}
      {badge && (
        <span className="
          absolute top-2 left-2
          text-[10px] font-semibold uppercase
          px-2 py-0.5 rounded-full
          bg-black/35 text-white
        ">
          {badge}
        </span>
      )}

      {/* 右上角箭头（轻量一点） */}
      <span
        className="
          absolute top-2 right-2
          inline-flex items-center justify-center
          w-5 h-5 rounded-full
          bg-white/20 text-xs
        "
      >
        →
      </span>

      {/* 底部：图标 + 标题 */}
      <div className="mt-auto flex items-center gap-2">
        {iconEmoji && (
          <span className="text-lg leading-none">
            {iconEmoji}
          </span>
        )}
        <span className="font-semibold text-sm leading-snug">
          {title}
        </span>
      </div>
    </button>
  );
}
