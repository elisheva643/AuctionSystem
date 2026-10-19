import { Component } from '@angular/core';
import { DonorService } from '../../services/donor/donor.service';
import { GiftService } from '../../services/gift/gift.service';
import { Donation } from '../../Models/donation';
import { DonationService } from '../../services/donation/donation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-donation',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-donation.component.html',
  styleUrl: './add-donation.component.css'
})
export class AddDonationComponent {
  donors: any[] = [];
  gifts: any[] = [];
  isSaving = false;
  donorMode: 'existing' | 'new' = 'existing';
  giftMode: 'existing' | 'new' = 'existing';

  donation: Donation = {
    donorId: 0,
    giftId: 0,
    quantity: 1
  };

  constructor(
    private donorService: DonorService,
    private giftService: GiftService,
    private donationService: DonationService
  ) {}

  private extractId(entity: any): number {
    return Number(entity?.id ?? entity?.Id ?? 0);
  }

  ngOnInit(): void {
    this.loadDonors();
    this.loadGifts();
  }

  loadDonors() {
    this.donorService.getDonors().subscribe(res => {
      this.donors = res;

      if (this.donors.length > 0 && !this.donation.donorId) {
        this.donation.donorId = this.extractId(this.donors[0]);
      }
    });
  }

  loadGifts() {
    this.giftService.getGifts().subscribe(res => {
      this.gifts = res;

      if (this.gifts.length > 0 && !this.donation.giftId) {
        this.donation.giftId = this.extractId(this.gifts[0]);
      }
    });
  }

  private hasEntityWithId(list: any[], id: number): boolean {
    return list.some(item => this.extractId(item) === id);
  }

  private getServerErrorMessage(err: any): string {
    if (typeof err?.error === 'string' && err.error.trim()) {
      return err.error;
    }

    if (err?.error?.message) {
      return err.error.message;
    }

    if (err?.error?.title) {
      return err.error.title;
    }

    return `HTTP ${err?.status ?? ''}`.trim();
  }

  saveDonation() {
    if (!this.donation.donorId || !this.donation.giftId || !this.donation.quantity || this.donation.quantity < 1) {
      alert('אנא ודאי שנבחרו תורם ומתנה והכמות תקינה');
      return;
    }

    const dto = {
      donerId: Number(this.donation.donorId),
      giftId: Number(this.donation.giftId),
      quantity: Number(this.donation.quantity)
    };

    if (!this.hasEntityWithId(this.donors, dto.donerId) || !this.hasEntityWithId(this.gifts, dto.giftId)) {
      alert('נבחרו מזהי תורם/מתנה לא תקינים. בחרי מחדש מהרשימה.');
      return;
    }

    console.log('Assign DTO:', dto);

    this.isSaving = true;
    this.donationService.assignDonation(dto).subscribe({
      next: () => {
        alert('התרומה נשמרה בהצלחה');
        this.donation = {
          donorId: this.donors.length > 0 ? this.extractId(this.donors[0]) : 0,
          giftId: this.gifts.length > 0 ? this.extractId(this.gifts[0]) : 0,
          quantity: 1
        };
        this.isSaving = false;
      },
      error: (err) => {
        console.error(err);
        alert(`שגיאה בשמירת התרומה: ${this.getServerErrorMessage(err)}`);
        this.isSaving = false;
      }
    });
  }

}
