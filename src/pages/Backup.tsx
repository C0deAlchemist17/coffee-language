import React from 'react';
import { Database, Download, Upload, RefreshCw, Calendar, HardDrive } from 'lucide-react';
import { formatDateTime } from '../utils/format';

const Backup: React.FC = () => {
  const backups = [
    { id: '1', filename: 'backup-2024-01-15.db', size: 2048, createdAt: new Date() },
    { id: '2', filename: 'backup-2024-01-14.db', size: 2040, createdAt: new Date(Date.now() - 86400000) },
    { id: '3', filename: 'backup-2024-01-13.db', size: 2035, createdAt: new Date(Date.now() - 172800000) },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">النسخ الاحتياطي والاستعادة</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="card hover:bg-white/10 transition-colors text-right">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
            <Download size={24} />
          </div>
          <h3 className="font-bold text-white mb-2">إنشاء نسخة احتياطية</h3>
          <p className="text-sm text-gray-400">إنشاء نسخة احتياطية جديدة من قاعدة البيانات</p>
        </button>

        <button className="card hover:bg-white/10 transition-colors text-right">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
            <Upload size={24} />
          </div>
          <h3 className="font-bold text-white mb-2">استعادة نسخة احتياطية</h3>
          <p className="text-sm text-gray-400">استعادة قاعدة البيانات من نسخة احتياطية</p>
        </button>

        <button className="card hover:bg-white/10 transition-colors text-right">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <RefreshCw size={24} />
          </div>
          <h3 className="font-bold text-white mb-2">إصلاح قاعدة البيانات</h3>
          <p className="text-sm text-gray-400">إصلاح قاعدة البيانات التالفة</p>
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className="text-coffee-400" size={24} />
            <h3 className="text-lg font-bold text-white">النسخ الاحتياطية السابقة</h3>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <HardDrive size={16} />
            <span className="text-sm">إجمالي: 6.1 MB</span>
          </div>
        </div>

        <div className="space-y-3">
          {backups.map((backup) => (
            <div key={backup.id} className="glass rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-coffee-600 flex items-center justify-center">
                  <Database size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{backup.filename}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>{(backup.size / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>{formatDateTime(backup.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary flex items-center gap-2 px-3 py-2">
                  <Download size={16} />
                  <span>تحميل</span>
                </button>
                <button className="btn-success flex items-center gap-2 px-3 py-2">
                  <RefreshCw size={16} />
                  <span>استعادة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Backup;
