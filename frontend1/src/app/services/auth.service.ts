import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JsonResponseModel } from '../model/jsonResponseModel.interface';
import { UserModel } from '../model/userModel.interface';
import { RolaEnum } from '../enum/rola.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  user!: UserModel;

  constructor(private http: HttpClient, private router: Router) {}

  login(login: string, haslo: string) {
    return this.http.post<JsonResponseModel<UserModel>>(`${this.apiUrl}/login`, { login, haslo });
  }

  logout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  setUser(user: UserModel) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  get userRole(): RolaEnum{
    return this.getUser()?.rola;
  }

  get isAuthenticated(): boolean {
    return !!this.getUser();
  }

  get isAdmin(): boolean {
    return this.isAuthenticated && this.getUser().rola == 'ADMIN';
  }

  get isSpecialist(): boolean {
    return this.isAuthenticated && this.getUser().rola == 'SPECJALISTA';
  }

  get isPatient(): boolean {
    return this.isAuthenticated && this.getUser().rola == 'PACJENT';
  }
}
