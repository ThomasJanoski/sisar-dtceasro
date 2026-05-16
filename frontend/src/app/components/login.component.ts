import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page login-page">
      <div class="card login-card">
        <div class="header">
          <h1>🔐 SISAR</h1>
          <p>Sistema de Arquivos</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label for="username">Usuário</label>
            <input 
              id="username" 
              formControlName="username" 
              autocomplete="username"
              placeholder="Digite seu usuário"
              [disabled]="isLoading" />
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              autocomplete="current-password"
              placeholder="Digite sua senha"
              [disabled]="isLoading" />
          </div>

          <button 
            type="submit" 
            [disabled]="form.invalid || isLoading"
            class="submit-btn">
            <span *ngIf="!isLoading">Entrar</span>
            <span *ngIf="isLoading" class="btn-loading">
              <span class="spinner"></span>Carregando...
            </span>
          </button>
        </form>

        <div class="error" *ngIf="error" [@fadeIn]>
          <span>⚠️</span> {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page { 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        min-height: 100vh; 
        padding: 1rem;
      }

      .login-card { 
        width: min(420px, 90vw); 
        border-radius: 16px; 
        background: white; 
        padding: 2.5rem; 
        box-shadow: 0 20px 60px rgba(20, 30, 50, 0.15);
        animation: slideUp 0.5s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .header {
        text-align: center;
        margin-bottom: 2rem;
      }

      h1 { 
        margin: 0; 
        font-size: 2rem;
        color: #0066cc;
        font-weight: 700;
      }

      p {
        margin: 0.5rem 0 0;
        color: #6b7280;
        font-size: 0.95rem;
        font-weight: 500;
      }

      .form-group {
        margin-bottom: 1.25rem;
      }

      label { 
        display: block; 
        margin-bottom: 0.5rem; 
        font-weight: 600;
        color: #374151;
        font-size: 0.95rem;
      }

      input { 
        width: 100%; 
        padding: 0.85rem 1rem; 
        border-radius: 10px; 
        border: 2px solid #e5e7eb; 
        font-size: 1rem;
        transition: all 0.2s ease;
        background: #f9fafb;
      }

      input:hover {
        border-color: #d1d5db;
      }

      input:focus {
        outline: none;
        border-color: #0066cc;
        background: white;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      }

      input:disabled {
        background: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
      }

      .submit-btn { 
        margin-top: 1.5rem; 
        width: 100%; 
        padding: 0.95rem; 
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        color: white; 
        border: none; 
        border-radius: 10px; 
        font-weight: 700;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
      }

      .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
      }

      .submit-btn:disabled { 
        opacity: 0.7; 
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

      .error { 
        margin-top: 1rem; 
        padding: 0.85rem 1rem;
        background: #fee2e2;
        color: #991b1b;
        border-radius: 8px;
        border-left: 4px solid #dc2626;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
        animation: slideDown 0.3s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
  ]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    console.log('✅ LoginComponent initialized');
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.error = '';
    
    const username = this.form.value.username ?? '';
    const password = this.form.value.password ?? '';
    
    this.auth.login(username, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.error?.message ?? 'Falha no login. Verifique usuário e senha.';
      },
    });
  }
}
