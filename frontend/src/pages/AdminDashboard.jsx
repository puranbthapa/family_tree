import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  UsersIcon,
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard().then((r) => r.data),
    refetchInterval: 60000,
  });

  if (isLoading) return <LoadingSpinner className="mt-20" />;

  const { stats, users_by_role, top_trees, recent_activity, active_users, trees_by_privacy } = data;

  const statCards = [
    {
      label: 'Total Users',
      value: stats.total_users,
      icon: UsersIcon,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 text-blue-700',
      link: '/admin/users',
      sub: `+${stats.new_users_this_month} this month`,
      trend: stats.new_users_this_month >= stats.new_users_last_month ? 'up' : 'down',
    },
    {
      label: 'Family Trees',
      value: stats.total_trees,
      icon: HomeIcon,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-700',
      link: '/admin/trees',
      sub: `+${stats.new_trees_this_month} this month`,
    },
    {
      label: 'Total Persons',
      value: stats.total_persons,
      icon: UserGroupIcon,
      color: 'bg-violet-500',
      lightColor: 'bg-violet-50 text-violet-700',
      sub: 'Across all trees',
    },
    {
      label: 'Activity Logs',
      value: stats.total_activity,
      icon: ClipboardDocumentListIcon,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50 text-amber-700',
      link: '/admin/activity',
      sub: 'Total actions',
    },
  ];

  const privacyColors = {
    private: { bg: 'bg-gray-100', text: 'text-gray-700', bar: 'bg-gray-400' },
    shared: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
    public: { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' },
  };

  const actionColors = {
    created: 'bg-green-100 text-green-700',
    updated: 'bg-blue-100 text-blue-700',
    deleted: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your application's data and activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value.toLocaleString()}</p>
              </div>
              <div className={`${card.color} p-2.5 rounded-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              {card.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />}
              {card.trend === 'down' && <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />}
              <span className="text-xs text-gray-500">{card.sub}</span>
              {card.link && (
                <Link to={card.link} className="text-xs text-indigo-600 hover:text-indigo-700 ml-auto font-medium">
                  View all →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users by Role */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Users by Role</h2>
          <div className="space-y-3">
            {users_by_role.map((role) => {
              const pct = stats.total_users > 0 ? Math.round((role.count / stats.total_users) * 100) : 0;
              return (
                <div key={role.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">{role.display_name}</span>
                    <span className="text-gray-500">{role.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trees by Privacy */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Trees by Privacy</h2>
          <div className="space-y-3">
            {Object.entries(trees_by_privacy).map(([privacy, count]) => {
              const pct = stats.total_trees > 0 ? Math.round((count / stats.total_trees) * 100) : 0;
              const colors = privacyColors[privacy] || privacyColors.private;
              return (
                <div key={privacy}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {privacy}
                      </span>
                    </div>
                    <span className="text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {Object.keys(trees_by_privacy).length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No trees yet</p>
          )}
        </div>

        {/* Most Active Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Most Active Users</h2>
          <div className="space-y-3">
            {active_users.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-100 text-gray-600' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{u.owned_trees_count} trees</span>
              </div>
            ))}
            {active_users.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No users yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Trees */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Largest Family Trees</h2>
            <Link to="/admin/trees" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {top_trees.map((tree, i) => (
              <div key={tree.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  i === 0 ? 'bg-indigo-100 text-indigo-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <ChartBarIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tree.name}</p>
                  <p className="text-xs text-gray-500">by {tree.owner}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{tree.persons_count}</span>
                  <span className="text-xs text-gray-500 block">members</span>
                </div>
              </div>
            ))}
            {top_trees.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No trees yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            <Link to="/admin/activity" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recent_activity.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition">
                <div className="mt-0.5">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{log.user?.name || 'System'}</span>
                    {' '}
                    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>
                      {log.action}
                    </span>
                    {' '}
                    <span className="text-gray-600">{log.subject_type}</span>
                  </p>
                  {log.description && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{log.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {recent_activity.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
