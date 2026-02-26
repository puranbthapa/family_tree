import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { treesApi, relationshipsApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

export default function RelationshipCalculator() {
  const { treeSlug } = useParams();
  const [person1Id, setPerson1Id] = useState('');
  const [person2Id, setPerson2Id] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: tree, isLoading } = useQuery({
    queryKey: ['tree', treeSlug],
    queryFn: () => treesApi.get(treeSlug).then((r) => r.data),
  });

  const { data: relData } = useQuery({
    queryKey: ['relationships', treeSlug],
    queryFn: () => relationshipsApi.list(treeSlug).then((r) => r.data),
  });

  const handleCalculate = async () => {
    if (!person1Id || !person2Id) {
      toast.error('Select both persons');
      return;
    }
    if (person1Id === person2Id) {
      toast.error('Select two different persons');
      return;
    }
    setLoading(true);
    try {
      const { data } = await relationshipsApi.calculate(treeSlug, person1Id, person2Id);
      setResult(data);
    } catch {
      toast.error('Failed to calculate');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner className="mt-20" />;

  const persons = tree?.persons || [];
  const relationships = relData || [];

  const relTypeLabels = {
    parent_child: 'Parent → Child',
    spouse: 'Spouse',
    ex_spouse: 'Ex-Spouse',
    partner: 'Partner',
    sibling: 'Sibling',
    half_sibling: 'Half-Sibling',
    step_parent_child: 'Step-Parent → Child',
    adoptive_parent_child: 'Adoptive Parent → Child',
    guardian: 'Guardian',
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/trees/${treeSlug}`} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Relationships & Calculator</h1>
      </div>

      {/* Relationship Calculator */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold mb-4">Relationship Calculator</h3>
        <p className="text-sm text-gray-600 mb-4">Find out how two people are related in your family tree.</p>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Person A</label>
            <select className="input-field" value={person1Id} onChange={(e) => setPerson1Id(e.target.value)}>
              <option value="">Select person...</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
              ))}
            </select>
          </div>
          <ArrowsRightLeftIcon className="w-6 h-6 text-gray-400 hidden sm:block mb-2" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Person B</label>
            <select className="input-field" value={person2Id} onChange={(e) => setPerson2Id(e.target.value)}>
              <option value="">Select person...</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
              ))}
            </select>
          </div>
          <button onClick={handleCalculate} className="btn-primary" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl text-center">
            <div className="text-sm text-gray-600 mb-1">
              {result.person1?.first_name} {result.person1?.last_name} is the
            </div>
            <div className="text-2xl font-bold text-indigo-700">{result.relationship}</div>
            <div className="text-sm text-gray-600 mt-1">
              of {result.person2?.first_name} {result.person2?.last_name}
            </div>
          </div>
        )}
      </div>

      {/* All Relationships */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">All Relationships ({relationships.length})</h3>
        {relationships.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No relationships defined yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-2 font-medium text-gray-500">Person 1</th>
                  <th className="pb-2 font-medium text-gray-500">Relationship</th>
                  <th className="pb-2 font-medium text-gray-500">Person 2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {relationships.map((rel) => (
                  <tr key={rel.id} className="hover:bg-gray-50">
                    <td className="py-2">
                      <Link to={`/trees/${treeSlug}/persons/${rel.person1?.id}`} className="text-indigo-600 hover:underline">
                        {rel.person1?.first_name} {rel.person1?.last_name}
                      </Link>
                    </td>
                    <td className="py-2">
                      <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {relTypeLabels[rel.type] || rel.type}
                      </span>
                    </td>
                    <td className="py-2">
                      <Link to={`/trees/${treeSlug}/persons/${rel.person2?.id}`} className="text-indigo-600 hover:underline">
                        {rel.person2?.first_name} {rel.person2?.last_name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
