import React from 'react';

interface SectionHeadingProps {
  icon: React.ReactNode;
  title: string;
  rightSlot?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ icon, title, rightSlot }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#C41111] to-[#930404] text-white flex items-center justify-center shadow-sm">
          {React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
      </div>
      {rightSlot}
    </div>
  );
};
