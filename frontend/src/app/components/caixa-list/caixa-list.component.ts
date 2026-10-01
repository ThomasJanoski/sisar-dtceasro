import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Caixa {
  ID: number;
  CODIGO?: string | null;
  SETOR?: string | null;
  ANO?: string | null;
  ASSUNTO?: string | null;
  CORRENTE?: string | null;
  INTERMEDIARIO?: string | null;
  DESTFINAL?: string | null;
  TIPO?: string | null;
  NCAIXA?: number | null;
  ESTANTE?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

@Component({
  selector: 'app-caixa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './caixa-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./caixa-list.component.css'],
})
export class CaixaListComponent implements OnInit {
  caixas = signal<Caixa[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  // Filtros
  filtros = {
    tipo: '',
    ano: '',
    page: 1,
  };

  // Metadados da paginação do Laravel
  paginacao = {
    total: 0,
    last_page: 0,
    current_page: 1,
  };

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const requestedType = params.get('tipo')?.toLocaleUpperCase('pt-BR') ?? '';
      const allowedTypes = ['CORRENTE', 'INTERMEDIARIO', 'ELIMINAÇÃO', 'PERMANENTE'];
      this.filtros.tipo = allowedTypes.includes(requestedType) ? requestedType : '';
      this.carregarDados();
    });
  }

  carregarDados(page: number = 1) {
    this.loading.set(true);
    this.errorMessage.set('');
    this.filtros.page = page;

    this.api.getCaixas(this.filtros).subscribe({
      next: (res: any) => {
        this.caixas.set(res.data ?? []);
        this.paginacao = {
          total: res.total ?? 0,
          last_page: res.last_page ?? 0,
          current_page: res.current_page ?? 1,
        };
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Não foi possível carregar as caixas. Verifique a conexão e tente novamente.');
        this.toast.error('Falha ao carregar as caixas.');
      },
    });
  }

  typeClass(type: string | null | undefined): string {
    switch (this.normalizeType(type)) {
      case 'CORRENTE': return 'type--current';
      case 'INTERMEDIARIO': return 'type--intermediate';
      case 'ELIMINACAO': return 'type--elimination';
      case 'PERMANENTE': return 'type--permanent';
      default: return 'type--unknown';
    }
  }

  typeLabel(type: string | null | undefined): string {
    switch (this.normalizeType(type)) {
      case 'CORRENTE': return 'Corrente';
      case 'INTERMEDIARIO': return 'Intermediário';
      case 'ELIMINACAO': return 'Eliminação';
      case 'PERMANENTE': return 'Permanente';
      default: return type?.trim() || 'Não informado';
    }
  }

  migrationStatus(caixa: Caixa, currentYear = new Date().getFullYear()) {
    const type = this.normalizeType(caixa.TIPO);
    const isCurrent = type === 'CORRENTE';
    const isIntermediate = type === 'INTERMEDIARIO';
    if (!isCurrent && !isIntermediate) return null;

    const period = this.parsePeriod(isCurrent ? caixa.CORRENTE : caixa.INTERMEDIARIO);
    if (!period || currentYear < period.end) return null;

    const stage = isCurrent ? 'corrente' : 'intermediário';
    const phaseMessage = currentYear === period.end
      ? `O prazo no arquivo ${stage} termina neste ano.`
      : `O prazo no arquivo ${stage} terminou em ${period.end}.`;

    return {
      severity: currentYear === period.end ? 'due' : 'overdue',
      label: currentYear === period.end ? 'Prazo no limite' : 'Prazo excedido',
      message: `${phaseMessage} Verifique a situação física da caixa e atualize o registro quando necessário.`,
    };
  }

  private normalizeType(type: string | null | undefined): string {
    return (type ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleUpperCase('pt-BR');
  }

  private parsePeriod(value: string | null | undefined): { start: number; end: number } | null {
    const match = value?.trim().match(/^(\d{4})(?:\s*-\s*(\d{4}))?$/);
    if (!match) return null;

    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    return end >= start ? { start, end } : null;
  }
}
