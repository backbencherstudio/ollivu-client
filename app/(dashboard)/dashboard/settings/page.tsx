'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'security' | 'notifications'>('security');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white p-4 md:p-10">
      {/* Tabs */}
      <div className="flex space-x-6 border-b mb-6">
        <button
          className={`pb-2 font-medium text-sm ${
            activeTab === 'security' ? 'border-b-2 border-black text-black' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('security')}
        >
          Login & Security
        </button>
        <button
          className={`pb-2 font-medium text-sm ${
            activeTab === 'notifications' ? 'border-b-2 border-black text-black' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('notifications')}
        >
          Notification Setting
        </button>
      </div>

      {activeTab === 'security' ? (
        <LoginSecurityTab showPassword={showPassword} setShowPassword={setShowPassword} />
      ) : (
        <NotificationTab />
      )}
    </div>
  );
}

function LoginSecurityTab({ showPassword, setShowPassword }: any) {
  const [twoFA, setTwoFA] = useState(true);
  return (
    <div className="space-y-10 w-[50%]">
      <div className="space-y-6">
        <h2 className="font-semibold text-base">Login Credentials</h2>
        <p className="text-sm text-gray-500">Keep your account safe with a secure password and by signing out of devices you're not actively using.</p>
        <LabelWithInput label="Email address" value="katie_sims@gmail.com" />
        <LabelWithInput label="Phone number" value="+45983280932" />
      </div>

      <div className="space-y-6">
        <h2 className="font-semibold text-base">Password & Security</h2>
        <p className="text-sm text-gray-500">Ensure your account stays secure by updating your password regularly.</p>
        <div className="space-y-2">
          <label className="text-sm font-medium">Change password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full border rounded-md px-4 py-2 pr-10"
              defaultValue="password"
            />
            <button
              type="button"
              className="absolute top-2.5 right-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
            <p className="text-xs text-gray-500">Enable 2FA for extra layer of security to your account</p>
          </div>
          <Toggle enabled={twoFA} onChange={setTwoFA} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-base">Active Sessions</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current Device</p>
            <p className="text-xs text-gray-500">Windows PC</p>
          </div>
          <span className="bg-green-100 text-green-600 px-3 py-1 text-xs rounded-full">Active</span>
        </div>
        <button className="bg-[#20B894] text-white text-sm px-4 py-1.5 rounded-full font-medium w-fit">
          Sign Out ↗
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-base text-red-500">Delete account</h2>
        <p className="text-sm text-red-500">Permanently delete your Hotels.com account and data.</p>
        <button className="text-sm border border-red-500 text-red-500 px-4 py-1.5 rounded-full font-medium w-fit">
          Delete ↗
        </button>
      </div>
    </div>
  );
}

function NotificationTab() {
  const [desktop, setDesktop] = useState(true);
  const [badge, setBadge] = useState(true);
  const [comm, setComm] = useState(true);
  const [ann, setAnn] = useState(false);
  const [sound, setSound] = useState(false);

  return (
    <div className="space-y-10 w-[50%]">
      <Section title="Notification Setting">
        <ToggleRow label="Enable Desktop Notification" description="Receive notification all of the messages, contracts, documents." value={desktop} onChange={setDesktop} />
        <ToggleRow label="Enable Unread Notification Badge" description="Receive notification all of the messages, contracts, documents." value={badge} onChange={setBadge} />
        <div className="mt-4 space-y-1">
          <label className="text-sm font-medium">Push Notification Time-out</label>
          <div className="mt-1">
            <select className="w-full border rounded-md px-4 py-2 text-sm">
              <option>10 Minutes</option>
              <option>15 Minutes</option>
              <option>30 Minutes</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Email Notifications">
        <ToggleRow label="Communication Emails" description="Receive email for messages, contracts, documents" value={comm} onChange={setComm} />
        <ToggleRow label="Announcements & Updates" description="Receive email about product updates, improvements, etc." value={ann} onChange={setAnn} />
      </Section>

      <Section title="Sounds">
        <ToggleRow label="Disable All Notification Sounds" description="Mute all notification of the messages. contracts, documents." value={sound} onChange={setSound} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function LabelWithInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        className="w-full border rounded-md px-4 py-2"
        defaultValue={value}
        readOnly
      />
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between border-b py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Toggle enabled={value} onChange={onChange} />
    </div>
  );
}

function Toggle({ enabled = false, onChange }: { enabled?: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
        enabled ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      ></div>
    </div>
  );
}
