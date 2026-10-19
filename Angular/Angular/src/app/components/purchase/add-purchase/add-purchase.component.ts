import { Component } from '@angular/core';
import { PurchaseService } from '../../../services/purchase/purchase.service';
import { Purchase } from '../../../Models/purchase_model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-purchase',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent {
  lotteryDone: boolean = false;

  purchase: Purchase = {
    userId: 0,        
    giftId: 0,
    quantity: 1,
    isDraft: true
  };
ngOnInit() {
  this.purchaseService.checkLottery().subscribe(res => {
    this.lotteryDone = res;
  });
}
  constructor(private purchaseService: PurchaseService) {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));        
        const rawId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];        
        this.purchase.userId = Number(rawId);         
        console.log('User ID loaded as number:', this.purchase.userId);
        try {
          localStorage.setItem('userId', String(this.purchase.userId));
        } catch (e) {
          console.warn('Unable to write userId to localStorage', e);
        }
      }
    }
  }

  addPurchase() {
    console.log('Sending purchase:', this.purchase);
    this.purchaseService.create(this.purchase).subscribe({
      next: () => alert('הרכישה נוספה בהצלחה 🎉'),
      error: err => {
        console.error('Purchase failed', err);
        console.error('Server response body:', err?.error);
        alert('שגיאת שרת — בדוק קונסול (Console) ו־Network');
      }
    });
  }

}
