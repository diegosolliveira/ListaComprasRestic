import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: number | null = null;

  constructor() {
    const savedUserId = localStorage.getItem('userId');
    this.userId = savedUserId ? +savedUserId : null;
  }

  login(userId: number) {
    if (userId > 0) {
      this.userId = userId;
      localStorage.setItem('userId', userId.toString());
      console.log(`Usuário logado: ${userId}`);
    } else {
      console.error('ID de usuário inválido para login');
    }
  }

  getUserId(): number | null {
    return this.userId;
  }

  isAuthenticated(): boolean {
    return this.userId !== null;
  }

  logout() {
    console.log(`Usuário ${this.userId} está fazendo logout`);
    this.userId = null;
    localStorage.removeItem('userId');
  }
}