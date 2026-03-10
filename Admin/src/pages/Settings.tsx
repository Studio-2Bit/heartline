import { useState } from 'react';
import { Save, Bell, Shield, Mail, Database, Globe } from 'lucide-react';

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoApproval, setAutoApproval] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Add Admin section states
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [notification, setNotification] = useState(""); // For Add Admin messages
  const [saveNotification, setSaveNotification] = useState(""); // For Save button

  const currentPassword = "123456"; // Replace with actual password check

  const handleVerify = () => {
    if (enteredPassword === currentPassword) {
      setIsVerified(true);
      setNotification("✅ Password verified!");
    } else {
      setNotification("❌ Incorrect password. Try again.");
    }
  };

  const handleAddAdmin = () => {
    if (newAdminEmail) {
      setNotification(`✅ New admin added: ${newAdminEmail}`);
      // Reset Add Admin section after 2 seconds
      setTimeout(() => {
        setShowPasswordInput(false);
        setIsVerified(false);
        setEnteredPassword("");
        setNewAdminEmail("");
        setNotification("");
      }, 2000);
    } else {
      setNotification("❌ Enter an email to add admin");
    }
  };

  const handleSave = () => {
    setSaveNotification("💾 Settings saved successfully!");
    setTimeout(() => setSaveNotification(""), 3000); // Hide after 3 sec
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your system preferences and configurations</p>
      </div>

      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bell className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Configure how you receive notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            

            

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Weekly Reports</h3>
                <p className="text-sm text-gray-600">Receive weekly summary reports</p>
              </div>
              <button
                onClick={() => setWeeklyReports(!weeklyReports)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  weeklyReports ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    weeklyReports ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Shield className="text-gray-700" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
              <p className="text-sm text-gray-600">Manage security settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactorAuth ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Update Password
              </button>
            </div>

            {/* Add New Admin Section */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Add new Admin</h3>
              <p className="text-sm text-gray-600 mb-3">Add new administrator accounts to manage the system</p>

              {!showPasswordInput && !isVerified && (
                <button
                  onClick={() => setShowPasswordInput(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Add Admin
                </button>
              )}

              {showPasswordInput && !isVerified && (
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-1"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                  />
                  <button
                    onClick={handleVerify}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Verify
                  </button>
                  {notification && (
                    <p className="mt-1 text-sm text-gray-700">{notification}</p>
                  )}
                </div>
              )}

              {isVerified && (
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter new admin email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-1"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                  />
                  <button
                    onClick={handleAddAdmin}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add
                  </button>
                  {notification && (
                    <p className="mt-1 text-sm text-gray-700">{notification}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Settings Section */}
        {/* ...rest of your sections remain unchanged... */}

        {/* Save / Cancel Buttons */}
        <div className="flex justify-end gap-3">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <div className="flex flex-col items-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Save Changes
            </button>
            {saveNotification && (
              <p className="mt-1 text-sm text-gray-700">{saveNotification}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
