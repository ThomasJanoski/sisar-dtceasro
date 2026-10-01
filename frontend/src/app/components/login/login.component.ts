import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.form.disable({ emitEvent: false });

    this.api.login(this.form.value.usuario, this.form.value.senha).subscribe({
      next: (res) => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('auth_user', res.user.usuario);
        this.toast.success('Acesso autorizado.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.form.enable({ emitEvent: false });
        this.isLoading.set(false);
        const message = err.status === 401
          ? 'Usuário ou senha incorretos.'
          : 'Erro de conexão. Tente novamente.';
        this.errorMessage.set(message);
        this.toast.error(message);
      },
    });
  }
}
