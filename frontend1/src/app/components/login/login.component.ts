import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  login: string = '';
  haslo: string = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.login, this.haslo).subscribe({
      next: (res) => {
        if (res.status == 200) {
          this.authService.setUser(res.payload);
          this.router.navigate(['/pacjenci']);
        } else {
          this.error = 'Nieprawidłowy login lub hasło';
        }
      },
      error: () => {
        this.error = 'Wystąpił błąd podczas logowania';
      },
    });
  }
}
