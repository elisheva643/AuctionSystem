import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

   private apiUrl = '/api/GiftDescription';

  constructor(private http: HttpClient) { }
  assignDonation(donation: { giftId: number; donerId: number; quantity: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, donation);
  }
}
