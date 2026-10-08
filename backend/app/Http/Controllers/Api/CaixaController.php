<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Caixa;

class CaixaController extends Controller
{
    public function index(Request $request)
    {
        $query = Caixa::query()->orderBy('id', 'desc');

        if ($request->filled('tipo')) {
            $query->where('TIPO', $request->input('tipo')); // Ajuste para o nome real da coluna no seu DB
        }

        if ($request->filled('ano')) {
            $query->where('ANO', $request->input('ano'));
        }

        // Paginação com 20 registros por página
        return $query->paginate(20);
    }

    public function show(int $id)
    {
        $c = Caixa::findOrFail($id);
        return response()->json($c)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    public function store(Request $request)
    {
        // Converte tudo para minúsculo primeiro
        $data = array_change_key_case($request->all(), CASE_LOWER);
        $request->merge($data);

        // Se falhar, retorna 422 automaticamente com as mensagens de erro
        $validated = $request->validate([
            'SETOR' => ['nullable', 'string', 'max:50'],
            'ANO' => ['nullable', 'string', 'max:10'],
            'ASSUNTO' => ['nullable', 'string', 'max:100'],
            'CODIGO' => ['nullable', 'string', 'max:30'],
            'CORRENTE' => ['nullable', 'string', 'max:10'],
            'INTERMEDIARIO' => ['nullable', 'string', 'max:10'],
            'DESTFINAL' => ['nullable', 'string', 'max:20'],
            'TIPO' => ['nullable', 'string', 'max:20'],
            'NCAIXA' => ['nullable', 'integer'],
            'ESTANTE' => ['nullable', 'integer'],
        ]);

        $caixa = Caixa::create($validated);

        return response()->json($caixa, 201);
    }

    public function update(Request $request, int $id)
    {
        $caixa = Caixa::findOrFail($id);
        $caixa->update($request->all());

        return response()->json($caixa);
    }
    public function destroy(int $id)
    {
        $caixa = Caixa::findOrFail($id);
        $caixa->delete();

        return response()->json([], 204)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
}
