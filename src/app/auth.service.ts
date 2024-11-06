import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';
  private userIdSubject = new BehaviorSubject<number | null>(null);

  userId$ = this.userIdSubject.asObservable();

  constructor() {
    this.initConfiguration();
    this.loadUserId();
  }

  initConfiguration() {
    if (isPlatformBrowser(this.platformId)) {
      const authConfig: AuthConfig = {
        issuer: 'https://accounts.google.com',
        strictDiscoveryDocumentValidation: false,
        clientId: '285850208426-9kqtoe1o7a70fos58i76dajji38hf1kv.apps.googleusercontent.com',
        redirectUri: window.location.origin + '/dashboard',
        scope: 'openid profile email',
      };

      this.oAuthService.configure(authConfig);
      this.oAuthService.setupAutomaticSilentRefresh();
      this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    }
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.userIdSubject.next(null);
  }

  getProfile() {
    const profile = this.oAuthService.getIdentityClaims();
    return profile;
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }

  loadUserId() {
    const profile = this.oAuthService.getIdentityClaims();
    const email = profile ? profile['email'] : null;

    if (email) {
      this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`).pipe(
        map(users => {
          if (users.length > 0) {
            const userId = users[0].id;
            this.userIdSubject.next(userId);
          } else {
            this.createUser(profile);
          }
        }),
        catchError(err => {
          console.error('Erro ao buscar usuário:', err);
          this.userIdSubject.next(null);
          return new Observable();
        })
      ).subscribe();
    }
  }

  createUser(profile: any): void {
    const newUser = {
      name: profile['name'],
      email: profile['email'],
      password: '',
    };

    this.http.post(`${this.apiUrl}/users`, newUser).subscribe(
      (response) => {
        console.log('Usuário criado com sucesso:', response);
        this.loadUserId(); 
      },
      (error) => {
        console.error('Erro ao criar o usuário:', error);
      }
    );
  }

  getUserShoppingList(): Observable<any[]> {
    return this.userId$.pipe(
      switchMap(userId => {
        if (userId) {
          return this.http.get<any[]>(`${this.apiUrl}/lista-compras?userId=${userId}`);
        } else {
          return new Observable<any[]>(observer => {
            observer.next([]);
            observer.complete();
          });
        }
      })
    );
  }
}
