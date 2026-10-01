// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch { return false; }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}