import { Component } from '@angular/core';
import { RevenueService } from '../../../services/revenue/revenue.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-revenue-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revenue-report.component.html',
  styleUrls: ['./revenue-report.component.css']
})
export class RevenueReportComponent {
  totalRevenue: number = 0;
  isLoading: boolean = true;

  constructor(private revenueService: RevenueService) {}

  ngOnInit(): void {
    this.revenueService.getTotalRevenue().subscribe({
      next: (data) => {
        this.totalRevenue = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('שגיאה בטעינת דוח הכנסות', err);
        this.isLoading = false;
      }
    });
  }

}
