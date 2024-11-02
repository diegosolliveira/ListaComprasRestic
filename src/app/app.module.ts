import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ListaComprasComponent } from './lista-compras/lista-compras.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

@NgModule({
  imports: [
    AppComponent,
    ListaComprasComponent,
    LoginComponent,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    FormsModule,
  ],
  bootstrap: []
})
export class AppModule { }
