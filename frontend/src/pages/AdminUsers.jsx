import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  ShieldCheckIcon,
  EyeIcon,
  UsersIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  CalendarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-700 ring-red-600/10',
  moderator: 'bg-amber-100 text-amber-700 ring-amber-600/10',
  user: 'bg-blue-100 text-blue-700 ring-blue-600/10',
};

function RoleBadge({ name, displayName }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${ROLE_COLORS[name] || 'bg-gray-100 text-gray-700 ring-gray-600/10'}`}>
      {displayName || name}
    </span>
  );
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Modals
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editRoles, setEditRoles] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', search, roleFilter, sort, page],
    queryFn: () => adminApi.getUsers({ search: search || undefined, role: roleFilter || undefined, sort, page }).then((r) => r.data),
  });

  // Fetch roles
  const { data: roles = [] } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => adminApi.getRoles().then((r) => r.data),
  });

  // Fetch user details
  const { data: userDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['admin-user', viewUser?.id],
    queryFn: () => adminApi.getUser(viewUser.id).then((r) => r.data),
    enabled: !!viewUser,
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated');
      setEditUser(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const assignMutation = useMutation({
    mutationFn: ({ userId, roles }) => adminApi.assignRoles(userId, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Roles updated');
      setEditRoles(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update roles'),
  });

  const openEdit = (user) => {
    setEditForm({ name: user.name, email: user.email, password: '' });
    setEditUser(user);
  };

  const openRoles = (user) => {
    setSelectedRoles(user.role_names || user.roles?.map((r) => r.name) || []);
    setEditRoles(user);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = { name: editForm.name, email: editForm.email };
    if (editForm.password) data.password = editForm.password;
    updateMutation.mutate({ id: editUser.id, data });
  };

  const toggleRole = (name) =>
    setSelectedRoles((prev) => prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]);

  const users = usersData?.data || [];
  const pagination = usersData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage accounts, roles and permissions for all users.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <UsersIcon className="w-4 h-4" />
          {pagination.total || 0} total users
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                className="input-field pl-9 pr-8 min-w-[140px]"
              >
                <option value="">All Roles</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>{r.display_name}</option>
                ))}
              </select>
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="input-field min-w-[130px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner className="py-16" />
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <UsersIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Roles</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Trees</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-indigo-600">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.length > 0 ? (
                            user.roles.map((role) => (
                              <RoleBadge key={role.id} name={role.name} displayName={role.display_name} />
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">No roles</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="text-sm text-gray-700">{user.owned_trees_count || 0}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewUser(user)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="View details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openRoles(user)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition"
                            title="Edit roles"
                          >
                            <ShieldCheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(user)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Edit user"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete user "${user.name}"? This will also remove all their trees.`)) {
                                deleteMutation.mutate(user.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete user"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          </>
        )}
      </div>

      {/* View User Modal */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size="lg">
        {viewUser && (
          <div className="space-y-5">
            {detailsLoading ? (
              <LoadingSpinner className="py-8" />
            ) : userDetails ? (
              <>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-indigo-600">
                      {userDetails.user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{userDetails.user.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <EnvelopeIcon className="w-3.5 h-3.5" />
                        {userDetails.user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Joined {new Date(userDetails.user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {userDetails.user.roles?.map((r) => (
                        <RoleBadge key={r.id} name={r.name} displayName={r.display_name} />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <HomeIcon className="w-4 h-4" />
                    Family Trees ({userDetails.trees.length})
                  </h4>
                  {userDetails.trees.length > 0 ? (
                    <div className="space-y-2">
                      {userDetails.trees.map((tree) => (
                        <div key={tree.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{tree.name}</p>
                            <p className="text-xs text-gray-500">{tree.persons_count} members</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            tree.privacy === 'public' ? 'bg-green-100 text-green-700' :
                            tree.privacy === 'shared' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {tree.privacy}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No trees created</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity</h4>
                  {userDetails.recent_activity.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {userDetails.recent_activity.map((log) => (
                        <div key={log.id} className="flex items-center gap-2 text-sm p-2 rounded hover:bg-gray-50">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            log.action === 'created' ? 'bg-green-100 text-green-700' :
                            log.action === 'updated' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-gray-600">{log.subject_type}</span>
                          <span className="text-gray-400 ml-auto text-xs">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No activity recorded</p>
                  )}
                </div>
              </>
            ) : null}
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                className="input-field"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span>
              </label>
              <input
                type="password"
                className="input-field"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="••••••••"
                minLength={8}
              />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setEditUser(null)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Edit Roles Modal */}
      <Modal isOpen={!!editRoles} onClose={() => setEditRoles(null)} title={`Manage Roles — ${editRoles?.name}`}>
        {editRoles && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Select which roles this user should have:</p>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedRoles.includes(role.name)
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.name)}
                    onChange={() => toggleRole(role.name)}
                    className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{role.display_name}</span>
                      <RoleBadge name={role.name} displayName={role.name} />
                    </div>
                    {role.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button onClick={() => setEditRoles(null)} className="btn-secondary">Cancel</button>
              <button
                onClick={() => assignMutation.mutate({ userId: editRoles.id, roles: selectedRoles })}
                disabled={assignMutation.isPending}
                className="btn-primary"
              >
                {assignMutation.isPending ? 'Saving...' : 'Save Roles'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
