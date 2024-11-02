import { Routes } from '@angular/router';
import { ListaComprasComponent } from './lista-compras/lista-compras.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'lista-compras', component: ListaComprasComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
