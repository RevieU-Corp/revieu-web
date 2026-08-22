import React from 'react';
import { Icons } from './Icons';
import { SettingItem } from './SettingItem';
import { SectionHeading } from './SectionHeading';

interface AccountSectionProps {
  onAccountSecurity: () => void;
  onNotification: () => void;
  onStorage: () => void;
  onSupport: () => void;
  onLogout: () => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  onAccountSecurity,
  onNotification,
  onStorage,
  onSupport,
  onLogout,
}) => {
  return (
    <section>
      <SectionHeading icon={<Icons.User />} title="Account" />
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <SettingItem icon={<Icons.Shield />} label="account security" onClick={onAccountSecurity} />
        <SettingItem icon={<Icons.Bell />} label="notification" onClick={onNotification} />
        <SettingItem icon={<Icons.Bookmark />} label="storage" onClick={onStorage} />
        <SettingItem icon={<Icons.HelpCircle />} label="support" onClick={onSupport} />
        <div className="h-[1px] bg-gray-100 mx-5 my-1"></div>
        <SettingItem icon={<Icons.LogOut />} label="logout" isDestructive onClick={onLogout} />
      </div>
      <p className="text-xs text-gray-400 mt-3 px-2">waitting for extending</p>
    </section>
  );
};
