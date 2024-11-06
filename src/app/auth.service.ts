import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    if (isPlatformBrowser(this.platformId)) {
      const authConfig: AuthConfig = {
        issuer: 'https://accounts.google.com',
        strictDiscoveryDocumentValidation: false,
        clientId: '285850208426-09k4igcna2bvoc69ap2cdlsbahqed2e8.apps.googleusercontent.com',
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
  }

  getProfile() {
    const profile = this.oAuthService.getIdentityClaims();
    return profile;
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }

  getUserId(): Observable<number | null> {
    const profile = this.oAuthService.getIdentityClaims();
    const email = profile ? profile['email'] : null;
  
    console.log('Email do usuário logado:', email);
  
    if (email) {
      return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`).pipe(
        map(users => {
          if (users.length > 0) {
            const userId = users[0].id;
            console.log('ID do usuário encontrado:', userId);
            return userId;
          } else {
            console.log('Nenhum usuário encontrado com esse email');
            return null;
          }
        })
      );
    } else {
      return new Observable<number | null>(observer => {
        observer.next(null);
        observer.complete();
      });
    }
  }

  getUserShoppingList(): Observable<any[]> {
    return this.getUserId().pipe(
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
