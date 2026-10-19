import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Purchase } from '../../Models/purchase_model';
import { Subject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = '/api/Purchase';
  private cartUpdated = new Subject<void>();
  cartUpdated$ = this.cartUpdated.asObservable();

  constructor(private http: HttpClient) { }

  notifyCartContentChanged() {
    this.cartUpdated.next();
  }

  create(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.apiUrl, purchase);
  }

  getByGift(giftId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/by-gift/${giftId}`);
  }

  getByUser(userId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/by-user/${userId}`);
  }

  getExpensive(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/get-expensive`);
  }

  getMostPurchased(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/get-most-purchased`);
  }

  update(id: number, purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.apiUrl}/${id}`, purchase);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getCart(userId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/cart/${userId}`);
  }
  confirmCart(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm/${userId}`, {});
  }
  checkLottery(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkLottery`);
  }

}


