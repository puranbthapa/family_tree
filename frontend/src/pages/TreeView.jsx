import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treesApi, personsApi, relationshipsApi, exportImportApi } from '../api';
import useTreeStore from '../store/treeStore';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import FamilyTreeChart from '../components/FamilyTreeChart';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  UserGroupIcon,
  LinkIcon,
  ListBulletIcon,
  UsersIcon,
  HeartIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';

export default function TreeView() {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setCurrentTree, setPersons, setRelationships } = useTreeStore();
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddRelation, setShowAddRelation] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'
  const [personForm, setPersonForm] = useState({
    first_name: '', last_name: '', gender: 'unknown',
    date_of_birth: '', birth_place: '', occupation: '',
    maiden_name: '', nickname: '', is_living: true,
  });
  const [relForm, setRelForm] = useState({ person1_id: '', person2_id: '', type: 'parent_child' });

  const { data: tree, isLoading } = useQuery({
    queryKey: ['tree', treeId],
    queryFn: () => treesApi.get(treeId).then((r) => r.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['tree-stats', treeId],
    queryFn: () => treesApi.statistics(treeId).then((r) => r.data),
  });

  useEffect(() => {
    if (tree) {
      setCurrentTree(tree);
      setPersons(tree.persons || []);
      setRelationships(tree.relationships || []);
    }
  }, [tree]);

  const createPersonMutation = useMutation({
    mutationFn: (data) => personsApi.create(treeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tree', treeId] });
      queryClient.invalidateQueries({ queryKey: ['tree-stats', treeId] });
      setShowAddPerson(false);
      setPersonForm({
        first_name: '', last_name: '', gender: 'unknown',
        date_of_birth: '', birth_place: '', occupation: '',
        maiden_name: '', nickname: '', is_living: true,
      });
      toast.success('Person added!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const createRelMutation = useMutation({
    mutationFn: (data) => relationshipsApi.create(treeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tree', treeId] });
      setShowAddRelation(false);
      setRelForm({ person1_id: '', person2_id: '', type: 'parent_child' });
      toast.success('Relationship created!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleExportGedcom = async () => {
    try {
      const { data } = await exportImportApi.exportGedcom(treeId);
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tree.name}.ged`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Exported!');
    } catch {
      toast.error('Export failed');
    }
  };

  // Image export
  const chartRef = useRef(null);
  const handleExportImage = async () => {
    if (!chartRef.current) { toast.error('Switch to Tree view first'); return; }
    try {
      toast.loading('Generating image...', { id: 'img-export' });
      await chartRef.current.captureImage(tree.name || 'family-tree');
      toast.success('Image downloaded!', { id: 'img-export' });
    } catch (err) {
      console.error(err);
      toast.error('Image export failed', { id: 'img-export' });
    }
  };

  const handleImportGedcom = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await exportImportApi.importGedcom(treeId, formData);
      queryClient.invalidateQueries({ queryKey: ['tree', treeId] });
      toast.success(`Imported ${data.stats.persons} persons and ${data.stats.relationships} relationships`);
    } catch {
      toast.error('Import failed');
    }
    e.target.value = '';
  };

  if (isLoading) return <LoadingSpinner className="mt-20" />;
  if (!tree) return <div className="text-center mt-20 text-gray-600">Tree not found</div>;

  const persons = tree.persons || [];
  const filteredPersons = persons.filter((p) =>
    !search || `${p.first_name} ${p.last_name} ${p.maiden_name || ''} ${p.nickname || ''}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-0 -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-4 sm:px-6 lg:px-8 pt-6 pb-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Tree Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white truncate">{tree.name}</h1>
            </div>
            {tree.description && (
              <p className="text-indigo-200 text-sm mt-1 line-clamp-2 max-w-2xl">{tree.description}</p>
            )}
          </div>
          {/* Nav Links */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to={`/trees/${treeId}/relationships`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/90 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              <LinkIcon className="w-3.5 h-3.5" /> Relations
            </Link>
            <Link
              to={`/trees/${treeId}/settings`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/90 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              <Cog6ToothIcon className="w-3.5 h-3.5" /> Settings
            </Link>
          </div>
        </div>

        {/* Inline Stats */}
        {stats && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <UsersIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">{stats.total_persons}</div>
                <div className="text-[10px] text-indigo-300 uppercase tracking-wider">Members</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <SparklesIcon className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">{stats.living}</div>
                <div className="text-[10px] text-indigo-300 uppercase tracking-wider">Living</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <HeartIcon className="w-3.5 h-3.5 text-pink-300" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">{stats.marriages}</div>
                <div className="text-[10px] text-indigo-300 uppercase tracking-wider">Marriages</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <ArrowsRightLeftIcon className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">{stats.relationships}</div>
                <div className="text-[10px] text-indigo-300 uppercase tracking-wider">Relations</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Toolbar ─── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: View toggle + Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
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
            {viewMode === 'list' && (
              <div className="relative flex-1 sm:w-56 sm:flex-initial">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-2.5 top-2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>
          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => setShowAddPerson(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm">
              <PlusIcon className="w-3.5 h-3.5" /> Add Person
            </button>
            <button onClick={() => setShowAddRelation(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition">
              <UserGroupIcon className="w-3.5 h-3.5" /> Add Relation
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1 hidden sm:block" />
            <button onClick={handleExportImage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
              title="Export as Image (PNG)"
            >
              <CameraIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Image</span>
            </button>
            <button onClick={handleExportGedcom}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
              title="Export GEDCOM"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GEDCOM</span>
            </button>
            <label
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition cursor-pointer"
              title="Import GEDCOM"
            >
              <ArrowUpTrayIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".ged,.txt" onChange={handleImportGedcom} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* ─── Content Area ─── */}
      <div className="px-0">
        {/* Tree Chart View */}
        {viewMode === 'tree' && (
          <div className="bg-white" style={{ height: 'calc(100vh - 230px)', minHeight: 450 }}>
            <FamilyTreeChart
              ref={chartRef}
              persons={persons}
              relationships={tree.relationships || []}
              treeId={treeId}
            />
          </div>
        )}

        {/* Members List View */}
        {viewMode === 'list' && (
          <div className="px-4 sm:px-6 lg:px-8 py-5">
            {filteredPersons.length === 0 ? (
              <div className="text-center py-16">
                <UserGroupIcon className="w-14 h-14 mx-auto text-gray-200 mb-4" />
                <h3 className="text-base font-medium text-gray-600 mb-1">
                  {search ? 'No results found' : 'No members yet'}
                </h3>
                <p className="text-sm text-gray-400">
                  {search ? 'Try a different search term' : 'Add your first family member to get started!'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPersons.map((person) => {
                  const birthYear = person.date_of_birth ? new Date(person.date_of_birth).getFullYear() : null;
                  const deathYear = person.date_of_death ? new Date(person.date_of_death).getFullYear() : null;
                  return (
                    <Link
                      key={person.id}
                      to={`/trees/${treeId}/persons/${person.id}`}
                      className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex items-center gap-3"
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm ${
                        person.gender === 'male' ? 'bg-blue-500' : person.gender === 'female' ? 'bg-pink-500' : 'bg-gray-400'
                      }`}>
                        {person.first_name[0]}{person.last_name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate group-hover:text-indigo-700 transition-colors">
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
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Person Modal */}
      <Modal isOpen={showAddPerson} onClose={() => setShowAddPerson(false)} title="Add Family Member" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); createPersonMutation.mutate(personForm); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input className="input-field" value={personForm.first_name}
                onChange={(e) => setPersonForm({ ...personForm, first_name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input className="input-field" value={personForm.last_name}
                onChange={(e) => setPersonForm({ ...personForm, last_name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maiden Name</label>
              <input className="input-field" value={personForm.maiden_name}
                onChange={(e) => setPersonForm({ ...personForm, maiden_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
              <input className="input-field" value={personForm.nickname}
                onChange={(e) => setPersonForm({ ...personForm, nickname: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select className="input-field" value={personForm.gender}
                onChange={(e) => setPersonForm({ ...personForm, gender: e.target.value })}>
                <option value="unknown">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" className="input-field" value={personForm.date_of_birth}
                onChange={(e) => setPersonForm({ ...personForm, date_of_birth: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
              <input className="input-field" value={personForm.birth_place}
                onChange={(e) => setPersonForm({ ...personForm, birth_place: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input className="input-field" value={personForm.occupation}
                onChange={(e) => setPersonForm({ ...personForm, occupation: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_living" checked={personForm.is_living}
              onChange={(e) => setPersonForm({ ...personForm, is_living: e.target.checked })} />
            <label htmlFor="is_living" className="text-sm text-gray-700">Currently living</label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowAddPerson(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={createPersonMutation.isPending}>
              {createPersonMutation.isPending ? 'Adding...' : 'Add Person'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Relationship Modal */}
      <Modal isOpen={showAddRelation} onClose={() => setShowAddRelation(false)} title="Create Relationship">
        <form onSubmit={(e) => { e.preventDefault(); createRelMutation.mutate(relForm); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person 1</label>
            <select className="input-field" value={relForm.person1_id}
              onChange={(e) => setRelForm({ ...relForm, person1_id: e.target.value })} required>
              <option value="">Select person...</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Type</label>
            <select className="input-field" value={relForm.type}
              onChange={(e) => setRelForm({ ...relForm, type: e.target.value })}>
              <option value="parent_child">Parent → Child</option>
              <option value="spouse">Spouse</option>
              <option value="ex_spouse">Ex-Spouse (Divorced)</option>
              <option value="partner">Partner (Unmarried)</option>
              <option value="sibling">Sibling</option>
              <option value="half_sibling">Half-Sibling</option>
              <option value="step_parent_child">Step-Parent → Child</option>
              <option value="adoptive_parent_child">Adoptive Parent → Child</option>
              <option value="guardian">Guardian</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person 2</label>
            <select className="input-field" value={relForm.person2_id}
              onChange={(e) => setRelForm({ ...relForm, person2_id: e.target.value })} required>
              <option value="">Select person...</option>
              {persons.filter(p => String(p.id) !== String(relForm.person1_id)).map((p) => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowAddRelation(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={createRelMutation.isPending}>
              {createRelMutation.isPending ? 'Creating...' : 'Create Relationship'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
