import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Donor } from '../../../Models/donor_model';
import { DonorService } from '../../../services/donor/donor.service';

@Component({
  selector: 'app-update-donor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-donor.component.html',
  styleUrl: './update-donor.component.css'
})

export class UpdateDonorComponent {
  @Input() donor!: Donor; 
  @Output() updated = new EventEmitter<void>(); 
  @Output() cancel = new EventEmitter<void>();  

 constructor(private donorService: DonorService) {}
 updateDonor() {
  if (!this.donor || !this.donor.id) {
    console.error('donor או ID אינם קיימים!');
    return;
  }

  this.donorService.updateDonor(this.donor, this.donor.id).subscribe({
    next: () => this.updated.emit(),
    error: err => console.log(err.error)
  });
 }  
}
