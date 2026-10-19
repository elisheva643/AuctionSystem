import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Donor } from '../../Models/donor_model';


@Injectable({
  providedIn: 'root'
})
export class DonorService {
  private apiUrl = '/api/Donor';

  constructor(private http: HttpClient) { }
  getDonors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  addDonor(donor: Donor): Observable<Donor> {
    return this.http.post<Donor>(this.apiUrl, donor);
  }
  deleteDonor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateDonor(donor: Donor, id: number): Observable<Donor> {
    return this.http.put<Donor>(`${this.apiUrl}/${id}`, donor);
  }
  getDonorById(id: number): Observable<Donor> {
    return this.http.get<Donor>(`${this.apiUrl}/${id}`);
  }
  getByName(name: string) {
    return this.http.get<Donor[]>(`/api/Donor/get-name?name=${name}`);
  }
  getByEmail(email: string) {
    return this.http.get<Donor[]>(`/api/Donor/get-email?email=${email}`);
  }
  getByGift(giftId: number) {
    return this.http.get<Donor[]>(`/api/Donor/get-gift/${giftId}`);
  }


}
