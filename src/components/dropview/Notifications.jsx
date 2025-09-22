import React from "react";
import { Card } from "../ui/card";

const Switch = ({ checked, onChange, className, children }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={className}
  >
    {children}
  </button>
);

export default function Notifications() {
  const [emailNotif, setEmailNotif] = React.useState(true);
  const [pushNotif, setPushNotif] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD1DC]/10 via-white to-[#A7DADC]/10">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="font-display text-xl text-[#2d2d2d]">Notifications</h1>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <Card className="p-6 bg-white border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-medium text-[#2d2d2d]">Email notifications</h3>
            <p className="text-sm text-[#2d2d2d]/60">Get updates in your inbox</p>
          </div>
          <Switch
            checked={emailNotif}
            onChange={setEmailNotif}
            className={`${emailNotif ? 'bg-[#A7DADC]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable email notifications</span>
            <span
              className={`${emailNotif ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </Card>

        <Card className="p-6 bg-white border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-medium text-[#2d2d2d]">Push notifications</h3>
            <p className="text-sm text-[#2d2d2d]/60">Receive real-time alerts</p>
          </div>
          <Switch
            checked={pushNotif}
            onChange={setPushNotif}
            className={`${pushNotif ? 'bg-[#A7DADC]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable push notifications</span>
            <span
              className={`${pushNotif ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </Card>
      </div>
    </div>
  );
}


