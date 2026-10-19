import { Component } from '@angular/core';
import { DonorService } from '../../../services/donor/donor.service';
import { Donor } from '../../../Models/donor_model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-donor',
  imports: [FormsModule],
  templateUrl: './add-donor.component.html',
  styleUrls: ['./add-donor.component.css']
})
export class AddDonorComponent {
  name = '';
  email = '';
  private returnUrl = '/add-donation';

  constructor(
    private donorService: DonorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/add-donation';
  }

  addDonor() {
    if (!this.name || !this.email) {
      alert('אנא מלאי את כל השדות הנדרשים');
      return;
    }

    const newDonor: Donor = {

      name: this.name,
      email: this.email,

    };


    this.donorService.addDonor(newDonor).subscribe({
      next: () => {
        alert('התורם נוסף בהצלחה!');
        this.name = '';
        this.email = '';
        this.router.navigateByUrl(this.returnUrl);

      },
      error: (err) => {
        console.error(err);
        alert('שגיאה בהוספת התורם');
      }
    });
  }



}
