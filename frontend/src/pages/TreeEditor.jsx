import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { treesApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import FamilyTreeChart from '../components/FamilyTreeChart';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TreeEditor() {
  const { treeId } = useParams();

  const { data: tree, isLoading } = useQuery({
    queryKey: ['tree', treeId],
    queryFn: () => treesApi.get(treeId).then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner className="mt-20" />;

  const persons = tree?.persons || [];
  const relationships = tree?.relationships || [];

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to={`/trees/${treeId}`} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{tree?.name}</h1>
          <span className="text-sm text-gray-400">{persons.length} members</span>
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#d1e3f0', border: '1px solid #5b8fb9' }} /> Male
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#fceef0', border: '1px solid #d4878f' }} /> Female
          </span>
        </div>
      </div>

      {/* Tree Chart */}
      <div className="flex-1 rounded-xl border border-gray-200 overflow-hidden bg-white">
        <FamilyTreeChart
          persons={persons}
          relationships={relationships}
          treeId={treeId}
        />
      </div>
    </div>
  );
}
