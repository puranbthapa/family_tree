<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FamilyTree;
use App\Models\ActivityLog;
use App\Services\GedcomService;
use Illuminate\Http\Request;

class ExportImportController extends Controller
{
    public function exportGedcom(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $service = new GedcomService();
        $content = $service->export($familyTree);

        ActivityLog::log($familyTree->id, $request->user()->id, 'exported', 'FamilyTree', $familyTree->id, null, null, 'Exported to GEDCOM');

        return response($content, 200, [
            'Content-Type' => 'text/plain',
            'Content-Disposition' => 'attachment; filename="' . \Str::slug($familyTree->name) . '.ged"',
        ]);
    }

    public function importGedcom(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'file' => 'required|file|mimes:ged,txt|max:10240',
        ]);

        $content = file_get_contents($request->file('file')->getRealPath());

        $service = new GedcomService();
        $stats = $service->import($familyTree, $content);

        ActivityLog::log($familyTree->id, $request->user()->id, 'imported', 'FamilyTree', $familyTree->id, null, $stats, 'Imported GEDCOM file');

        return response()->json([
            'message' => 'Import completed',
            'stats' => $stats,
        ]);
    }

    public function exportJson(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $tree = $familyTree->load(['persons.lifeEvents', 'persons.media', 'relationships']);

        return response()->json($tree, 200, [
            'Content-Disposition' => 'attachment; filename="' . \Str::slug($familyTree->name) . '.json"',
        ]);
    }

    public function activityLog(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $logs = $familyTree->activityLogs()
            ->with('user:id,name')
            ->latest()
            ->paginate(50);

        return response()->json($logs);
    }
}
