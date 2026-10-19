import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login/login.component';
import { RegisterComponent } from './components/login/register/register.component';
import { GiftListComponent } from './components/gift/gift-list/gift-list.component';
import { AddGiftComponent } from './components/gift/add-gift/add-gift.component';
import { ListDonorsComponent } from './components/donor/list-donors/list-donors.component';
import { AddDonorComponent } from './components/donor/add-donor/add-donor.component';
import { adminGuard } from './auth.guard';
import { AddPurchaseComponent } from './components/purchase/add-purchase/add-purchase.component';
import { CartComponent } from './components/purchase/cart/cart.component';
import { PaymentComponent } from './components/purchase/payment/payment.component';
import { WinnerComponent } from './components/winner/winner.component';
import { RevenueReportComponent } from './components/revenue/revenue-report/revenue-report.component';
import { AddDonationComponent } from './components/add-donation/add-donation.component';
import { PurchasesManagementComponent } from './components/purchases-management/purchases-management.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gifts', component: GiftListComponent },
  { path: 'add-gift', component: AddGiftComponent,canActivate: [adminGuard] },
  { path: 'donors', component: ListDonorsComponent },
  { path: 'add-donor', component: AddDonorComponent ,canActivate: [adminGuard]},
  { path: 'add-purchase', component: AddPurchaseComponent },
  { path: 'cart', component: CartComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'winners', component: WinnerComponent },
  { path: 'revenue', component: RevenueReportComponent },
  { path: 'add-donation', component: AddDonationComponent, canActivate: [adminGuard] },
  { path: 'purchases-management', component: PurchasesManagementComponent, canActivate: [adminGuard] },
];