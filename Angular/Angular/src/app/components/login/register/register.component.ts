import { Component } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { Register } from '../../../Models/register_model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
    standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
   registerData: Register = { name: '', email: '', password: '' };

  constructor(
    private loginService: LoginService,
  ) {}

  register() {
    this.loginService.register(this.registerData).subscribe({
      next: res => {
        console.log('User created:', res);
        alert('הרשמת בהצלחה! כעת אנא התחבר/י.');
      },
      error: err => {
        console.error(err);
        alert('אירעה שגיאה בהרשמה');
      }
    });
  }
}
