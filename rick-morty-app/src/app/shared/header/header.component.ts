import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/User';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  get showLogAsGuest(): boolean {
    const currentRoute = this.router.url;
    const isAuthRoute = currentRoute.includes('/auth/login') || currentRoute.includes('/auth/register');
    return !this.isLoggedIn || isAuthRoute;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
