<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CaixaController;
use App\Http\Controllers\Api\AuthController;

// Caixas (CRUD)
Route::get('caixas', [CaixaController::class, 'index']);
Route::post('caixas', [CaixaController::class, 'store']);
Route::get('caixas/{id}', [CaixaController::class, 'show']);
Route::put('caixas/{id}', [CaixaController::class, 'update']);
Route::delete('caixas/{id}', [CaixaController::class, 'destroy']);

// Auth
Route::post('login', [AuthController::class, 'login']);
