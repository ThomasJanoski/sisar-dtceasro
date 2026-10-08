<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caixa extends Model
{
    protected $table = 'caixa';

    // Altere para o nome exato da sua coluna de chave primária
    protected $primaryKey = 'ID';

    // Indica que a chave não é do tipo padrão (id minúsculo)
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'SETOR',
        'ANO',
        'ASSUNTO',
        'CODIGO',
        'CORRENTE',
        'INTERMEDIARIO',
        'DESTFINAL',
        'TIPO',
        'NCAIXA',
        'ESTANTE',
    ];
}
