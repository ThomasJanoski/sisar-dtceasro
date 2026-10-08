<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable("caixa")) {
            Schema::create('caixa', function (Blueprint $table) {
                $table->id();
                $table->string('setor')->nullable();
                $table->string('ano')->nullable();
                $table->string('assunto')->nullable();
                $table->string('codigo')->nullable();
                $table->string('corrente')->nullable();
                $table->string('intermediario')->nullable();
                $table->string('destfinal')->nullable();
                $table->string('tipo')->nullable();
                $table->integer('ncaixa')->nullable()->index();
                $table->string('estante')->nullable();
                $table->timestamps();
            });
        };
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('caixa');
    }
};
