import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from './model/userModel.interface';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from './services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [SnackBarService]
})
export class AppComponent {
  title = 'frontend1';

  constructor(private authService: AuthService, private router: Router){

  }

  login(){
    if(this.isLoggedIn){
      this.authService.logout();
      this.router.navigate(['login']);
    }else{
      this.router.navigate(['login']);
    }
  }

  get isLoggedIn(){
    return this.authService.isAuthenticated;
  }

  isAdmin(){
    return this.authService.isAdmin;
  }

  getName(){
    const user: UserModel = this.authService.getUser();
    return `${user.imie} ${user.nazwisko} (${user.rola})` 
  }
}
