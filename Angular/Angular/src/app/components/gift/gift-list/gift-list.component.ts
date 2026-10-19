import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UpdateGiftComponent } from '../update-gift/update-gift.component';
import { GiftService } from '../../../services/gift/gift.service';
import { FormsModule } from '@angular/forms';
import { PurchaseService } from '../../../services/purchase/purchase.service';
import { Gift } from '../../../Models/gift_model';
import { Purchase } from '../../../Models/purchase_model';

interface GiftWithDonors {
  id?: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  imageUrl?: string;
  donorNames: string[];
  selectedQuantity?: number;
}

@Component({
  selector: 'app-gift-list',
  standalone: true,
  imports: [CommonModule, UpdateGiftComponent, FormsModule],
  templateUrl: './gift-list.component.html',
  styleUrls: ['./gift-list.component.css']
})
export class GiftListComponent implements OnInit {
  gifts: GiftWithDonors[] = [];
  selectedGift: any = null;
  selectedGiftIndex: number | null = null;
  isAdmin = false;
  filterName: string = '';
  currentUserId: number | null = null;
  selectedCategory: 'all' | 'home' | 'travel' | 'electronics' | 'kids' = 'all';




  private platformId = inject(PLATFORM_ID);

  constructor(private giftService: GiftService, private purchaseService: PurchaseService) { }

  get filteredGifts(): GiftWithDonors[] {
    if (this.selectedCategory === 'all') {
      return this.gifts;
    }

    return this.gifts.filter(gift => this.isGiftInSelectedCategory(gift.category));
  }

  private isGiftInSelectedCategory(category: string | undefined): boolean {
    const normalized = (category || '').trim().toLowerCase();

    switch (this.selectedCategory) {
      case 'home':
        return normalized.includes('בית');
      case 'travel':
        return normalized.includes('תיירות') || normalized.includes('נופש');
      case 'electronics':
        return normalized.includes('חשמל');
      case 'kids':
        return normalized.includes('ילדים') || normalized.includes('שופינג');
      default:
        return true;
    }
  }

  private enrichGiftsWithDonors(gifts: any[], giftDescriptions: any[]): GiftWithDonors[] {
    return gifts.map(gift => {
      const gd = giftDescriptions.filter((gd: any) => gd.giftId === gift.id) || [];
      return {
        ...gift,
        donorNames: gd.map((d: any) => d.gift?.name || 'ללא שם').slice(0, 3)
      };
    });
  }

  ngOnInit() {
    this.giftService.getGifts().subscribe(gifts => {
      this.gifts = gifts.map(gift => ({
        ...gift,
        donorNames: []
      }));
    });

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          this.isAdmin = (role || '').toString().toLowerCase() === 'manager';
          const idFromToken = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

          if (idFromToken) {
            this.currentUserId = Number(idFromToken);
            console.log('זיהיתי את המשתמש! ה-ID שלו הוא:', this.currentUserId);
          } else {
            console.error('לא מצאתי שום ID בתוך הטוקן. בדקי את ה-Console');
          }
        } catch (error) {
          console.error('Error decoding token', error);
          this.isAdmin = false;
        }
      }
    }
  }

 

  selectGift(gift: any, index: number) {
    this.selectedGift = { ...gift };
    this.selectedGiftIndex = index;
  }

  onGiftUpdated() {
    this.selectedGift = null;
    this.selectedGiftIndex = null;
    this.giftService.getGifts().subscribe(gifts => {
      this.gifts = gifts.map(gift => ({
        ...gift,
        ticketCost: 10,
        donorNames: []
      }));
    });
  }

  cancelGiftEdit() {
    this.selectedGift = null;
    this.selectedGiftIndex = null;
  }

  deleteGift(id: number) {
    if (confirm('האם את בטוחה שברצונך למחוק מתנה זו?')) {
      this.giftService.deleteGift(id).subscribe({
        next: () => {
          this.gifts = this.gifts.filter(gift => gift.id !== id);
          alert('המתנה נמחקה בהצלחה!');
        },

        error: (err) => {
          console.error(err);
          const serverMessage = err?.error?.message || err?.error || 'שגיאה במחיקת המתנה';
          alert(serverMessage);
        }
      });
    }
  }
  searchByName() {
    if (!this.filterName) {
      this.giftService.getGifts().subscribe(gifts => {
        this.gifts = gifts.map(gift => ({
          ...gift,
          ticketCost: 10,
          donorNames: []
        }));
      });
      return;
    }

    this.giftService.getByName(this.filterName).subscribe({
      next: res => {
        this.gifts = res.map(gift => ({
          ...gift,
          ticketCost: 10,
          donorNames: []
        }));
      },
      error: err => console.error(err)
    });
  }
  addToCart(gift: GiftWithDonors) {
    if (!this.currentUserId) {
      alert('לא ניתן להוסיף לסל – המשתמש לא מזוהה');
      return;
    }

    const purchase: Purchase = {
      userId: this.currentUserId,
      giftId: gift.id!,
      isDraft: true,
      quantity: gift.selectedQuantity || 1,

    };

    this.purchaseService.create(purchase).subscribe({
      next: (res) => {
        alert('המתנה נוספה לסל בהצלחה!');
        this.purchaseService.notifyCartContentChanged();
      },
      error: (err) => {
        console.error(err);
        alert('שגיאה בהוספת המתנה לסל');
      }
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (!img) {
      return;
    }

    img.src = '/a.png';
    img.classList.add('is-fallback');
  }


}