import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'caixa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="form-page">
      <div class="form-header">
        <h2>{{ isEdit ? '✏️ Editar Caixa' : '➕ Nova Caixa' }}</h2>
        <p>{{ isEdit ? 'Modifique os dados da caixa' : 'Preencha os dados da nova caixa' }}</p>
      </div>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="grid"> 
            <div class="form-group">
              <label for="SETOR">Setor</label>
              <input id="SETOR" formControlName="SETOR" placeholder="Ex: RH" [disabled]="isLoading" />
              <small *ngIf="form.get('SETOR')?.invalid && form.get('SETOR')?.touched" class="error-msg">
                Campo obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="ANO">Ano</label>
              <input id="ANO" formControlName="ANO" placeholder="Ex: 2024" [disabled]="isLoading" />
              <small *ngIf="form.get('ANO')?.invalid && form.get('ANO')?.touched" class="error-msg">
                Campo obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="ASSUNTO">Assunto</label>
              <input id="ASSUNTO" formControlName="ASSUNTO" placeholder="Descrição" [disabled]="isLoading" />
              <small *ngIf="form.get('ASSUNTO')?.invalid && form.get('ASSUNTO')?.touched" class="error-msg">
                Campo obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="CODIGO">Código</label>
              <input id="CODIGO" formControlName="CODIGO" placeholder="Código único" [disabled]="isLoading" />
              <small *ngIf="form.get('CODIGO')?.invalid && form.get('CODIGO')?.touched" class="error-msg">
                Campo obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="CORRENTE">Corrente</label>
              <input id="CORRENTE" formControlName="CORRENTE" placeholder="Informação" [disabled]="isLoading" />
              <small *ngIf="form.get('CORRENTE')?.invalid && form.get('CORRENTE')?.touched" class="error-msg">
                Campo obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="INTERMEDIARIO">Intermediário</label>
              <input id="INTERMEDIARIO" formControlName="INTERMEDIARIO" placeholder="Informação" [disabled]="isLoading" />
              <small *ngIf="form.get('INTERMEDIARIO')?.invalid && form.get('INTERMEDIARIO')?.touched" class="error-msg">
                Campo obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="DESTFINAL">Dest. Final</label>
              <input id="DESTFINAL" formControlName="DESTFINAL" placeholder="Destino final" [disabled]="isLoading" />
              <small *ngIf="form.get('DESTFINAL')?.invalid && form.get('DESTFINAL')?.touched" class="error-msg">
                Campo obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="TIPO">Tipo</label>
              <select id="TIPO" formControlName="TIPO" [disabled]="isLoading">
                <option value="Corrente">Corrente</option>
                <option value="INTERMEDIARIO">Intermediário</option>
                <option value="ELIMINAÇÃO">Eliminação</option>
                <option value="PERMANENTE">Permanente</option>
              </select>
            </div>

            <div class="form-group">
              <label for="NCAIXA">Nº Caixa</label>
              <input id="NCAIXA" type="number" formControlName="NCAIXA" placeholder="1" [disabled]="isLoading" />
              <small *ngIf="form.get('NCAIXA')?.invalid && form.get('NCAIXA')?.touched" class="error-msg">
                Deve ser maior que 0
              </small>
            </div>

            <div class="form-group">
              <label for="ESTANTE">Estante</label>
              <input id="ESTANTE" type="number" formControlName="ESTANTE" placeholder="1" [disabled]="isLoading" />
              <small *ngIf="form.get('ESTANTE')?.invalid && form.get('ESTANTE')?.touched" class="error-msg">
                Deve ser maior que 0
              </small>
            </div>
          </div>

          <div class="actions">
            <button type="submit" [disabled]="form.invalid || isLoading" class="btn-primary">
              <span *ngIf="!isLoading">💾 Salvar</span>
              <span *ngIf="isLoading" class="btn-loading">
                <span class="spinner"></span>Salvando...
              </span>
            </button>
            <button 
              type="button" 
              class="btn-secondary" 
              (click)="router.navigate(['/dashboard/caixas'])"
              [disabled]="isLoading">
              ✕ Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [
    `
      .form-page { 
        padding: 1.5rem; 
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
      }

      .form-header {
        margin-bottom: 1.5rem;
      }

      h2 { 
        margin: 0; 
        color: #1f2937;
        font-size: 1.75rem;
      }

      p {
        margin: 0.5rem 0 0;
        color: #6b7280;
        font-size: 0.95rem;
      }

      .form-card { 
        background: white; 
        border-radius: 12px; 
        box-shadow: 0 10px 30px rgba(30, 50, 80, 0.1); 
        padding: 2rem;
      }

      .grid { 
        display: grid; 
        gap: 1.5rem; 
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        margin-bottom: 2rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      label { 
        display: block; 
        margin-bottom: 0.5rem; 
        font-weight: 600; 
        color: #374151;
        font-size: 0.95rem;
      }

      input, select { 
        width: 100%; 
        padding: 0.85rem 1rem; 
        border-radius: 8px; 
        border: 2px solid #e5e7eb;
        font-size: 1rem;
        transition: all 0.2s ease;
        background: #f9fafb;
      }

      input:hover, select:hover {
        border-color: #d1d5db;
      }

      input:focus, select:focus {
        outline: none;
        border-color: #0066cc;
        background: white;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      }

      input:disabled, select:disabled {
        background: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
      }

      .error-msg {
        color: #dc2626;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        display: block;
      }

      .actions { 
        display: flex; 
        gap: 1rem; 
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .btn-primary, .btn-secondary { 
        border: none; 
        border-radius: 8px; 
        padding: 0.95rem 1.5rem; 
        font-weight: 700; 
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1rem;
      }

      .btn-primary { 
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
      }

      .btn-secondary { 
        background: #f3f4f6; 
        color: #374151;
        border: 2px solid #e5e7eb;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #e5e7eb;
        border-color: #d1d5db;
        transform: translateY(-2px);
      }

      .btn-primary:disabled, .btn-secondary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-loading {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
        margin-right: 0.5rem;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @media (max-width: 768px) {
        .form-page {
          padding: 1rem;
        }

        .form-card {
          padding: 1.5rem;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .actions {
          justify-content: stretch;
        }

        .btn-primary, .btn-secondary {
          flex: 1;
        }
      }
    `
  ]
})
export class CaixaFormComponent implements OnInit {
  form!: FormGroup;
  id = 0;
  isEdit = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, public router: Router) {
    this.form = this.fb.group({
      SETOR: ['', Validators.required],
      ANO: ['', Validators.required],
      ASSUNTO: ['', Validators.required],
      CODIGO: ['', Validators.required],
      CORRENTE: ['', Validators.required],
      INTERMEDIARIO: ['', Validators.required],
      DESTFINAL: ['', Validators.required],
      TIPO: ['Corrente', Validators.required],
      NCAIXA: [1, [Validators.required, Validators.min(1)]],
      ESTANTE: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.id = id;
      this.isEdit = true;
      this.isLoading = true;
      this.api.getCaixa(id).subscribe({
        next: (data: any) => {
          if (data) {
            this.form.patchValue(data);
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const payload = this.form.value;
    const action = this.isEdit ? this.api.updateCaixa(this.id, payload!) : this.api.createCaixa(payload!);

    action.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/caixas']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
