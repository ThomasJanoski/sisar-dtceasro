import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'dashboard-page',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="page dashboard-page">
      <header class="topbar">
        <div class="brand-section">
          <span class="brand">🏛️ SISAR</span>
          <span class="subtitle">Bem-vindo, <strong>{{ auth.userName }}</strong></span>
        </div>
        <button type="button" class="logout-btn" (click)="auth.logout()">
          ↪️ Sair
        </button>
      </header>

      <section class="actions">
        <a routerLink="caixas" [queryParams]="{ tipo: 'Corrente' }" class="action-btn action-corrente">
          <span class="icon">📋</span>
          <span class="text">
            <strong>Arquivo Corrente</strong>
            <small>Documentos ativos</small>
          </span>
        </a>
        <a routerLink="caixas" [queryParams]="{ tipo: 'INTERMEDIARIO' }" class="action-btn action-intermediario">
          <span class="icon">📂</span>
          <span class="text">
            <strong>Intermediário</strong>
            <small>Transição</small>
          </span>
        </a>
        <a routerLink="caixas" [queryParams]="{ tipo: 'ELIMINAÇÃO' }" class="action-btn action-eliminacao">
          <span class="icon">🗑️</span>
          <span class="text">
            <strong>Eliminação</strong>
            <small>Para destruir</small>
          </span>
        </a>
        <a routerLink="caixas" [queryParams]="{ tipo: 'PERMANENTE' }" class="action-btn action-permanente">
          <span class="icon">🔒</span>
          <span class="text">
            <strong>Permanente</strong>
            <small>Arquivo histórico</small>
          </span>
        </a>
        <a routerLink="caixas/new" class="action-btn action-add">
          <span class="icon">➕</span>
          <span class="text">
            <strong>Adicionar Caixa</strong>
            <small>Nova entrada</small>
          </span>
        </a>
      </section>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .page { 
        min-height: 100vh; 
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 1.5rem; 
      }

      .topbar { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        gap: 1rem; 
        padding: 1.25rem 1.5rem; 
        background: white; 
        border-radius: 12px; 
        box-shadow: 0 10px 30px rgba(34, 60, 80, 0.1);
        margin-bottom: 1.5rem;
      }

      .brand-section {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .brand { 
        display: block; 
        font-weight: 800; 
        font-size: 1.3rem;
        color: #0066cc;
      }

      .subtitle { 
        color: #6b7280;
        font-size: 0.9rem;
      }

      .logout-btn {
        padding: 0.75rem 1.2rem;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .logout-btn:hover {
        background: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      .actions { 
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem; 
        margin: 1.5rem 0;
      }

      .action-btn { 
        display: flex;
        align-items: center;
        gap: 1rem;
        text-decoration: none; 
        padding: 1.25rem;
        border-radius: 12px; 
        background: white;
        color: #1f2937;
        border: 2px solid #e5e7eb;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }

      .action-btn:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        border-color: transparent;
      }

      .action-btn .icon {
        font-size: 2rem;
      }

      .action-btn .text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .action-btn strong {
        color: #1f2937;
        font-size: 0.95rem;
      }

      .action-btn small {
        color: #9ca3af;
        font-size: 0.85rem;
      }

      .action-corrente {
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        border-color: #6ee7b7;
      }

      .action-corrente:hover {
        border-color: #34d399;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
      }

      .action-intermediario {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-color: #fcd34d;
      }

      .action-intermediario:hover {
        border-color: #fbbf24;
        box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
      }

      .action-eliminacao {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        border-color: #fca5a5;
      }

      .action-eliminacao:hover {
        border-color: #f87171;
        box-shadow: 0 8px 24px rgba(239, 68, 68, 0.2);
      }

      .action-permanente {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        border-color: #93c5fd;
      }

      .action-permanente:hover {
        border-color: #60a5fa;
        box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
      }

      .action-add {
        background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
        border-color: #a5b4fc;
        font-weight: 700;
      }

      .action-add:hover {
        border-color: #818cf8;
        box-shadow: 0 8px 24px rgba(79, 70, 229, 0.2);
      }

      main { 
        margin-top: 1rem; 
      }

      @media (max-width: 768px) {
        .topbar {
          flex-direction: column;
          text-align: center;
        }

        .actions {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DashboardComponent {
  constructor(public auth: AuthService) {}
}
