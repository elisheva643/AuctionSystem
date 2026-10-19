import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isAdmin = false;
  isUserLoggedIn = false;
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      this.isUserLoggedIn = !!token;

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          this.isAdmin = (role || '').toString().toLowerCase() === 'manager';
        } catch (error) {
          console.error('Error decoding token', error);
          this.isAdmin = false;
        }
      }
    }
  }
}
