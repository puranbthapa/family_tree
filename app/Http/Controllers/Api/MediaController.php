<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\FamilyTree;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $familyTree->media()->with(['person:id,first_name,last_name', 'uploadedBy:id,name']);

        if ($personId = $request->input('person_id')) {
            $query->where('person_id', $personId);
        }
        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function store(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'file' => 'required|file|max:20480', // 20MB
            'person_id' => 'nullable|exists:persons,id',
            'type' => 'required|in:photo,document,video,audio',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'media_date' => 'nullable|date',
        ]);

        $file = $request->file('file');
        $path = $file->store("trees/{$familyTree->id}/media", 'public');

        $media = Media::create([
            'family_tree_id' => $familyTree->id,
            'person_id' => $validated['person_id'] ?? null,
            'uploaded_by' => $request->user()->id,
            'type' => $validated['type'],
            'title' => $validated['title'] ?? $file->getClientOriginalName(),
            'description' => $validated['description'] ?? null,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'media_date' => $validated['media_date'] ?? null,
        ]);

        return response()->json($media, 201);
    }

    public function destroy(Request $request, FamilyTree $familyTree, Media $media)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($media->file_path);
        if ($media->thumbnail_path) {
            Storage::disk('public')->delete($media->thumbnail_path);
        }
        $media->delete();

        return response()->json(['message' => 'Media deleted']);
    }
}
