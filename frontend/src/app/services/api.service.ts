// src/app/services/api.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // A URL é montada dinamicamente para facilitar o deploy entre dev e produção
  private baseUrl: string;

  constructor(private http: HttpClient) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      this.baseUrl = `http://${host}:8000/api`;
    } else {
      this.baseUrl = `${window.location.origin}/api`;
    }
  }

  /**
   * Busca lista de caixas com paginação e filtros.
   * O interceptor injeta o token automaticamente.
   */
  getCaixas(filtros: { tipo?: string, ano?: string, page?: number }): Observable<any> {
    let params = new HttpParams();

    // Adiciona os filtros na query string apenas se existirem
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });

    return this.http.get(`${this.baseUrl}/caixas`, { params });
  }

  /**
   * Busca uma caixa específica para edição
   */
  getCaixa(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/caixas/${id}`);
  }

  /**
   * Cria uma nova caixa
   */
  createCaixa(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/caixas`, payload);
  }

  /**
   * Atualiza uma caixa existente
   */
  updateCaixa(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/caixas/${id}`, payload);
  }

  /**
   * Exclui uma caixa
   */
  deleteCaixa(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/caixas/${id}`);
  }

  /**
   * Método de Login
   * Nota: Este método é público e não passa pelo Interceptor de Auth (ou é ignorado por ele)
   */
  login(usuario: string, senha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { usuario, senha });
  }
}