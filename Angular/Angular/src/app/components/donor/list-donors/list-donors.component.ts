import { Component } from '@angular/core';
import { DonorService } from '../../../services/donor/donor.service';
import { UpdateDonorComponent } from "../update-donor/update-donor.component";
import { CommonModule } from '@angular/common';
import { Donor } from '../../../Models/donor_model';
import { GiftDescription } from '../../../Models/GiftDescription_model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-donors',
  imports: [CommonModule, UpdateDonorComponent, FormsModule],
  templateUrl: './list-donors.component.html',
  styleUrls: ['./list-donors.component.css']
})
export class ListDonorsComponent {
  donors: any[] = [];
  selectedDonor: any = null;
  viewDonor: Donor | null = null;
  donorGifts: GiftDescription[] = [];
  isAdmin = false;
  filterName: string = '';

  constructor(private donorService: DonorService) { }

  ngOnInit() {
    this.loadDonors();

    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
          this.isAdmin = payload['role'] === 'Manager';

    }
        console.log('isAdmin:', this.isAdmin);

  }

  loadDonors() {
    this.donorService.getDonors().subscribe(data => {
      this.donors = data;
    });
  }



  selectDonor(donor: any) {
    this.selectedDonor = { ...donor };
  }

  onDonorUpdated() {
    this.selectedDonor = null;
    this.loadDonors();
  }

  deleteDonor(id: number) {
    this.donorService.deleteDonor(id).subscribe({
      next: () => {
        this.donors = this.donors.filter(donor => donor.id !== id);
        alert('התורם נמחק בהצלחה!');
      },
      error: (err) => {
        console.error(err);
        const serverMessage = err?.error?.message || err?.error || 'שגיאה במחיקת התורם';
        alert(serverMessage);
      }
    });
  }

  showDonor(donorId: number) {
    this.donorService.getDonorById(donorId).subscribe(d => {
      this.viewDonor = d;
      this.donorGifts = d.giftDescription || [];
    });
  }

  searchByName() {
    if (!this.filterName) {
      this.loadDonors();
      return;
    }

    this.donorService.getByName(this.filterName).subscribe({
      next: res => this.donors = res,
      error: err => console.error(err)
    });
  }
}
