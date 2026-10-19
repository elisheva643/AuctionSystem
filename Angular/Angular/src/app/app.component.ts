import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login/login.service';
import { CartComponent } from "./components/purchase/cart/cart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, CartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  isUserLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

get isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) return false;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // התיקון כאן: בודק את שתי האפשרויות
        const role = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        return role === 'Manager';
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  signOut() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}