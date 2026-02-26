import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { treesApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import FamilyTreeChart from '../components/FamilyTreeChart';
import useAuthStore from '../store/authStore';
import {
  ArrowLeftIcon,
  UsersIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ListBulletIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

export default function PublicTreeView() {
  const { treeSlug } = useParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [viewMode, setViewMode] = useState('tree');

  const { data: tree, isLoading, error } = useQuery({
    queryKey: ['public-tree', treeSlug],
    queryFn: () => treesApi.publicGet(treeSlug).then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner className="mt-20" />;

  if (error) {
    const status = error.response?.status;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LockClosedIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {status === 403 ? 'This tree is private' : 'Tree not found'}
          </h2>
          <p className="text-gray-500 mb-6">
            {status === 403
              ? 'The owner has not made this tree public.'
              : 'The tree you are looking for does not exist.'}
          </p>
          <Link to="/public/trees" className="btn-primary">Browse Public Trees</Link>
        </div>
      </div>
    );
  }

  if (!tree) return null;

  const persons = tree.persons || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/public/trees"
              className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Public Trees
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/20 text-green-200 flex items-center gap-1">
                <GlobeAltIcon className="w-3 h-3" /> Public Tree
              </span>
              {isAuthenticated && (
                <Link to="/dashboard" className="text-sm text-white/80 hover:text-white transition">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{tree.name}</h1>
          {tree.description && (
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">{tree.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-indigo-200">
            <span className="flex items-center gap-1">
              <UsersIcon className="w-4 h-4" /> {tree.persons_count || 0} members
            </span>
            {tree.owner && <span>by {tree.owner.name}</span>}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
              onClick={() => setViewMode('tree')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                viewMode === 'tree'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ChartBarIcon className="w-3.5 h-3.5" /> Tree
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ListBulletIcon className="w-3.5 h-3.5" /> Members
            </button>
          </div>
          <span className="text-xs text-gray-400 ml-2">Read-only view</span>
        </div>
      </div>

      {/* Content */}
      <div>
        {viewMode === 'tree' ? (
          <div className="bg-white" style={{ height: 'calc(100vh - 230px)', minHeight: 450 }}>
            <FamilyTreeChart
              persons={persons}
              relationships={tree.relationships || []}
              treeSlug={treeSlug}
              readOnly
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {persons.length === 0 ? (
              <div className="text-center py-16">
                <UsersIcon className="w-14 h-14 mx-auto text-gray-200 mb-4" />
                <h3 className="text-base font-medium text-gray-600">No members in this tree</h3>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {persons.map((person) => {
                  const birthYear = person.date_of_birth ? new Date(person.date_of_birth).getFullYear() : null;
                  const deathYear = person.date_of_death ? new Date(person.date_of_death).getFullYear() : null;
                  return (
                    <div
                      key={person.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3"
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm ${
                        person.gender === 'male' ? 'bg-blue-500' : person.gender === 'female' ? 'bg-pink-500' : 'bg-gray-400'
                      }`}>
                        {person.first_name[0]}{person.last_name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">
                          {person.first_name} {person.last_name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {birthYear ? `${birthYear}${deathYear ? ` – ${deathYear}` : person.is_living ? ' – present' : ''}` : ''}
                          {person.occupation ? ` · ${person.occupation}` : ''}
                        </div>
                      </div>
                      {!person.is_living && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Deceased</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
