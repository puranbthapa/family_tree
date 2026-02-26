import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { treesApi } from '../api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  UsersIcon,
  TrashIcon,
  PencilIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editTree, setEditTree] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', privacy: 'private' });

  const { data, isLoading } = useQuery({
    queryKey: ['trees'],
    queryFn: () => treesApi.list().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => treesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trees'] });
      setShowCreate(false);
      setForm({ name: '', description: '', privacy: 'private' });
      toast.success('Family tree created!');
    },
    onError: () => toast.error('Failed to create tree'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }) => treesApi.update(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trees'] });
      setEditTree(null);
      toast.success('Tree updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => treesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trees'] });
      toast.success('Tree deleted');
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      slug: editTree.slug,
      data: { name: editTree.name, description: editTree.description, privacy: editTree.privacy },
    });
  };

  if (isLoading) return <LoadingSpinner className="mt-20" />;

  const trees = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Family Trees</h1>
          <p className="text-gray-600 mt-1">Manage and explore your family history</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          New Tree
        </button>
      </div>

      {trees.length === 0 ? (
        <div className="text-center py-16 card">
          <UsersIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No family trees yet</h3>
          <p className="text-gray-600 mb-6">Create your first family tree to get started.</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            Create Family Tree
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trees.map((tree) => (
            <div key={tree.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <Link to={`/trees/${tree.slug}`} className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                  {tree.name}
                </Link>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  tree.privacy === 'public' ? 'bg-green-100 text-green-700' :
                  tree.privacy === 'shared' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {tree.privacy}
                </span>
              </div>
              {tree.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tree.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <UsersIcon className="w-4 h-4" />
                  {tree.persons_count || 0} members
                </span>
              </div>
              <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                <Link to={`/trees/${tree.slug}`} className="btn-primary text-sm py-1.5 px-3 flex-1 text-center">
                  Open
                </Link>
                <Link to={`/trees/${tree.slug}/editor`} className="btn-secondary text-sm py-1.5 px-3">
                  <ChartBarIcon className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setEditTree({ ...tree })}
                  className="btn-secondary text-sm py-1.5 px-3"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this tree and all its data?')) {
                      deleteMutation.mutate(tree.slug);
                    }
                  }}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Family Tree">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tree Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Smith Family Tree"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input-field"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
            <select
              className="input-field"
              value={form.privacy}
              onChange={(e) => setForm({ ...form, privacy: e.target.value })}
            >
              <option value="private">Private - Only you</option>
              <option value="shared">Shared - Invited members</option>
              <option value="public">Public - Anyone</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTree} onClose={() => setEditTree(null)} title="Edit Family Tree">
        {editTree && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tree Name</label>
              <input
                className="input-field"
                value={editTree.name}
                onChange={(e) => setEditTree({ ...editTree, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="input-field"
                rows={3}
                value={editTree.description || ''}
                onChange={(e) => setEditTree({ ...editTree, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
              <select
                className="input-field"
                value={editTree.privacy}
                onChange={(e) => setEditTree({ ...editTree, privacy: e.target.value })}
              >
                <option value="private">Private</option>
                <option value="shared">Shared</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditTree(null)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>Save</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
