import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      SETOR: ['', Validators.required],
      ANO: ['', Validators.required],
      ASSUNTO: [''],
      CODIGO: ['', Validators.required],
      TIPO: ['Corrente'],
      DESTFINAL: [''],
    });
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.errors = {};
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.api.getCaixa(+id).subscribe((data) => this.form.patchValue(data));
    }
  }

  submit() {
    if (this.form.invalid) return;

    const action = this.isEdit
      ? this.api.updateCaixa(this.route.snapshot.params['id'], this.form.value)
      : this.api.createCaixa(this.form.value);

    action.subscribe({
      next: () => this.router.navigate(['/dashboard/caixas']),
      error: (err) => {
        if (err.status === 422) this.errors = err.error.errors; // Exibe erros do Laravel
      },
    });
  }
}
