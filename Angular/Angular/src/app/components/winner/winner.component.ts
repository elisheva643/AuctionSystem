import { Component, inject, PLATFORM_ID } from '@angular/core';
import { WinnerService } from '../../services/winner/winner.service';
import { Winner } from '../../Models/winner_model';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-winner',
  imports: [CommonModule],
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css'] 
})
export class WinnerComponent {
   winners: Winner[] = [];
  isAdmin: boolean = false;
  private platformId = inject(PLATFORM_ID);

  constructor(private winnerService: WinnerService) {}

  ngOnInit(): void {
    this.checkAdminStatus();
    this.loadWinners();
  } 

  private checkAdminStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
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
  loadWinners() {
    this.winnerService.getWinners().subscribe({
      next: (res) => this.winners = res,
      error: (err) => console.error(err)
    });
  }

  draw() {
    if (!this.isAdmin) return;
    this.winnerService.drawWinners().subscribe({
      next: (res: any) => {
        if (!Array.isArray(res)) {
          this.winners = Object.keys(res).map(key => ({
            giftId: Number(key),
            userId: res[key]
          } as any));
        } else {
          this.winners = res;
        }
      },
      error: (err) => console.error('Draw failed:', err)
    });
  }

  reset() {
    if (!this.isAdmin) return;
    if (confirm('האם את בטוחה שברצונך לבטל את כל תוצאות ההגרלה?')) {
      this.winnerService.resetLottery().subscribe({
        next: () => {
          this.winners = [];
          alert('ההגרלה בוטלה בהצלחה');
        },
        error: (err) => console.error('Reset failed:', err)
      });
    }
  }
}