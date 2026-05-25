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
        <a routerLink="/dashboard/caixas/new" class="btn-add-quick">➕ Adicionar Nova</a>
      </div>

      <!-- Estado de Carregamento -->
      <div *ngIf="loading()" class="loader">
        <div class="loading-spinner"></div>
        <span>Buscando registros...</span>
      </div>

      <!-- Lista Vazia -->
      <div *ngIf="!loading() && caixas().length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>Nenhuma caixa encontrada para este filtro.</p>
      </div>

      <!-- Grid de Cards -->
      <div class="cards-grid" *ngIf="!loading()">
        <article 
          *ngFor="let caixa of caixas()" 
          class="card" 
          [ngClass]="getCardClass(caixa)">
          
          <header>
            <span class="setor">{{ caixa.SETOR }}</span>
            <strong class="ncaixa">Caixa #{{ caixa.NCAIXA }}</strong>
            <div class="badge-container">
              <span class="type-badge">
                {{ caixa.TIPO }}
              </span>
              <span *ngIf="estaVencida(caixa)" class="alert-icon" title="Atenção: Esta caixa já deveria ter mudado de fase!">⚠️</span>
            </div>
          </header>

          <div class="card-body">
            <div class="info-row">
              <span class="label">Ano</span>
              <span class="value">{{ caixa.ANO }}</span>
            </div>
            <div class="info-row">
              <span class="label">Assunto</span>
              <span class="value">{{ caixa.ASSUNTO }}</span>
            </div>
            <div class="info-row">
              <span class="label">Código</span>
              <span class="value">{{ caixa.CODIGO }}</span>
            </div>
            <div class="info-row">
              <span class="label">Estante</span>
              <span class="value">{{ caixa.ESTANTE }}</span>
            </div>
            <div class="info-row">
              <span class="label">Data - Corrente</span>
              <span class="value">{{ caixa.CORRENTE }}</span>
            </div>
            <div class="info-row">
              <span class="label">Data - Intermediário</span>
              <span class="value">{{ caixa.INTERMEDIARIO }}</span>
            </div>
            <div class="info-row">
              <span class="label">Destinação Final</span>
              <span class="value">{{ caixa.DESTFINAL }}</span>
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
              <span *ngIf="isDeleting" class="spinner-small"></span>
            </button>
          </footer>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; background: #f8fafc; min-height: 100vh; }

      .page-content { padding: 2rem; }

      .page-header { 
        display: flex; justify-content: space-between; align-items: center; 
        margin-bottom: 2rem; 
      }

      h2 { margin: 0; color: #1e293b; font-size: 1.75rem; font-weight: 800; }
      
      .btn-add-quick {
        padding: 0.8rem 1.5rem;
        background: #0066cc;
        color: white;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
      }

      .btn-add-quick:hover { transform: translateY(-2px); background: #0052a3; }

      /* Grid Setup */
      .cards-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
        gap: 1.5rem; 
      }

      /* Card Styling */
      .card { 
        background: #ffffff;
        border-radius: 20px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        position: relative;
        border: 1px solid #e2e8f0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        overflow: hidden;
      }

      .card:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      }

      /* Linha Lateral de Cor */
      .card::before {
        content: '';
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 8px;
        background: #cbd5e0;
      }

      /* Cores por Tipo */
      .card.card-success::before { background: #10b981; }
      .card.card-warning::before { background: #f59e0b; }
      .card.card-danger::before { background: #ef4444; }
      .card.card-primary::before { background: #3b82f6; }

      /* Estilos de Alerta (Vencidos) */
      .card.card-alert-to-intermediate { 
        border: 2px dashed #f59e0b; 
        background: #fffbeb;
      }
      .card.card-alert-to-elimination { 
        border: 2px dashed #ef4444; 
        background: #fef2f2;
        animation: pulse-border 2s infinite;
      }

      @keyframes pulse-border {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2); }
        70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }

      /* Header do Card */
      header { 
        display: flex; flex-direction: column; 
        margin-bottom: 1.25rem; 
      }

      .setor { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
      .ncaixa { font-size: 1.25rem; color: #1e293b; margin: 0.25rem 0; font-weight: 800; }
      
      .badge-container { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
      .type-badge { 
        padding: 4px 12px; background: #f1f5f9; color: #475569; 
        border-radius: 8px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      }
      .alert-icon { font-size: 1.1rem; }

      /* Body do Card */
      .card-body { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
      .info-row { display: flex; align-items: baseline; gap: 0.75rem; }
      .label { min-width: 70px; font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
      .value { font-size: 0.9rem; color: #334155; font-weight: 500; line-height: 1.4; }

      /* Footer */
      footer { 
        margin-top: 1.5rem; padding-top: 1.25rem; 
        border-top: 1px solid #f1f5f9; display: flex; gap: 0.75rem; 
      }

      .btn-edit, .btn-delete {
        flex: 1; padding: 0.6rem; border-radius: 10px; font-weight: 600; font-size: 0.85rem;
        display: flex; align-items: center; justify-content: center; gap: 0.4rem;
        transition: all 0.2s; text-decoration: none; border: none; cursor: pointer;
      }

      .btn-edit { background: #eff6ff; color: #2563eb; }
      .btn-edit:hover { background: #dbeafe; }

      .btn-delete { background: #fef2f2; color: #dc2626; }
      .btn-delete:hover:not(:disabled) { background: #fee2e2; }

      /* Feedback Visuals */
      .loader { padding: 5rem; text-align: center; color: #64748b; }
      .loading-spinner { 
        width: 40px; height: 40px; border: 4px solid #f1f5f9; 
        border-top-color: #0066cc; border-radius: 50%; animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
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

  // Extrai o ano final (ex: "2018-2022" -> 2022)
  private extrairAnoFinal(valor: any): number {
    if (!valor) return 0;
    const stringValor = String(valor);
    const anos = stringValor.match(/\d{4}/g); 
    return (anos && anos.length > 0) ? parseInt(anos[anos.length - 1], 10) : 0;
  }

  // Remove acentos e padroniza para comparação
  private normalizar(texto: string): string {
    return texto ? texto.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
  }

  getCardClass(caixa: any): string {
    const anoAtual = new Date().getFullYear();
    const tipo = this.normalizar(caixa.TIPO);
    
    // Verificamos os campos de validade vindos do banco
    const fimCorrente = this.extrairAnoFinal(caixa.CORRENTE);
    const fimIntermediario = this.extrairAnoFinal(caixa.INTERMEDIARIO);

    // 1. Lógica de Alerta (Vencimento de fase)
    if (tipo === 'CORRENTE' && fimCorrente > 0 && anoAtual > fimCorrente) {
      return 'card-alert-to-intermediate'; // Precisa ir para Intermediário
    }
    
    if (tipo === 'INTERMEDIARIO' && fimIntermediario > 0 && anoAtual > fimIntermediario) {
      return 'card-alert-to-elimination'; // Precisa ser Eliminado
    }

    // 2. Cores padrão por tipo
    const mapping: Record<string, string> = {
      'CORRENTE': 'card-success',
      'INTERMEDIARIO': 'card-warning',
      'ELIMINACAO': 'card-danger',
      'PERMANENTE': 'card-primary'
    };

    return mapping[tipo] || '';
  }

  estaVencida(caixa: any): boolean {
    const classe = this.getCardClass(caixa);
    return classe.includes('alert');
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
    if (!confirm('Deseja realmente excluir esta caixa?')) return;
    this.isDeleting = true;
    this.api.deleteCaixa(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.loadCaixas(this.tipo());
      },
      error: () => (this.isDeleting = false)
    });
  }
}