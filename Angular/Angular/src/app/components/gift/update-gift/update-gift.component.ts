import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Gift } from '../../../Models/gift_model';
import { FormsModule } from '@angular/forms';
import { GiftService } from '../../../services/gift/gift.service';

@Component({
  selector: 'app-update-gift',
  imports: [FormsModule],
  templateUrl: './update-gift.component.html',
  styleUrls: ['./update-gift.component.css']
})
export class UpdateGiftComponent {
  @Input() gift!: Gift; 
  @Output() updated = new EventEmitter<void>(); 
  @Output() cancel = new EventEmitter<void>();  

  constructor(private giftService: GiftService) {}

  updateGift() {
    if (!this.gift || !this.gift.id) {
      console.error('Gift או ID אינם קיימים!');
      return;
    }

    this.giftService.updateGift(this.gift, this.gift.id).subscribe({
      next: () => this.updated.emit(),
      error: err => console.log(err.error)
    });
  }  
}  

  

