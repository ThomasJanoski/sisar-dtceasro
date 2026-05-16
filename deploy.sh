#!/bin/bash

# --- CONFIGURAÇÕES DO SISTEMA ---
SYSTEM_NAME="sisar"
REMOTE_HOST="DC2" 
REMOTE_PATH="C:/laragon/www/$SYSTEM_NAME"
FRONTEND_DIR="./frontend"
BACKEND_DIR="./backend"

echo "----------------------------------------------------"
echo "🚀 INICIANDO DEPLOY PROFISSIONAL: $SYSTEM_NAME"
echo "----------------------------------------------------"

# 1. BUILD DO FRONTEND (ANGULAR)
echo "📦 Passo 1: Gerando build de produção do Angular..."
# Lembre-se: O environment.prod.ts deve usar window.location.hostname para o IP ser dinâmico!
(cd $FRONTEND_DIR && ng build --configuration production)

if [ $? -ne 0 ]; then
    echo "❌ Erro no build do Angular! Deploy interrompido."
    exit 1
fi

# 2. PREPARAÇÃO DO SERVIDOR REMOTO
echo "🧹 Passo 2: Garantindo estrutura de pastas no servidor..."
ssh $REMOTE_HOST "powershell -Command \"New-Item -ItemType Directory -Force -Path '$REMOTE_PATH/public'\""

echo "🧹 Limpando arquivos estáticos antigos..."
ssh $REMOTE_HOST "powershell -Command \"Get-ChildItem -Path '$REMOTE_PATH/public' -Include *.js,*.css,*.html,*.map,*.txt,*.ico -Recurse | Remove-Item -Force\""

# 3. ENVIO DO FRONTEND (ANGULAR)
echo "🚚 Passo 3: Enviando arquivos do Angular para a pasta public..."
scp -r $FRONTEND_DIR/dist/frontend/browser/* $REMOTE_HOST:$REMOTE_PATH/public/

# 4. ENVIO DO BACKEND (LARAVEL)
echo "🚚 Passo 4: Enviando lógica do Backend (Laravel)..."
# Primeiro enviamos as pastas para a raiz
scp -r \
    $BACKEND_DIR/app \
    $BACKEND_DIR/bootstrap \
    $BACKEND_DIR/config \
    $BACKEND_DIR/database \
    $BACKEND_DIR/routes \
    $BACKEND_DIR/resources \
    $BACKEND_DIR/artisan \
    $BACKEND_DIR/composer.json \
    $BACKEND_DIR/composer.lock \
    $REMOTE_HOST:$REMOTE_PATH/

# AGORA O PULO DO GATO: Enviar o index.php para dentro da pasta PUBLIC
echo "🚚 Enviando index.php para a pasta public do servidor..."
scp $BACKEND_DIR/public/index.php $REMOTE_HOST:$REMOTE_PATH/public/

echo "----------------------------------------------------"
echo "✅ TRANSFERÊNCIA CONCLUÍDA!"
echo "----------------------------------------------------"

# 5. COMANDOS PÓS-DEPLOY (REGRAS DE OURO)
echo "⚙️ Passo 5: Atualizando dependências, banco e caches..."

# Entramos no diretório e executamos a sequência de limpeza e atualização
# Adicionei: migrate (banco), view:clear (front), e mudei config:cache para garantir leitura do .env
ssh $REMOTE_HOST "powershell -Command \"
    cd $REMOTE_PATH;
    php C:/Composer/composer.phar install --no-dev --optimize-autoloader;
    
    echo '--- Limpando caches antigos ---';
    php artisan config:clear;
    php artisan route:clear;
    php artisan view:clear;
    php artisan cache:clear;
    
    echo '--- Rodando Migrations ---';
    php artisan migrate --force;
    
    echo '--- Otimizando novamente ---';
    php artisan config:cache;
    php artisan route:cache;
\""

echo "----------------------------------------------------"
echo "🎉 DEPLOY DO $SYSTEM_NAME FINALIZADO COM SUCESSO!"
# Sugestão: Use o IP da VPN aqui se o DNS .intraer ainda estiver falhando
echo "🌐 Acesse: http://10.230.48.125 (VPN) ou http://sisar.dtceasro.intraer"
echo "----------------------------------------------------"