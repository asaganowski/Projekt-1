import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JsonResponseModel } from '../model/jsonResponseModel.interface';
import { FacilityModel } from '../model/facilityModel.interface';

@Injectable({
  providedIn: 'root'
})
export class PlacowkiService {

  private apiUrl = 'http://localhost:3000/api/placowki';

  constructor(private http: HttpClient, private router: Router) { }

  getAllFacilities() {
    return this.http.get<JsonResponseModel<FacilityModel[]>>(`${this.apiUrl}`);
  }

  addNewFacility(facility: any){
    return this.http.post<any>(`${this.apiUrl}`, facility);
  }

  deleteFacility(id: number){
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  
}
