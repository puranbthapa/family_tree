import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personsApi, lifeEventsApi, commentsApi, mediaApi, relationshipsApi } from '../api';
import { NEPAL_PROVINCES, getDistricts, getMunicipalities } from '../data/nepalLocations';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  ChatBubbleLeftIcon,
  PhotoIcon,
  HeartIcon,
  CameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function PersonProfile() {
  const { treeSlug, personId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [eventForm, setEventForm] = useState({ type: 'other', title: '', event_date: '', event_place: '', description: '' });
  const [commentBody, setCommentBody] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: person, isLoading } = useQuery({
    queryKey: ['person', treeSlug, personId],
    queryFn: () => personsApi.get(treeSlug, personId).then((r) => r.data),
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', treeSlug, personId],
    queryFn: () => commentsApi.list(treeSlug, personId).then((r) => r.data),
    enabled: activeTab === 'comments',
  });

  useEffect(() => {
    if (person) setEditForm(person);
  }, [person]);

  const updateMutation = useMutation({
    mutationFn: (data) => personsApi.update(treeSlug, personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', treeSlug, personId] });
      setIsEditing(false);
      toast.success('Profile updated');
    },
    onError: () => toast.error('Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => personsApi.delete(treeSlug, personId),
    onSuccess: () => {
      navigate(`/trees/${treeSlug}`);
      toast.success('Person deleted');
    },
  });

  const addEventMutation = useMutation({
    mutationFn: (data) => lifeEventsApi.create(treeSlug, personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', treeSlug, personId] });
      setShowEventModal(false);
      setEventForm({ type: 'other', title: '', event_date: '', event_place: '', description: '' });
      toast.success('Event added');
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId) => lifeEventsApi.delete(treeSlug, personId, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', treeSlug, personId] });
      toast.success('Event deleted');
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (data) => commentsApi.create(treeSlug, personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', treeSlug, personId] });
      setCommentBody('');
      toast.success('Comment added');
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('photo', file);
      return personsApi.uploadPhoto(treeSlug, personId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', treeSlug, personId] });
      queryClient.invalidateQueries({ queryKey: ['tree'] });
      toast.success('Photo uploaded');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Upload failed'),
  });

  const deletePhotoMutation = useMutation({
    mutationFn: () => personsApi.deletePhoto(treeSlug, personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', treeSlug, personId] });
      queryClient.invalidateQueries({ queryKey: ['tree'] });
      toast.success('Photo removed');
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be less than 5MB');
      return;
    }
    uploadPhotoMutation.mutate(file);
    e.target.value = '';
  };

  if (isLoading) return <LoadingSpinner className="mt-20" />;
  if (!person) return <div className="text-center mt-20">Person not found</div>;

  const genderColor = person.gender === 'male' ? 'bg-blue-500' :
    person.gender === 'female' ? 'bg-pink-500' : 'bg-gray-400';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'comments', label: 'Comments' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/trees/${treeSlug}`} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{person.full_name}</h1>
          {person.nickname && <p className="text-gray-500">"{person.nickname}"</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center gap-2 text-sm">
            <PencilIcon className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => confirm('Delete this person?') && deleteMutation.mutate()}
            className="btn-danger flex items-center gap-2 text-sm"
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Photo */}
          <div className="relative group flex-shrink-0">
            {person.profile_photo ? (
              <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                <img
                  src={`/storage/${person.profile_photo}`}
                  alt={person.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={`w-28 h-28 rounded-xl flex items-center justify-center text-white font-bold text-3xl ${genderColor} shadow-sm`}>
                {person.first_name[0]}{person.last_name[0]}
              </div>
            )}
            {/* Photo overlay on hover */}
            <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer p-2 rounded-full bg-white/90 hover:bg-white transition shadow-sm" title="Upload photo">
                <CameraIcon className="w-5 h-5 text-gray-700" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {person.profile_photo && (
                <button
                  onClick={() => confirm('Remove profile photo?') && deletePhotoMutation.mutate()}
                  className="p-2 rounded-full bg-white/90 hover:bg-white transition shadow-sm"
                  title="Remove photo"
                >
                  <XMarkIcon className="w-5 h-5 text-red-600" />
                </button>
              )}
            </div>
            {uploadPhotoMutation.isPending && (
              <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem icon={CalendarIcon} label="Born"
              value={person.date_of_birth ? `${new Date(person.date_of_birth).toLocaleDateString()}${person.birth_place ? `, ${person.birth_place}` : ''}` : 'Unknown'} />
            {!person.is_living && (
              <InfoItem icon={CalendarIcon} label="Died"
                value={person.date_of_death ? `${new Date(person.date_of_death).toLocaleDateString()}${person.death_place ? `, ${person.death_place}` : ''}` : 'Unknown'} />
            )}
            {person.age !== null && (
              <InfoItem icon={CalendarIcon} label="Age" value={`${person.age} years`} />
            )}
            {person.occupation && <InfoItem icon={BriefcaseIcon} label="Occupation" value={person.occupation} />}
            {person.birth_place && <InfoItem icon={MapPinIcon} label="Birth Place" value={person.birth_place} />}
            {person.religion && <InfoItem icon={HeartIcon} label="Religion" value={person.religion} />}
            {person.maiden_name && <InfoItem label="Maiden Name" value={person.maiden_name} />}
            {(person.province || person.district || person.municipality) && (
              <InfoItem icon={MapPinIcon} label="Address"
                value={[person.address, person.municipality, person.district, person.province].filter(Boolean).join(', ')} />
            )}
          </div>
        </div>
        {person.bio && <p className="mt-4 text-gray-700 text-sm">{person.bio}</p>}
        {person.notes && <p className="mt-2 text-gray-500 text-sm italic">{person.notes}</p>}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailSection title="Personal Details" items={[
            { label: 'Full Name', value: person.full_name },
            { label: 'Gender', value: person.gender },
            { label: 'Nationality', value: person.nationality },
            { label: 'Email', value: person.email },
            { label: 'Phone', value: person.phone },
            { label: 'Address', value: [person.address, person.municipality, person.district, person.province].filter(Boolean).join(', ') },
          ].filter(i => i.value)} />
        </div>
      )}

      {activeTab === 'timeline' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Life Events</h3>
            <button onClick={() => setShowEventModal(true)} className="btn-primary text-sm flex items-center gap-1">
              <PlusIcon className="w-4 h-4" /> Add Event
            </button>
          </div>
          {person.life_events?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No life events recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {person.life_events?.map((event) => (
                <div key={event.id} className="card flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{event.title}</div>
                      <button onClick={() => deleteEventMutation.mutate(event.id)}
                        className="text-red-400 hover:text-red-600 p-1">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.event_date ? new Date(event.event_date).toLocaleDateString() : ''}
                      {event.event_place ? ` · ${event.event_place}` : ''}
                    </div>
                    {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'relationships' && (
        <div className="space-y-6">
          <RelationshipSection title="Parents" persons={person.parents_list} treeSlug={treeSlug} />
          <RelationshipSection title="Spouses / Partners" persons={person.spouses_list} treeSlug={treeSlug} />
          <RelationshipSection title="Children" persons={person.children_list} treeSlug={treeSlug} />
          <RelationshipSection title="Siblings" persons={person.siblings_list} treeSlug={treeSlug} />
        </div>
      )}

      {activeTab === 'comments' && (
        <div>
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Write a comment..."
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
              />
              <button
                onClick={() => commentBody.trim() && addCommentMutation.mutate({ body: commentBody })}
                className="btn-primary text-sm"
                disabled={addCommentMutation.isPending}
              >
                Post
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {comments?.data?.map((comment) => (
              <div key={comment.id} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{comment.user?.name}</span>
                  <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700">{comment.body}</p>
                {comment.replies?.map((reply) => (
                  <div key={reply.id} className="ml-6 mt-2 pl-3 border-l-2 border-gray-200">
                    <span className="font-medium text-xs">{reply.user?.name}</span>
                    <p className="text-sm text-gray-600">{reply.body}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Person" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(editForm); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'First Name', key: 'first_name', required: true },
              { label: 'Last Name', key: 'last_name', required: true },
              { label: 'Middle Name', key: 'middle_name' },
              { label: 'Maiden Name', key: 'maiden_name' },
              { label: 'Nickname', key: 'nickname' },
              { label: 'Aliases', key: 'aliases' },
              { label: 'Birth Place', key: 'birth_place' },
              { label: 'Death Place', key: 'death_place' },
              { label: 'Occupation', key: 'occupation' },
              { label: 'Religion (धर्म)', key: 'religion' },
              { label: 'Nationality', key: 'nationality' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Phone', key: 'phone' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  className="input-field"
                  value={editForm[field.key] || ''}
                  onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                  required={field.required}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select className="input-field" value={editForm.gender || 'unknown'}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                <option value="male">Male (पुरुष)</option>
                <option value="female">Female (महिला)</option>
                <option value="other">Other (अन्य)</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" className="input-field" value={editForm.date_of_birth?.split('T')[0] || ''}
                onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Death</label>
              <input type="date" className="input-field" value={editForm.date_of_death?.split('T')[0] || ''}
                onChange={(e) => setEditForm({ ...editForm, date_of_death: e.target.value })} />
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t pt-3 mt-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Address (ठेगाना)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province (प्रदेश)</label>
                <select className="input-field" value={editForm.province || ''}
                  onChange={(e) => setEditForm({ ...editForm, province: e.target.value, district: '', municipality: '' })}>
                  <option value="">Select province</option>
                  {NEPAL_PROVINCES.map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District (जिल्ला)</label>
                <select className="input-field" value={editForm.district || ''}
                  onChange={(e) => setEditForm({ ...editForm, district: e.target.value, municipality: '' })}
                  disabled={!editForm.province}>
                  <option value="">Select district</option>
                  {getDistricts(editForm.province).map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipality (नगरपालिका)</label>
                <select className="input-field" value={editForm.municipality || ''}
                  onChange={(e) => setEditForm({ ...editForm, municipality: e.target.value })}
                  disabled={!editForm.district}>
                  <option value="">Select municipality</option>
                  {getMunicipalities(editForm.province, editForm.district).map((m) => (<option key={m} value={m}>{m}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward / Tole (वडा / टोल)</label>
                <input className="input-field" value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="e.g. Ward-5, Lakeside" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea className="input-field" rows={3} value={editForm.bio || ''}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea className="input-field" rows={2} value={editForm.notes || ''}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="edit_is_living" checked={editForm.is_living ?? true}
              onChange={(e) => setEditForm({ ...editForm, is_living: e.target.checked })} />
            <label htmlFor="edit_is_living" className="text-sm text-gray-700">Currently living</label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Life Event Modal */}
      <Modal isOpen={showEventModal} onClose={() => setShowEventModal(false)} title="Add Life Event">
        <form onSubmit={(e) => { e.preventDefault(); addEventMutation.mutate(eventForm); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select className="input-field" value={eventForm.type}
              onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}>
              {['birth','death','marriage','divorce','engagement','graduation','immigration',
                'emigration','military_service','retirement','baptism','other'].map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input className="input-field" value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="input-field" value={eventForm.event_date}
                onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
              <input className="input-field" value={eventForm.event_place}
                onChange={(e) => setEventForm({ ...eventForm, event_place: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input-field" rows={3} value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowEventModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={addEventMutation.isPending}>Add Event</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5" />}
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function DetailSection({ title, items }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelationshipSection({ title, persons, treeSlug }) {
  if (!persons || persons.length === 0) return null;
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {persons.map((p) => (
          <Link key={p.id} to={`/trees/${treeSlug}/persons/${p.id}`}
            className="card hover:shadow-md transition flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
              p.gender === 'male' ? 'bg-blue-500' : p.gender === 'female' ? 'bg-pink-500' : 'bg-gray-400'
            }`}>
              {p.first_name[0]}{p.last_name[0]}
            </div>
            <div>
              <div className="font-medium text-sm">{p.first_name} {p.last_name}</div>
              {p.date_of_birth && <div className="text-xs text-gray-500">{new Date(p.date_of_birth).getFullYear()}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
