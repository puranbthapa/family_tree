import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treesApi, collaboratorsApi, exportImportApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  UserPlusIcon,
  TrashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function TreeSettings() {
  const { treeSlug } = useParams();
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'viewer' });
  const [activeTab, setActiveTab] = useState('collaborators');

  const { data: tree, isLoading } = useQuery({
    queryKey: ['tree', treeSlug],
    queryFn: () => treesApi.get(treeSlug).then((r) => r.data),
  });

  const { data: collabData } = useQuery({
    queryKey: ['collaborators', treeSlug],
    queryFn: () => collaboratorsApi.list(treeSlug).then((r) => r.data),
  });

  const { data: activityData } = useQuery({
    queryKey: ['activity', treeSlug],
    queryFn: () => exportImportApi.activityLog(treeSlug).then((r) => r.data),
    enabled: activeTab === 'activity',
  });

  const inviteMutation = useMutation({
    mutationFn: (data) => collaboratorsApi.invite(treeSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators', treeSlug] });
      setShowInvite(false);
      setInviteForm({ email: '', role: 'viewer' });
      toast.success('Invitation sent!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to invite'),
  });

  const removeMutation = useMutation({
    mutationFn: (collabId) => collaboratorsApi.remove(treeSlug, collabId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators', treeSlug] });
      toast.success('Collaborator removed');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ collabId, role }) => collaboratorsApi.updateRole(treeSlug, collabId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators', treeSlug] });
      toast.success('Role updated');
    },
  });

  if (isLoading) return <LoadingSpinner className="mt-20" />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/trees/${treeSlug}`} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{tree?.name} - Settings</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {['collaborators', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 capitalize transition ${
                activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'activity' ? 'Activity Log' : tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'collaborators' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <button onClick={() => setShowInvite(true)} className="btn-primary text-sm flex items-center gap-2">
              <UserPlusIcon className="w-4 h-4" /> Invite
            </button>
          </div>

          {/* Owner */}
          {collabData?.owner && (
            <div className="card mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  {collabData.owner.name?.[0]}
                </div>
                <div>
                  <div className="font-medium text-sm">{collabData.owner.name}</div>
                  <div className="text-xs text-gray-500">{collabData.owner.email}</div>
                </div>
              </div>
              <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Owner</span>
            </div>
          )}

          {/* Collaborators */}
          <div className="space-y-3">
            {collabData?.collaborators?.map((collab) => {
              const name = collab.user?.name || collab.email || 'Unknown';
              const email = collab.user?.email || collab.email || '';
              const initial = name[0]?.toUpperCase() || '?';
              const isEmailOnly = !collab.user_id;

              return (
                <div key={collab.id} className="card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isEmailOnly ? 'bg-amber-400' : 'bg-gray-300'}`}>
                      {initial}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{name}</div>
                      {collab.user && <div className="text-xs text-gray-500">{email}</div>}
                      {isEmailOnly ? (
                        <span className="text-xs text-amber-600">Not registered yet — will get access on signup</span>
                      ) : !collab.accepted_at ? (
                        <span className="text-xs text-amber-600">Pending invitation</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="input-field text-xs py-1"
                      value={collab.role}
                      onChange={(e) => updateRoleMutation.mutate({ collabId: collab.id, role: e.target.value })}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={() => confirm('Remove?') && removeMutation.mutate(collab.id)}
                      className="p-1.5 text-red-400 hover:text-red-600">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {(!collabData?.collaborators || collabData.collaborators.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-6">No collaborators yet. Invite family members!</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-2">
          {activityData?.data?.map((log) => (
            <div key={log.id} className="card flex items-start gap-3 py-3">
              <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm">
                  <span className="font-medium">{log.user?.name}</span>
                  <span className="text-gray-500"> {log.action} </span>
                  <span className="text-gray-700">{log.subject_type}</span>
                </div>
                {log.description && <p className="text-xs text-gray-500">{log.description}</p>}
                <div className="text-xs text-gray-400 mt-1">{new Date(log.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
          {(!activityData?.data || activityData.data.length === 0) && (
            <p className="text-center text-gray-500 py-8">No activity yet.</p>
          )}
        </div>
      )}

      {/* Invite Modal */}
      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Collaborator">
        <form onSubmit={(e) => { e.preventDefault(); inviteMutation.mutate(inviteForm); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" className="input-field" value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="family@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="input-field" value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}>
              <option value="viewer">Viewer - Can view only</option>
              <option value="editor">Editor - Can add/edit members</option>
              <option value="admin">Admin - Full access</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowInvite(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={inviteMutation.isPending}>Send Invitation</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
