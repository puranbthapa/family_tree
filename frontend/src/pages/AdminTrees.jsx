import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  TrashIcon,
  HomeIcon,
  UsersIcon,
  EyeIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const PRIVACY_CONFIG = {
  private: { label: 'Private', icon: LockClosedIcon, color: 'bg-gray-100 text-gray-700' },
  shared: { label: 'Shared', icon: UserGroupIcon, color: 'bg-blue-100 text-blue-700' },
  public: { label: 'Public', icon: GlobeAltIcon, color: 'bg-green-100 text-green-700' },
};

export default function AdminTrees() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const { data: treesData, isLoading } = useQuery({
    queryKey: ['admin-trees', search, privacy, sort, page],
    queryFn: () => adminApi.getTrees({ search: search || undefined, privacy: privacy || undefined, sort, page }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteTree(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trees'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Tree deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const trees = treesData?.data || [];
  const pagination = treesData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Trees</h1>
          <p className="text-gray-500 mt-1">View and manage all family trees across the platform.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <HomeIcon className="w-4 h-4" />
          {pagination.total || 0} total trees
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tree name or owner..."
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
          <div className="flex gap-2">
            <div className="relative">
              <FunnelIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={privacy}
                onChange={(e) => { setPrivacy(e.target.value); setPage(1); }}
                className="input-field pl-9 pr-8 min-w-[140px]"
              >
                <option value="">All Privacy</option>
                <option value="private">Private</option>
                <option value="shared">Shared</option>
                <option value="public">Public</option>
              </select>
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="input-field min-w-[140px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="members">Most Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trees Grid */}
      {isLoading ? (
        <LoadingSpinner className="py-16" />
      ) : trees.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <HomeIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No family trees found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trees.map((tree) => {
              const privacyConfig = PRIVACY_CONFIG[tree.privacy] || PRIVACY_CONFIG.private;
              const PrivacyIcon = privacyConfig.icon;

              return (
                <div key={tree.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{tree.name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          by {tree.owner?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${privacyConfig.color}`}>
                        <PrivacyIcon className="w-3 h-3" />
                        {privacyConfig.label}
                      </span>
                    </div>

                    {tree.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tree.description}</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        {tree.persons_count} members
                      </span>
                      <span className="text-xs text-gray-400">
                        Created {new Date(tree.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <UserGroupIcon className="w-3.5 h-3.5" />
                        Owner: {tree.owner?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/trees/${tree.slug}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="View tree"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Delete tree "${tree.name}"? This will permanently remove all persons, relationships and media.`)) {
                            deleteMutation.mutate(tree.slug);
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete tree"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex items-center justify-between">
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
        </>
      )}
    </div>
  );
}
