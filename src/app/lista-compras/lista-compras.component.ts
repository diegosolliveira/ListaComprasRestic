import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-compras.component.html',
  styleUrls: ['./lista-compras.component.css']
})
export class ListaComprasComponent {
  items = [
    { name: 'Arroz', bought: false, editing: false },
    { name: 'Feijão', bought: true, editing: false }
  ];

  newItem = '';

  addItem() {
    if (this.newItem.trim()) {
      this.items.push({ name: this.newItem, bought: false, editing: false });
      this.newItem = '';
    }
  }

  toggleBought(item: any) {
    item.bought = !item.bought;
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
  }

  editItem(item: any) {
    item.editing = true;
  }

  saveItem(item: any, newName: string) {
    item.name = newName;
    item.editing = false;
  }
}
