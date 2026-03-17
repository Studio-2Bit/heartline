import { useState } from 'react';
import { Save, Bell, Shield, Download, Loader } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export default function Settings() {
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [autoApproval, setAutoApproval] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Add Admin states
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminNotification, setAdminNotification] = useState('');
  const [saveNotification, setSaveNotification] = useState('');

  const handleVerify = async () => {
    try {
      await axios.post(`${API}/verify-password`, { password: enteredPassword }, authHeaders());
      setIsVerified(true);
      setAdminNotification('✅ Password verified!');
    } catch {
      setAdminNotification('❌ Incorrect password. Try again.');
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail) {
      setAdminNotification('❌ Enter an email to add admin');
      return;
    }
    try {
      await axios.post(`${API}/add-admin`, { email: newAdminEmail }, authHeaders());
      setAdminNotification(`✅ New admin added: ${newAdminEmail}`);
      setTimeout(() => {
        setShowPasswordInput(false);
        setIsVerified(false);
        setEnteredPassword('');
        setNewAdminEmail('');
        setAdminNotification('');
      }, 2000);
    } catch (err: any) {
      setAdminNotification(err.response?.data?.message || '❌ Failed to add admin');
    }
  };

  const [showPwForm, setShowPwForm] = useState(false);
const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
const [pwMessage, setPwMessage] = useState('');

const handleUpdatePassword = async () => {
  if (pwData.newPassword !== pwData.confirmPassword) {
    setPwMessage('❌ Passwords do not match');
    return;
  }
  try {
    await axios.put('http://localhost:5000/api/auth/update-password', {
      currentPassword: pwData.currentPassword,
      newPassword: pwData.newPassword,
    }, authHeaders());
    setPwMessage('✅ Password updated successfully!');
    setTimeout(() => { setShowPwForm(false); setPwMessage(''); }, 2000);
  } catch (err: any) {
    setPwMessage(`❌ ${err.response?.data?.message || 'Failed to update password'}`);
  }
};

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const { data } = await axios.get(`${API}/logs`, authHeaders());
      const logs = data.logs;

      // Build CSV
      const headers = ['Type', 'Action', 'User', 'Details', 'Timestamp'];
      const rows = logs.map((l: any) => [
        l.type,
        l.action,
        l.user,
        `"${l.details.replace(/"/g, "'")}"`,
        new Date(l.createdAt).toLocaleString(),
      ]);

      const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weekly-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = () => {
    setSaveNotification('💾 Settings saved successfully!');
    setTimeout(() => setSaveNotification(''), 3000);
  };

  return (
    <div>
     

      <div className="space-y-6">

        
        <div className="bg-white rounded-xl shadow-md p-6">
          

          <div className="space-y-4">
           

            {/* Download Weekly Report */}
            <div className="p-4 bg-gray-50 rounded-lg justify-between">
              <h3 className="font-semibold text-gray-900 mb-1">Download Weekly Report</h3>
              
              <button
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isDownloading
                  ? <><Loader className="h-4 w-4 animate-spin" /><span>Preparing...</span></>
                  : <><Download size={18} /><span>Download Report</span></>
                }
              </button>
              
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Shield className="text-gray-700" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
             
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
  <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
  {!showPwForm ? (
    <button
      onClick={() => setShowPwForm(true)}
      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
    >
      Update Password
    </button>
  ) : (
    <div className="space-y-2 max-w-sm">
      <input type="password" placeholder="Current password"
        value={pwData.currentPassword}
        onChange={(e) => setPwData({ ...pwData, currentPassword: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
      />
      <input type="password" placeholder="New password"
        value={pwData.newPassword}
        onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
      />
      <input type="password" placeholder="Confirm new password"
        value={pwData.confirmPassword}
        onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
      />
      <div className="flex gap-2">
        <button onClick={handleUpdatePassword}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Update
        </button>
        <button onClick={() => { setShowPwForm(false); setPwMessage(''); }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
      {pwMessage && <p className="text-sm text-gray-700">{pwMessage}</p>}
    </div>
  )}
</div>

            {/* Add New Admin */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Add New Admin</h3>
              

              {!showPasswordInput && !isVerified && (
                <button
                  onClick={() => setShowPasswordInput(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Add Admin
                </button>
              )}

              {showPasswordInput && !isVerified && (
                <div className="space-y-2 max-w-sm">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <button
                    onClick={handleVerify}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Verify
                  </button>
                  {adminNotification && <p className="text-sm text-gray-700">{adminNotification}</p>}
                </div>
              )}

              {isVerified && (
                <div className="space-y-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter new admin email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <button
                    onClick={handleAddAdmin}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Admin
                  </button>
                  {adminNotification && <p className="text-sm text-gray-700">{adminNotification}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save */}
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
            {saveNotification && <p className="mt-1 text-sm text-gray-700">{saveNotification}</p>}
          </div>
        </div>

      </div>
    </div>
  );
}