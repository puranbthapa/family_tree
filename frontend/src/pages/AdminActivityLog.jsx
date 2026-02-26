import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UserIcon,
  HomeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const ACTION_STYLES = {
  created: { bg: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  updated: { bg: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  deleted: { bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const SUBJECT_ICONS = {
  FamilyTree: HomeIcon,
  Person: UserIcon,
  Relationship: DocumentTextIcon,
};

export default function AdminActivityLog() {
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);

  const { data: activityData, isLoading } = useQuery({
    queryKey: ['admin-activity', search, action, page],
    queryFn: () => adminApi.getActivity({ search: search || undefined, action: action || undefined, page }).then((r) => r.data),
  });

  const logs = activityData?.data || [];
  const pagination = activityData || {};

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-500 mt-1">Track all actions performed across the platform.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ClipboardDocumentListIcon className="w-4 h-4" />
          {pagination.total || 0} total entries
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by action, subject, user or description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10 pr-10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <FunnelIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={action}
              onChange={(e) => { setAction(e.target.value); setPage(1); }}
              className="input-field pl-9 pr-8 min-w-[150px]"
            >
              <option value="">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {isLoading ? (
        <LoadingSpinner className="py-16" />
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No activity logs found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {logs.map((log, idx) => {
              const actionStyle = ACTION_STYLES[log.action] || ACTION_STYLES.updated;
              const SubjectIcon = SUBJECT_ICONS[log.subject_type] || GlobeAltIcon;

              return (
                <div key={log.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition">
                  <div className="flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center pt-1 hidden sm:flex">
                      <div className={`w-2.5 h-2.5 rounded-full ${actionStyle.dot}`} />
                      {idx < logs.length - 1 && (
                        <div className="w-px h-full bg-gray-200 mt-1 min-h-[2rem]" />
                      )}
                    </div>

                    {/* Icon */}
                    <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                      <SubjectIcon className="w-4 h-4 text-gray-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {log.user?.name || 'System'}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${actionStyle.bg}`}>
                          {log.action}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">{log.subject_type}</span>
                        {log.subject_id && (
                          <span className="text-xs text-gray-400">#{log.subject_id}</span>
                        )}
                      </div>

                      {log.description && (
                        <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {formatTimeAgo(log.created_at)}
                        </span>
                        <span>{new Date(log.created_at).toLocaleString()}</span>
                        {log.family_tree && (
                          <span className="flex items-center gap-1">
                            <HomeIcon className="w-3 h-3" />
                            {log.family_tree.name}
                          </span>
                        )}
                        {log.ip_address && (
                          <span className="flex items-center gap-1">
                            <GlobeAltIcon className="w-3 h-3" />
                            {log.ip_address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
              <p className="text-sm text-gray-500">
                {pagination.from}–{pagination.to} of {pagination.total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-white transition"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        p === page ? 'bg-indigo-600 text-white' : 'hover:bg-white border border-gray-300 text-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  disabled={page >= pagination.last_page}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-white transition"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
