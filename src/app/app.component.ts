import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { UserNew } from './services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firebaseAuth';
  isLoggedIn = false;

  user$: string;
  authenticated$: Observable<boolean>;

  constructor(public authService: AuthService, private router: Router) {
    this.user$ = this.authService.authState;
    this.authenticated$ = this.authService.authenticated();
    // console.log(this.authService.isUserEmailLoggedIn, ' a ')
  }

  logout(): void {
    this.authService.singout();
    this.router.navigateByUrl('login');
  }
}
