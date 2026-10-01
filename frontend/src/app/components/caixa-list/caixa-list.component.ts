import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-caixa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './caixa-list.component.html',
  styleUrls: ['./caixa-list.component.css']
})
export class CaixaListComponent implements OnInit {
  caixas = signal<any[]>([]);
  loading = signal(false);

  // Filtros
  filtros = {
    tipo: '',
    ano: '',
    page: 1
  };

  // Metadados da paginação do Laravel
  paginacao = {
    total: 0,
    last_page: 0,
    current_page: 1
  };

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.carregarDados();
  }

  // No arquivo caixa-list.component.ts
  carregarDados(page: number = 1) {
    this.loading.set(true);
    this.filtros.page = page;

    this.api.getCaixas(this.filtros).subscribe({
      next: (res: any) => {
        // O paginate do Laravel coloca os resultados em 'data'
        this.caixas.set(res.data);

        // Armazena a info de paginação para o botão
        this.paginacao = {
          total: res.total,
          last_page: res.last_page,
          current_page: res.current_page
        };
        this.loading.set(false);
      }
    });
  }
}