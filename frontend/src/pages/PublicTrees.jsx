import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { treesApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/authStore';
import {
  MagnifyingGlassIcon,
  UsersIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function PublicTrees() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['public-trees', search, page],
    queryFn: () => treesApi.publicList({ search, page }).then((r) => r.data),
  });

  const trees = data?.data || [];
  const lastPage = data?.last_page || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <GlobeAltIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Public Family Trees</h1>
                <p className="text-gray-500 text-sm">Browse publicly shared family trees</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
                  <ArrowLeftIcon className="w-4 h-4" /> Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn-primary">Sign In</Link>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mt-5 relative max-w-lg">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Search public trees..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingSpinner className="mt-16" />
        ) : trees.length === 0 ? (
          <div className="text-center py-20">
            <GlobeAltIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No public trees found</h3>
            <p className="text-gray-400">
              {search ? 'Try a different search term' : 'No family trees have been made public yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trees.map((tree) => (
                <Link
                  key={tree.id}
                  to={`/public/trees/${tree.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {tree.name}
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                      <GlobeAltIcon className="w-3 h-3" /> Public
                    </span>
                  </div>
                  {tree.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tree.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4" />
                      {tree.persons_count || 0} members
                    </span>
                    {tree.owner && (
                      <span className="text-gray-400">by {tree.owner.name}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {lastPage}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
