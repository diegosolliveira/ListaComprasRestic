import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  login(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users?email=${email}`);
  }

  getShoppingList(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lista-compras?userId=${userId}`);
  }

  postShoppingItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lista-compras`, item);
  }

  deleteShoppingItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/lista-compras/${id}`);
  }

  updateShoppingItem(id: number, item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/lista-compras/${id}`, item);
  }
}
