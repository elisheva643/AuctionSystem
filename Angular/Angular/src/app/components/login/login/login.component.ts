import { Component } from '@angular/core';
import { Login } from '../../../Models/login_model';
import { LoginService } from '../../../services/login/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: Login = { email: '', password: '' };

  constructor(private loginService: LoginService, private router: Router) { }

  login() {
    this.loginService.login(this.loginData).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);

        const tokenData = JSON.parse(atob(res.token.split('.')[1]));
        console.log('הנתונים בתוך הטוקן:', tokenData);

        if (tokenData.role === 'Manager' || tokenData.role === '1') {
          console.log('איזה יופי, השרת מזהה שאת מנהלת!');
        }

        alert('התחברת בהצלחה!');
        this.router.navigate(['/gifts']);
      },
      error: err => alert('אימייל או סיסמה שגויים')
    });
  }
  isPasswordVisible: boolean = false; 
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
