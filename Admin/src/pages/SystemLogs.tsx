import { useState, useEffect } from 'react';
import { Search, Download, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

interface Log {
  _id: string;
  type: 'info' | 'warning' | 'error';
  action: string;
  user: string;
  details: string;
  createdAt: string;
}

const getTypeIcon = (type: string) => {
  if (type === 'error')   return <AlertCircle className="text-red-600" size={20} />;
  if (type === 'warning') return <AlertTriangle className="text-yellow-600" size={20} />;
  return <Info className="text-blue-600" size={20} />;
};

const getTypeBadge = (type: string) => {
  if (type === 'error')   return 'bg-red-100 text-red-800';
  if (type === 'warning') return 'bg-yellow-100 text-yellow-800';
  return 'bg-blue-100 text-blue-800';
};

export default function SystemLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'info' | 'warning' | 'error'>('all');

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API}/logs`, authHeaders());
      setLogs(data.logs);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Type', 'Action', 'User', 'Details', 'Timestamp'],
      ...logs.map((l) => [l.type, l.action, l.user, l.details, new Date(l.createdAt).toLocaleString()])
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || log.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          
          <p className="text-black-600 font-bold text-2xl">View all system activities and events</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Download size={20} />
          Export Logs
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'info', 'warning', 'error'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === type ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {[
          { type: 'info',    label: 'Info',     icon: <Info size={24} className="text-blue-600" />,     bg: 'bg-blue-100' },
          { type: 'warning', label: 'Warnings', icon: <AlertTriangle size={24} className="text-yellow-600" />, bg: 'bg-yellow-100' },
          { type: 'error',   label: 'Errors',   icon: <AlertCircle size={24} className="text-red-600" />, bg: 'bg-red-100' },
        ].map((card) => (
          <div key={card.type} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 ${card.bg} rounded-lg`}>{card.icon}</div>
              <h3 className="text-gray-600 font-medium">{card.label}</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {logs.filter((l) => l.type === card.type).length}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Type', 'Action', 'User', 'Details', 'Timestamp'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading logs...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No logs found</td>
                </tr>
              ) : filtered.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(log.type)}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeBadge(log.type)}`}>
                        {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{log.details}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filtered.length}</span> of{' '}
          <span className="font-semibold">{logs.length}</span> logs
        </p>
      </div>
    </div>
  );
}