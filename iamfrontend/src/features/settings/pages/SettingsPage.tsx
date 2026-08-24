import { useState } from "react";
import { User, Lock, Bell, Settings as SettingsIcon, Save } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import Card from "@/shared/components/Card/Card";
import Input from "@/shared/components/Input/Input";
import Button from "@/shared/components/Button/Button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "preferences">("profile");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <User size={18} />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Lock size={18} />
                Security
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === "notifications"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Bell size={18} />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === "preferences"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <SettingsIcon size={18} />
                Preferences
              </button>
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Profile Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    defaultValue="Patricia"
                    placeholder="First name"
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    defaultValue="Lee"
                    placeholder="Last name"
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  defaultValue="patricia.lee@company.com"
                  placeholder="Email"
                />
                <Input
                  label="Employee ID"
                  type="text"
                  defaultValue="EMP011"
                  disabled
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    type="text"
                    defaultValue="Security"
                    placeholder="Department"
                  />
                  <Input
                    label="Job Title"
                    type="text"
                    defaultValue="IAM Administrator"
                    placeholder="Job title"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button variant="primary" className="flex items-center gap-2">
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Change Password</h3>
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                  <div className="flex justify-end pt-4">
                    <Button variant="primary">Update Password</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Current Session</p>
                      <p className="text-xs text-slate-500">Windows • Chrome • 192.168.1.45</p>
                    </div>
                    <span className="text-xs text-green-600 font-semibold">Active Now</span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Multi-Factor Authentication</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Add an extra layer of security to your account by enabling MFA.
                </p>
                <Button variant="secondary">Enable MFA</Button>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Access Request Notifications</p>
                    <p className="text-xs text-slate-500">Get notified when someone requests access</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Approval Notifications</p>
                    <p className="text-xs text-slate-500">Get notified when your requests are reviewed</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Security Alerts</p>
                    <p className="text-xs text-slate-500">Get notified about security events</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Weekly Reports</p>
                    <p className="text-xs text-slate-500">Receive weekly summary of activities</p>
                  </div>
                  <input type="checkbox" className="rounded text-blue-600" />
                </label>

                <div className="flex justify-end pt-4">
                  <Button variant="primary">Save Preferences</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "preferences" && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Application Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Theme
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 p-2 bg-white">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timezone
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 p-2 bg-white">
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Asia/Tokyo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date Format
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 p-2 bg-white">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary">Save Preferences</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
