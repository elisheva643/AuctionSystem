import { Component } from '@angular/core';
import { Gift } from '../../../Models/gift_model';
import { FormsModule } from '@angular/forms';
import { GiftService } from '../../../services/gift/gift.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-gift',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-gift.component.html',
  styleUrls: ['./add-gift.component.css']
})
export class AddGiftComponent {
  giftName = '';
  giftPrice = 10;
  giftDescription = '';
  giftCategory = '';
  giftImageUrl = '';
  private returnUrl = '/add-donation';
  constructor(
    private giftService: GiftService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/add-donation';
  }

  addGift() {
    if (!this.giftName) {
      alert('אנא מלאי את כל השדות הנדרשים');
      return;
    }

    const newGift: Gift = {

      name: this.giftName,
      price: this.giftPrice,
      description: this.giftDescription,
      category: this.giftCategory,
      imageUrl: this.giftImageUrl
    };
    console.log(newGift);

    this.giftService.addGift(newGift).subscribe({
      next: () => {
        alert('המתנה נוספה בהצלחה!');
        this.giftName = '';
        this.giftPrice = 10;
        this.giftDescription = '';
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        console.error(err);
        alert('שגיאה בהוספת המתנה');
      }
    });
  }


}
