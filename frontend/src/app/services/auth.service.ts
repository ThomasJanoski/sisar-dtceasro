import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    
    // O Sanctum apenas precisa saber se o token existe.
    // A validação se ele expirou ou não acontece na API (401 Unauthorized)
    return !!token; 
  }

  getUsername(): string | null {
    return localStorage.getItem('auth_user');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}