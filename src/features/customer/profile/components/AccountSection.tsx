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
        <div onClick={onAccountSecurity}>
          <SettingItem icon={<Icons.Shield />} label="account security" />
        </div>
        <div onClick={onNotification}>
          <SettingItem icon={<Icons.Bell />} label="notification" />
        </div>
        <div onClick={onStorage}>
          <SettingItem icon={<Icons.Bookmark />} label="storage" />
        </div>
        <div onClick={onSupport}>
          <SettingItem icon={<Icons.HelpCircle />} label="support" />
        </div>
        <div className="h-[1px] bg-gray-100 mx-5 my-1"></div>
        <div onClick={onLogout}>
          <SettingItem icon={<Icons.LogOut />} label="logout" isDestructive />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3 px-2">waitting for extending</p>
    </section>
  );
};
