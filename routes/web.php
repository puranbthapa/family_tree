<?php

use Illuminate\Support\Facades\Route;

// API health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Serve the React SPA for all non-API routes
Route::get('/{any?}', function () {
    $path = public_path('index.html');
    if (file_exists($path)) {
        return response(file_get_contents($path), 200)
            ->header('Content-Type', 'text/html');
    }
    return view('welcome');
})->where('any', '(?!api).*');
