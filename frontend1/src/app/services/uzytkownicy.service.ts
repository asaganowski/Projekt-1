import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JsonResponseModel } from '../model/jsonResponseModel.interface';
import { UserDto, UserModel } from '../model/userModel.interface';

@Injectable({
  providedIn: 'root'
})
export class UzytkownicyService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private router: Router) { }

  getUsers(role?: string) {
    let params = new HttpParams();
    if (role) {
      params = params.set('role', role);
    }
  
    return this.http.get<JsonResponseModel<UserDto[]>>(`${this.apiUrl}`, { params });
  }

  addUser(user: UserModel){
    return this.http.post<any>(this.apiUrl, user);
  }

  getSpecialistsByFacility(idPlacowki: number) {
    const url = `${this.apiUrl}/${idPlacowki}/placowki`;
    return this.http.get<JsonResponseModel<any[]>>(url);
  }
  
}
