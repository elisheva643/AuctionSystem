import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      // פיענוח הטוקן
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // התיקון הקריטי: בודק גם את השדה הקצר "role" וגם את הארוך
      const role = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (role === 'Manager') {
        return true; // המשתמש מנהל - מותר לו להיכנס
      }
    } catch (error) {
      console.error('Error decoding token', error);
    }
  }

  // אם הוא לא מנהל - ננווט אותו לדף אחר
  alert('אין לך הרשאה לגשת לדף זה');
  router.navigate(['/login']);
  return false;
};