import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ListaComprasComponent } from './lista-compras/lista-compras.component';


@NgModule({
  imports: [
    AppComponent,
    ListaComprasComponent,
    LoginComponent,
    BrowserModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
