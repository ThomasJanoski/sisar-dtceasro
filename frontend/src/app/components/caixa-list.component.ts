import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'caixa-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-content">
      <div class="page-header">
        <div>
          <h2>📦 Caixas de Arquivo</h2>
          <p *ngIf="tipo()">Filtrando por: <strong>{{ tipo() }}</strong></p>
        </div>
        <a routerLink="/dashboard/caixas/new" class="btn-add-quick">➕ Adicionar</a>
      </div>

      <div *ngIf="loading()" class="loader">
        <div class="loading-spinner"></div>
        <span>Carregando caixas...</span>
      </div>

      <div *ngIf="!loading() && caixas().length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>Nenhuma caixa encontrada para o filtro selecionado.</p>
      </div>

      <div class="cards-grid">
        <article 
          *ngFor="let caixa of caixas()" 
          class="card" 
          [class.card-danger]="caixa.TIPO === 'ELIMINAÇÃO'" 
          [class.card-warning]="caixa.TIPO === 'INTERMEDIARIO'" 
          [class.card-primary]="caixa.TIPO === 'PERMANENTE'" 
          [class.card-success]="caixa.TIPO === 'Corrente'">
          <header>
            <div class="header-info">
              <span class="setor">{{ caixa.SETOR }}</span>
              <strong class="ncaixa">Caixa #{{ caixa.NCAIXA }}</strong>
            </div>
            <span class="type-badge">{{ caixa.TIPO }}</span>
          </header>
          <div class="card-body">
            <div class="info-row">
              <strong>Ano:</strong>
              <span>{{ caixa.ANO }}</span>
            </div>
            <div class="info-row">
              <strong>Assunto:</strong>
              <span>{{ caixa.ASSUNTO }}</span>
            </div>
            <div class="info-row">
              <strong>Código:</strong>
              <span>{{ caixa.CODIGO }}</span>
            </div>
            <div class="info-row">
              <strong>Estante:</strong>
              <span>{{ caixa.ESTANTE }}</span>
            </div>
          </div>
          <footer>
            <a [routerLink]="['/dashboard/caixas', caixa.ID, 'edit']" class="btn-edit">
              ✏️ Editar
            </a>
            <button 
              type="button" 
              class="btn-delete"
              (click)="deleteCaixa(caixa.ID)"
              [disabled]="isDeleting">
              <span *ngIf="!isDeleting">🗑️ Excluir</span>
              <span *ngIf="isDeleting" class="btn-loading">
                <span class="spinner"></span>...
              </span>
            </button>
          </footer>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page-content { 
        padding: 1.5rem; 
        background: white; 
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .page-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start;
        gap: 1rem; 
        margin-bottom: 2rem;
      }

      h2 {
        margin: 0;
        color: #1f2937;
        font-size: 1.5rem;
      }

      p {
        margin: 0.5rem 0 0;
        color: #6b7280;
        font-size: 0.9rem;
      }

      .btn-add-quick {
        padding: 0.75rem 1.2rem;
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        white-space: nowrap;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
      }

      .btn-add-quick:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
      }

      .loader { 
        padding: 3rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e5e7eb;
        border-radius: 50%;
        border-top-color: #0066cc;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .empty-state { 
        padding: 3rem;
        text-align: center;
        color: #6b7280;
        border: 2px dashed #e5e7eb;
        border-radius: 12px;
        background: #f9fafb;
      }

      .empty-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
      }

      .cards-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
        gap: 1.5rem;
      }

      .card { 
        border-radius: 12px; 
        overflow: hidden; 
        background: #ffffff; 
        border: 2px solid #e5e7eb;
        display: flex; 
        flex-direction: column;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        border-color: transparent;
      }

      .card header { 
        padding: 1rem; 
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700; 
        background: rgba(0, 0, 0, 0.02);
        border-bottom: 2px solid #f3f4f6;
      }

      .header-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .setor {
        font-size: 0.95rem;
        color: #6b7280;
      }

      .ncaixa {
        color: #1f2937;
        font-size: 1.1rem;
      }

      .type-badge {
        padding: 0.35rem 0.75rem;
        background: #f3f4f6;
        color: #374151;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .card-body { 
        padding: 1rem; 
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .info-row {
        display: grid;
        grid-template-columns: 100px 1fr;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      .info-row strong {
        color: #6b7280;
      }

      .info-row span {
        color: #1f2937;
        word-break: break-word;
      }

      .card footer { 
        padding: 1rem; 
        display: flex; 
        gap: 0.5rem;
        border-top: 1px solid #f3f4f6;
      }

      .btn-edit, .btn-delete { 
        flex: 1;
        border: none; 
        border-radius: 6px; 
        padding: 0.75rem; 
        background: #f3f4f6; 
        color: #374151;
        cursor: pointer; 
        text-decoration: none;
        font-weight: 600;
        text-align: center;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-edit:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
      }

      .btn-delete {
        background: #fee2e2;
        color: #991b1b;
      }

      .btn-delete:hover:not(:disabled) {
        background: #fecaca;
        transform: translateY(-1px);
      }

      .btn-delete:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
      }

      .spinner {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid rgba(153, 27, 27, 0.3);
        border-radius: 50%;
        border-top-color: #991b1b;
        animation: spin 0.8s linear infinite;
      }

      .card.card-danger {
        border-color: #fca5a5;
        background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
      }

      .card.card-danger:hover {
        border-color: #f87171;
      }

      .card.card-warning {
        border-color: #fcd34d;
        background: linear-gradient(135deg, #fefce8 0%, #ffffff 100%);
      }

      .card.card-warning:hover {
        border-color: #fbbf24;
      }

      .card.card-primary {
        border-color: #93c5fd;
        background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
      }

      .card.card-primary:hover {
        border-color: #60a5fa;
      }

      .card.card-success {
        border-color: #86efac;
        background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
      }

      .card.card-success:hover {
        border-color: #4ade80;
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
        }

        .cards-grid {
          grid-template-columns: 1fr;
        }

        .info-row {
          grid-template-columns: 80px 1fr;
        }
      }
    `
  ]
})
export class CaixaListComponent {
  caixas = signal<any[]>([]);
  loading = signal(true);
  tipo = signal('');
  isDeleting = false;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParamMap.subscribe((params) => {
      const tipo = params.get('tipo') ?? '';
      this.tipo.set(tipo);
      this.loadCaixas(tipo);
    });
  }

  loadCaixas(tipo: string): void {
    this.loading.set(true);
    this.api.getCaixas(tipo).subscribe({
      next: (result) => {
        this.caixas.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.caixas.set([]);
        this.loading.set(false);
      },
    });
  }

  deleteCaixa(id: number): void {
    if (!confirm('Tem certeza que deseja excluir esta caixa? Esta ação não pode ser desfeita.')) {
      return;
    }

    this.isDeleting = true;
    this.api.deleteCaixa(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.loadCaixas(this.tipo());
      },
      error: () => {
        this.isDeleting = false;
      }
    });
  }
}
