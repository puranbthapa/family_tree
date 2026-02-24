<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FamilyTreeController;
use App\Http\Controllers\Api\PersonController;
use App\Http\Controllers\Api\RelationshipController;
use App\Http\Controllers\Api\LifeEventController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\CollaboratorController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ExportImportController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/life-event-types', [LifeEventController::class, 'types']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'changePassword']);

    // Pending invites for current user
    Route::get('/invites/pending', [CollaboratorController::class, 'pendingInvites']);
    Route::post('/invites/accept', [CollaboratorController::class, 'acceptInvite']);

    // Family Trees
    Route::apiResource('trees', FamilyTreeController::class)->parameters(['trees' => 'familyTree']);
    Route::get('/trees/{familyTree}/statistics', [FamilyTreeController::class, 'statistics']);

    // Persons within a tree
    Route::get('/trees/{familyTree}/persons/search', [PersonController::class, 'search']);
    Route::get('/trees/{familyTree}/persons/duplicates', [PersonController::class, 'duplicates']);
    Route::post('/trees/{familyTree}/persons/positions', [PersonController::class, 'updatePositions']);
    Route::post('/trees/{familyTree}/persons/{person}/photo', [PersonController::class, 'uploadPhoto']);
    Route::delete('/trees/{familyTree}/persons/{person}/photo', [PersonController::class, 'deletePhoto']);
    Route::apiResource('trees.persons', PersonController::class)->parameters(['trees' => 'familyTree']);

    // Relationships within a tree
    Route::post('/trees/{familyTree}/relationships/calculate', [RelationshipController::class, 'calculate']);
    Route::apiResource('trees.relationships', RelationshipController::class)->parameters(['trees' => 'familyTree']);

    // Life events for a person
    Route::apiResource('trees.persons.life-events', LifeEventController::class)
        ->parameters(['trees' => 'familyTree', 'life-events' => 'lifeEvent']);

    // Media
    Route::get('/trees/{familyTree}/media', [MediaController::class, 'index']);
    Route::post('/trees/{familyTree}/media', [MediaController::class, 'store']);
    Route::delete('/trees/{familyTree}/media/{media}', [MediaController::class, 'destroy']);

    // Collaborators
    Route::get('/trees/{familyTree}/collaborators', [CollaboratorController::class, 'index']);
    Route::post('/trees/{familyTree}/collaborators/invite', [CollaboratorController::class, 'invite']);
    Route::put('/trees/{familyTree}/collaborators/{collaborator}', [CollaboratorController::class, 'updateRole']);
    Route::delete('/trees/{familyTree}/collaborators/{collaborator}', [CollaboratorController::class, 'remove']);

    // Comments on persons
    Route::apiResource('trees.persons.comments', CommentController::class)
        ->parameters(['trees' => 'familyTree']);

    // Export / Import
    Route::get('/trees/{familyTree}/export/gedcom', [ExportImportController::class, 'exportGedcom']);
    Route::post('/trees/{familyTree}/import/gedcom', [ExportImportController::class, 'importGedcom']);
    Route::get('/trees/{familyTree}/export/json', [ExportImportController::class, 'exportJson']);

    // Activity log
    Route::get('/trees/{familyTree}/activity', [ExportImportController::class, 'activityLog']);
});
