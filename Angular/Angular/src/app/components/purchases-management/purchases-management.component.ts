import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseService } from '../../services/purchase/purchase.service';
import { GiftService } from '../../services/gift/gift.service';
import { RevenueService } from '../../services/revenue/revenue.service';

interface PurchaseWithDetails {
  id?: number;
  userId: number;
  giftId: number;
  quantity: number;
  isDraft: boolean;
  giftName?: string;
  giftPrice?: number;
  createdAt?: string;
}

@Component({
  selector: 'app-purchases-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchases-management.component.html',
  styleUrl: './purchases-management.component.css'
})
export class PurchasesManagementComponent implements OnInit {
  purchases: PurchaseWithDetails[] = [];
  filteredPurchases: PurchaseWithDetails[] = [];
  filterStatus: 'all' | 'draft' | 'confirmed' = 'all';
  isLoading = false;
  totalRevenue: number = 0;

  constructor(
    private purchaseService: PurchaseService,
    private giftService: GiftService,
  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.isLoading = true;
    
    this.purchaseService.getExpensive().subscribe({
      next: (purchases: any[]) => {
        this.enrichPurchasesWithGiftDetails(purchases);
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading purchases:', err);
        this.isLoading = false;
        alert('שגיאה בטעינת הרכישות');
      }
    });
  }

  private enrichPurchasesWithGiftDetails(purchases: any[]): void {
    this.purchases = purchases.map(p => {
      const giftId = p.giftId ?? p.giftID ?? p.GiftId ?? p.gift?.id;
      return {
        ...p,
        giftId,
        giftName: p.gift?.name,
        giftPrice: p.gift?.price,
      };
    });

    this.purchases.forEach(p => {
      if (!p.giftId) {
        p.giftName = p.giftName ?? 'מתנה לא זמינה';
        return;
      }

      this.giftService.getGiftById(p.giftId).subscribe({
        next: (gift: any) => {
          p.giftName = gift.name;
          p.giftPrice = gift.price;
        },
        error: () => {
          p.giftName = `מתנה #${p.giftId}`;
          p.giftPrice = 10;
        }
      });
    });
  }

  applyFilter(): void {
    if (this.filterStatus === 'all') {
      this.filteredPurchases = this.purchases;
    } else if (this.filterStatus === 'draft') {
      this.filteredPurchases = this.purchases.filter(p => p.isDraft);
    } else {
      this.filteredPurchases = this.purchases.filter(p => !p.isDraft);
    }
  }

  toggleStatus(purchase: PurchaseWithDetails): void {
    if (purchase.id) {
      const updated = {
        id: purchase.id,
        userId: purchase.userId,
        giftId: purchase.giftId,
        quantity: purchase.quantity,
        isDraft: !purchase.isDraft
      };
      this.purchaseService.update(purchase.id, updated).subscribe({
        next: (res: any) => {
          purchase.isDraft = !purchase.isDraft;
          this.applyFilter();
          alert('סטטוס עודכן בהצלחה');
        },
        error: (err: any) => {
          console.error('Error updating status:', err);
          alert('שגיאה בעדכון סטטוס');
        }
      });
    }
  }

  deletePurchase(id: number | undefined): void {
    if (!id) return;
    if (confirm('האם את בטוחה שברצונך למחוק רכישה זו?')) {
      this.purchaseService.delete(id).subscribe({
        next: (res: any) => {
          this.purchases = this.purchases.filter(p => p.id !== id);
          this.applyFilter();
          alert('הרכישה נמחקה בהצלחה');
        },
        error: (err: any) => {
          console.error('Error deleting purchase:', err);
  const serverMessage = err?.error?.message || err?.error || 'שגיאה במחיקת הרכישה';
        alert(serverMessage);       
       }
      });
    }
  }
getTotalRevenue(): number {
  return this.filteredPurchases
    .filter(p => !p.isDraft)
    .reduce((sum, p) =>
      sum + (p.quantity * (p.giftPrice || 0)), 0);
}

  getTotalPurchases(): number {
    return this.filteredPurchases.length;
  }

  getDraftCount(): number {
    return this.purchases.filter(p => p.isDraft).length;
  }

  getConfirmedCount(): number {
    return this.purchases.filter(p => !p.isDraft).length;
  }

  refresh(): void {
    this.loadPurchases();
  }
}
