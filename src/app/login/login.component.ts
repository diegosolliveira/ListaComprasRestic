import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email } = this.loginForm.value;
      this.apiService.login(email).subscribe({
        next: (response) => {
          if (response.length > 0) { 
            const user = response[0];
            console.log('Usuário autenticado:', user);

            localStorage.setItem('userId', user.id);
            this.router.navigate(['/lista-compras']);
          } else {
            console.error('Usuário não encontrado');
          }
        },
        error: (error) => {
          console.error('Erro de login', error);
        }
      });
    }
  }
}
