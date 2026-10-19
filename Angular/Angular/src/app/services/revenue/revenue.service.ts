import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
private apiUrl = 'https://localhost:7240/api/Rvevnue';

  constructor(private http: HttpClient) {}

  getTotalRevenue(): Observable<number> {
    return this.http.get<number>(this.apiUrl);
  }
}
