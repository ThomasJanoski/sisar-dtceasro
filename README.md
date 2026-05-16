# SISAR - DTCEA-SRO 🚀
### Sistema de Arquivo e Gerenciamento

O **SISAR** é uma plataforma robusta desenvolvida para o **DTCEA-SRO**, focada na organização e gerenciamento de arquivos. O sistema utiliza uma arquitetura moderna separando o Frontend (SPA) do Backend (API Restful), garantindo performance, segurança e escalabilidade.

---

## 🛠 Tecnologias Utilizadas

### **Frontend**
- **Angular 17+**: Framework principal para uma interface reativa e dinâmica.
- **Tailwind CSS / Angular Material**: (Ajuste conforme o que usou) para estilização.
- **RxJS**: Gerenciamento de fluxos de dados assíncronos.

### **Backend**
- **Laravel 11**: Framework PHP para uma API segura e produtiva.
- **MySQL**: Banco de dados relacional para armazenamento de informações.
- **Sanctum**: Autenticação leve e segura.

### **Infraestrutura / Servidor**
- **Nginx**: Servidor web atuando como Proxy Reverso (Porta 443).
- **Laragon**: Ambiente de desenvolvimento/serviço no Windows Server.
- **SSL/HTTPS**: Comunicação criptografada via certificados autoassinados.
- **VPN IPSec**: Acesso remoto seguro à rede DTCEA.

---

## 🏗 Arquitetura do Sistema

O sistema foi configurado para rodar de forma unificada na porta **443 (HTTPS)**:
- **`/`**: Serve o build estático do Angular.
- **`/api`**: Encaminha as requisições para o backend Laravel via Nginx.

Esta abordagem elimina problemas de **CORS** e simplifica o acesso para usuários externos via VPN, exigindo o aceite do certificado SSL apenas uma vez.

---

## 🚀 Como Executar o Projeto

### **Pré-requisitos**
- PHP 8.2+
- Node.js & Angular CLI
- Composer
- Laragon (ou Nginx configurado)

### **Configuração do Backend**
1. Clone o repositório.
2. Na pasta `/backend`, execute `composer install`.
3. Configure o arquivo `.env` com as credenciais do banco de dados.
4. Gere a chave da aplicação: `php artisan key:generate`.
5. Execute as migrations: `php artisan migrate`.

### **Configuração do Frontend**
1. Na pasta `/frontend`, execute `npm install`.
2. Para rodar localmente: `ng serve`. 
   - *O sistema detectará automaticamente o ambiente localhost e apontará para a porta 8000.*