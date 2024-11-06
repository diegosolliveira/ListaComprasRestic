import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-lista-compras',
  templateUrl: './lista-compras.component.html',
  styleUrls: ['./lista-compras.component.css']
})
export class ListaComprasComponent implements OnInit {
  items: any[] = [];
  newItem = '';
  newPrice = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userId$.subscribe(userId => {
      if (userId) {
        this.getShoppingList(userId);
      } else {
        console.error('Usuário não encontrado!');
      }
    });
  }

  getShoppingList(userId: number) {
    this.apiService.getShoppingList(userId).subscribe(
      (data) => {
        this.items = data;
      },
      (error) => {
        console.error('Erro ao buscar a lista de compras:', error);
      }
    );
  }

  addItem() {
    if (this.newItem.trim() && this.newPrice > 0) {
      this.authService.userId$.subscribe(userId => {
        if (userId) {
          const newShoppingItem = {
            title: this.newItem,
            userId: userId,
            included: false,
            price: this.newPrice
          };

          console.log('Adicionando item:', newShoppingItem);

          this.apiService.postShoppingItem(newShoppingItem).subscribe(
            (item) => {
              console.log('Item adicionado com sucesso:', item);
              this.items.push(item);
              this.newItem = '';
              this.newPrice = 0;
            },
            (error) => {
              console.error('Erro ao adicionar item:', error);
            }
          );
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
