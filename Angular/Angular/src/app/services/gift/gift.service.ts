import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gift } from '../../Models/gift_model';


@Injectable({
  providedIn: 'root'
})

export class GiftService {
  private apiUrl = '/api/Gift';

  constructor(private http: HttpClient) { }
  getGifts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getGiftById(id: number): Observable<Gift> {
    return this.http.get<Gift>(`${this.apiUrl}/${id}`);
  }
  addGift(gift: Gift): Observable<Gift> {
    return this.http.post<Gift>(this.apiUrl, gift);
  }
  deleteGift(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateGift(gift: Gift, id: number): Observable<Gift> {
    return this.http.put<Gift>(`${this.apiUrl}/${id}`, gift);
  }
  getByName(name: string) {
    return this.http.get<Gift[]>(`/api/Gift/get-name?name=${name}`);
  }
  getByDonor(donorId: number) {
    return this.http.get<Gift[]>(`/api/Gift/get-gift-doner/${donorId}`);
  }


}
