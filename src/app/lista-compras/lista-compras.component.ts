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
  userId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUserId().subscribe((userId) => {
      if (userId) {
        this.userId = userId;
        this.getShoppingList();
      } else {
        console.error('Usuário não encontrado!');
      }
    });
  }

  getShoppingList() {
    if (this.userId) {
      this.apiService.getShoppingList(this.userId).subscribe(
        (data) => {
          this.items = data;
        },
        (error) => {
          console.error('Erro ao buscar a lista de compras:', error);
        }
      );
    }
  }

  addItem() {
    if (this.newItem.trim() && this.newPrice > 0 && this.userId !== null) {
      const newShoppingItem = {
        title: this.newItem,
        userId: this.userId,
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
  }

  toggleBought(item: any) {
    item.included = !item.included;
    this.apiService.updateShoppingItem(item.id, item).subscribe(
      () => {
        console.log('Item atualizado com sucesso');
      },
      (error) => {
        console.error('Erro ao atualizar item:', error);
      }
    );
  }

  deleteItem(index: number) {
    const item = this.items[index];
    this.apiService.deleteShoppingItem(item.id).subscribe(
      () => {
        this.items.splice(index, 1);
      },
      (error) => {
        console.error('Erro ao deletar item:', error);
      }
    );
  }

  editItem(item: any) {
    item.editing = true;
  }

  saveItem(item: any, newName: string, newPrice: number) {
    item.title = newName;
    item.price = newPrice;
    item.editing = false;

    this.apiService.updateShoppingItem(item.id, item).subscribe(
      () => {
        console.log('Item atualizado com sucesso');
      },
      (error) => {
        console.error('Erro ao atualizar item:', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
