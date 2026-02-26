import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  KeyIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';

const ROLE_COLORS = {
  admin: { card: 'border-l-red-500', badge: 'bg-red-100 text-red-700', icon: 'bg-red-50 text-red-600' },
  moderator: { card: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700', icon: 'bg-amber-50 text-amber-600' },
  user: { card: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700', icon: 'bg-blue-50 text-blue-600' },
};

const DEFAULT_COLORS = { card: 'border-l-gray-400', badge: 'bg-gray-100 text-gray-700', icon: 'bg-gray-50 text-gray-600' };

export default function AdminRoles() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [form, setForm] = useState({ name: '', display_name: '', description: '' });

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => adminApi.getRoles().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      toast.success('Role created');
      setShowCreate(false);
      setForm({ name: '', display_name: '', description: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create role'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      toast.success('Role updated');
      setEditRole(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Role deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const builtInRoles = ['admin', 'moderator', 'user'];
  const totalAssignments = roles.reduce((sum, r) => sum + (r.users_count || 0), 0);

  const openEdit = (role) => {
    setForm({ display_name: role.display_name, description: role.description || '' });
    setEditRole(role);
  };

  if (isLoading) return <LoadingSpinner className="mt-20" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-500 mt-1">Define roles and permissions for your application.</p>
        </div>
        <button
          onClick={() => { setForm({ name: '', display_name: '', description: '' }); setShowCreate(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl">
            <KeyIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            <p className="text-sm text-gray-500">Total Roles</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-xl">
            <ShieldCheckIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{builtInRoles.length}</p>
            <p className="text-sm text-gray-500">Built-in Roles</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="bg-violet-50 p-3 rounded-xl">
            <UserGroupIcon className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
            <p className="text-sm text-gray-500">Total Assignments</p>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const colors = ROLE_COLORS[role.name] || DEFAULT_COLORS;
          const isBuiltIn = builtInRoles.includes(role.name);

          return (
            <div
              key={role.id}
              className={`bg-white rounded-xl border border-gray-200 border-l-4 ${colors.card} overflow-hidden hover:shadow-md transition`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${colors.icon}`}>
                      {isBuiltIn ? <ShieldCheckIcon className="w-5 h-5" /> : <ShieldExclamationIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{role.display_name}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                          {role.name}
                        </span>
                      </div>
                      {isBuiltIn && (
                        <span className="text-xs text-gray-400 font-medium">Built-in</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(role)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit role"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    {!isBuiltIn && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete role "${role.display_name}"? All users with this role will lose it.`)) {
                            deleteMutation.mutate(role.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete role"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3">
                  {role.description || 'No description provided.'}
                </p>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <UserGroupIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{role.users_count}</span>
                    {' '}user{role.users_count !== 1 ? 's' : ''} assigned
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Role Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Role">
        <form
          onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Slug</label>
            <input
              type="text"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
              placeholder="e.g. editor"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Lowercase, letters, numbers, dashes and underscores only.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              className="input-field"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              placeholder="e.g. Editor"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input-field"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What can users with this role do?"
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal isOpen={!!editRole} onClose={() => setEditRole(null)} title={`Edit Role — ${editRole?.display_name}`}>
        {editRole && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate({
                id: editRole.id,
                data: { display_name: form.display_name, description: form.description },
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Slug</label>
              <input type="text" className="input-field bg-gray-50" value={editRole.name} disabled />
              <p className="text-xs text-gray-400 mt-1">Role slugs cannot be changed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                className="input-field"
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="input-field"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setEditRole(null)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
