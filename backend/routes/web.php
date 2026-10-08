<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CaixaController;
use App\Http\Controllers\Api\AuthController;

Route::get('/', function () {
    return view('welcome');
});

// API routes are now defined in routes/api.php
