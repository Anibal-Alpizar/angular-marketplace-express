import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { DarkModeService } from 'src/app/share/dark-mode.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  currentUser: any;
  isDarkMode = false;
  constructor(
    private darkModeService: DarkModeService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.isDarkMode = darkModeService.isDarkMode;
    this.darkModeService.darkModeUpdated.subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      this.currentUser = JSON.parse(currentUserString);
    } else {
      this.currentUser = null;
    }

    this.authService.isAuthenticated.subscribe((valor) => {
      this.isAuthenticated = valor;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.currentUser = null;
  }

  login() {
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}
