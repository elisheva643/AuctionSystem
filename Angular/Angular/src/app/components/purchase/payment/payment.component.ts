import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PurchaseService } from '../../../services/purchase/purchase.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  
  // פרטי תשלום
  cardNumber: string = '';
  cardHolder: string = '';
  expiryMonth: string = '';
  expiryYear: string = '';
  cvv: string = '';
  
  // מידע על הרכישה
  totalAmount: number = 0;
  userId!: number;
  
  isProcessing: boolean = false;
  paymentSuccess: boolean = false;
  paymentError: boolean = false;

  constructor(
    private purchaseService: PurchaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // קבלת userId
      const id = localStorage.getItem('userId');
      if (id) {
        this.userId = Number(id);
      } else {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const rawId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            if (rawId) {
              this.userId = Number(rawId);
            }
          }
        } catch (e) {
          console.warn('Unable to read userId', e);
        }
      }

      // קבלת סכום מ-localStorage (נשמור אותו מהעגלה)
      const amount = localStorage.getItem('paymentAmount');
      if (amount) {
        this.totalAmount = Number(amount);
      } else {
        // אם אין סכום - חזרה לעגלה
        this.router.navigate(['/cart']);
      }
    }
  }

  formatCardNumber(): void {
    // הסרת רווחים ואז הוספת רווח כל 4 ספרות
    let cleaned = this.cardNumber.replace(/\s/g, '');
    let formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    this.cardNumber = formatted.substring(0, 19); // מקסימום 16 ספרות + 3 רווחים
  }

  formatCVV(): void {
    this.cvv = this.cvv.replace(/\D/g, '').substring(0, 3);
  }

  isFormValid(): boolean {
    const cardDigits = this.cardNumber.replace(/\s/g, '');
    return (
      cardDigits.length === 16 &&
      this.cardHolder.trim().length >= 3 &&
      this.expiryMonth.length === 2 &&
      this.expiryYear.length === 2 &&
      this.cvv.length === 3 &&
      Number(this.expiryMonth) >= 1 &&
      Number(this.expiryMonth) <= 12
    );
  }

  processPayment(): void {
    if (!this.isFormValid()) {
      alert('נא למלא את כל השדות בצורה תקינה');
      return;
    }

    if (!confirm(`האם את בטוחה שברצונך לבצע תשלום בסך ${this.totalAmount} ש"ח?`)) {
      return;
    }

    this.isProcessing = true;
    this.paymentError = false;

    // סימולציה של תשלום - המתנה של 2 שניות
    setTimeout(() => {
      // אישור הרכישה בשרת
      this.purchaseService.confirmCart(this.userId).subscribe({
        next: () => {
          this.isProcessing = false;
          this.paymentSuccess = true;
          
          // ניקוי הסכום מ-localStorage
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('paymentAmount');
          }

          // העברה לעמוד הצלחה אחרי 3 שניות
          setTimeout(() => {
            this.router.navigate(['/gifts']);
          }, 3000);
        },
        error: (err) => {
          console.error('Payment error:', err);
          this.isProcessing = false;
          this.paymentError = true;
        }
      });
    }, 2000);
  }

  cancel(): void {
    if (confirm('האם את בטוחה שברצונך לבטל את התשלום?')) {
      // ניקוי הסכום
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('paymentAmount');
      }
      this.router.navigate(['/cart']);
    }
  }
}
