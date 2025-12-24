import React from "react";

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
        w-36 h-20                  /* 调整为更适合16:9手机的尺寸 */
        rounded-2xl shadow-md
        overflow-hidden
        flex flex-col justify-between
        p-2.5
        ${textColor}
        hover:shadow-lg
        transition-shadow
        cursor-pointer
      `}
      style={{ background }}
    >
      {/* 左上角角标 */}
      {badge && (
        <span className="
          absolute top-1.5 left-1.5
          text-[9px] font-semibold uppercase
          px-1.5 py-0.5 rounded-full
          bg-black/35 text-white
        ">
          {badge}
        </span>
      )}

      {/* 右上角箭头（轻量一点） */}
      <span
        className="
          absolute top-1.5 right-1.5
          inline-flex items-center justify-center
          w-4 h-4 rounded-full
          bg-white/20 text-xs
        "
      >
        →
      </span>

      {/* 底部：图标 + 标题 */}
      <div className="mt-auto flex items-center gap-1.5">
        {iconEmoji && (
          <span className="text-base leading-none">
            {iconEmoji}
          </span>
        )}
        <span className="font-semibold text-xs leading-snug">
          {title}
        </span>
      </div>
    </button>
  );
}
