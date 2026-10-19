import { Component, inject, PLATFORM_ID } from '@angular/core';
import { PurchaseService } from '../../../services/purchase/purchase.service';
import { Purchase } from '../../../Models/purchase_model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GiftService } from '../../../services/gift/gift.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart: Purchase[] = [];
  userId!: number;
  isOrderConfirmed: boolean = false;
  lotteryDone: boolean = false;


  constructor(
    private purchaseService: PurchaseService,
    private giftService: GiftService,
    private router: Router
  ) { }
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {

    this.purchaseService.checkLottery().subscribe(res => this.lotteryDone = res);
    this.purchaseService.checkLottery().subscribe(res => {
      this.lotteryDone = res;

    });
    if (isPlatformBrowser(this.platformId)) {
      const id = localStorage.getItem('userId');
      if (id) {
        this.userId = Number(id);
        this.loadCart();
      } else {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const rawId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            if (rawId) {
              this.userId = Number(rawId);
              try { localStorage.setItem('userId', String(this.userId)); } catch { }
              this.loadCart();
            }
          }
        } catch (e) {
          console.warn('Unable to read userId from token/localStorage', e);
        }
      }
    }
    this.purchaseService.cartUpdated$.subscribe(() => {
    console.log('העגלה קיבלה הודעה על שינוי - טוענת נתונים מחדש...');
    this.loadCart(); // הפונקציה הקיימת שלך שטוענת מהשרת
  });
  }

  loadCart() {
    console.log('Loading cart for userId:', this.userId);

    this.purchaseService.getCart(this.userId).subscribe({
      next: res => {
        const merged: { [key: number]: Purchase } = {};

        res.forEach(p => {
          if (merged[p.giftId]) {
            merged[p.giftId].quantity += p.quantity;
          } else {
            merged[p.giftId] = { ...p };
          }
        });

        this.cart = Object.values(merged);

        this.cart.forEach(p => {
          if (!p.gift) {
            this.giftService.getGiftById(p.giftId).subscribe({
              next: g => p.gift = { name: g.name, price: g.price },
              error: () => console.warn('Failed to load gift', p.giftId)
            });
          }
        });
      },
      error: err => console.error(err)
    });
  }


  getTotal() {
    return this.cart.reduce((sum, p) => {
      const price = Number(p.gift?.price ?? 0) || 0;
      const qty = Number(p.quantity) || 0;
      return sum + price * qty;
    }, 0);
  }
  removeItem(p: Purchase) {
    if (p.id !== undefined) {
      this.purchaseService.delete(p.id).subscribe({
        next: () => {
          this.loadCart();
        },
        error: (err) => console.error('מחיקה נכשלה', err)
      });
    }
  }
  confirmPurchase() {
    const total = this.getTotal();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('paymentAmount', total.toString());
    }
    this.router.navigate(['/payment']);
  }

  getTotalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  increaseQuantity(item: Purchase): void {
    item.quantity = (item.quantity || 1) + 1;
  }

  decreaseQuantity(item: Purchase): void {
    if ((item.quantity || 1) > 1) {
      item.quantity = (item.quantity || 1) - 1;
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (!img) {
      return;
    }
    img.src = 'assets/placeholder.png';
    img.classList.add('is-fallback');
  }
}
