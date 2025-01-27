import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { JsonResponseModel } from "../model/jsonResponseModel.interface";
import { Injectable } from "@angular/core";
import { RolaEnum } from "../enum/rola.enum";

@Injectable({
  providedIn: 'root'
})
export class WizytyService {

  private apiUrl = 'http://localhost:3000/api/appointments';

  constructor(private http: HttpClient, private router: Router) { }

  getAllAppointments(id: number, rola: RolaEnum) {
    let params = new HttpParams();
    if (id) {
      params = params.set('id_uzytkownika', id);
    }
    if(rola){
        params = params.set('rola', rola);
    }
    return this.http.get<JsonResponseModel<any>>(this.apiUrl, {params});
  }

  addNewAppointment(wizyta: any){
    return this.http.post<any>(this.apiUrl, wizyta);
  }

  deleteAppointment(id: number){
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
}