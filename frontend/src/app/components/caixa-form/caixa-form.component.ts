import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './caixa-form.component.html',
})

export class CaixaFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  errors: any = {};
  loading = signal(false);
  isSaving = signal(false);
  loadError = signal('');

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
  ) {
    this.form = this.fb.group({
      SETOR: ['', Validators.required],
      ANO: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]], // Apenas um ano
      CORRENTE: ['', [Validators.required, this.anoPeriodoValidator()]],
      INTERMEDIARIO: ['', [Validators.required, this.anoPeriodoValidator()]],
      ASSUNTO: [''],
      CODIGO: ['', Validators.required],
      NCAIXA: [null, [Validators.required]],
      ESTANTE: [null, [Validators.required]],
      TIPO: ['CORRENTE'],
      DESTFINAL: ['ELIMINAÇÃO'],
    });
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.errors = {};
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadRecord(+id);
    }
  }

  fieldError(field: string): string {
    const control = this.form.get(field);
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) return 'Campo obrigatório.';
      if (control.errors?.['invalidFormat']) return 'Use o formato AAAA ou AAAA-AAAA.';
      if (control.errors?.['pattern']) return 'Ano inválido (ex: 2026).';
    }
    return this.errors[field]?.[0] || '';
  }

  loadRecord(id: number) {
    this.loading.set(true);
    this.loadError.set('');
    this.api.getCaixa(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set('Não foi possível carregar esta caixa. Tente novamente.');
        this.toast.error('Falha ao carregar a caixa para edição.');
      },
    });
  }

  retryLoad() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadRecord(+id);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const action = this.isEdit
      ? this.api.updateCaixa(this.route.snapshot.params['id'], this.form.value)
      : this.api.createCaixa(this.form.value);

    this.isSaving.set(true);
    this.errors = {};
    action.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Caixa atualizada com sucesso.' : 'Caixa cadastrada com sucesso.');
        this.router.navigate(['/dashboard/caixas']);
      },
      error: (err) => {
        this.isSaving.set(false);
        if (err.status === 422) {
          this.errors = err.error.errors ?? {};
          this.toast.error('Revise os campos destacados antes de salvar.');
        } else {
          this.toast.error('Não foi possível salvar a caixa. Tente novamente.');
        }
      },
    });
  }

  anoPeriodoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Regex: 4 dígitos, opcionalmente seguidos por hífen e mais 4 dígitos
      const regex = /^\d{4}(-\d{4})?$/;
      return regex.test(value) ? null : { invalidFormat: true };
    };
  }
}
